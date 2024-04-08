import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import LoginForm from "./components/pages/MainPage/MainPage";
import Dashboard from "./components/pages/Dashboard/Dashboard";
import SignUpForm from "./components/pages/SignUp/SignUp";
import DebateRecord from "./components/pages/DebateRecord/DebateRecords";
import DebateRoom from "./components/pages/DebateRoom/DebateRoom";
import Modal from "./components/pages/DebateCreate/DebateCreate";

const App: React.FC = () => {
    const handleLogin = (username: string, password: string) => {
        console.log('Logging in with:', username, password);
        // 여기에 로그인 처리 로직을 추가하세요.
    };
    const handleJoin = (joinCode: string) => {
        console.log('Joining with code:', joinCode);
        // 여기에 입장 처리 로직을 추가하세요.
    };
    const register = () => {
        console.log('sign up');
        // 여기에 입장 처리 로직을 추가하세요.
    };
    const debateCreate = () => {
        console.log('Create');
        // 여기에 입장 처리 로직을 추가하세요.
    };
    const logout = () => {
        console.log('logout');
        // 여기에 입장 처리 로직을 추가하세요.
    };
    const signup = () => {
        console.log('signup');
        // 여기에 입장 처리 로직을 추가하세요.
    };
    const back = () => {
        console.log(' back ');
        // 여기에 입장 처리 로직을 추가하세요.
    };
    const join = () => {
        console.log('join');
        // 여기에 입장 처리 로직을 추가하세요.
    };
    return (
        <Router>
            <Routes>
                <Route path="/signUp" element={<SignUpForm onSubmit={signup}/>}/>
                <Route path="/LoginPage"
                       element={<LoginForm onLogin={handleLogin} onJoin={handleJoin} onRegister={register}/>}/>

                <Route path="/dashboard" element={<Dashboard onDebateCreate={debateCreate} onLogout={logout}
                                                             onOpenDebateRecord={debateCreate} onDebateName={join}/>}/>
                <Route path="/debateRecord" element={<DebateRecord onBack={back}/>}/>
                <Route path="/debateRoom" element={<DebateRoom onLeave={back}/>}/>
                <Route path="/debateCreate"
                       element={<Modal onButtonClick={debateCreate} onClose={back} onDebateName={join}/>}/>


            </Routes>
        </Router>
    );
};


export default App;