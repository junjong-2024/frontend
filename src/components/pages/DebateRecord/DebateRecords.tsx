import React, {useState} from 'react';
import {useNavigate} from "react-router-dom";
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

    const handleDebateCreate = () => {
        setShowModal(true);
    };


    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleOpenDebateRecord = () => {
        navigate('/debateRecord');
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
                    <text className="debateName">토론방 이름</text>
                    <text className="debateDate">토론 날짜</text>
                    <img className="debateCheckImg" src={"https://www.shutterstock.com/image-vector/no-image-available-icon-template-600nw-1036735678.jpg"}></img>
                    <div className="recordButton">
                        <button className="videoDownload">영상 다운로드</button>
                        <button className="scriptDownload">스크립트 다운로드</button>
                    </div>
                    <text className="script">스크립트 미리보기</text>
                    <text className="scriptContent">내용</text>
                    </div>
                </div>

            </div>
        </>
    );
};

export default DebateRecord;