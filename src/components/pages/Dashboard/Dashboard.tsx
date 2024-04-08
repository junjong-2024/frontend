import React, {useState} from 'react';
import {useNavigate} from "react-router-dom";
import Modal from '../DebateCreate/DebateCreate';
import "./Dashboard.css";

interface DashboardProps {
    onLogout: () => void;
    onDebateCreate: () => void;
    onOpenDebateRecord: () => void;
    onDebateName: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({onLogout, onDebateCreate, onOpenDebateRecord, onDebateName}) => {
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
                        <Modal onClose={handleCloseModal} onButtonClick={onDebateCreate} onDebateName={onDebateName}/>
                    )}
                </div>


                    <img className="line" src={require("../../image/Rectangle 32.svg").default} alt="선 "/>

            </div>
            <div>
                <div className="page">
                    <div className="buttonList">
                        <button className="dashboardButton" onClick={handleLogout}>
                            <text className="Button_text">대시 보드</text>
                        </button>
                        <button className="userButton" onClick={handleLogout}>
                            <text className="Button_text">사용자 설정</text>
                        </button>
                        <button className="ruleButton" onClick={handleLogout}>
                            <text className="Button_text">토론 규칙</text>
                        </button>
                        <button className="paymentButton" onClick={handleLogout}>
                            <text className="Button_text">결제 정보</text>
                        </button>
                        <button className="VolumeButton" onClick={handleLogout}>
                            <text className="Button_text">용량 정보</text>
                        </button>
                        <button className="logout" onClick={handleLogout}>
                            <text className="Button_text">로그아웃</text>
                        </button>
                    </div>
                    <div className="pagebutton">
                        <button className="debateRecord" onClick={handleOpenDebateRecord}>토론 기록</button>
                    </div>
                </div>

            </div>
        </>
    );
};

export default Dashboard;
