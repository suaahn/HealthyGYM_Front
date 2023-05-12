import React, {useEffect, useRef} from "react";
import "./MyCommunity.css";
import {NavLink, Route, Routes} from "react-router-dom";
import MyWrite from "./MyWrite";
import MyCmtBbs from "./MyCmtBbs";
import MyLikeBbs from "./MyLikeBbs";

function MyCommunity({token, profile}) {

    const editProfileLinkRef = useRef(null);

    useEffect(() => {
        editProfileLinkRef.current.click();
    }, []);

    return (
        <div className='mypage-mycommunity-00'>
            <div className="mypage-mycommunity-03">
                <div className="mypage-mycommunity-04">
                    <NavLink to="/mypage/profilecard/mycommunity/mywrite" ref={editProfileLinkRef}>나의 작성글</NavLink>
                </div>
                <div className="mypage-mycommunity-04">
                    <NavLink to="/mypage/profilecard/mycommunity/mycmtbbs">댓글단 글</NavLink>
                </div>
                <div className="mypage-mycommunity-04">
                    <NavLink to="/mypage/profilecard/mycommunity/mylikebbs">좋아요한 글</NavLink>
                </div>
            </div>
            <hr></hr>
            <Routes>
                <Route path="mywrite" element={<MyWrite token={token} profile={profile}/>}/>
                <Route path="mycmtbbs" element={<MyCmtBbs token={token} profile={profile}/>}/>
                <Route path="mylikebbs" element={<MyLikeBbs token={token} profile={profile}/>}/>
            </Routes>
        </div>
    );
}

export default MyCommunity;