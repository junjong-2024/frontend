import React, {useState} from 'react';
import {Dialog, DialogContent, DialogTitle,} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import "./DebateCreate.css";
import axios from "axios";

interface ModalProps {
    onClose: () => void;
    onDebateName: (debateName: string) => void;
    onButtonClick: () => void;
    onDebateContent: (debateContent: string) => void;
}


const Modal: React.FC<ModalProps> = ({onClose, onButtonClick, onDebateName, onDebateContent}) => {
    const [name, setName] = useState('');
    const [debateContent, setDebateContent] = useState('');
    const [rule_id, setRule_id] = useState('');
    const navigate = useNavigate();

    const NameSet = () => {
        onDebateName(name);
    }
    const ContentSet = () => {
        onDebateContent(name);
    }
    const create = async () => {
        const Token = localStorage.getItem('token'); // 로컬에 저장된 토큰 가져오기
        if (!Token) {
            alert('로그인이 필요합니다.');
            return;
        }

        try {
            const response = await axios.post('https://junjong2024.asuscomm.com:443/api/room', {
                name,
                rule_id
            }, {
                headers: {
                    Authorization: `Bearer ${Token}`
                }
            });

            if (response.status === 200) {
                const { id, name, created_at, user_id, video_src, thumbnail_src, script, rule_id } = response.data;

                console.log('Debate Created:', {
                    id,
                    name,
                    created_at,
                    user_id,
                    video_src,
                    thumbnail_src,
                    script,
                    rule_id
                });

                // 성공적으로 생성되면 다음 페이지로 이동
                navigate('/SettingCreater');
            } else {
                alert('토론 생성에 실패했습니다.');
            }
        } catch (error) {
            console.error('Error creating debate:', error);
            alert('토론 생성 중 오류가 발생했습니다.');
        }
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
                            value={name}
                            onChange={(e) => setName(e.target.value)}
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
                    <label className="debateRule">토론 규칙 선택</label>
                    <select
                        name="debate"
                        className="debateRuleBox"
                        value={rule_id}
                        onChange={(e) => setRule_id(e.target.value)}
                        required
                    >
                        <option value="" disabled>토론 규칙</option>
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
