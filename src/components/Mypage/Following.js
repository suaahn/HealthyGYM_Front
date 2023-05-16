import {useEffect, useState} from "react";
import axios from '../../utils/CustomAxios';
import "./MypageCss/Follow.css";
import FollowBtn from "./FollowBtn";
import {Link} from "react-router-dom";

// 프로필 카드 - 팔로잉 리스트
function Following({token}) {

    const [followingList, setFollowingList] = useState([]);

    useEffect(() => {
        axios.post('http://localhost:3000/members/follow', token)
            .then((response) => {
                setFollowingList(response.data.followDtoList);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [token]);

    return (
        <div className='follow-container'>
            <div className='mypage-follow-01'>팔로잉</div>
            <div className='follow-list'>
                {followingList.length > 0 ? (
                    followingList.map((following) => (
                        <div className='follow-list-01' key={following.followseq}>
                            <div className='mypage-follow-02'>
                                <img
                                    src={`http://localhost:3000/images/profile/${following.profile}`}
                                    alt="이미지"
                                    width="40"
                                    height="40"
                                />
                            </div>
                            <div className='follow-list-02'>
                                <div className='mypage-follow-03'>
                                    <Link to={`/userpage/${following.userseq}/profile`}>
                                        <div className='follow-list-03'>{following.foltarget}</div>
                                        <div className='mypage-follow-04'>
                                            {following.mbti === "선택" || following.mbti === null ? "비공개" : following.mbti}{" "}
                                            {following.gender === "female" ? "여자" : following.gender === "male" ? "남자" : ""}
                                        </div>
                                    </Link>
                                </div>
                                <FollowBtn token={token} foltarget={following.foltarget}/>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>팔로잉하는 유저가 없습니다</p>
                )}
            </div>
        </div>
    )
}

export default Following;