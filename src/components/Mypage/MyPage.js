import {Link, Routes, Route, NavLink} from "react-router-dom";
import "./MyPage.css";
import ProfileCard from "./ProfileCard";
import Setting from "./Setting";
import BodyCom from "./BodyCom";

function Nav() {
    return (
        <div>
            <ul>
                <li>
                    <NavLink to="/mypage/profile">프로필</NavLink>
                </li>
                <li>
                    <NavLink to="/mypage/bodycom">체성분</NavLink>
                </li>
                <li>
                    <NavLink to="/mypage/mywrite">내가 쓴 글</NavLink>
                </li>
                <li>
                    <NavLink to="/mypage/setting">설정</NavLink>
                </li>
            </ul>
            <Routes>
                <Route path="profile" element={<Profile/>}/>
                <Route path="bodycom" element={<BodyCom/>}/>
                <Route path="mywrite" element={<Mywrite/>}/>
                <Route path="setting/*" element={<Setting/>}/>
            </Routes>
        </div>
    );
}

function Profile() {
    return (
        <div>
            <hr/>
            <h2>Profile</h2>
            <ProfileCard/>
            <ul>
                <li>
                    <div>나의 헬친</div>
                </li>
                <li>
                    <Link to="/mypage/mate">+나의 헬친을 등록해주세요</Link>
                </li>
                <li>
                    <div>나의 체성분 변화</div>
                </li>
                <li>
                    <Link to="/mypage/bodycom">+나의 체성분을 등록해주세요</Link>
                </li>
            </ul>
        </div>
    );
}

function Mywrite() {
    return (
        <div>
            <h2>Mywrite</h2>
            <hr/>
            <div>
                <h3>내가 쓴 글</h3>
            </div>
        </div>
    );
}

function MyPage() {
    return (
        <div>
            <h1>마이페이지</h1>
            <Nav/>
        </div>
    );
}

export default MyPage;