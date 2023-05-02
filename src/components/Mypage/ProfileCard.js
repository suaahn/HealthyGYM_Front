import {Link} from "react-router-dom";
import {useEffect, useMemo, useState} from "react";
import axios from "axios";
import Follower from "./Follower";
import Following from "./Following";
import "./ProfileCard.css";

function ProfileCard() {
    const [member, setMember] = useState({});
    const [followNum, setFollowNum] = useState(0);
    const [followerNum, setFollowerNum] = useState(0);
    const [modalContent, setModalContent] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // 모달 열기
    const openModal = (content) => {
        setModalContent(content);
        setIsModalOpen(true);
    };

    // 모달 닫기
    const closeModal = () => {
        setModalContent(null);
        setIsModalOpen(false);
    };

    // 모달 클릭 이벤트 핸들러
    const handleModalClick = (event) => {
        event.stopPropagation();
    };

    const authToken = localStorage.getItem("auth_token");
    const token = useMemo(() => ({ authToken: authToken }), [authToken]);

    useEffect(() => {
        // member 정보 가져오기
        axios
            .post("http://localhost:3000/members/findmember",token)
            .then((response) => {
                setMember(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [token]);

    useEffect(() => {
        // following 정보 가져오기
        axios
            .post("http://localhost:3000/members/follow",token)
            .then((response) => {
                setFollowNum(response.data.followNum);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [token]);

    useEffect(() => {
        // follower 정보 가져오기
        axios
            .post("http://localhost:3000/members/follower",token)
            .then((response) => {
                setFollowerNum(response.data.followerNum);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [token]);

    return (
        <div className="profile-card">
            <ul className="profile-ul">
                <li>
                    <img
                        src={`http://localhost:3000/images/profile/${member.profile}`}
                        alt="프로필 이미지"
                        width="90"
                        height="90"
                    />
                </li>
                <li>
                    <div style={{ fontWeight: 'bold', fontSize: '1.3rem', marginTop: '12px', marginBottom: '7px' }}>{member.nickname}</div>
                </li>
                <div>
                    <ul style={{ display: 'flex', listStyle: 'none', fontSize: '0.8rem', color: '#666'}}>
                        <li onClick={() => openModal(<Follower/>)} style={{cursor: "pointer"}}>
                            팔로워 <b style={{ color: '#333'}}>{followerNum}</b>
                        </li>
                        <span style={{fontSize: '0.8rem', marginLeft: '5px', marginRight: '5px', color: '#ccc'}}>|</span>
                        <li onClick={() => openModal(<Following/>)} style={{cursor: "pointer"}}>
                            팔로잉 <b style={{ color: '#333'}}>{followNum}</b>
                        </li>
                    </ul>
                    {isModalOpen && (
                        <div className="modal" onClick={closeModal}>
                            <div className="modal-content" onClick={handleModalClick}>
                                {modalContent}
                            </div>
                        </div>
                    )}
                </div>
                <Link to="/mypage/setting/editprofile" className="setting-btn">
                    설정
                </Link>
            </ul>
        </div>
    );
}

export default ProfileCard;
