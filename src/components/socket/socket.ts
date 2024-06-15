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

export function joinRoom(name: string, room_id: string, localMediaEl: HTMLVideoElement,
                         remoteVideoEl: HTMLVideoElement,
                         remoteAudioEl: HTMLAudioElement,
                         mediasoupClientInstance: any,
                         socketUrl: string,
                         successCallback: () => void) {

    if (rc && rc.isOpen()) {
        console.log('Already connected to a room');
    } else {
        rc = new RoomClient(localMediaEl, remoteVideoEl, remoteAudioEl, mediasoupClientInstance, socketUrl,room_id, name,  successCallback);
    }
}

