import {Routes, Route, NavLink} from "react-router-dom";
import "./MyPage.css";
import Setting from "./Setting";
import BodyCom from "./BodyCom";
import {useState} from "react";
import Profile from "./Profile";

function Nav() {
    return (
        <div>
            <ul className="nav-ul">
                <li className="nav-li">
                    <NavLink to="/mypage/profile">프로필</NavLink>
                </li>
                <li className="nav-li">
                    <NavLink to="/mypage/bodycom">체성분</NavLink>
                </li>
                <li className="nav-li">
                    <NavLink to="/mypage/mywrite">내가 쓴 글</NavLink>
                </li>
                <li className="nav-li">
                    <NavLink to="/mypage/setting/editprofile">설정</NavLink>
                </li>
            </ul>
            <hr></hr>
            <Routes>
                <Route path="profile" element={<Profile/>}/>
                <Route path="bodycom" element={<BodyCom/>}/>
                <Route path="mywrite" element={<Mywrite/>}/>
                <Route path="setting/*" element={<Setting/>}/>
            </Routes>
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

function TempLogin() {

    const [authToken, setAuthToken] = useState(localStorage.getItem('auth_token') || '');
    const handleChange = (event) => {
        setAuthToken(event.target.value);
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        localStorage.setItem("auth_token", authToken);
        window.location.reload();

    }

    const handleLogout = (event) => {
        event.preventDefault();

        localStorage.removeItem('auth_token');
        window.location.reload();
    }

    return (
        <div>
            {localStorage.getItem('auth_token') ? (
                <div>
                <label>MemberSeq : {authToken} </label>
                <button onClick={handleLogout}>로그아웃</button>
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    <label>
                        MemberSeq :
                        <input type="text" value={authToken} onChange={handleChange}/>
                    </label>
                    <button type="submit">임시 로그인</button>
                </form>
            )}
            <hr></hr>
        </div>
    )
}


function MyPage() {

    return (
        <div>
            <Nav/>
            <TempLogin/>
        </div>
    );
}

export default MyPage;