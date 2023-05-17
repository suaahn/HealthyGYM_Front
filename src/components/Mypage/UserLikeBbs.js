import React, {useEffect, useMemo, useState} from "react";
import axios from '../../utils/CustomAxios';
import {Link} from "react-router-dom";
import "./MypageCss/MyCommunity.css";
import {getLinkByBbsTag} from "./MyPage";

// 유저페이지 - 좋아요한 글 리스트
function UserLikeBbs({token, profile}) {
    const [bbsImageList, setBbsImageList] = useState([]);

    const requestBody = useMemo(
        () => ({
            bbstag: 0,
            memberseq: token.memberseq,
        }),
        [token.memberseq]
    );

    useEffect(() => {
        axios
            .post("http://localhost:3000/mypage/mylikebbs", requestBody, {
                headers: {
                    "Content-Type": "application/json",
                },
            })
            .then((response) => {
                setBbsImageList(response.data);
            });
    }, [requestBody]);

    const removeImageTags = (content) => {
        const imgRegex = /<img\b[^>]*>/gi;
        const youtubeRegex = /<iframe\b[^>]*><\/iframe>/gi;
        return content.replace(imgRegex, "").replace(youtubeRegex, "<p>[Youtube]</p>");
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("ko-KR");
    };

    const renderBbsImageList = (bbstag, title) => {
        const filteredBbs = bbsImageList
            .filter((bbs) => bbs.bbstag === bbstag)
            .slice(0, 2);
        const totalCount = bbsImageList.filter((bbs) => bbs.bbstag === bbstag)
            .length;

        if (filteredBbs.length > 0) {
            return (
                <div className="mypage-mycommunity-02">
                    <div className="mypage-mycommunity-05">
                        <div className="mypage-mycommunity-15">
                            <div  className="mypage-mycommunity-21">
                                <b>
                                    {title}
                                    <Link to={`/userpage/${token.memberseq}/all/mylikebbs/${bbstag}`}><b className="mypage-mycommunity-16"> {totalCount}</b>
                                    </Link>
                                </b>
                                <div className="mypage-mycommunity-22">
                                    <Link to={`/userpage/${token.memberseq}/all/mylikebbs/${bbstag}`}>
                                        전체보기
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="mypage-mycommunity-20"/>
                        </div>
                    </div>
                    <div className="mypage-mycommunity-06">
                        {filteredBbs.map((bbs, i) => (
                            <div key={i}>
                                <div className="mypage-mycommunity-09">
                                    <Link to={getLinkByBbsTag(bbs.bbsseq, bbs.bbstag)}>
                                        <div className="mypage-mycommunity-08">
                                            <div className="mypage-mycommunity-10">
                                                <div className="mypage-mycommunity-13">{bbs.title}</div>
                                                <div className="mypage-mycommunity-12">
                                                    <div
                                                        dangerouslySetInnerHTML={{
                                                            __html: removeImageTags(bbs.content),
                                                        }}
                                                    />
                                                </div>
                                                <div className="mypage-mycommunity-14">
                                                    <img
                                                        src={`http://localhost:3000/images/profile/${bbs.profile}`}
                                                        alt="프로필 이미지"
                                                        width="20"
                                                        height="20"
                                                    />
                                                    <div className="mypage-mycommunity-17">{bbs.nickname}</div>
                                                    <div className="mypage-mycommunity-18">{formatDate(bbs.wdate)}</div>
                                                    <div className="mypage-mycommunity-19">댓글 {bbs.cmtcount}</div>
                                                    <div className="mypage-mycommunity-19">조회 {bbs.readcount}</div>
                                                    <div className="mypage-mycommunity-19">좋아요 {bbs.likecount}</div>
                                                </div>
                                            </div>
                                            <div className="mypage-mycommunity-11">
                                                {bbs.thumnail ? (
                                                    <img
                                                        src={`https://firebasestorage.googleapis.com/v0/b/healthygym-8f4ca.appspot.com/o/files%${bbs.thumnail}?alt=media`}
                                                        alt=""
                                                        width={120}
                                                        height={120}
                                                    />
                                                ) : (
                                                    <div
                                                        style={{
                                                            width: 120,
                                                            height: 120,
                                                            backgroundColor: "white",
                                                        }}
                                                    ></div>
                                                )}

                                            </div>
                                        </div>
                                        <div>
                                            <div className="mypage-mycommunity-20"/>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        return null;
    };

    return (
        <div className="mypage-mycommunity-01">
            {renderBbsImageList(3, "정보게시판")}
            {renderBbsImageList(4, "자유게시판")}
            {renderBbsImageList(5, "운동메이트")}
            {renderBbsImageList(10, "식단공유")}
            {renderBbsImageList(11, "식단추천")}
        </div>
    );
}

export default UserLikeBbs;
