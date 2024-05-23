import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./SignUp.css"

interface SignUpFormProps {
    onSubmit: (name: string, login_id: string, password: string, user_email: string, phone: string) => void;
}

const SignUpForm: React.FC<SignUpFormProps> = ({ onSubmit }) => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [login_id, setLogin_id] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [user_email, setUser_email] = useState('');

    const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (password !== confirmPassword) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/user/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    login_id,
                    password,
                    user_email,
                }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log('Success:', data);

            onSubmit(name, login_id, password, user_email, confirmPassword);
            navigate('/LoginPage'); // /LoginPage 페이지로 이동
        } catch (error) {
            console.error('Error:', error);
            alert('회원가입 중 오류가 발생했습니다. 다시 시도해주세요.');
        }
    };

    return (
        <div>
            <div className="Logo">
                <text>Deba;it</text>
            </div>
            <div className="line1">
                <img className="line" src={require("../../image/Rectangle 32.svg").default} alt="선 "/>
            </div>
            <div className="signUpText">
                <text className="Text">회원가입</text>
            </div>
            <form className="signUpList" autoComplete="off" onSubmit={handleFormSubmit}>
                <div>
                    <input
                        className="signUpName"
                        placeholder="이름"
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <input
                        className="signUpUsername"
                        placeholder="아이디"
                        type="text"
                        id="login_id"
                        value={login_id}
                        onChange={(e) => setLogin_id(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <input
                        className="signUpPwd"
                        placeholder="비밀번호"
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <input
                        className="ConfirmPassword"
                        placeholder="비밀번호 확인"
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <input
                        className="signUpEmail"
                        placeholder="이메일 주소"
                        type="email"
                        id="user_email"
                        value={user_email}
                        onChange={(e) => setUser_email(e.target.value)}
                        required
                    />
                </div>

                <button className="SignUp" type="submit">가입하기</button>
            </form>
            <div className="footer"></div>
        </div>
    );
};

export default SignUpForm;
