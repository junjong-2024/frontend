import React from 'react';
import * as mediasoupClient from 'mediasoup-client';
import { types } from 'mediasoup-client';
import io from 'socket.io-client';
import { setupSocket, CustomSocket } from './socket';
import {Consumer,ConsumerOptions} from "mediasoup-client/lib/Consumer";

const mediaType = {
    audio: 'audioType',
    video: 'videoType',
    screen: 'screenType'
};
export const remoteVideoEls: HTMLVideoElement[] = [];
const _EVENTS = {
    exitRoom: 'exitRoom',
    openRoom: 'openRoom',
    startVideo: 'startVideo',
    stopVideo: 'stopVideo',
    startAudio: 'startAudio',
    stopAudio: 'stopAudio',
    startScreen: 'startScreen',
    stopScreen: 'stopScreen'
};

interface RoomClientProps {
    localMediaEl: HTMLDivElement;
    remoteVideoEl: HTMLDivElement;
    remoteAudioEl: HTMLDivElement;
    socketUrl: string;
    room_id: string;
    name: string;
    successCallback: () => void;
}
interface ConsumeResult {
    consumer: Consumer;
    stream: MediaStream;
    kind: 'video' | 'audio';
}
class RoomClient {
    private name: string;
    private localMediaEl: HTMLVideoElement ;
    private remoteVideoEl: HTMLVideoElement ;
    private remoteAudioEl: HTMLAudioElement ;
    private socket: any;
    private producerTransport: types.Transport | null = null;
    private consumerTransport: types.Transport | null = null;
    private device: mediasoupClient.Device | null = null;
    private room_id: string;
    private isVideoOnFullScreen: boolean = false;
    private isDevicesVisible: boolean = false;
    private consumers: Map<string, types.Consumer> = new Map();
    private producers: Map<string, types.Producer> = new Map();
    private producerLabel: Map<string, string> = new Map();
    private _isOpen: boolean = false;
    private eventListeners: Map<string, Array<() => void>> = new Map();
    static mediaType = {
        audio: 'audioType',
        video: 'videoType',
        screen: 'screenType'
    };

    constructor(
        localMediaEl: HTMLVideoElement,
        remoteVideoEl: HTMLVideoElement,
        remoteAudioEl: HTMLAudioElement,
        mediasoupClientInstance: typeof mediasoupClient,
        socketUrl: string,
        room_id: string,
        name: string,
        successCallback: () => void
    ) {
        this.name = name;
        this.localMediaEl = localMediaEl;
        this.remoteVideoEl = remoteVideoEl;
        this.remoteAudioEl = remoteAudioEl;
        this.mediasoupClient = mediasoupClientInstance;
        this.socket = setupSocket(io(socketUrl));
        this.room_id = room_id;

        console.log('Mediasoup client', mediasoupClientInstance);

        Object.keys(_EVENTS).forEach((evt) => {
            this.eventListeners.set(evt, []);
        });
        this.createRoom(room_id, name).then(async () => {
            try {
                await this.join(name, room_id);
                this.initSockets();
                this._isOpen = true;
                console.log("create room")
                successCallback();
            } catch(ex) {
                alert('The room is full!');
            }
        });

    }

    private mediasoupClient: typeof mediasoupClient;



    ////////// INIT /////////

    async start() {
        let room_id = this.room_id;
        let name = this.name;
        await this.socket.request('start', { room_id, name }).catch((err: any) => {
            console.log('Start debate error:', err);
        });
    }

    async createRoom(room_id: string, name: string): Promise<void> {
        try {
            await this.socket.request('createRoom', {
                room_id,
                name
            });
        } catch (err) {
            console.log('Create room error:', err);
        }
    }

    async join(name: string, room_id: string) {
        try {
            const e: any = await this.socket.request('join', { name, room_id });
            if (e.hasOwnProperty('error')) {
                return Promise.reject(new Error('The room is full!'));
            }
            console.log('Joined to room', e);


            const data = await this.socket.request('getRouterRtpCapabilities');
            const device = await this.loadDevice(data);
            this.device = device;
            await this.initTransports(device);
            this.socket.emit('getProducers');
        } catch (error) {
            console.error('Failed to load device:', error);
            alert('Failed to join the room');
        }
    }


    async loadDevice(routerRtpCapabilities: mediasoupClient.types.RtpCapabilities): Promise<mediasoupClient.Device> {
        let device: mediasoupClient.Device;
        console.log("check")

        try {
            device = new mediasoupClient.Device();

        } catch (error: any) {
            if (error.name === 'UnsupportedError') {
                console.error('Browser not supported');
                alert('Browser not supported');
                throw error;
            } else {
                console.error(error);
                throw error;
            }
        }
        await device.load({ routerRtpCapabilities });
        return device;
    }


    async initTransports(device: mediasoupClient.Device) {
        // init producerTransport
        {
            const data = await this.socket.request('createWebRtcTransport', {
                forceTcp: false,
                rtpCapabilities: device.rtpCapabilities
            });

            if (data.error) {
                console.error(data.error);
                return;
            }

            this.producerTransport = device.createSendTransport(data);

            this.producerTransport.on('connect', async ({ dtlsParameters }, callback, errback) => {
                this.socket
                    .request('connectTransport', {
                        dtlsParameters,
                        transport_id: data.id
                    })
                    .then(callback)
                    .catch(errback);
            });

            this.producerTransport.on('produce', async ({ kind, rtpParameters }, callback, errback) => {
                try {
                    const { producer_id } = await this.socket.request('produce', {
                        producerTransportId: this.producerTransport!.id,
                        kind,
                        rtpParameters
                    });
                    callback({ id: producer_id });
                } catch (err:any) {
                    errback(err);
                }
            });

            this.producerTransport.on('connectionstatechange', (state) => {
                switch (state) {
                    case 'connecting':
                        break;
                    case 'connected':
                        break;
                    case 'failed':
                        this.producerTransport!.close();
                        break;
                    default:
                        break;
                }
            });
        }

        // init consumerTransport
        {
            const data = await this.socket.request('createWebRtcTransport', {
                forceTcp: false
            });

            if (data.error) {
                console.error(data.error);
                return;
            }

            this.consumerTransport = device.createRecvTransport(data);
            this.consumerTransport.on('connect', ({ dtlsParameters }, callback, errback) => {
                this.socket
                    .request('connectTransport', {
                        transport_id: this.consumerTransport!.id,
                        dtlsParameters
                    })
                    .then(callback)
                    .catch(errback);
            });

            this.consumerTransport.on('connectionstatechange', async (state) => {
                switch (state) {
                    case 'connecting':
                        break;
                    case 'connected':
                        break;
                    case 'failed':
                        this.consumerTransport!.close();
                        break;
                    default:
                        break;
                }
            });
        }
    }

    initSockets() {
        this.socket.on('rule', (data: any) => {
            console.log(new Date().toISOString(), data);
        });

        this.socket.on('consumerClosed', ({ consumer_id }: { consumer_id: string }) => {
            console.log('Closing consumer:', consumer_id);
            this.removeConsumer(consumer_id);
        });

        this.socket.on('addUser', (data: any) => {
            console.log('New user:', data);
        });

        this.socket.on('swapUser', (data: any) => {
            console.log('Swap user:', data);
        });

        this.socket.on('removeUser', (data: any) => {
            console.log('Remove user:', data);
        });

        this.socket.on('newProducers', async (data: any) => {
            console.log('New producers', data);
            for (let { producer_id } of data) {
                await this.consume(producer_id);
            }
        });

        this.socket.on('disconnect', () => {
            this.exit(true);
        });
    }

    //////// MAIN FUNCTIONS 토론방 입장할때 호출 /////////////

    async produce(type: string, deviceId: string | null = null) {
        console.log("produceproduce");
        let mediaConstraints: any = {};
        let audio = false;
        let screen = false;
        switch (type) {
            case mediaType.audio:
                mediaConstraints = {
                    audio: {
                        deviceId: deviceId
                    },
                    video: false
                };
                audio = true;
                break;
            case mediaType.video:
                mediaConstraints = {
                    audio: false,
                    video: {
                        width: {
                            min: 640,
                            ideal: 640
                        },
                        height: {
                            min: 480,
                            ideal: 480
                        },
                        deviceId: deviceId
                    }
                };
                break;
            case mediaType.screen:
                mediaConstraints = false;
                screen = true;
                break;
            default:
                return;
        }

        if (!this.device!.canProduce('video') && !audio) {
            console.error('Cannot produce video');
            return;
        }
        if (this.producerLabel.has(type)) {
            console.log('Producer already exists for this type ' + type);
            return;
        }
        console.log('Media constraints:', mediaConstraints);
        let stream;
        try {
            stream = screen ? await (navigator.mediaDevices as any).getDisplayMedia() : await navigator.mediaDevices.getUserMedia(mediaConstraints);
            console.log(navigator.mediaDevices.getSupportedConstraints());
            const track = audio ? stream.getAudioTracks()[0] : stream.getVideoTracks()[0];
            const params = {
                track
            };
            const producer = await this.producerTransport!.produce(params);
            console.log('Producer', producer);

            this.producers.set(producer.id, producer);

            let elem: HTMLVideoElement;
            if (!audio) {
                elem = document.createElement('video');
                elem.srcObject = stream;
                elem.id = producer.id;
                elem.playsInline = false;
                elem.autoplay = true;
                elem.className = 'vid';
                this.localMediaEl.appendChild(elem);
                console.log(elem+ "일단은 눈에 띄어야한다")
            }

            producer.on('trackended', () => {
                this.closeProducer(type);
            });

            producer.on('transportclose', () => {
                console.log('Producer transport closed');
                if (!audio) {
                    elem!.parentNode!.removeChild(elem!);
                }
                this.producers.delete(producer.id);
            });

            producer.on('@close', () => {
                console.log('Closing producer');
                if (!audio) {
                    elem!.parentNode!.removeChild(elem!);
                }
                this.producers.delete(producer.id);
            });

            this.producerLabel.set(type, producer.id);

            switch (type) {
                case mediaType.audio:
                    this.event(_EVENTS.startAudio);
                    break;
                case mediaType.video:
                    this.event(_EVENTS.startVideo);
                    break;
                case mediaType.screen:
                    this.event(_EVENTS.startScreen);
                    break;
                default:
                    return;
            }
        } catch (err) {
            console.log(err);
        }
    }

    async consume(producer_id: string) {
        try {

            const { consumer, stream, kind } = await this.getConsumeStream(producer_id);
            this.consumers.set(consumer.id, consumer);
            let elem: HTMLVideoElement | HTMLAudioElement;
            if (kind === 'video') {
                elem = document.createElement('video');
                elem.srcObject = stream;
                elem.id = consumer.id;

                if ("playsInline" in elem) {
                    elem.playsInline = false;
                } // For video
                elem.autoplay = true;
                elem.className = 'vid';
                remoteVideoEls.push(elem as HTMLVideoElement);

                // 원하는 내용 확인
                console.log("Remote Video Elements:");
                remoteVideoEls.forEach((el, index) => {
                    console.log(`Element ${index + 1}:`, el);
                });
                this.remoteVideoEl.appendChild(elem);
                console.log(elem+ "일단은 눈에 띄어야한다 비디오2")
            } else {
                elem = document.createElement('audio');
                elem.srcObject = stream;
                elem.id = consumer.id;
                elem.autoplay = true;
                // Handle playsInline property for audio
                if ("playsInline" in elem) {
                    // Some browsers might support it, so set it to false if available
                    elem.playsInline = false;
                }
                this.remoteAudioEl.appendChild(elem);
                console.log(elem+ "일단은 눈에 띄어야한다33333333")
            }

            consumer.on('trackended', () => {
                this.removeConsumer(consumer.id);
            });

            consumer.on('transportclose', () => {
                this.removeConsumer(consumer.id);
            });
        } catch (error) {
            console.error('Error consuming stream:', error);
        }
    }

    async getConsumeStream(producerId: string): Promise<ConsumeResult> {
        const { rtpCapabilities } = this.device!;
        const data = await this.socket.request('consume', {
            rtpCapabilities,
            consumerTransportId: this.consumerTransport!.id,
            producerId
        });
        const { id, kind, rtpParameters } = data;

        const consumer = await this.consumerTransport!.consume({
            id,
            producerId,
            kind,
            rtpParameters,
        });

        const stream = new MediaStream();
        stream.addTrack(consumer.track);

        return {
            consumer,
            stream,
            kind
        };
    }

    closeProducer(type: string) {
        if (!this.producerLabel.has(type)) {
            console.log('No producer found for this type ' + type);
            return;
        }
        let producer_id = this.producerLabel.get(type)!;
        console.log(producer_id);
        this.socket.emit('producerClosed', {
            producer_id
        });
        this.producers.get(producer_id)!.close();
        this.producers.delete(producer_id);
        this.producerLabel.delete(type);

        switch (type) {
            case mediaType.audio:
                this.event(_EVENTS.stopAudio);
                break;
            case mediaType.video:
                this.event(_EVENTS.stopVideo);
                break;
            case mediaType.screen:
                this.event(_EVENTS.stopScreen);
                break;
            default:
                return;
        }
    }

    async exit(offline: boolean) {
        const clean = () => {
            this._isOpen = false;
            this.consumerTransport!.close();
            this.producerTransport!.close();
            this.socket.off('disconnect');
            this.socket.off('newProducers');
            this.socket.off('consumerClosed');
        };

        if (!offline) {
            this.socket.request('exitRoom').then((e: any) => {
                console.log(e);
                clean();
            }).catch((err: any) => {
                console.warn(err);
                clean();
            });
        } else {
            clean();
        }
        this.event(_EVENTS.exitRoom);
    }

    /////// UTILS ////////

    async event(evt: string) {
        if (!this.eventListeners.has(evt)) {
            console.log('No listeners found for event ' + evt);
            return;
        }
        this.eventListeners.get(evt)!.forEach((callback) => {
            callback();
        });
    }

    on(evt: string, callback: () => void) {
        this.eventListeners.get(evt)!.push(callback);
    }

    getLocalProducers() {
        return this.producers;
    }

    removeConsumer(consumer_id: string) {
        let elem = document.getElementById(consumer_id);
        elem!.parentNode!.removeChild(elem!);
        this.consumers.delete(consumer_id);
    }
}

export default RoomClient;
