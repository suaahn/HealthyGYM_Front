import {Link} from "react-router-dom";
import "./MypageCss/Profile.css";
import React, {useEffect, useMemo, useState} from "react";
import axios from '../../utils/CustomAxios';
import BodyGraph from "./BodyGraph";
import lock from "../../asset/icon_lock.png";

// 유저페이지 프로필 (체성분, 사진)
function UsersProfile({token}) {

    const [inbodyList, setInbodyList] = useState([]);
    const [inbodyCount, setInbodyCount] = useState('');
    const [weightInt,setWeightInt] = useState(0);
    const [muscleInt,setMuscleInt] = useState(0);
    const [fatInt,setFatInt] = useState(0);
    const [mate,setMate] = useState(false);

    const authToken = localStorage.getItem("memberseq");
    const loginToken = useMemo(() => ({memberseq: authToken}), [authToken]);

    useEffect(() => {
        // confirm mate
        const requestBody = {
            memberseq: loginToken.memberseq,
            userseq: token.memberseq,
        };

        axios.post("http://localhost:3000/confirm/mate", requestBody, {
            headers: {
                "Content-Type": "application/json",
            },
        }).then((response) => {
            console.log(response.data);
            setMate(response.data);   // Mate 여부 세팅
        });
    }, [token, loginToken]);

    useEffect(() => {
        axios.post('http://localhost:3000/bodycomlist', token)
            .then(response => {
                setInbodyList(response.data.list);
                setInbodyCount(response.data.list.length);

                const { list } = response.data;
                const [firstItem, ...restItems] = list;
                const lastItem = restItems.pop();

                setWeightInt(lastItem.weight-firstItem.weight);
                setMuscleInt(lastItem.musclemass-firstItem.musclemass);
                setFatInt(lastItem.bodyfatmass-firstItem.bodyfatmass);
            })
            .catch(error => {
                console.log(error);
            });
    }, [token]);

    const [bbsImageList, setBbsImageList] = useState([]);
    const [bbsImageCount, setBbsImageCount] = useState('')

    const requestBody = useMemo(() => ({
        bbstag: 2,
        memberseq: token.memberseq,
    }), [token.memberseq]);

    useEffect(() => {
        axios.post("http://localhost:3000/mypage/mybbs", requestBody, {
            headers: {
                "Content-Type": "application/json",
            },
        }).then((response) => {
            setBbsImageList(response.data);
            setBbsImageCount(response.data.length);
        });
    }, [requestBody]);

    return (
        <div className='profile-container-01'>
            <div className=' bbs-image-container-02'>
                <b className='mypage-profile-02'>체성분<b className='count-blue'>{inbodyCount}</b></b></div>
            {mate ? <div>
                <div>
                    {inbodyList.length === 0 ? (
                        <div className='profile-container-box'>
                            <div className='profile-container-box-01'>
                                등록된 체성분이 없어요
                            </div>
                        </div>
                    ) : (
                        <div className="profile-container-box-03">
                            <div>
                                {inbodyList.slice(-1).map((inbody) => (
                                    <li key={inbody.bodycomseq} className="inbody-item">
                                        <div className="inbody-item-text">
                                            <div className="mypage-profile-04"><BodyGraph token={token}/></div>

                                            <div className="inbody-item-component">
                                                <div className="inbody-item-component-01">체중</div>
                                                {inbody.weight}
                                                <div className={`mypage-profile-06 ${weightInt >= 0 ? 'mypage-profile-07' : 'mypage-profile-08'}`}>
                                                    {weightInt >= 0 ? `+${weightInt.toFixed(1)}` : weightInt.toFixed(1)}
                                                </div>
                                            </div>

                                            <div className="inbody-item-component">
                                                <div className="inbody-item-component-01">골격근량</div>
                                                {inbody.musclemass}
                                                <div className={`mypage-profile-06 ${muscleInt >= 0 ? 'mypage-profile-07' : 'mypage-profile-08'}`}>
                                                    {muscleInt >= 0 ? `+${muscleInt.toFixed(1)}` : muscleInt.toFixed(1)}
                                                </div>
                                            </div>

                                            <div className="inbody-item-component">
                                                <div className="inbody-item-component-01">체지방량</div>
                                                {inbody.bodyfatmass}
                                                <div className={`mypage-profile-06 ${fatInt >= 0 ? 'mypage-profile-07' : 'mypage-profile-08'}`}>
                                                    {fatInt >= 0 ? `+${fatInt.toFixed(1)}` : fatInt.toFixed(1)}
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                <div className='mypage-profile-09'>* 등록된 체성분의 처음과 마지막을 비교합니다.</div></div> : <div className='profile-container-box-04'>
                <div className='mypage-profile-10'>
                <img className='mypage-profile-11' alt="좋아요"
                     src={lock}
                     style={{
                         width: '50px',
                         height: '50px'
                     }}/>
                <div className='profile-container-box-01'>
                    팔로우하는 사이가 되어야 볼 수 있어요
                </div></div>
            </div>}

            <div className='bbs-image-container'>
                <div className='bbs-image-container-02'>
                    <div>
                        <b  className='mypage-profile-02'>사진<b className='count-blue'> {bbsImageCount}</b></b></div>
                    <div className='bbs-image-blue-text'><Link className="mypage-profile-03" to="/">전체보기</Link></div>
                </div>

                <div className='bbs-image-container-01'>
                    {bbsImageList.length === 0 ? (
                        <div className='profile-container-box-04'>
                                <div className='profile-container-box-01'>
                                   등록된 사진이 없어요
                                </div>
                        </div>
                    ) : (
                        <div className='mypage-bbs-image'>
                            {bbsImageList.slice(0, 4).map((bbs, i) => (
                                <div key={i}>
                                    {bbs.thumnail ? (
                                        <Link to={`/community/gallery/view/${bbs.bbsseq}`}>
                                            <img className='mypage-bbs-image-01'
                                                 src={`https://firebasestorage.googleapis.com/v0/b/healthygym-8f4ca.appspot.com/o/files%${bbs.thumnail}?alt=media`}
                                                 alt=''
                                            />
                                        </Link>
                                    ) : (
                                        <Link to={`/community/gallery/view/${bbs.bbsseq}`}>
                                            <div className='mypage-bbs-image-01'
                                            />
                                        </Link>
                                    )}
                                </div>
                            ))}
                            {bbsImageList.length < 4 && (
                                Array.from({length: 4 - bbsImageList.length}).map((_, i) => (
                                    <div className='mypage-bbs-image-01'
                                         key={`placeholder-${i}`}
                                    />
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>


        </div>
    );
}

export default UsersProfile;