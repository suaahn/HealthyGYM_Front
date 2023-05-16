import {Link, useParams} from "react-router-dom";
import React, {useEffect, useMemo, useState} from "react";
import axios from '../../utils/CustomAxios';
import "./MyCommunity.css";
import {getLinkByBbsTag} from "./MyPage";



function MyAllBbs({token, profile}) {
    let params = useParams();

    const [bbsImageList, setBbsImageList] = useState([]);
    const [bbsTitle, setBbsTitle] = useState("");

    const requestBody = useMemo(
        () => ({
            bbstag: params.bbstag,
            memberseq: token.memberseq,
        }),
        [params.bbstag, token.memberseq]
    );

    useEffect(() => {
        axios
            .post(`http://localhost:3000/mypage/${params.communitytag}`, requestBody, {
                headers: {
                    "Content-Type": "application/json",
                },
            })
            .then((response) => {
                setBbsImageList(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [params.communitytag, requestBody]);

    useEffect(() => {
        if (params.bbstag === "1") {
            setBbsTitle("운동루틴");
        } else if (params.bbstag === "3") {
            setBbsTitle("정보게시판");
        } else if (params.bbstag === "4") {
            setBbsTitle("자유게시판");
        } else if (params.bbstag === "5") {
            setBbsTitle("운동메이트");
        } else if (params.bbstag === "10") {
            setBbsTitle("식단공유");
        } else if (params.bbstag === "11") {
            setBbsTitle("식단추천");
        }
    }, [params.bbstag]);

    const removeImageTags = (content) => {
        const imgRegex = /<img\b[^>]*>/gi;
        return content.replace(imgRegex, "");
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("ko-KR");
    };

    const totalCount = bbsImageList.length;

    return (
        <div className="mypage-mycommunity-23">
            <div className="mypage-mycommunity-01">
                <div className="mypage-mycommunity-02">
                    <div className="mypage-mycommunity-05">
                        <div className="mypage-mycommunity-15">
                            <div className="mypage-mycommunity-21">
                                <b>
                                    {bbsTitle}
                                    <b className="mypage-mycommunity-16"> {totalCount}</b>
                                </b>
                            </div>
                        </div>
                        <div>
                            <div className="mypage-mycommunity-20"/>
                        </div>
                    </div>
                    <div className="mypage-mycommunity-06">
                        {bbsImageList.map((bbs, i) => (
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
                                                        src={`http://localhost:3000/images/profile/${profile}`}
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
            </div>
        </div>
    );
}

export default MyAllBbs;
