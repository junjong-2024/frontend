import { Socket } from 'socket.io-client';
import RoomClient from "./RoomClient";

interface SocketData {
    error?: string;
    [key: string]: any;
}

export interface CustomSocket extends Socket {
    request: <T = any>(type: string, data?: object) => Promise<T>;
}

export const setupSocket = (socket: Socket): CustomSocket => {
    const customSocket = socket as CustomSocket;
    customSocket.request = function request<T = any>(type: string, data = {}): Promise<T> {
        return new Promise((resolve, reject) => {
            this.emit(type, data, (response: SocketData) => {
                if (response.error) {
                    reject(response.error);
                } else {
                    resolve(response as T);
                }
            });
        });
    };
    return customSocket;
};

export let producer: any = null;
export let rc: any = null;
export let isEnumerateDevices = false;

export function start() {
    rc.start();
}

export function joinRoom(name: string, room_id: string, audioSelect: HTMLOptionElement, videoSelect: HTMLOptionElement, localMediaEl: HTMLVideoElement,
                         remoteVideoEl: HTMLVideoElement,
                         remoteAudioEl: HTMLAudioElement,
                         mediasoupClientInstance: any,
                         socketUrl: string,
                         successCallback: () => void) {

    if (rc && rc.isOpen()) {
        console.log('Already connected to a room');
    } else {
        initEnumerateDevices(audioSelect,videoSelect);
        rc = new RoomClient(localMediaEl, remoteVideoEl, remoteAudioEl, mediasoupClientInstance, socketUrl, room_id, name,  successCallback);
    }
}

export function initEnumerateDevices(audioSelect: HTMLOptionElement, videoSelect: HTMLOptionElement) {
    // Many browsers, without the consent of getUserMedia, cannot enumerate the devices.
    if (isEnumerateDevices) return;

    const constraints = {
        audio: true,
        video: true
    };

    navigator.mediaDevices
        .getUserMedia(constraints)
        .then((stream: MediaStream) => {
            enumerateDevices(audioSelect, videoSelect);
            stream.getTracks().forEach(function (track: MediaStreamTrack) {
                track.stop();
            });
            console.log("initinitinit")
        })
        .catch((err: any) => {
            console.error('Access denied for audio/video: ', err);
        });
}

export function enumerateDevices(audioSelect: HTMLOptionElement, videoSelect: HTMLOptionElement) {
    // Load mediaDevice options
    navigator.mediaDevices.enumerateDevices().then((devices: MediaDeviceInfo[]) =>
        devices.forEach((device) => {
            let el = null;
            if ('audioinput' === device.kind) {
                el = audioSelect;
                console.log(audioSelect)
            } else if ('videoinput' === device.kind) {
                el = videoSelect;
            }
            if (!el) return;

            let option = document.createElement('option');
            option.value = device.deviceId || '';
            option.innerText = device.label || '';

            el.appendChild(option);
            isEnumerateDevices = true;
        })
    );
}