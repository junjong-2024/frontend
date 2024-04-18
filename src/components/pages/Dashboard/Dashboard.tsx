import React, {useState} from 'react';
import {useNavigate} from "react-router-dom";
import Modal from '../DebateCreate/DebateCreate';
import "./Dashboard.css";

interface DashboardProps {
    onLogout: () => void;
    onDebateCreate: () => void;
    onOpenDebateRecord: () => void;
    onDebateName: () => void;
    onDebateContent: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({onLogout, onDebateCreate, onOpenDebateRecord, onDebateName,onDebateContent}) => {
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

                    <div className="pagebutton">
                        <text className="dash">대시 보드</text>
                        <button className="debateRecord" onClick={handleOpenDebateRecord}>
                            <img className="debateImg" src={"https://www.shutterstock.com/image-vector/no-image-available-icon-template-600nw-1036735678.jpg"}/>
                            <text className="debateTitle">토론 제목</text>
                        </button>
                    </div>
                </div>

            </div>
        </>
    );
};

export default Dashboard;
