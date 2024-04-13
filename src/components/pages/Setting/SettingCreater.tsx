import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import "./SettingCreater.css"
import speaker from "../../image/speaker.svg"
import speakerMute from "../../image/speakermute.svg"
import video from "../../image/video.svg"
import videMute from "../../image/videomute.svg"
import mic from "../../image/mic.svg"
import micMute from "../../image/micmute.svg"


interface SettingCreaterProps {
    onSubmit: (name: string) => void;
}

const SettingCreater: React.FC<SettingCreaterProps> = ({onSubmit}) => {
    const navigate = useNavigate();
    const [nickname, setNickName] = useState('');
    const [soundClicked, setSoundClicked] = useState(false);
    const [videoClicked, setVideoClicked] = useState(false);
    const [micClicked, setMicClicked] = useState(false);
    const [soundImg, setSoundImg] = useState(speaker);
    const [videoImg, setVideoImg] = useState(video);
    const [micImg, setMicImg] = useState(mic);

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
        navigate('/debateRoom');
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
                <img className="privateCam" src={require("../../image/cam.svg").default}/>
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
                <select name="soundChoice" className="soundChoice">
                    <option disabled selected>헤드셋 설정</option>
                    <option value="sound1">기본 헤드셋1</option>
                    <option value="sound2">기본 헤드셋2</option>
                    <option value="sound3">기본 헤드셋3</option>
                </select>
                <select name="videoChoice" className="videoChoice">
                    <option disabled selected>비디오 설정</option>
                    <option value="video1">기본 비디오1</option>
                    <option value="video2">기본 비디오2</option>
                </select>
                <select name="micChoice" className="micChoice">
                    <option disabled selected>마이크 설정</option>
                    <option value="mic1">기본 마이크1</option>
                    <option value="mic2">기본 마이크2</option>
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
                <button className="debateCreateBtn" onClick={onClickCreate}>생성하기</button>
            </div>

            </div>
        </div>
    );
};

export default SettingCreater;
