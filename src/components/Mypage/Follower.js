import {useEffect, useState} from "react";
import axios from "axios";
import "./Follow.css";
import FollowBtn from "./FollowBtn";
import {Link} from "react-router-dom";

function Follower({token}) {

    const [followerList, setFollowerList] = useState([]);

    useEffect(() => {
        axios.post('http://localhost:3000/members/follower', token)
            .then((response) => {
                setFollowerList(response.data.followDtoList);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [token]);

    return (
        <div className='follow-container'>
            <div className='mypage-follow-01'>팔로워</div>
            <div className='follow-list'>
                {followerList.length > 0 ? (
                    followerList.map((follower) => (
                        <div className='follow-list-01' key={follower.followseq}>
                            <div className='mypage-follow-02'>
                                <img
                                    src={`http://localhost:3000/images/profile/${follower.profile}`}
                                    alt="이미지"
                                    width="40"
                                    height="40"
                                />
                            </div>
                            <div className='follow-list-02'>
                                <Link to={`/userpage/${follower.userseq}/profile`}>
                                    <div className='mypage-follow-03'>
                                        <div className='follow-list-03'>{follower.foltarget}</div>
                                        <div className='mypage-follow-04'>
                                            {follower.mbti === "선택" || follower.mbti === null ? "비공개" : follower.mbti}{" "}
                                            {follower.gender === "female" ? "여자" : follower.gender === "male" ? "남자" : ""}
                                        </div>
                                    </div>
                                </Link>
                                <FollowBtn token={token} foltarget={follower.foltarget}/>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>팔로워가 없습니다</p>
                )}
            </div>
        </div>
    )
}

export default Follower;