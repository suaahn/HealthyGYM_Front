import {Link, Route, Routes} from "react-router-dom";
import EditProfile from "./EditProfile";
import PwdChange from "./PwdChange";

function Setting() {
    return (
        <div>
            <hr></hr>
            <ul>
                <li><Link to="/mypage/setting/editprofile">회원정보 수정</Link></li>
                <li><Link to="/mypage/setting/pwdchange">비밀번호 변경</Link></li>
            </ul>
            <Routes>
                <Route path="editprofile" element={<EditProfile/>}></Route>
                <Route path="pwdchange" element={<PwdChange/>}></Route>
            </Routes>
        </div>
    )
}
export default Setting;