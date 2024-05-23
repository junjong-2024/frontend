import { Socket } from 'socket.io-client';

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