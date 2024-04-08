import React from 'react';
import {useNavigate} from "react-router-dom";

interface DebateRoomProps {
    onLeave: () => void;
}

const DebateRoom: React.FC<DebateRoomProps> = ({onLeave}) => {

    const navigate = useNavigate();

    const leave = () => {
        navigate('/dashboard');
    };

    return (
        <div>
            <h2>Debate Room</h2>
            <button onClick={leave}>Leave</button>
        </div>
    );
};

export default DebateRoom;