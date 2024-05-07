import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import "./SettingCreater.css"
import speaker from "../../image/speaker.svg"
import speakerMute from "../../image/speakermute.svg"
import video from "../../image/video.svg"
import videMute from "../../image/videomute.svg"
import mic from "../../image/mic.svg"
import micMute from "../../image/micmute.svg"
import io from 'socket.io-client'

interface SettingCreaterProps {
    name: string;
    localMediaEl: HTMLVideoElement | null;
    remoteVideoEl: HTMLElement | null;
    remoteAudioEl: HTMLElement | null;
    mediasoupClient: any;
    socket: any;
    room_id: string;
    successCallback: () => void;
    onSubmit: (name: string) => void;
}

const SettingCreater: React.FC<SettingCreaterProps> = ({ onSubmit,
                                                           successCallback,
                                                           name,
                                                           room_id,
                                                           localMediaEl,
                                                           remoteVideoEl,
                                                           remoteAudioEl,
                                                           mediasoupClient,
                                                           socket}) => {
    const navigate = useNavigate();
    const [nickname, setNickName] = useState('');
    const [soundClicked, setSoundClicked] = useState(false);
    const [videoClicked, setVideoClicked] = useState(false);
    const [micClicked, setMicClicked] = useState(false);
    const [soundImg, setSoundImg] = useState(speaker);
    const [videoImg, setVideoImg] = useState(video);
    const [micImg, setMicImg] = useState(mic);
    const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);
    const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
    const [micDevices, setMicDevices] = useState<MediaDeviceInfo[]>([]);
    const [selectedMicDevice, setSelectedMicDevice] = useState<string>('');
    const [selectedAudioDevice, setSelectedAudioDevice] = useState<string>('');
    const [selectedVideoDevice, setSelectedVideoDevice] = useState<string>('');

    useEffect(() => {
        const getLocalMedia = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                if (localMediaEl) {
                    // Assign the local media stream to the video element
                    localMediaEl.srcObject = stream;
                }
            } catch (error) {
                console.error('Error accessing local media:', error);
            }
        };
        getLocalMedia();
    }, [localMediaEl]);
    useEffect(() => {
        // 컴포넌트가 마운트될 때 실행
        const getDevices = async () => {
            try {
                const devices = await navigator.mediaDevices.enumerateDevices();
                const audioDevices = devices.filter(device => device.kind === 'audioinput');
                const videoDevices = devices.filter(device => device.kind === 'videoinput');
                const micDevices = devices.filter(device => device.kind === 'audioinput');

                setAudioDevices(audioDevices);
                setVideoDevices(videoDevices);
                setMicDevices(micDevices);
                console.error(audioDevices);
                console.error(micDevices);
            } catch (error) {
                console.error('Error enumerating media devices:', error);
            }
        };

        getDevices();
        const requestMicPermission = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
                console.log('오디오 및 마이크 권한이 허용되었습니다.');
                stream.getTracks().forEach(track => track.stop());
            } catch (error) {
                console.log('오디오 및 마이크 권한이 허용되었습니다.');
            }
        };
        requestMicPermission();
    }, []);
    const handleMicChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedMicDevice(event.target.value);
        // 선택된 마이크 디바이스와 연결하는 작업 추가
    };

    const handleAudioChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedAudioDevice(event.target.value);
        // 선택된 오디오 디바이스와 연결하는 작업 추가
    };

    const handleVideoChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedVideoDevice(event.target.value);
        // 선택된 비디오 디바이스와 연결하는 작업 추가
    };
    const SoundClick = () => {
        if (soundClicked) {
            setSoundImg(speaker);
            setSoundClicked(false); // 초기 상태 false 일 땐 초기 상태 이미지 src
        } else {
            setSoundImg(speakerMute);
            setSoundClicked(true); // true일 땐 변경될 이미지 src
        }
    };
    const videoClick = () => {
        if (videoClicked) {
            setVideoImg(video);
            setVideoClicked(false); // 초기 상태 false 일 땐 초기 상태 이미지 src
        } else {
            setVideoImg(videMute);
            setVideoClicked(true); // true일 땐 변경될 이미지 src
        }
    };
    const micClick = () => {
        if (micClicked) {
            setMicImg(mic);
            setMicClicked(false); // 초기 상태 false 일 땐 초기 상태 이미지 src
        } else {
            setMicImg(micMute);
            setMicClicked(true); // true일 땐 변경될 이미지 src
        }
    };

    const onClickCreate = () => {
        navigate('/debateRoom', {
            state: {
                name,
                selectedMicDevice,
                selectedAudioDevice,
                selectedVideoDevice
            }
        });
    };

    return (
        <div>
            <div className="Logo">
                <text>Deba;it</text>
            </div>
            <div className="line1">
                <img className="line" src={require("../../image/Rectangle 32.svg").default} alt="선 "/>
            </div>
            <div className="top">

            <div className="cam">
                <video className="privateCam" ref={(el) => { if (el) localMediaEl = el; }} autoPlay muted></video>
            </div>
            <div className="otherButton">
                <button className={soundClicked ?"soundClick" : "SoundSet"} onClick={SoundClick}>
                    <img className="soundIcon" src={soundImg} />
                </button>
                <button className={videoClicked ? "videoClick" : "videoSet"} onClick={videoClick}>
                    <img className="videoIcon" src={videoImg} />
                </button>
                <button className={micClicked ? "micClick" : "micSet"} onClick={micClick}>
                    <img className="micIcon" src={micImg} />
                </button>
            </div>
            <div className="setSelect">
                <select name="soundChoice" className="soundChoice" onChange={handleAudioChange} value={selectedAudioDevice} >
                    <option disabled selected>헤드셋 설정</option>
                    {audioDevices.map(device => (
                        <option key={device.deviceId} value={device.deviceId}>{device.label || device.deviceId}</option>
                    ))}
                </select>
                <select name="videoChoice" className="videoChoice" onChange={handleVideoChange} value={selectedVideoDevice}>
                    <option disabled selected>비디오 설정</option>
                    {videoDevices.map(device => (
                        <option key={device.deviceId} value={device.deviceId}>{device.label || device.deviceId}</option>
                    ))}
                </select>
                <select name="micChoice" className="micChoice" onChange={handleMicChange} value={selectedMicDevice} >
                    <option disabled selected>마이크 설정</option>
                    {micDevices.map(device => (
                        <option key={device.deviceId} value={device.deviceId}>{device.label || device.deviceId}</option>
                    ))}
                </select>
            </div>

            </div>
            <div className="bottom">
                <div className="nicknameSet">
                    <text className="nicknameSet">이름 설정</text>
                    <input
                        className="nicknameInput"
                        type="text"
                        id="nickname"
                        value={nickname}
                        onChange={(e) => setNickName(e.target.value)}
                        required
                    />

                    <button className="nicknameButton">설정</button>

                </div>
            <div className="createDebate">
                <text className="createText">토론을 시작할 준비가 되셨나요?</text>
                <button className="debateCreateBtn" onClick={onClickCreate}>생성하기

                </button>
            </div>

            </div>
        </div>

    );
};

export default SettingCreater;
