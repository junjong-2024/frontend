import React, { useState } from 'react';
import "./test.css";
import image1 from "../../image/speaker.svg"
import image2 from "../../image/speakermute.svg"
import image3 from "../../image/video.svg"
import image4 from "../../image/videomute.svg"
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';


const Tests: React.FC = () => {
    const [divs, setDivs] = useState([
        { id: 'Div 1', image: image1 },
        { id: 'Div 2', image: image2 },
        { id: 'Div 3', image: image3 },
        { id: 'Div 4', image: image4 }
    ]);
    const handleMenuItemClick = (option: string) => {
        handleClose(); // 메뉴 닫기
        // 선택한 옵션에 따라 다른 동작 수행
        console.log(`Selected option: ${option}`);
        // 다른 로직 추가 가능
    };
    const swapDivs = (index1: number, index2: number) => {
        if (index1 < 0 || index1 >= divs.length || index2 < 0 || index2 >= divs.length) {
            console.error('Invalid indices');
            return;
        }

        const newDivs = [...divs];
        [newDivs[index1], newDivs[index2]] = [newDivs[index2], newDivs[index1]];
        setDivs(newDivs);
    };

    const options = [
        'None',
        'Atria',
        'Callisto',
        'Dione',
        'Ganymede',
        'Hangouts Call',
        'Luna',
        'Oberon',
        'Phobos',
        'Pyxis',
        'Sedna',
        'Titania',
        'Triton',
        'Umbriel',
    ];

    const ITEM_HEIGHT = 48;
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
        <>
            <div>
                {divs.map((div, index) => (
                    <div className={"asd" + index.toString()} key={index}
                         style={{border: '1px solid black', margin: '5px', padding: '10px'}}>
                        <img src={div.image} alt={div.id} style={{width: '100px', height: '100px'}}/>
                        <div>{div.id}</div>
                        <button onClick={() => swapDivs(index, (index + 1) % divs.length)}>Swap{index}</button>
                    </div>
                ))}
            </div>
            <div>
                <IconButton
                    aria-label="more"
                    id="long-button"
                    aria-controls={open ? 'long-menu' : undefined}
                    aria-expanded={open ? 'true' : undefined}
                    aria-haspopup="true"
                    onClick={handleClick}
                >
                    <MoreVertIcon/>
                </IconButton>
                <Menu
                    id="long-menu"
                    MenuListProps={{
                        'aria-labelledby': 'long-button',
                    }}
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    PaperProps={{
                        style: {
                            maxHeight: ITEM_HEIGHT * 4.5,
                            width: '20ch',
                        },
                    }}
                >
                    {options.map((option) => (
                        <MenuItem
                            key={option}
                            selected={option === 'Pyxis'}
                            onClick={() => handleMenuItemClick(option)}
                        >
                            {option}
                        </MenuItem>
                    ))}
                </Menu>
            </div>
        </>
    );
};

export default Tests;
