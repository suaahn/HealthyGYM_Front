import React, {useEffect, useState} from "react";
import "./MyCommunity.css";
import {Route, Routes, useNavigate} from "react-router-dom";
import MyWrite from "./MyWrite";
import MyCmtBbs from "./MyCmtBbs";
import MyLikeBbs from "./MyLikeBbs";
import {Menu} from "semantic-ui-react";

function MyCommunity({token, profile}) {

    const [activeItem, setActiveItem] = useState('');
    let navigate = useNavigate();

    useEffect(() => {
        // URL 검사
        const path = window.location.pathname;

        if (path === "/mypage/profilecard/mycommunity/mywrite") {
            setActiveItem("나의 작성글");
        } else if (path === "/mypage/profilecard/mycommunity/mycmtbbs") {
            setActiveItem("댓글단 글");
        } else if (path === "/mypage/profilecard/mycommunity/mylikebbs") {
            setActiveItem("좋아요한 글");
        }
    }, [window.location.pathname]);

    const handleItemClick = (e, {name}) => {
        if (name === '나의 작성글') {
            navigate('/mypage/profilecard/mycommunity/mywrite');
        } else if (name === '댓글단 글') {
            navigate('/mypage/profilecard/mycommunity/mycmtbbs');
        } else if (name === '좋아요한 글') {
            navigate('/mypage/profilecard/mycommunity/mylikebbs');
        }
    };

    return (
        <div className='mypage-mycommunity-00'>
            <div className='mypage-mycommunity-24'><Menu pointing secondary style={{margin: '0px', width: '100%'}}>

                <Menu.Item
                    name='나의 작성글'
                    active={activeItem === '나의 작성글'}
                    onClick={handleItemClick}
                />

                <Menu.Item
                    name='댓글단 글'
                    active={activeItem === '댓글단 글'}
                    onClick={handleItemClick}
                />
                <Menu.Item
                    name='좋아요한 글'
                    active={activeItem === '좋아요한 글'}
                    onClick={handleItemClick}
                />

            </Menu></div>
            <Routes>
                <Route path="mywrite" element={<MyWrite token={token} profile={profile}/>}/>
                <Route path="mycmtbbs" element={<MyCmtBbs token={token} profile={profile}/>}/>
                <Route path="mylikebbs" element={<MyLikeBbs token={token} profile={profile}/>}/>
            </Routes>
        </div>
    );
}

export default MyCommunity;