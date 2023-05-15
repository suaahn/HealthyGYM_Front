import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthenticationService from "./auth/AuthenticationService"; 

import { Button, Dropdown, Icon } from "semantic-ui-react";
import logo from "../asset/logo_gym.png";
import styled from "styled-components";
import Message from "./Message/Message";
import { HomeHeader, MenuItem, MenuSpan } from "./homeStyle";

export default function Header() {
    const [menuItem, setMenuItem] = useState(0);
    //const [memberseq, setMemberseq] = useState(localStorage.getItem("memberseq"));
    const [search, setSearch] = useState("");
    const navigate = useNavigate();
    let profile = null;

    useEffect(() => {
      // URL 검사
      const path = window.location.pathname;
      
      if(path === "/") {
        setMenuItem(1);
      } else if(path.startsWith('/community')) {
        setMenuItem(2);
      } else if(path.startsWith('/mate')) {
        setMenuItem(3);
      } else {
        setMenuItem(0);
      }
    }, [profile, window.location.pathname]);

    const handleMember =   () => {
      return (
        <>
          <Dropdown icon={null} trigger={
            <img
                src={`http://localhost:3000/images/profile/${localStorage.getItem('profile')}`}
                alt="프로필"
                width="37"
                height="37"
                style={{ borderRadius: '50%', overflow:'hidden', objectFit: 'cover'}}
            />} style={{ height:'37.9px', padding:'1px 0'}}>
            <Dropdown.Menu>
              <Dropdown.Item>
                <Link to="/mypage/profilecard/profile" style={{ color:'black'}}>마이페이지</Link>
              </Dropdown.Item>
              <Dropdown.Item onClick={logout}>로그아웃</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          <Message />

          <Button.Group size="small">
            <Button id="write-button" onClick={() => navigate('/write')}>글쓰기</Button>
            <Button icon id="image-button" onClick={() => navigate('/image/edit')}>
              <Icon className="camera" />
            </Button>
          </Button.Group>
        </>
        
      );
    }

    const handleGuest = () => {
      return (
        <>
          <MenuSpan>
            <Link to="/login">로그인</Link>
          </MenuSpan>
          <Link to="/signup">회원가입</Link>
        </>
      );
    }

    const logout = () => {
        AuthenticationService.logout();
        alert("로그아웃되었습니다.");
        navigate("/");
    };

    return (
        <HomeHeader>
          <div>
            <Link to="/">
              <img alt="logo" src={logo} />
            </Link>
            
            <span>
              <MenuItem className={menuItem === 1 && "active"} to="/">홈</MenuItem>
              <MenuItem className={menuItem === 2 && "active"} to="/community/1">커뮤니티</MenuItem>
              <MenuItem className={menuItem === 3 && "active"} to="/mate/health">헬친</MenuItem>
            </span>

            <form onSubmit={(e) => {
              e.preventDefault();
              navigate(`/search/${search}`);
              }} style={{textAlign:'center'}}>
              <div className="ui icon input" style={{ margin:'0 15px'}}>
                <input type="text" placeholder="검색어를 입력하세요" onChange={(e) => setSearch(e.target.value)} required/>
                <i className="search icon"></i>
              </div>
            </form>

            <div>
              {localStorage.getItem("memberseq") == null ? handleGuest():handleMember()}
            </div>
          </div>
        </HomeHeader>
    );
}

