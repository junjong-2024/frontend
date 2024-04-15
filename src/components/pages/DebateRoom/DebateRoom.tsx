import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import "./DebateRoom.css"
import {Box, LinearProgress, linearProgressClasses, styled, Typography} from "@mui/material";

interface DebateRoomProps {
    onLeave: () => void;
}

const DebateRoom: React.FC<DebateRoomProps> = ({onLeave}) => {
    const [progress, setProgress] = React.useState(0);
    const [timeLeft, setTimeLeft] = useState('3:00');
    const navigate = useNavigate();

    const leave = () => {
        navigate('/dashboard');
    };

    const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
        height: 30,

        [`&.${linearProgressClasses.colorPrimary}`]: {
            backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 300 : 800],
        },
        [`& .${linearProgressClasses.bar}`]: {

            backgroundColor: theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8',
        },
    }));
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60); // 소수점을 버림
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };
    useEffect(() => {
        const totalTime = 3 * 60; // 3분을 초 단위로 변환
        let remainingTime = totalTime;
        const intervalTime = 1; // 1초마다 갱신

        const updateTimer = () => {
            remainingTime--;
            const minutes = Math.floor(remainingTime / 60);
            const seconds = remainingTime % 60;
            setTimeLeft(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);

            const newProgress = ((totalTime - remainingTime) / totalTime) * 100; // 진행률 계산
            setProgress(newProgress);

            if (remainingTime <= 0) {
                clearInterval(timer);
                setProgress(0);
                setTimeLeft('3:00');
                remainingTime = totalTime; // 타이머를 다시 3분으로 설정
                timer = setInterval(updateTimer, intervalTime * 1000);
            }
        };

        let timer = setInterval(updateTimer, intervalTime * 1000);

        return () => {
            clearInterval(timer);
        };
    }, []);


    return (
        <div>
            <div className="lineTop">
                <img className="logo" src={require("../../image/logo.svg").default}/>
                <div className="Title">
                    <text>토론 제목</text>
                </div>
                <div className="memberCount">3명/6명</div>
            </div>
            <div className="line1">
                <img className="line" src={require("../../image/Rectangle 32.svg").default} alt="선 "/>
            </div>
            <div className="timer">
                <div className="order">A팀 입론</div>
                <Box  className="timerBar" sx={{ width: '100%' }}>
                    <BorderLinearProgress variant="determinate" value={progress}></BorderLinearProgress>
                </Box>
                <Typography variant="h5" gutterBottom>
                    {timeLeft}
                </Typography>
            </div>
            <button onClick={leave}>Leave</button>
        </div>
    );
};

export default DebateRoom;