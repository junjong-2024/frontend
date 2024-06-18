import React, {useState} from 'react';
import {useNavigate} from "react-router-dom";
import Modal from '../DebateCreate/DebateCreate';
import "./DebateRule.css";
import axios from "axios";

interface DebateRuleProps {
    onLogout: () => void;
    onDebateCreate: () => void;
    onOpenDebateRecord: () => void;
    onDebateName: () => void;
    onDebateContent: () => void;
}

const DebateRule: React.FC<DebateRuleProps> = ({ onDebateCreate, onDebateName,onDebateContent}) => {
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
        localStorage.removeItem('token');
        navigate('/LoginPage');
    };

    const handleCreateDefaultRule = () => {
        const token = localStorage.getItem('token');

        const defaultRuleData = {
            rule_name: '기본 규칙',
            spec: {
                teamSize: 2,
                orderSize: 1,
                rules: [
                    { debater: 'team_0_0', msg: '팀 A 입안', time: 10 },
                    { debater: 'team_1_0', msg: '팀 B 입안', time: 10 },
                    { debater: 'team_0_0', msg: '팀 A 교차질의', time: 10 },
                    { debater: 'team_1_0', msg: '팀 B 교차질의', time: 10 },
                    { debater: 'team_0_0', msg: '팀 A 반박', time: 10 },
                    { debater: 'team_1_0', msg: '팀 B 반박', time: 10 },
                    { debater: 'team_0_0', msg: '팀 A 마무리', time: 10 },
                    { debater: 'team_1_0', msg: '팀 B 마무리', time: 10 },
                ],
            },
        };

        axios.post('https://junjong2024.asuscomm.com/api/rule', defaultRuleData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            })
            .then((response) => {
                console.log('Rule creation successful:', response.data);
                alert("기본 규칙 생성에 성공하였습니다.")
            })
            .catch((error) => {
                console.error('Error creating rule:', error);
                // Handle error scenarios appropriately
            });
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
                    <div className="rulePage">
                        <text className="rule">토론 규칙</text>
                        <button className="default" onClick={handleCreateDefaultRule}>기본 규칙 생성</button>
                    </div>
                </div>

            </div>
        </>
    );
};

export default DebateRule;