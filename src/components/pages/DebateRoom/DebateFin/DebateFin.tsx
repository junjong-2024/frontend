import React, {useState} from 'react';
import {Dialog, DialogContent, DialogTitle,} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import "../../DebateCreate/DebateCreate.css";
import "./DebateFin.css"

interface DebateFinProps {
    onClose: () => void;
    onButtonClick: () => void;
}


const DebateFin: React.FC<DebateFinProps> = ({onClose, onButtonClick}) => {

    const navigate = useNavigate();

    const create = () => {
        navigate('/SettingCreater');
    };

    return (
        <Dialog className="popup" open={true} onClose={onClose}>
            <img className="logoImg" width="186px" height="169px" src={require("../../../image/logo.svg").default} alt="로고"/>
            <DialogTitle className="PopupLogo1" fontSize="40px" fontWeight="bold">Deba;it</DialogTitle>
            <DialogContent>
                <div className="debateFin">
                    <text className="debateFinTxt">토론을 종료할까요?</text>
                    <div className="debateFinSub">
                        <text className="debateFinSubTxt">토론 종료 버튼 클릭 시 <br></br> 10초 후에 토론 방이 사라집니다.</text>
                    </div>
                </div>
                <div className="finish">
                    <button className="finishButton" onClick={create} type="submit">토론 종료</button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default DebateFin;
