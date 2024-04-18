import React, {useState} from 'react';
import {Dialog, DialogContent, DialogTitle,} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import "./DebateCreate.css";

interface ModalProps {
    onClose: () => void;
    onDebateName: (debateName: string) => void;
    onButtonClick: () => void;
    onDebateContent: (debateContent: string) => void;
}


const Modal: React.FC<ModalProps> = ({onClose, onButtonClick, onDebateName, onDebateContent}) => {
    const [debateName, setDebateName] = useState('');
    const [debateContent, setDebateContent] = useState('');
    const navigate = useNavigate();

    const NameSet = () => {
        onDebateName(debateName);
    }
    const ContentSet = () => {
        onDebateContent(debateName);
    }
    const create = () => {
        navigate('/SettingCreater');
    };

    return (
        <Dialog className="popup" open={true} onClose={onClose}>
            <img className="logoImg" width="186px" height="169px" src={require("../../image/logo.svg").default} alt="로고"/>
            <DialogTitle className="PopupLogo1" fontSize="40px" fontWeight="bold">Deba;it</DialogTitle>
            <DialogContent>
                <form className="debateNameSet" onSubmit={NameSet}>
                    <div>
                        <label className="Name" htmlFor="debateName">토론방 이름</label>
                        <input
                            className="nameInput"
                            type="text"
                            id="debateName"
                            value={debateName}
                            onChange={(e) => setDebateName(e.target.value)}
                            required
                        />
                    </div>
                </form>
                <form className="debateContent" onSubmit={ContentSet}>
                    <div>
                        <label className="Content" htmlFor="debateContent">토론방 설명</label>
                        <textarea
                            className="ContentInput"
                            id="debateContent"
                            value={debateContent}
                            onChange={(e) => setDebateContent(e.target.value)}
                            required
                        />
                    </div>
                </form>
                <div className="ruleSelect">
                    <text className="debateRule">토론 규칙 선택</text>
                    <select name="debate" className="debateRuleBox">
                        <option disabled selected>토론 규칙</option>
                        <option value="rule1">기본 규칙1</option>
                        <option value="rule2">기본 규칙2</option>
                        <option value="rule3">기본 규칙3</option>
                        <option value="rule4">기본 규칙4</option>
                    </select>
                </div>
                <div className="create">
                    <button className="createButton" onClick={create} type="submit">토론 생성</button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default Modal;
