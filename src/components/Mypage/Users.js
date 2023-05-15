import React, {useEffect, useState} from "react";
import "./MyCommunity.css";
import {Route, Routes, useNavigate} from "react-router-dom";
import {Menu} from "semantic-ui-react";
import UserLikeBbs from "./UserLikeBbs";
import UserWriteBbs from "./UserWriteBbs";
import UserCmtBbs from "./UserCmtBbs";

function Users({token, profile}) {

    const [activeItem, setActiveItem] = useState('');
    let navigate = useNavigate();

    useEffect(() => {
        // URL 검사
        const path = window.location.pathname;

        if (path === `/userpage/${token.memberseq}/users/write`) {
            setActiveItem("작성글");
        } else if (path === `/userpage/${token.memberseq}/users/cmt`) {
            setActiveItem("댓글단 글");
        } else if (path === `/userpage/${token.memberseq}/users/like`) {
            setActiveItem("좋아요한 글");
        }
    }, [window.location.pathname]);

    const handleItemClick = (e, {name}) => {
        if (name === '작성글') {
            navigate(`/userpage/${token.memberseq}/users/write`);
        } else if (name === '댓글단 글') {
            navigate(`/userpage/${token.memberseq}/users/cmt`);
        } else if (name === '좋아요한 글') {
            navigate(`/userpage/${token.memberseq}/users/like`);
        }
    };

    return (
        <div className='mypage-mycommunity-00'>
            <div className='mypage-mycommunity-24'><Menu pointing secondary style={{margin: '0px', width: '100%'}}>

                <Menu.Item
                    name='작성글'
                    active={activeItem === '작성글'}
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
                <Route path="write" element={<UserWriteBbs token={token} profile={profile}/>}/>
                <Route path="cmt" element={<UserCmtBbs token={token} profile={profile}/>}/>
                <Route path="like" element={<UserLikeBbs token={token} profile={profile}/>}/>
            </Routes>
        </div>
    );
}

export default Users;