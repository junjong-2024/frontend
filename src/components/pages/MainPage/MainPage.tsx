import React, {useState} from 'react';
import {useNavigate} from "react-router-dom";
import "./MainPage.css"

interface LoginFormProps {
    onLogin: (username: string, password: string) => void;
    onJoin: (joinCode: string) => void;
    onRegister: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({onLogin, onJoin, onRegister}) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [joinCode, setJoinCode] = useState('');
    const navigate = useNavigate();

    const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onLogin(username, password);
        navigate('/dashboard');
    };

    const handleJoin = () => {
        onJoin(joinCode);
        navigate('/userSetting');
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
                            <label className="idtext" htmlFor="username">아이디</label>
                            <input
                                className="idInput"
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
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
                    <img className="logoImg" src={require("../../image/logo.svg").default} alt="로고"/>
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
