import {Link} from "react-router-dom";
import "./Profile.css";
import React, {useEffect, useMemo, useState} from "react";
import axios from '../../utils/CustomAxios';
import BodyGraph from "./BodyGraph";

function Profile({token}) {

    const [inbodyList, setInbodyList] = useState([]);
    const [inbodyCount, setInbodyCount] = useState('');
    const [weightInt,setWeightInt] = useState(0);
    const [muscleInt,setMuscleInt] = useState(0);
    const [fatInt,setFatInt] = useState(0);

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
                <b className='mypage-profile-02'>나의 체성분<b className='count-blue'>{inbodyCount}</b></b></div>
            <div>
                {inbodyList.length === 0 ? (
                    <div className='profile-container-box'>
                        <Link to="/mypage/profilecard/bodycom">
                            <div className='profile-container-box-01'>
                                <b className='profile-container-box-02'>+ </b>나의 첫번째 체성분을 등록해보세요
                            </div>
                        </Link>
                    </div>
                ) : (
                    <Link className='mypage-profile-05' to="/mypage/profilecard/bodycom">
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
                    </Link>
                )}
            </div>
            <div className='mypage-profile-09'>* 등록된 체성분의 처음과 마지막을 비교합니다.
            </div>
            <div className='bbs-image-container'>
                <div className='bbs-image-container-02'>
                        <b className='mypage-profile-02'>나의 사진<b className='count-blue'> {bbsImageCount}</b></b></div>

                <div className='bbs-image-container-01'>
                    {bbsImageList.length === 0 ? (
                        <div className='profile-container-box-04'>
                            <Link to="/write">
                                <div className='profile-container-box-01'>
                                    <b className='profile-container-box-02'>+ </b>나의 첫번째 사진을 등록해보세요
                                </div>
                            </Link>
                        </div>
                    ) : (
                        <div className='mypage-bbs-image'>
                            {bbsImageList.map((bbs, i) => (
                                <div key={i}>
                                    {bbs.thumnail ? (
                                        <Link to={`/community/gallery/view/${bbs.bbsseq}`}>
                                            <img
                                                className='mypage-bbs-image-01'
                                                src={`https://firebasestorage.googleapis.com/v0/b/healthygym-8f4ca.appspot.com/o/files%${bbs.thumnail}?alt=media`}
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
                        </div>
                    )}
                </div>
            </div>


        </div>
    );
}

export default Profile;