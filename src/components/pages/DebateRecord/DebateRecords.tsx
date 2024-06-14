import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate} from "react-router-dom";
import Modal from "../DebateCreate/DebateCreate";
import "./DebateRecord.css"

interface DebateRecordProps {
    onBack: () => void;
    onDebateCreate: () => void;
    onDebateName: () => void;
    onDebateContent: () => void;
}

const DebateRecord: React.FC<DebateRecordProps> = ({onBack,  onDebateCreate,onDebateName,onDebateContent}) => {
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    const [recordData, setRecordData] = useState({
        thumbnail_src: '',
        name: '',
        created_at: '',
        script: '',
        rule_id: '',
        video_src: ''
    });
    const location = useLocation();
    useEffect(() => {
        if (location.state) {
            setRecordData(location.state as any);
        }
    }, [location.state]);

    const handleDebateCreate = () => {
        setShowModal(true);
    };


    const handleCloseModal = () => {
        setShowModal(false);
    };



    const handleDashboard = () => {
        navigate('/dashboard');
    };
    const handleUserSetting = () => {
        navigate('/usersetting');
    };
    const handleDebateRule = () => {
        navigate('/DebateRule');
    };
    const handlePayment = () => {
        navigate('/Payment');
    };
    const handleVolume = () => {
        navigate('/Volume');
    };
    const handleLogout = () => {
        navigate('/LoginPage');
    };
    /*
    const formatScript = (script: string) => {
        const lines = script.split('\n');
        if (lines.length > 3) {
            return `${lines.slice(0, 3).join('\n')}...`;
        }
        return script;
    };

     */
    const handleDownloadScript = () => {
        const element = document.createElement("a");
        const file = new Blob([recordData.script], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = `${recordData.name}_script.txt`;
        document.body.appendChild(element);
        element.click();
    };
    const handleDownloadVideo = () => {
        const element = document.createElement('a');
        element.href = recordData.video_src; // Assuming video_src is a valid URL
        element.download = `${recordData.name}_video.mp4`;
        document.body.appendChild(element);
        element.click();
    };

    return (
        <>
            <div className="header">
                <div className="logoAndButton">
                    <text className="dashboardLogo">Deba;it</text>
                    <button className="debateCreate" onClick={handleDebateCreate}>토론 생성</button>
                    {showModal && (
                        <Modal onClose={handleCloseModal} onButtonClick={onDebateCreate} onDebateName={onDebateName} onDebateContent={onDebateContent}/>
                    )}
                </div>


                <img className="line" src={require("../../image/Rectangle 32.svg").default} alt="선 "/>

            </div>
            <div>
                <div className="page">
                    <div className="buttonList">
                        <button className="dashboardButton" onClick={handleDashboard}>
                            <text className="Button_text">대시 보드</text>
                        </button>
                        <button className="userButton" onClick={handleUserSetting}>
                            <text className="Button_text">사용자 설정</text>
                        </button>
                        <button className="ruleButton" onClick={handleDebateRule}>
                            <text className="Button_text">토론 규칙</text>
                        </button>
                        <button className="paymentButton" onClick={handlePayment}>
                            <text className="Button_text">결제 정보</text>
                        </button>
                        <button className="VolumeButton" onClick={handleVolume}>
                            <text className="Button_text">용량 정보</text>
                        </button>
                        <button className="logout" onClick={handleLogout}>
                            <text className="Button_text">로그아웃</text>
                        </button>
                    </div>
                    <div className="recordPage">
                        <text className="debateCheck">토론 조회</text>
                        <text className="debateName">{recordData.name}</text>
                        <text className="debateDate">{recordData.created_at}</text>
                        <img className="debateCheckImg" src={recordData.thumbnail_src} alt="토론 이미지" />
                        <div className="recordButton">
                            <button className="videoDownload" onClick={handleDownloadVideo}>영상 다운로드</button>
                            <button className="scriptDownload" onClick={handleDownloadScript}>스크립트 다운로드</button>
                        </div>
                        <text className="script">스크립트 미리보기</text>
                        <text className="scriptContent">{recordData.script}</text>
                    </div>
                </div>

            </div>
        </>
    );
};

export default DebateRecord;