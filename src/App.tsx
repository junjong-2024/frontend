import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import LoginForm from "./components/pages/MainPage/MainPage";
import Dashboard from "./components/pages/Dashboard/Dashboard";
import SignUpForm from "./components/pages/SignUp/SignUp";
import DebateRecord from "./components/pages/DebateRecord/DebateRecords";
import DebateRoom from "./components/pages/DebateRoom/DebateRoom";
import Modal from "./components/pages/DebateCreate/DebateCreate";
import UserSetting from "./components/pages/Dashboard/UserSetting";
import DebateRule from "./components/pages/Dashboard/DebateRule";
import Payment from "./components/pages/Dashboard/Payment";
import Volume from "./components/pages/Dashboard/Volume";
import SettingCreater from "./components/pages/Setting/SettingCreater";
import SettingMember from "./components/pages/Setting/SettingMember";
import Tests from "./components/pages/test/test";
import DebateMemberRoom from "./components/pages/DebateRoom/DebateMemberRoom";

import {Device} from 'mediasoup-client'
import io from "socket.io-client";

const App: React.FC = () => {

    const name = 'user';
    const room_id= 'room_id'
    const localMediaEl = document.getElementById('localMedia') as HTMLVideoElement ;
    const remoteVideoEl = document.getElementById('remoteVideo')as HTMLVideoElement ;
    const remoteAudioEl = document.getElementById('remoteAudio')as HTMLVideoElement ;
    const mediasoupClientInstance = new Device();
    const socket = io();

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
                                                             onOpenDebateRecord={debateCreate} onDebateName={join} onDebateContent={join}/>}/>
                <Route path="/debateRecord" element={<DebateRecord onBack={back} onDebateCreate={debateCreate} onDebateName={join} onDebateContent={join}/>}/>
                <Route path="/usersetting" element={<UserSetting onDebateCreate={debateCreate} onLogout={logout}
                                                                 onOpenDebateRecord={debateCreate} onDebateName={join} onDebateContent={join}/>}/>
                <Route path="/DebateRule" element={<DebateRule onDebateCreate={debateCreate} onLogout={logout}
                                                                 onOpenDebateRecord={debateCreate} onDebateName={join} onDebateContent={join}/>}/>
                <Route path="/Payment" element={<Payment onDebateCreate={debateCreate} onLogout={logout}
                                                               onOpenDebateRecord={debateCreate} onDebateName={join} onDebateContent={join}/>}/>
                <Route path="/Volume" element={<Volume onDebateCreate={debateCreate} onLogout={logout}
                                                         onOpenDebateRecord={debateCreate} onDebateName={join} onDebateContent={join}/>}/>

                <Route path="/debateRoom" element={<DebateRoom onLeave={back}/>}/>
                <Route path="/debateMemberRoom" element={<DebateMemberRoom onLeave={back}/>}/>

                <Route path="/debateCreate"
                       element={<Modal onButtonClick={debateCreate} onClose={back} onDebateName={join} onDebateContent={join}/>}/>
                <Route path="/SettingCreater" element={<SettingCreater onSubmit={signup}
                                                                       name={name}
                                                                       localMediaEl={localMediaEl}
                                                                       remoteVideoEl={remoteVideoEl}
                                                                       remoteAudioEl={remoteAudioEl}
                                                                       mediasoupClient={mediasoupClientInstance}
                                                                       socket={socket}
                                                                       successCallback={join}/>}/>
                <Route path="/SettingMember" element={<SettingMember onSubmit={signup}
                                                                     name={name}
                                                                     localMediaEl={localMediaEl}
                                                                     remoteVideoEl={remoteVideoEl}
                                                                     remoteAudioEl={remoteAudioEl}
                                                                     mediasoupClient={mediasoupClientInstance}
                                                                     socket={socket}
                                                                     successCallback={join}/>}/>
                <Route path="/test" element={<Tests />}/>

            </Routes>
        </Router>
    );
};


export default App;