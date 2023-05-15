import React, {useEffect, useState, useRef, useCallback} from "react";
import axios from "axios";
import "./BodyCom.css";

function BodyComInput({ inbodyListLength }) {
    const [memberseq, setMemberseq] = useState("");
    const [uploadFile, setUploadFile] = useState(null);
    const [inputKey, setInputKey] = useState(Date.now()); // 키 값 변경을 통해 input 요소 초기화
    const [isUploading, setIsUploading] = useState(false); // 파일 업로드 중 여부 상태
    const [isUploaded, setIsUploaded] = useState(false); // 파일 업로드 완료 여부 상태
    const [isCancelled, setIsCancelled] = useState(false); // 업로드 취소 여부 상태
    const fileInputRef = useRef(null);

    const [weight, setWeight] = useState("");
    const [bodyfatmass, setBodyfatmass] = useState("");
    const [musclemass, setMusclemass] = useState("");
    const [imgpath, setImgpath] = useState(null);

    const authToken = localStorage.getItem("memberseq");
    const token = {memberseq: authToken};

    useEffect(() => {

        axios
            .post("http://localhost:3000/members/findmember", token)
            .then((response) => {
                setMemberseq(response.data.memberseq);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [authToken]);

    const handleImageChange = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileSelect = (event) => {
        if (event.target && event.target.files && event.target.files.length > 0) {
            const selectedFile = event.target.files[0];
            if (selectedFile) {
                setUploadFile(selectedFile);
                setIsUploading(false);
            }
        }
    };

    const handleCancel = useCallback(() => {
        if (isUploading) {
            // 만약 업로드 중이라면, 요청을 취소합니다.
            setIsCancelled(true);
        }

        // 상태값 초기화
        setUploadFile(null);
        setIsUploading(false);
        setIsUploaded(false);
        setIsCancelled(false); // 취소 상태 초기화
        setInputKey(Date.now());
    }, [isUploading]);


    const handleSubmitData = async () => {
        try {
            const response = await axios.post("http://localhost:3000/userbodycom", {
                memberseq,
                weight,
                musclemass,
                bodyfatmass,
                imgpath,
            });

        } catch (error) {
            console.error(error);
        } finally {
            // 전송 후 상태 초기화
            setUploadFile(null);
            setIsUploading(false);
            setIsUploaded(false);
            setIsCancelled(false); // 취소 상태 초기화
            setInputKey(Date.now());
            alert("저장되었습니다.");
            window.location.reload();
        }
    };

    useEffect(() => {
        let source = axios.CancelToken.source();

        const handleSubmit = async () => {
            if (isCancelled || !uploadFile) {
                return; // 업로드가 취소되었을 경우 함수 실행 중지
            }

            const formData = new FormData();
            formData.append("memberseq", memberseq);
            formData.append("uploadFile", uploadFile);

            setIsUploading(true); // 파일 업로드 중 상태로 설정

            try {
                const response = await axios.post(
                    "http://localhost:3000/ocr_fileUpload",
                    formData,
                    {
                        cancelToken: source.token,
                    }
                );
                if (!isCancelled) {
                    setWeight(response.data.weight);
                    setBodyfatmass(response.data.bodyfatmass);
                    setMusclemass(response.data.musclemass);
                    setImgpath(response.data.imgpath);
                    setIsUploaded(true); // 파일 업로드 완료 상태로 설정
                }
            } catch (error) {
                console.error(error);
            } finally {
                setIsUploading(false); // 파일 업로드 중 상태 해제
            }
        };

        handleSubmit();

        return () => {
            // 컴포넌트 언마운트 시 요청 취소 처리
            source.cancel("Component unmounted");
        };
    }, [memberseq, uploadFile, isCancelled]);

    return (
        <div className='mypage-bodycom-99'>
            <form>
                {!uploadFile && (inbodyListLength === 0 ? (
                    <div className='mypage-bodycom-06'>
                        <div className='mypage-bodycom-07' onClick={handleImageChange}>
                            <b className='mypage-bodycom-08'>+ </b>나의 첫번째 체성분을 등록해보세요
                        </div>
                    </div>
                ) : (
                    <div className="mypage-bodycom-13" onClick={handleImageChange}>
                        <div className="mypage-bodycom-14">+</div>
                        <div>체성분검사 올리기</div>
                    </div>
                ))}
                {isUploading && (
                    <div className='mypage-bodycom-15'>
                        <div className='mypage-bodycom-26'>
                            <div className="mypage-bodycom-25"></div>
                            <div onClick={handleCancel}>취소</div>
                        </div>
                    </div>
                )}

                {isUploaded && !isCancelled && (
                    <div>
                        <form>
                            <div className='mypage-bodycom-15'>
                                <div className='mypage-bodycom-17'>
                                    <img style={{cursor: 'pointer'}}
                                         src={`http://localhost:3000/images/inbody/${imgpath}`}
                                         alt="체성분 이미지"
                                         className="mypage-bodycom-16"
                                    />
                                </div>
                                <div className='mypage-bodycom-19'>
                                    <div className='mypage-bodycom-18'>
                                        <div className="mypage-bodycom-21">
                                            <div className="mypage-bodycom-22">체중</div>
                                            {weight}</div>
                                        <div className="mypage-bodycom-21">
                                            <div className="mypage-bodycom-22">골격근량</div>
                                            {musclemass}</div>
                                        <div className="mypage-bodycom-21">
                                            <div className="mypage-bodycom-22">체지방량</div>
                                            {bodyfatmass}</div>
                                    </div>
                                    <div className='mypage-bodycom-20'>
                                        <div className='mypage-bodycom-24' onClick={handleCancel}>취소</div>
                                        <div className='mypage-bodycom-23' onClick={handleSubmitData}>저장</div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                )}

                <input
                    key={inputKey} // 키 값 변경으로 인해 input 요소
                    type="file"
                    style={{display: "none"}}
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                />
            </form>
        </div>
    );
}

export default BodyComInput;

