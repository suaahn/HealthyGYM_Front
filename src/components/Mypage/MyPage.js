import {Routes, Route, useNavigate} from "react-router-dom";
import "./MyPage.css";
import "./MypageActive.css";
import Setting from "./Setting";
import BodyCom from "./BodyCom";
import Profile from "./Profile";
import ProfileCard from "./ProfileCard";
import MyCommunity from "./MyCommunity";
import {useEffect, useMemo, useState} from "react";
import {Menu} from "semantic-ui-react";

export function getLinkByBbsTag(bbsseq, bbstag) {
    if (bbstag === 5) {
        return `/mate/health/view/${bbsseq}`;
    } else {
        return `/view/${bbsseq}`;
    }
}

function MyPage() {

    const authToken = localStorage.getItem("memberseq");
    const token = useMemo(() => ({memberseq: authToken}), [authToken]);

    const [activeItem, setActiveItem] = useState('');
    let navigate = useNavigate();

    useEffect(() => {
        // URL 검사
        const path = window.location.pathname;

        if (path === "/mypage/profilecard/profile") {
            setActiveItem("프로필");
        } else if (path === "/mypage/profilecard/bodycom") {
            setActiveItem("체성분");
        } else if (path === "/mypage/profilecard/mycommunity/mywrite") {
            setActiveItem("커뮤니티");
        } else if (path === "/mypage/setting/editprofile") {
            setActiveItem("설정");
        }
    }, [window.location.pathname]);

    const handleItemClick = (e, {name}) => {
        if (name === '프로필') {
            navigate('/mypage/profilecard/profile');
        } else if (name === '체성분') {
            navigate('/mypage/profilecard/bodycom');
        } else if (name === '커뮤니티') {
            navigate('/mypage/profilecard/mycommunity/mywrite');
        } else if (name === '설정') {
            navigate('/mypage/setting/editprofile');
        }
    };

    useEffect(() => {
        //console.log(token.memberseq);
        if (token.memberseq === null) {
            alert("로그인 해주세요.");
            navigate("/");
        }
    }, [token.memberseq, navigate]);

    return (
        <div>
            <Menu pointing secondary style={{margin: '0px', width: '100%'}}>
                <Menu.Item
                    name='프로필'
                    active={activeItem === '프로필'}
                    onClick={handleItemClick}
                />
                <Menu.Item
                    name='체성분'
                    active={activeItem === '체성분'}
                    onClick={handleItemClick}
                />
                <Menu.Item
                    name='커뮤니티'
                    active={activeItem === '커뮤니티'}
                    onClick={handleItemClick}
                />
                <Menu.Item
                    name='설정'
                    active={activeItem === '설정'}
                    onClick={handleItemClick}
                />
            </Menu>
            <Routes>
                <Route path="profilecard/*" element={<ProfileCard token={token}/>}/>
                <Route path="profile" element={<Profile token={token}/>}/>
                <Route path="bodycom" element={<BodyCom token={token}/>}/>
                <Route path="mycommunity/*" element={<MyCommunity/>}/>
                <Route path="setting/*" element={<Setting token={token}/>}/>
            </Routes>
        </div>
    );
}

export default MyPage;