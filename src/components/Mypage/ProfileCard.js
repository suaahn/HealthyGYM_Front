import {Link} from "react-router-dom";
import {useEffect, useState} from "react";
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

    useEffect(() => {
        // member 정보 가져오기
        axios
            .get("http://localhost:3000/members/findmember")
            .then((response) => {
                setMember(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    useEffect(() => {
        // following 정보 가져오기
        axios
            .get("http://localhost:3000/members/follow")
            .then((response) => {
                setFollowNum(response.data.followNum);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    useEffect(() => {
        // follower 정보 가져오기
        axios
            .get("http://localhost:3000/members/follower")
            .then((response) => {
                setFollowerNum(response.data.followerNum);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    return (
        <div>
            <ul>
                <li>
                    <hr/>
                    <h3>Profile Card</h3>
                    <img
                        src={`http://localhost:3000/images/profile/${member.profile}`}
                        alt="프로필 이미지"
                        width="90"
                        height="90"
                    />
                </li>
                <li>
                    <div>닉네임 : {member.nickname}</div>
                </li>
                <div>
                    <li onClick={() => openModal(<Follower/>)} style={{cursor: "pointer"}}>
                        팔로워 {followerNum}
                    </li>
                    <li onClick={() => openModal(<Following/>)} style={{cursor: "pointer"}}>
                        팔로잉 {followNum}
                    </li>
                    {isModalOpen && (
                        <div className="modal" onClick={closeModal}>
                            <div className="modal-content" onClick={handleModalClick}>
                                {modalContent}
                            </div>
                        </div>
                    )}
                </div>
                <li>
                    <Link to="/mypage/setting">설정</Link>
                </li>
                <hr/>
            </ul>
        </div>
    );
}

export default ProfileCard;
