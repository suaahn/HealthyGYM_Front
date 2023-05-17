import React, {useEffect, useMemo, useState} from "react";
import axios from '../../utils/CustomAxios';
import "./MypageCss/BodyComAll.css";

// 등록한 체성분 이미지 전체보기
function BodyComAll({token}) {
    const [inbodyList, setInbodyList] = useState([]);
    const [inbodyCount, setInbodyCount] = useState([]);
    const [selectedImg, setSelectedImg] = useState(null);

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

    const renderedList = useMemo(() => [...inbodyList].sort((a, b) => b.bodycomseq - a.bodycomseq), [inbodyList]);


    const handleImgClick = (imgPath) => {
        setSelectedImg(imgPath);
    };

    const handleImgClose = () => {
        setSelectedImg(null);
    };

    return (
        <div className="mypage-bodycomall-00">
            <div className="mypage-bodycomall-01">
                <div className="mypage-bodycomall-02">
                    <div>
                        <b>
                            체성분 등록<b className="mypage-bodycomall-03"> {inbodyCount}</b>
                        </b>
                    </div>
                </div>
                <div className="mypage-bodycomall-05">
                    {inbodyList.length !== 0 && (
                        <div className="mypage-bodycomall-09">
                            {renderedList.map((inbody) => (
                                <div key={`inbody-${inbody.bodycomseq}`}>
                                    {inbody.imgpath ? (
                                        <img
                                            className="mypage-bodycomall-10"
                                            src={`http://localhost:3000/images/inbody/${inbody.imgpath}`}
                                            alt=""
                                            onClick={() => handleImgClick(inbody.imgpath)}
                                        />
                                    ) : (
                                        <div className="mypage-bodycomall-11"/>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <div>
                {selectedImg && (
                    <div className="mypage-bodycomall-12" onClick={handleImgClose}>
                        <div className="mypage-bodycomall-13">
                            <img
                                src={`http://localhost:3000/images/inbody/${selectedImg}`}
                                alt="인바디 결과"
                                className="mypage-bodycomall-14"
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default BodyComAll;

