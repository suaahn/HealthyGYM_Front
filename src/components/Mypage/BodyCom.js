import React, { useEffect, useMemo, useState, useCallback } from "react";
import axios from "axios";
import "./BodyCom.css";
import {Link, Route, Routes} from "react-router-dom";
import BodyComInput from "./BodyComInput";

function BodyCom({token}) {
    const [inbodyList, setInbodyList] = useState([]);
    const [inbodyCount, setInbodyCount] = useState([]);
    const [selectedImg, setSelectedImg] = useState(null);
    const [visibleItems, setVisibleItems] = useState(10); // 초기에 10개 항목 보여주기
    const [isLoading, setIsLoading] = useState(false);
    const [prevScrollPos, setPrevScrollPos] = useState(0);

    const loadMoreItems = useCallback(() => {
        if (visibleItems >= inbodyList.length) {
            return; // 모든 항목을 로드한 경우, 추가로 로드하지 않음
        }

        setIsLoading(true);
        setTimeout(() => {
            setVisibleItems((prevVisibleItems) => prevVisibleItems + 5);
            setIsLoading(false);
        }, 1000); // 1초 후에 추가 항목 로드
    }, [inbodyList.length, visibleItems]);

    useEffect(() => {
        axios
            .post("http://localhost:3000/bodycomlist", token)
            .then((response) => {
                setInbodyList(response.data.list);
                setInbodyCount(response.data.list.length);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [token]);

    const renderedList = useMemo(() => {
        const sortedList = [...inbodyList].sort((a, b) => b.bodycomseq - a.bodycomseq);
        return sortedList.slice(0, visibleItems);
    }, [inbodyList, visibleItems]);

    const handleImgClick = (imgPath) => {
        setSelectedImg(imgPath);
    };

    const handleImgClose = () => {
        setSelectedImg(null);
    };

    const handleScroll = useCallback(() => {
        const currentScrollPos = window.pageYOffset;
        const maxScrollPos = document.documentElement.offsetHeight - window.innerHeight;

        if (currentScrollPos > prevScrollPos) {
            // 스크롤이 아래로 내려갈 때만 동작
            if (!isLoading && currentScrollPos >= maxScrollPos && visibleItems < inbodyList.length) {
                // 스크롤이 맨 아래로 도달한 경우이며, 로딩 중이 아니고 더 로드할 데이터가 남아 있는 경우
                loadMoreItems();
            }
        }

        setPrevScrollPos(currentScrollPos);
    }, [prevScrollPos, isLoading, visibleItems, inbodyList.length, loadMoreItems]);

    useEffect(() => {
        // 스크롤 이벤트 핸들러 등록
        window.addEventListener("scroll", handleScroll, { capture: true });

        return () => {
            // 컴포넌트가 언마운트될 때 스크롤 이벤트 핸들러 제거
            window.removeEventListener("scroll", handleScroll, { capture: true });
        };
    }, [handleScroll]);

    useEffect(() => {
        // 스크롤 이벤트 핸들러 등록
        window.addEventListener("scroll", handleScroll);

        return () => {
            // 컴포넌트가 언마운트될 때 스크롤 이벤트 핸들러 제거
            window.removeEventListener("scroll", handleScroll);
        };
    }, [handleScroll]);

    return (
        <div className="mypage-bodycom-00">
            <div className="mypage-bodycom-01">
                <div className="mypage-bodycom-02">
                    <div>
                        <b>
                            체성분 등록<b className="mypage-bodycom-03"> {inbodyCount}</b>
                        </b>
                    </div>
                    <div className="mypage-bodycom-04">
                        <Link className="nav-link" to="/">
                            전체보기
                        </Link>
                    </div>
                </div>
                <div className="mypage-bodycom-05">
                    {inbodyList.length !== 0 && (
                        <div className="mypage-bodycom-12">
                            <div className="mypage-bodycom-09">
                                {renderedList.slice(0, 4).map((inbody) => (
                                    <div key={`inbody-${inbody.bodycomseq}`}>
                                        {inbody.imgpath ? (
                                            <img
                                                className="mypage-bodycom-10"
                                                src={`http://localhost:3000/images/inbody/${inbody.imgpath}`}
                                                alt=""
                                                onClick={() => handleImgClick(inbody.imgpath)}
                                            />
                                        ) : (
                                            <div className="mypage-bodycom-11" />
                                        )}
                                        {inbodyList.length < 4 && (
                                            Array.from({ length: 4 - inbodyList.length }).map((_, i) => (
                                                <div
                                                    className="mypage-bodycom-11"
                                                    key={`placeholder-${i}`}
                                                />
                                            ))
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                <BodyComInput inbodyListLength={inbodyList.length} />

                <div className="mypage-bodycom-27">
                    <div className="mypage-bodycom-28">
                        <div className="mypage-bodycom-29">
                            <b>번호</b>
                        </div>
                        <div className="mypage-bodycom-30">
                            <b>등록일</b>
                        </div>
                        <div className="mypage-bodycom-31">
                            <b>체중</b>
                        </div>
                        <div className="mypage-bodycom-31">
                            <b>골격근량</b>
                        </div>
                        <div className="mypage-bodycom-31">
                            <b>체지방량</b>
                        </div>
                        <div className="mypage-bodycom-31"></div>
                    </div>
                    <div className="mypage-bodycom-28">
                        <div>
                            {renderedList.map((bodycom) => (
                                <div key={`bodycom-${bodycom.bodycomseq}`} className="mypage-bodycom-35">
                                    <div className="mypage-bodycom-29">
                                        {bodycom.bodycomseq}
                                    </div>
                                    <div className="mypage-bodycom-30">
                                        <div className="mypage-bodycom-32">
                                            {bodycom.uploaddate.slice(0, 10)}
                                        </div>
                                        <div className="mypage-bodycom-32">
                                            {bodycom.uploaddate.slice(11, 16)}
                                        </div>
                                    </div>
                                    <div className="mypage-bodycom-31">{bodycom.weight}</div>
                                    <div className="mypage-bodycom-31">{bodycom.musclemass}</div>
                                    <div className="mypage-bodycom-31">{bodycom.bodyfatmass}</div>
                                    <div className="mypage-bodycom-31"><div className="mypage-bodycom-33">삭제</div></div>
                                </div>
                            ))}

                        </div>
                    </div>
                </div>
            </div>
            <div className="inbody-list-container">
                {selectedImg && (
                    <div className="inbody-image-modal" onClick={handleImgClose}>
                        <div className="inbody-image-modal-content">
                            <img
                                src={`http://localhost:3000/images/inbody/${selectedImg}`}
                                alt="인바디 결과"
                                className="inbody-image-modal-image"
                            />
                        </div>
                    </div>
                )}
            </div>
            <Routes><Route path="/bodycominput" element={<BodyComInput token={token} />}></Route></Routes>

        </div>
    );
}

export default BodyCom;

