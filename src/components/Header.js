import { Link, useNavigate } from "react-router-dom";
import AuthenticationService from "./auth/AuthenticationService"; 

import logo from "../asset/logo_gym.png";

export default function Header() {
    const navigate = useNavigate();
    const logout = () => {
        AuthenticationService.logout();
        alert("로그아웃되었습니다.");
        navigate("/");
    }
    return (
        <header>
          <span>
            <img alt="logo" src={logo} style={{ width:"150px", margin:"10px"}} />
          </span>
          <div style={{ float:"right"}}>
            <Link to="/login">로그인</Link>
            <span onClick={logout}>로그아웃</span>
          </div>
        </header>
    );
}