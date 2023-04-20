import {Link} from "react-router-dom";
import "./MyPage.css";
import {useEffect, useState} from "react";
import axios from "axios";
import Follower from "./Follower";
import Following from "./Following";

function ProfileCard() {
    const [member, setMember] = useState([]);

    // 팔로우 유저 리스트
    // const [follow, setFollow] = useState([]);
    // const [follower, setFollower] = useState([]);

    const [followNum, setFollowNum] = useState(0);
    const [followerNum, setFollowerNum] = useState(0);

    useEffect(() => {
        axios.get('http://localhost:3000/members/findmember')
            .then((response) => {
                setMember(response.data);

                // 데이터 확인용
                console.log(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    useEffect(() => {
        axios.get('http://localhost:3000/members/follow')
            .then((response) => {
                //setFollow(response.data.followDtoList);
                setFollowNum(response.data.followNum);

                // 데이터 확인용
                console.log(response.data.followDtoList);
                console.log(response.data.followNum);
                console.log(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    useEffect(() => {
        axios.get('http://localhost:3000/members/follower')
            .then((response) => {
                //setFollower(response.data.followDtoList);
                setFollowerNum(response.data.followerNum);

                // 데이터 확인용
                console.log(response.data.followDtoList);
                console.log(response.data.followerNum);
                console.log(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    const [isFollowerOpen, setIsFollowerOpen] = useState(false);
    const [isFollowingOpen, setIsFollowingOpen] = useState(false);

    const followerOpen = () => {
        setIsFollowerOpen(true);
        setIsFollowingOpen(false);
    };

    const followingOpen = () => {
        setIsFollowerOpen(false);
        setIsFollowingOpen(true);
    };

    return (
        <div>
            <ul>
                <li>
                    <hr></hr>
                    <h3>Profile Card</h3>


                    <li>
                        <img
                            src={`http://localhost:3000/images/${member.profile}`}
                            alt="프로필 이미지"
                            width="90"
                            height="90"
                        />
                    </li>
                </li>
                <li>
                    <div>닉네임 : {member.nickname}</div>
                </li>
                {/*<li><Link to="/mypage/follower">팔로워 {followerNum}</Link></li>*/}
                <div>
                    <li>
                        <Link onClick={followerOpen}>팔로워 {followerNum}</Link>
                    </li>

                </div>
                {/*<li><Link to="/mypage/following">팔로잉 {followNum}</Link></li>*/}
                <li>
                    <Link onClick={followingOpen}>팔로잉 {followNum}</Link>
                </li>
                <li><Link to="/mypage/setting">설정</Link></li>
                {isFollowerOpen && <Follower setIsFollowerOpen={setIsFollowerOpen}/>}
                {isFollowingOpen && <Following setIsFollowingOpen={setIsFollowingOpen}/>}
                <hr></hr>
            </ul>
        </div>
    )
}

export default ProfileCard;