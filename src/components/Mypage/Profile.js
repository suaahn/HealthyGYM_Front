import {Link} from "react-router-dom";
import "./Profile.css";
import React, {useEffect, useMemo, useState} from "react";
import axios from "axios";
import gold from "../../asset/icon_gold.png";
import silver from "../../asset/icon_silver.png";
import bronze from "../../asset/icon_bronze.png";

function Profile({token}) {

    const [level, setLevel] = useState('gold');
    const [inbodyList, setInbodyList] = useState([]);
    const [inbodyCount, setInbodyCount] = useState('');

    useEffect(() => {
        axios.post('http://localhost:3000/bodycomlist', token)
            .then(response => {
                setInbodyList(response.data.list);
                setInbodyCount(response.data.list.length);
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
            <b>나의 체성분<b className='count-blue'>{inbodyCount}</b></b>
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
                    <Link to="/mypage/profilecard/bodycom">
                    <div className="profile-container-box-03">
                        <ul>
                            {inbodyList.slice(-1).map((inbody) => (
                                <li key={inbody.bodycomseq} className="inbody-item">
                                    <div className="inbody-item-text">
                                        <div className="inbody-item-component"><img alt="level"
                                                                                    src={level === "gold" ? gold : level === "silver" ? silver : level === "bronze" ? bronze : ""}
                                                                                    style={{
                                                                                        width: '50px',
                                                                                        height: '50px'
                                                                                    }}/></div>

                                        <div className="inbody-item-component">
                                            <div className="inbody-item-component-01">체중</div>
                                            {inbody.weight}</div>
                                        <div className="inbody-item-component">
                                            <div className="inbody-item-component-01">골격근량</div>
                                            {inbody.musclemass}</div>
                                        <div className="inbody-item-component">
                                            <div className="inbody-item-component-01">체지방량</div>
                                            {inbody.bodyfatmass}</div>
                                    </div>
                                </li>
                            ))}
                        </ul>

                    </div></Link>
                )}
            </div>

            <div className='bbs-image-container'>
                <div className='bbs-image-container-02'>
                <div>
                <b>나의 사진<b className='count-blue'> {bbsImageCount}</b></b></div>
                <div className='bbs-image-blue-text'><Link className="nav-link" to="/">전체보기</Link></div></div>

                <div className='bbs-image-container-01'>
                    {bbsImageList.length === 0 ? (
                        <div className='profile-container-box-04'>
                            <Link to="/mypage/bodygallery">
                                <div className='profile-container-box-01'>
                                    <b className='profile-container-box-02'>+ </b>나의 첫번째 사진을 등록해보세요
                                </div>
                            </Link>
                        </div>
                    ) : (
                        <div className='mypage-bbs-image'>
                            {bbsImageList.slice(0, 4).map((bbs, i) => (
                                <div key={i}>
                                    {bbs.thumnail ? (
                                        <Link to={`/view/${bbs.bbsseq}`}>
                                            <img className='mypage-bbs-image-01'
                                                 src={`https://firebasestorage.googleapis.com/v0/b/healthygym-8f4ca.appspot.com/o/files%${bbs.thumnail}?alt=media`}
                                                 alt=''
                                            />
                                        </Link>
                                    ) : (
                                        <Link to={`/view/${bbs.bbsseq}`}>
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

export default Profile;