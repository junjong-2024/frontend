import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import Modal from '../DebateCreate/DebateCreate';
import "./Dashboard.css";
import axios from "axios";

interface DashboardProps {
    onLogout: () => void;
    onDebateCreate: () => void;
    onOpenDebateRecord: () => void;
    onDebateName: () => void;
    onDebateContent: () => void;
}
interface DebateRecord {
    id: number;
    name: string;
    created_at: string;
    user_id: number;
    video_src: string;
    thumbnail_src: string;
    script: string;
    rule_id: string;
}
const Dashboard: React.FC<DashboardProps> = ({onLogout, onDebateCreate, onOpenDebateRecord, onDebateName,onDebateContent}) => {
    const [showModal, setShowModal] = useState(false);
    const [debateRecords, setDebateRecords] = useState<DebateRecord[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('로그인이 필요합니다.');
                navigate('/LoginPage');
                return;
            }

            try {
                const response = await axios.get('https://junjong2024.asuscomm.com/api/room/list', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                const records = response.data.map((record: any) => ({
                    ...record,
                    thumbnail_src: `https://junjong2024.asuscomm.com/${record.thumbnail_src}`
                }));

                setDebateRecords(records);
            } catch (error) {
                console.error('Error fetching data:', error);
                alert('데이터를 가져오는 중 오류가 발생했습니다.');
            }
        };

        fetchData();
    }, [navigate]);

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
                        {debateRecords.map((record, index) => (
                            <button key={index} className="debateRecord" onClick={handleOpenDebateRecord}>
                                <img className="debateImg" src={record.thumbnail_src} alt="토론 이미지"/>
                                <text className="debateTitle">{record.name}</text>
                            </button>
                        ))}
                    </div>
                </div>

            </div>
        </>
    );
};

export default Dashboard;
