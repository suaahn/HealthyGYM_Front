import React, {useEffect, useMemo, useState} from "react";
import axios from "axios";
import {Link, Route, Routes} from "react-router-dom";
import scale from "../../asset/icon_scale.png";
import heart from "../../asset/icon_heart.png";
import writing from "../../asset/icon_writing.png";
import Follower from "./Follower";
import Following from "./Following";
import Users from "./Users";
import UserProfile from "./UserProfile";
import UserAllBbs from "./UserAllBbs";

function UserProfileCard({usertoken}){
    const [member, setMember] = useState({});
    const [followNum, setFollowNum] = useState(0);
    const [followerNum, setFollowerNum] = useState(0);
    const [inbodyCount, setInbodyCount] = useState([]);
    const [likeBbsCount, setLikeBbsCount] = useState([]);
    const [bbsCount, setBbsCount] = useState([]);

    const requestBody = useMemo(
        () => ({
            bbstag: 0,
            memberseq: usertoken.memberseq
        }),
        [usertoken.memberseq]
    );

    useEffect(() => {
        // member 정보 가져오기
        axios
            .post("http://localhost:3000/members/findmember", usertoken)
            .then((response) => {
                setMember(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [usertoken]);

    useEffect(() => {
        // following 정보 가져오기
        axios
            .post("http://localhost:3000/members/follow", usertoken)
            .then((response) => {
                setFollowNum(response.data.followNum);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [usertoken]);

    useEffect(() => {
        // follower 정보 가져오기
        axios
            .post("http://localhost:3000/members/follower", usertoken)
            .then((response) => {
                setFollowerNum(response.data.followerNum);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [usertoken]);

    useEffect(() => {
        axios
            .post("http://localhost:3000/bodycomlist", usertoken)
            .then((response) => {
                setInbodyCount(response.data.list.length);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [usertoken]);

    useEffect(() => {
        axios
            .post("http://localhost:3000/mypage/mylikebbs", requestBody, {
                headers: {
                    "Content-Type": "application/json",
                },
            })
            .then((response) => {
                setLikeBbsCount(response.data.length);
            });
    }, [requestBody]);

    useEffect(() => {
        axios
            .post("http://localhost:3000/mypage/mybbs", requestBody, {
                headers: {
                    "Content-Type": "application/json",
                },
            })
            .then((response) => {
                setBbsCount(response.data.length);
            });
    }, [requestBody]);

    return (
        <>
            <div className="mypage-profilecard-00">
                <div className="mypage-profilecard-01">
                    <div className="mypage-profilecard-02">
                        <div className="mypage-profilecard-04">
                            <img
                                src={`http://localhost:3000/images/profile/${member.profile}`}
                                alt="프로필 이미지"
                                width="120"
                                height="120"
                                style={{ borderRadius: '50%', overflow:'hidden', objectFit: 'cover'}}
                            />
                        </div>
                        <div className="mypage-profilecard-05">
                            <div className="mypage-profilecard-06">{member.nickname}</div>
                            <div className="mypage-profilecard-07">
                                <div className="mypage-profilecard-08">
                                    <Link className="mypage-profilecard-21" to={`/userpage/${usertoken.memberseq}/follower`}>
                                        <div className="mypage-profilecard-09">
                                            팔로워
                                        </div>
                                        <div className="mypage-profilecard-10">
                                            {followerNum}
                                        </div>
                                    </Link>
                                    <div className="mypage-profilecard-11">
                                    </div>
                                        <Link className="mypage-profilecard-21" to={`/userpage/${usertoken.memberseq}/following`}>
                                        <div className="mypage-profilecard-09">
                                            팔로잉
                                        </div>
                                        <div className="mypage-profilecard-10">
                                            {followNum}
                                        </div>
                                    </Link>

                                </div>
                                <div className="mypage-profilecard-12">
                                    <Link to="/mypage/setting/editprofile" className="mypage-profilecard-13">
                                        팔로우
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mypage-profilecard-03">
                        <div className="mypage-profilecard-14">
                            <div className="mypage-profilecard-15">
                                <Link to={`/userpage/${usertoken.memberseq}/profile`}>
                                    <div className="mypage-profilecard-16"><img alt="체성분"
                                                                                src={scale}
                                                                                style={{
                                                                                    width: '25px',
                                                                                    height: '25px'
                                                                                }}/>
                                    </div>
                                    <div className="mypage-profilecard-17">체성분
                                    </div>
                                    <div className="mypage-profilecard-18">{inbodyCount}
                                    </div>
                                </Link>
                            </div>
                            <div className="mypage-profilecard-15">
                                <Link to={`/userpage/${usertoken.memberseq}/users/like`}>
                                    <div className="mypage-profilecard-16"><img alt="좋아요"
                                                                                src={heart}
                                                                                style={{
                                                                                    width: '25px',
                                                                                    height: '25px'
                                                                                }}/>
                                    </div>
                                    <div className="mypage-profilecard-17">좋아요
                                    </div>
                                    <div className="mypage-profilecard-18">{likeBbsCount}
                                    </div>
                                </Link>
                            </div>
                            <div className="mypage-profilecard-15">
                                <Link to={`/userpage/${usertoken.memberseq}/users/write`}>
                                    <div className="mypage-profilecard-16"><img alt="작성글"
                                                                                src={writing}
                                                                                style={{
                                                                                    width: '25px',
                                                                                    height: '25px'
                                                                                }}/>
                                    </div>
                                    <div className="mypage-profilecard-17">작성글
                                    </div>
                                    <div className="mypage-profilecard-18">{bbsCount}
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mypage-profilecard-20">
                    <div className='connect'>
                        <Routes>
                            <Route path="profile" element={<UserProfile token={usertoken} nickname={member.nickname} />}/>
                            <Route path="follower" element={<Follower token={usertoken}/>}/>
                            <Route path="following" element={<Following token={usertoken}/>}/>
                            <Route path="users/*"
                                   element={<Users token={usertoken} profile={member.profile}/>}/>
                            <Route path="all/:communitytag/:bbstag"
                                   element={<UserAllBbs token={usertoken} profile={member.profile}/>}/>
                        </Routes>
                    </div>
                </div>
            </div>
        </>
    );
}
export default UserProfileCard;