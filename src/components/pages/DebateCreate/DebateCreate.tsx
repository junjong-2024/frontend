import React, {useEffect, useState} from 'react';
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
interface Rule {
    id: number;
    rule_name: string;
}

const Modal: React.FC<ModalProps> = ({onClose, onButtonClick, onDebateName, onDebateContent}) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [rule_id, setRule_id] = useState('');
    const navigate = useNavigate();
    const [rules, setRules] = useState<Rule[]>([]);

    const NameSet = () => {
        onDebateName(name);
    }
    const ContentSet = () => {
        onDebateContent(description);
    }
    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token'); // 로컬에 저장된 토큰 가져오기
            if (!token) {
                alert('로그인이 필요합니다.');
                return;
            }

            try {
                const response = await axios.get('/api/rule/list', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                console.log('Fetched data:', response.data);
                setRules(response.data); // 응답 데이터를 상태에 저장
            } catch (error) {
                console.error('Error fetching data:', error);
                alert('데이터를 가져오는 중 오류가 발생했습니다.');
            }
        };

        fetchData();
    }, []);
    const create = async () => {
        const token = localStorage.getItem('token'); // 로컬에 저장된 토큰 가져오기
        console.log(token);
        if (!token) {
            alert('로그인이 필요합니다.');
            return;
        }

        try {
            const response = await fetch('https://junjong2024.asuscomm.com:443/api/room', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name,
                    rule_id,
                    description
                })
            });

            if (response.ok) {
                const data = await response.json();
                const { id, name, created_at, user_id, video_src, thumbnail_src, script, rule_id } = data;

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

                // 성공적으로 생성되면 다음 페이지로 이동, id를 함께 전달
                navigate('/SettingCreater', { state: { id } });
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
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
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
                        {rules.map(rule => (
                            <option key={rule.id} value={rule.id}>{rule.rule_name}</option>
                        ))}
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
