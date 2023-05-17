import {Route, Routes, useNavigate} from "react-router-dom";
import EditProfile from "./EditProfile";
import PwdChange from "./PwdChange";
import "./MypageCss/Setting.css";
import React, {useEffect, useState} from "react";
import {Menu} from "semantic-ui-react";

// 설정 내비게이션
function Setting({token}) {

    const [activeItem, setActiveItem] = useState('');
    let navigate = useNavigate();

    useEffect(() => {
        // URL 검사
        const path = window.location.pathname;

        if (path === "/mypage/setting/editprofile") {
            setActiveItem("회원정보 수정");
        } else if (path === "/mypage/setting/pwdchange") {
            setActiveItem("비밀번호 변경");
        }
    }, [window.location.pathname]);

    const handleItemClick = (e, {name}) => {
        if (name === '회원정보 수정') {
            navigate('/mypage/setting/editprofile');
        } else if (name === '비밀번호 변경') {
            navigate('/mypage/setting/pwdchange');
        }
    };

    return (
        <div>
            <div className='mypage-setting-01'>
            <Menu pointing secondary style={{margin: '0px', width: '100%'}}>
                <Menu.Item
                    name='회원정보 수정'
                    active={activeItem === '회원정보 수정'}
                    onClick={handleItemClick}
                />

                <Menu.Item
                    name='비밀번호 변경'
                    active={activeItem === '비밀번호 변경'}
                    onClick={handleItemClick}
                />
            </Menu></div>
            <Routes>
                <Route path="/editprofile" element={<EditProfile token={token}/>} />
                <Route path="/pwdchange" element={<PwdChange token={token}/>} />
            </Routes>
        </div>
    );
}

export default Setting;