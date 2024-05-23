import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import "./MainPage.css";

interface LoginFormProps {
    onLogin: (login_id: string, password: string) => void;
    onJoin: (joinCode: string) => void;
    onRegister: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, onJoin, onRegister }) => {
    const [login_id, setLogin_id] = useState('');
    const [password, setPassword] = useState('');
    const [joinCode, setJoinCode] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            const response = await fetch('http://localhost:8080/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ login_id, password }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            const token = data.token;
            localStorage.setItem('token', token);

            onLogin(login_id, password);
            navigate('/dashboard');
        } catch (error) {
            console.error('Error:', error);
            alert('로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
        }
    };

    const handleJoin = () => {
        onJoin(joinCode);
        navigate('/SettingMember');
    };

    const handleRegister = () => {
        onRegister();
        navigate('/signUp');
    };

    return (
        <>
            <div className="Logo">
                <text>Deba;it</text>
            </div>
            <div className="line1">
                <img className="line" src={require("../../image/Rectangle 32.svg").default} alt="선 "/>
            </div>
            <div className="item">
                <div className="LoginAndSignup">
                    <form className="id" onSubmit={handleLogin}>
                        <text className="login">로그인</text>
                        <div>
                            <label className="idtext" htmlFor="login_id">아이디</label>
                            <input
                                className="idInput"
                                type="text"
                                id="login_id"
                                value={login_id}
                                onChange={(e) => setLogin_id(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="pwdText" htmlFor="password">비밀번호</label>
                            <input
                                className="pwdInput"
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button className="loginButton" type="submit">로그인 하기</button>
                    </form>
                    <div>
                        <button className="signUpButton" onClick={handleRegister}>회원가입 하기</button>
                    </div>
                </div>
                <div className="join">
                    <div className="img">
                        <img className="mainlogoImg" src={require("../../image/logo.svg").default} alt="로고"/>
                    </div>
                    <text className="joinText">토론방 참여코드 입력</text>
                    <div>
                        <input
                            className="joinInput"
                            type="text"
                            id="joinCode"
                            value={joinCode}
                            onChange={(e) => setJoinCode(e.target.value)}
                            required
                        />
                    </div>
                    <button className="joinButton" onClick={handleJoin}>입장하기</button>
                </div>
            </div>
        </>
    );
};

export default LoginForm;
