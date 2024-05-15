import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import "./SignUp.css"

interface SignUpFormProps {
    onSubmit: (name: string, username: string, password: string, email: string, phone:string) => void;
}

const SignUpForm: React.FC<SignUpFormProps> = ({onSubmit}) => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');

    const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        onSubmit(name, username, password, email,confirmPassword);
        navigate('/LoginPage'); // /LoginPage 페이지로 이동
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
            <form  className="signUpList" onSubmit={handleFormSubmit}>
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
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
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
                        type="text"
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
                        type="text"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
