import React from 'react';
import {useNavigate} from "react-router-dom";

interface DebateRecordProps {
    onBack: () => void;
}

const DebateRecord: React.FC<DebateRecordProps> = ({onBack}) => {
    const navigate = useNavigate();

    const back = () => {
        navigate('/dashboard');
    };

    return (
        <div>
            <h2>Debate Record</h2>
            <button onClick={back}>Back</button>
        </div>
    );
};

export default DebateRecord;