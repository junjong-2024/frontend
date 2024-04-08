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

                <div className="line1">
                    <img className="line" src={require("../../image/Rectangle 32.svg").default} alt="선 "/>
                </div>
            </div>
            <div>
                <button onClick={handleOpenDebateRecord}>토론 기록</button>
                <button onClick={handleLogout}>Logout</button>

            </div>
        </>
    );
};

export default Dashboard;
