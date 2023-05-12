import {Routes, Route, NavLink} from "react-router-dom";
import "./MyPage.css";
import "./MypageActive.css";
import Setting from "./Setting";
import BodyCom from "./BodyCom";
import Profile from "./Profile";
import ProfileCard from "./ProfileCard";
import MyCommunity from "./MyCommunity";
import {useMemo} from "react";

function Nav() {

    const authToken = localStorage.getItem("memberseq");
    const token = useMemo(() => ({memberseq: authToken}), [authToken]);

    return (
        <div>
            <ul className="nav-ul">
                <li className="nav-li">
                    <NavLink to="/mypage/profilecard/profile">프로필</NavLink>
                </li>
                <li className="nav-li">
                    <NavLink to="/mypage/profilecard/bodycom">체성분</NavLink>
                </li>
                <li className="nav-li">
                    <NavLink to="/mypage/profilecard/mycommunity">커뮤니티</NavLink>
                </li>
                <li className="nav-li">
                    <NavLink to="/mypage/setting">설정</NavLink>
                </li>
            </ul>
            <hr></hr>
            <Routes>
                <Route path="profilecard/*" element={<ProfileCard token={token}/>}/>
                <Route path="profile" element={<Profile token={token}/>}/>
                <Route path="bodycom" element={<BodyCom token={token}/>}/>
                <Route path="mycommunity/*" element={<MyCommunity token={token}/>}/>
                <Route path="setting/*" element={<Setting token={token}/>}/>
            </Routes>
        </div>
    );
}

function MyPage() {

    return (
        <div>
            <Nav/>
        </div>
    );
}

export default MyPage;