// combinedCode.ts 파일에 붙여넣기

import { Socket } from 'socket.io-client';
import React, { useRef, useState } from 'react';
import RoomClient from "./RoomClient";
import { types } from 'mediasoup-client';

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

export function joinRoom(name: string, room_id: string, audioSelect: string, videoSelect: string, localMediaEl: HTMLVideoElement,
                         remoteVideoEl: HTMLVideoElement,
                         remoteAudioEl: HTMLVideoElement,
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

export function initEnumerateDevices(audioSelect: string, videoSelect: string) {
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
        })
        .catch((err: any) => {
            console.error('Access denied for audio/video: ', err);
        });
}

export function enumerateDevices(audioSelect: string, videoSelect: string) {
    // Load mediaDevice options
    navigator.mediaDevices.enumerateDevices().then((devices: MediaDeviceInfo[]) =>
        devices.forEach((device) => {
            let el = null;
            if ('audioinput' === device.kind) {
                el = audioSelect;
            } else if ('videoinput' === device.kind) {
                el = videoSelect;
            }
            if (!el) return;

            let option = document.createElement('option');
            option.value = device.deviceId || '';
            option.innerText = device.label || '';
            // @ts-ignore
            el.appendChild(option);
            isEnumerateDevices = true;
        })
    );
}