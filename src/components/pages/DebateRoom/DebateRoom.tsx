import React, {useEffect, useRef, useState} from 'react';
import {useLocation, useNavigate} from "react-router-dom";
import "./DebateRoom.css"
import {Box, LinearProgress, linearProgressClasses, styled, Typography,IconButton,Menu} from "@mui/material";
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import speaker from "../../image/speaker.svg"
import speakerMute from "../../image/speakermute.svg"
import video from "../../image/video.svg"
import videMute from "../../image/videomute.svg"
import mic from "../../image/mic.svg"
import micMute from "../../image/micmute.svg"
import DebateFin from "./DebateFin/DebateFin";
import RoomClient, { remoteVideoEls,ruleData } from "../../socket/RoomClient";
import {rc} from "../../socket/socket";

interface DebateRoomProps {
    onLeave: () => void;
}


const DebateRoom: React.FC<DebateRoomProps> = ({onLeave}) => {
    const [progress, setProgress] = React.useState(0);
    const [timeLeft, setTimeLeft] = useState('3:00');
    const navigate = useNavigate();
    const location = useLocation();
    const { room_id,name, selectedAudioDevice, selectedVideoDevice } = location.state;
    const videoRef = useRef<HTMLVideoElement>(null);
    const videoRef1 = useRef<HTMLVideoElement>(null);
    const videoRef2 = useRef<HTMLVideoElement>(null);
    const videoRef3 = useRef<HTMLVideoElement>(null);
    const videoRef4 = useRef<HTMLVideoElement>(null);
    const videoRef5 = useRef<HTMLVideoElement>(null);

    const leave = () => {
        const token = localStorage.getItem('token');
        rc.exit();
        if (token) {
            navigate('/dashboard');
        } else {
            navigate('/loginpage');
        }
    };
    const [soundClicked, setSoundClicked] = useState(false);
    const [videoClicked, setVideoClicked] = useState(false);
    const [micClicked, setMicClicked] = useState(false);
    const [DebateClicked, setDebateClicked] = useState(false);
    const [DebateText, setDebateText] = useState("토론시작");
    const [soundImg, setSoundImg] = useState(speaker);
    const [videoImg, setVideoImg] = useState(video);
    const [micImg, setMicImg] = useState(mic);
    const [showModal, setShowModal] = useState(false);
    const [latestMsg, setLatestMsg] = useState('대기 중');

    const SoundClick = () => {
        if (soundClicked) {
            setSoundImg(speaker);
            setSoundClicked(false); // 초기 상태 false 일 땐 초기 상태 이미지 src
        } else {
            setSoundImg(speakerMute);
            setSoundClicked(true); // true일 땐 변경될 이미지 src
        }
    };
    const videoClick = () => {
        if (videoClicked) {
            setVideoImg(video);
            setVideoClicked(false); // 초기 상태 false 일 땐 초기 상태 이미지 src
        } else {
            setVideoImg(videMute);
            setVideoClicked(true); // true일 땐 변경될 이미지 src
        }
    };
    const micClick = () => {
        if (micClicked) {
            setMicImg(mic);
            setMicClicked(false); // 초기 상태 false 일 땐 초기 상태 이미지 src
        } else {
            setMicImg(micMute);
            setMicClicked(true); // true일 땐 변경될 이미지 src
        }
    };
    const DebateClick = () => {
        if (DebateClicked) {

            setShowModal(true);
        } else {
            console.log("진행되고 있긴하거임?")
            rc.start(); // rc의 start 메서드로 소켓 연결 시작
            setDebateText("토론종료");
            setDebateClicked(true);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };
    const onDebateCreate = () => {
        // 토론 생성 로직
        handleCloseModal(); // 모달 닫기
    };
    const handleMenuItemClick = (option: string) => {
        handleClose(); // 메뉴 닫기
        // 선택한 옵션에 따라 다른 동작 수행
        console.log(`Selected option: ${option}`);
        // 다른 로직 추가 가능
    };
    const options = [
        'A1',
        'A2',
        'A3',
        'B1',
        'B2',
        'B3'

    ];
    const ITEM_HEIGHT = 68;

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
        height: 30,
        width: 1500,
        [`&.${linearProgressClasses.colorPrimary}`]: {
            backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 300 : 800],
        },
        [`& .${linearProgressClasses.bar}`]: {

            backgroundColor: theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8',
        },
    }));

    useEffect(() => {
        const totalTime = 3 * 60; // 3분을 초 단위로 변환
        let remainingTime = totalTime;
        const intervalTime = 1; // 1초마다 갱신

        const updateTimer = () => {
            remainingTime--;
            const minutes = Math.floor(remainingTime / 60);
            const seconds = remainingTime % 60;
            setTimeLeft(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);

            const newProgress = ((totalTime - remainingTime) / totalTime) * 100; // 진행률 계산
            setProgress(newProgress);

            if (remainingTime <= 0) {
                clearInterval(timer);
                setProgress(0);
                setTimeLeft('3:00');
                remainingTime = totalTime; // 타이머를 다시 3분으로 설정
                timer = setInterval(updateTimer, intervalTime * 1000);
            }
        };

        let timer = setInterval(updateTimer, intervalTime * 1000);

        return () => {
            clearInterval(timer);
        };
    }, []);

    useEffect(() => {
        const initVideo = async () => {
            try {
                console.log("device start")
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                if (videoRef.current) {


                    console.log(selectedAudioDevice + " audio");
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    await rc.produce(RoomClient.mediaType.audio, selectedAudioDevice);
                    console.log(selectedVideoDevice + " video");
                    await rc.produce(RoomClient.mediaType.video, selectedVideoDevice);

                    videoRef.current.srcObject = stream;
                }
            } catch (error) {
                console.error('Error accessing local media:', error);
            }
        };

        initVideo();
    }, []);
    useEffect(() => {
        // 오디오 음소거 처리
        const toggleAudio = () => {
            if (videoRef.current && videoRef.current.srcObject) {
                const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
                tracks.forEach(track => {
                    if (track.kind === 'audio') {
                        track.enabled = !soundClicked; // soundClicked가 true이면 음소거, false이면 활성화
                    }
                });
            }
        };

        // 마이크 클릭 상태 변경
        const toggleMicClicked = () => {
            if (soundClicked) {
                setMicImg(micMute);
                setMicClicked(true); // soundClicked가 true이면 micClicked를 true로 설정
            }
        };
        const toggleMicUnclicked = () => {
            if (soundClicked) {
                setMicImg(mic);
                setMicClicked(false);
            }
        };
        toggleAudio(); // 초기 렌더링 시 오디오 상태에 따라 트랙 활성화/비활성화
        toggleMicClicked(); // 초기 렌더링 시 마이크 클릭 상태 설정

        return () => {
            // 컴포넌트 언마운트 시 이벤트 핸들러 정리
            toggleMicUnclicked();
            toggleAudio();
        };
    }, [soundClicked]);
    useEffect(() => {
        // 마이크 음소거 처리
        const toggleMicrophone = () => {
            if (videoRef.current && videoRef.current.srcObject) {
                const tracks = (videoRef.current.srcObject as MediaStream).getAudioTracks();
                tracks.forEach(track => {
                    track.enabled = !micClicked;
                });
            }
        };
        const toggleInsteadClicked = () => {
            if (micClicked) {
                if (soundClicked) {
                    setSoundImg(speaker);
                    setSoundClicked(false); // 마이크가 음소거 상태이고 오디오가 음소거 상태일 때 마이크 버튼을 누르면 오디오 음소거가 해제됩니다.
                }
            }
        };

        toggleMicrophone(); // 초기 렌더링 시 마이크 상태에 따라 트랙 활성화/비활성화

        return () => {
            // 컴포넌트 언마운트 시 이벤트 핸들러 정리
            toggleInsteadClicked();
            toggleMicrophone();
        };
    }, [micClicked]);
    useEffect(() => {
        const initA1Video = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (error) {
                console.error('Error accessing local media:', error);
            }
        };

        const toggleVideo = () => {
            if (videoRef.current) {
                if (videoClicked) {
                    // 비디오를 안 보이도록 설정
                    videoRef.current.srcObject = null;
                } else {
                    // 비디오를 다시 보이도록 설정
                    initA1Video();
                }
            }
        };

        toggleVideo(); // 초기 렌더링 시에도 toggleVideo 함수를 호출합니다.

        return () => {
            // 필요에 따라 정리 작업을 수행할 수 있습니다.
        };
    }, [videoClicked]);

    useEffect(() => {
        const observer = new MutationObserver((mutationsList) => {
            for (let mutation of mutationsList) {
                if (mutation.type === 'childList' && remoteVideoEls[0] && videoRef1.current) {
                    videoRef1.current.srcObject = remoteVideoEls[0].srcObject;
                    observer.disconnect(); // 연결된 후 옵저버 해제
                }
            }
        });

        // remoteVideoEls 배열을 감시
        observer.observe(document, {
            childList: true,
            subtree: true,
        });

        // Clean up
        return () => {
            observer.disconnect();
        };
    }, []);

    useEffect(() => {
        const observer1 = new MutationObserver((mutationsList) => {
            for (let mutation of mutationsList) {
                if (mutation.type === 'childList' && remoteVideoEls[1] && videoRef2.current) {
                    videoRef2.current.srcObject = remoteVideoEls[1].srcObject;
                    observer1.disconnect(); // 연결된 후 옵저버 해제
                }
            }
        });

        // remoteVideoEls 배열을 감시
        observer1.observe(document, {
            childList: true,
            subtree: true,
        });

        // Clean up
        return () => {
            observer1.disconnect();
        };
    }, []);
    useEffect(() => {
        const observer2 = new MutationObserver((mutationsList) => {
            for (let mutation of mutationsList) {
                if (mutation.type === 'childList' && remoteVideoEls[2] && videoRef3.current) {
                    videoRef3.current.srcObject = remoteVideoEls[2].srcObject;
                    observer2.disconnect(); // 연결된 후 옵저버 해제
                }
            }
        });

        // remoteVideoEls 배열을 감시
        observer2.observe(document, {
            childList: true,
            subtree: true,
        });

        // Clean up
        return () => {
            observer2.disconnect();
        };
    }, []);
    useEffect(() => {
        const observer3 = new MutationObserver((mutationsList) => {
            for (let mutation of mutationsList) {
                if (mutation.type === 'childList' && remoteVideoEls[3] && videoRef4.current) {
                    videoRef4.current.srcObject = remoteVideoEls[3].srcObject;
                    observer3.disconnect(); // 연결된 후 옵저버 해제
                }
            }
        });

        // remoteVideoEls 배열을 감시
        observer3.observe(document, {
            childList: true,
            subtree: true,
        });

        // Clean up
        return () => {
            observer3.disconnect();
        };
    }, []);
    useEffect(() => {
        const observer4 = new MutationObserver((mutationsList) => {
            for (let mutation of mutationsList) {
                if (mutation.type === 'childList' && remoteVideoEls[4] && videoRef5.current) {
                    videoRef5.current.srcObject = remoteVideoEls[4].srcObject;
                    observer4.disconnect(); // 연결된 후 옵저버 해제
                }
            }
        });

        // remoteVideoEls 배열을 감시
        observer4.observe(document, {
            childList: true,
            subtree: true,
        });

        // Clean up
        return () => {
            observer4.disconnect();
        };
    }, []);


    useEffect(() => {
        if (ruleData.length > 0) {
            setLatestMsg(ruleData[ruleData.length - 1].msg);
        }
    }, [ruleData]);



    return (
        <div>
            <div className="lineTop">
                <img className="logo" src={require("../../image/logo.svg").default}/>
                <div className="Title">
                    <text>토론 제목</text>
                </div>
                <div className="memberCount">3명/6명</div>
            </div>
            <div className="line1">
                <img className="line" src={require("../../image/Rectangle 32.svg").default} alt="선 "/>
            </div>
            <div className="timer">
                <div className="order">{latestMsg}</div>
                <Box  className="timerBar" sx={{ width: '100%' }}>
                    <BorderLinearProgress variant="determinate" value={progress}></BorderLinearProgress>
                </Box>
                <div className="timerText" >
                    <Typography variant="h5" gutterBottom>
                        {timeLeft}
                    </Typography>
                </div>
            </div>
            <div className="AteamArea">
                <div className="A1">
                    <video className="Cam" ref={videoRef} autoPlay width="526px" height="332px" ></video>
                    <IconButton
                        aria-label="more"
                        id="long-button"
                        aria-controls={open ? 'long-menu' : undefined}
                        aria-expanded={open ? 'true' : undefined}
                        aria-haspopup="true"
                        onClick={handleClick}
                    >
                        <MoreVertIcon />
                    </IconButton>
                    <Menu
                        id="long-menu"
                        MenuListProps={{
                            'aria-labelledby': 'long-button',
                        }}
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}

                    >
                        {options.map((option) => (
                            <MenuItem
                                key={option}
                                selected={option === 'A1'}
                                onClick={() => handleMenuItemClick(option)}
                            >
                                {option}
                            </MenuItem>
                        ))}
                    </Menu>
                </div>
                <div className="A2">
                    <video className="Cam" ref={videoRef1} autoPlay width="526px" height="332px" ></video>
                    {remoteVideoEls[0] ? (
                            <>
                    <IconButton
                        aria-label="more"
                        id="long-button"
                        aria-controls={open ? 'long-menu' : undefined}
                        aria-expanded={open ? 'true' : undefined}
                        aria-haspopup="true"
                        onClick={handleClick}
                    >
                        <MoreVertIcon />
                    </IconButton>
                    <Menu
                        id="long-menu"
                        MenuListProps={{
                            'aria-labelledby': 'long-button',
                        }}
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}

                    >
                        {options.map((option) => (
                            <MenuItem
                                key={option}
                                selected={option === 'A1'}
                                onClick={() => handleMenuItemClick(option)}
                            >
                                {option}
                            </MenuItem>
                        ))}
                    </Menu>
                            </>
                    ) : null}
                </div>
                <div className="A3">
                    {remoteVideoEls[1] ? (
                        <>
                    <video className="Cam" ref={videoRef2} autoPlay width="526px" height="332px" ></video>
                    <IconButton
                        aria-label="more"
                        id="long-button"
                        aria-controls={open ? 'long-menu' : undefined}
                        aria-expanded={open ? 'true' : undefined}
                        aria-haspopup="true"
                        onClick={handleClick}
                    >
                        <MoreVertIcon />
                    </IconButton>
                    <Menu
                        id="long-menu"
                        MenuListProps={{
                            'aria-labelledby': 'long-button',
                        }}
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}

                    >
                        {options.map((option) => (
                            <MenuItem
                                key={option}
                                selected={option === 'A1'}
                                onClick={() => handleMenuItemClick(option)}
                            >
                                {option}
                            </MenuItem>
                        ))}
                    </Menu>
                        </>
                    ) : null}
                </div>
            </div>
            <div className="BteamArea">
                <div className="B1">
                    <video className="Cam" ref={videoRef3} autoPlay width="526px" height="332px" ></video>
                    {remoteVideoEls[2] ? (
                            <>
                    <IconButton
                        aria-label="more"
                        id="long-button"
                        aria-controls={open ? 'long-menu' : undefined}
                        aria-expanded={open ? 'true' : undefined}
                        aria-haspopup="true"
                        onClick={handleClick}
                    >
                        <MoreVertIcon />
                    </IconButton>
                    <Menu
                        id="long-menu"
                        MenuListProps={{
                            'aria-labelledby': 'long-button',
                        }}
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}

                    >
                        {options.map((option) => (
                            <MenuItem
                                key={option}
                                selected={option === 'A1'}
                                onClick={() => handleMenuItemClick(option)}
                            >
                                {option}
                            </MenuItem>
                        ))}
                    </Menu>
                            </>
                    ) : null}
                </div>
                <div className="B2">
                    <video className="Cam" ref={videoRef4} autoPlay width="526px" height="332px" ></video>
                    {remoteVideoEls[3] ? (
                            <>
                    <IconButton
                        aria-label="more"
                        id="long-button"
                        aria-controls={open ? 'long-menu' : undefined}
                        aria-expanded={open ? 'true' : undefined}
                        aria-haspopup="true"
                        onClick={handleClick}
                    >
                        <MoreVertIcon />
                    </IconButton>
                    <Menu
                        id="long-menu"
                        MenuListProps={{
                            'aria-labelledby': 'long-button',
                        }}
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}

                    >
                        {options.map((option) => (
                            <MenuItem
                                key={option}
                                selected={option === 'A1'}
                                onClick={() => handleMenuItemClick(option)}
                            >
                                {option}
                            </MenuItem>
                        ))}
                    </Menu>
                            </>
                    ) : null}
                </div>
                <div className="B3">
                    <video className="Cam" ref={videoRef5} autoPlay width="526px" height="332px" ></video>
                    {remoteVideoEls[4] ? (
                        <>
                    <IconButton
                        aria-label="more"
                        id="long-button"
                        aria-controls={open ? 'long-menu' : undefined}
                        aria-expanded={open ? 'true' : undefined}
                        aria-haspopup="true"
                        onClick={handleClick}
                    >
                        <MoreVertIcon />
                    </IconButton>
                    <Menu
                        id="long-menu"
                        MenuListProps={{
                            'aria-labelledby': 'long-button',
                        }}
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}

                    >
                        {options.map((option) => (
                            <MenuItem
                                key={option}
                                selected={option === 'A1'}
                                onClick={() => handleMenuItemClick(option)}
                            >
                                {option}
                            </MenuItem>
                        ))}
                    </Menu>
                        </>
                    ) : null}
                </div>
            </div>
            <div className="btnAndCode">
                <div className="InviteCode">
                    <span className="invite">토론방 참여 코드</span>
                    <span className="code" onClick={() => {navigator.clipboard.writeText(room_id); alert("회의 번호가 복사되었습니다!");}}>{room_id}</span>
                </div>
                <div className="btnList">
                    <button className={soundClicked ?"RoomSoundClick" : "RoomSoundSet"} onClick={SoundClick}>
                        <img className="sound" src={soundImg} />
                    </button>
                    <button className={videoClicked ? "RoomVideoClick" : "RoomVideoSet"} onClick={videoClick}>
                        <img className="video" src={videoImg} />
                    </button>
                    <button className={micClicked ? "RoomMicClick" : "RoomMicSet"} onClick={micClick}>
                        <img className="mic" src={micImg} />
                    </button>
                    <button className="leaveBtn" onClick={leave}>
                        <img className="leave" src={require("../../image/logout 2.svg").default}/>
                    </button>
                </div>
                <div className={`debateBtn ${localStorage.getItem('token') ? '' : 'hidden'}`}>
                    <button className={DebateClicked ? "RoomDebateClick":"RoomDebateSet"} onClick={DebateClick}>
                        <text className="debateText" >{DebateText}</text>
                    </button>
                    {showModal && (
                        <DebateFin onClose={handleCloseModal} onButtonClick={onDebateCreate} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default DebateRoom;