import React, {useEffect, useRef, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import "./SettingMember.css"
import speaker from "../../image/speaker.svg"
import speakerMute from "../../image/speakermute.svg"
import video from "../../image/video.svg"
import videMute from "../../image/videomute.svg"
import mic from "../../image/mic.svg"
import micMute from "../../image/micmute.svg"
import io from "socket.io-client";
import {setupSocket, CustomSocket, joinRoom} from '../../socket/socket';

interface SettingMemberProps {
    name: string;
    localMediaEl: HTMLVideoElement ;
    remoteVideoEl: HTMLVideoElement ;
    remoteAudioEl: HTMLAudioElement ;
    mediasoupClient: any;
    socket: any;
    successCallback: () => void;
    onSubmit: (name: string) => void;
}

const SettingMember: React.FC<SettingMemberProps> = ({onSubmit,
                                                         successCallback,
                                                         localMediaEl,
                                                         remoteVideoEl,
                                                         remoteAudioEl,
                                                         mediasoupClient}) => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [soundClicked, setSoundClicked] = useState(false);
    const [videoClicked, setVideoClicked] = useState(false);
    const [micClicked, setMicClicked] = useState(false);
    const [soundImg, setSoundImg] = useState(speaker);
    const [videoImg, setVideoImg] = useState(video);
    const [micImg, setMicImg] = useState(mic);
    const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);
    const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
    const [micDevices, setMicDevices] = useState<MediaDeviceInfo[]>([]);
    const selectedMicDeviceRef = useRef<HTMLOptionElement | null>(null);
    const selectedAudioDeviceRef = useRef<HTMLOptionElement | null>(null);
    const selectedVideoDeviceRef = useRef<HTMLOptionElement | null>(null);
    const location = useLocation();
    const { room_id } = location.state || {};

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

        const getRemoteMedia = async () => {
            try {

                const remoteStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                if (remoteVideoEl) {

                    remoteVideoEl.srcObject = remoteStream;
                }
                if (remoteAudioEl) {

                    remoteAudioEl.srcObject = remoteStream;
                }
            } catch (error) {
                console.error('Error accessing remote media:', error);
            }
        };

        getLocalMedia();
        getRemoteMedia();
    }, [localMediaEl, remoteVideoEl, remoteAudioEl]);

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
        const selectedOption = event.target.selectedOptions[0];
        selectedMicDeviceRef.current = selectedOption;
        console.log(selectedOption);
    };

    const handleAudioChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedOption = event.target.selectedOptions[0];
        selectedAudioDeviceRef.current = selectedOption;
        console.log(selectedOption);
    };

    const handleVideoChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedOption = event.target.selectedOptions[0];
        selectedVideoDeviceRef.current = selectedOption;
        console.log(selectedOption);
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

    const onClickCreate = async () => {
        navigate('/debateRoom', {
            state: {
                name,
                room_id,
                selectedMicDevice: selectedMicDeviceRef.current?.value,
                selectedAudioDevice: selectedAudioDeviceRef.current?.value,
                selectedVideoDevice: selectedVideoDeviceRef.current?.value
            }
        });
        console.log(selectedAudioDeviceRef.current);
        console.log(selectedVideoDeviceRef.current);
        if (selectedAudioDeviceRef.current&&selectedVideoDeviceRef.current) {
            console.log(localMediaEl+"remotevideo확인")
            joinRoom(name, room_id, selectedAudioDeviceRef.current, selectedVideoDeviceRef.current, localMediaEl, remoteVideoEl, remoteAudioEl, mediasoupClient, "/", successCallback);

        }

        console.log(name);
    };

    useEffect(() => {
        // 오디오 음소거 처리
        const toggleAudio = () => {
            if (localMediaEl && localMediaEl.srcObject) {
                const tracks = (localMediaEl.srcObject as MediaStream).getTracks();
                tracks.forEach(track => {
                    if (track.kind === 'audio') {
                        track.enabled = !soundClicked; // soundClicked가 true이면 음소거, false이면 활성화
                    }
                });
            }
        };

        // 비디오 음소거 처리
        const toggleVideo = () => {
            if (localMediaEl && localMediaEl.srcObject) {
                const tracks = (localMediaEl.srcObject as MediaStream).getTracks();
                tracks.forEach(track => {
                    if (track.kind === 'video') {
                        track.enabled = !videoClicked; // videoClicked가 true이면 비디오 음소거, false이면 활성화
                    }
                });
            }
        };

        // 마이크 음소거 처리
        const toggleMicrophone = () => {
            if (localMediaEl && localMediaEl.srcObject) {
                const audioTracks = (localMediaEl.srcObject as MediaStream).getAudioTracks();
                audioTracks.forEach(track => {
                    track.enabled = !micClicked; // micClicked가 true이면 마이크 음소거, false이면 활성화
                });
            }
        };

        toggleAudio();
        toggleVideo();
        toggleMicrophone();

    }, [soundClicked, videoClicked, micClicked, localMediaEl]);
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
                    <video className="privateCam" ref={(el) => { if (el) localMediaEl = el; }} autoPlay></video>
                    <video ref={(el) => { if (el) remoteVideoEl = el; }} style={{ display: 'none' }} autoPlay />
                    <audio ref={(el) => { if (el) remoteAudioEl = el; }} style={{ display: 'none' }} autoPlay />
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
                    <select name="soundChoice" className="soundChoice" defaultValue="" onChange={handleAudioChange}>
                        <option value="" disabled>헤드셋 설정</option>
                        {audioDevices.map(device => (
                            <option key={device.deviceId} value={device.deviceId}>{device.label || device.deviceId}</option>
                        ))}
                    </select>
                    <select name="videoChoice" className="videoChoice" defaultValue="" onChange={handleVideoChange}>
                        <option value="" disabled>비디오 설정</option>
                        {videoDevices.map(device => (
                            <option key={device.deviceId} value={device.deviceId}>{device.label || device.deviceId}</option>
                        ))}
                    </select>
                    <select name="micChoice" className="micChoice" defaultValue="" onChange={handleMicChange}>
                        <option value="" disabled>마이크 설정</option>
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
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />

                    <button className="nicknameButton">설정</button>

                </div>
                <div className="createDebate">
                    <text className="debateJoin">참여할 준비가 되셨나요?</text>
                    <button className="debateJoinBtn" onClick={onClickCreate}>입장하기</button>
                </div>

            </div>
        </div>
    );
};

export default SettingMember;
