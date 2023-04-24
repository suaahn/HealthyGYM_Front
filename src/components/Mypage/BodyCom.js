import ProfileCard from "./ProfileCard";
import {useEffect, useRef, useState} from "react";
import axios from "axios";
import "./BodyCom.css";

function BodyCom() {

    const [previewUrl, setPreviewUrl] = useState(null);

    const [uploadFile, setuploadFile] = useState(null);

    const fileInputRef = useRef();

    const [inbodyList, setInbodyList] = useState([]);

    const [selectedImg, setSelectedImg] = useState(null);

    const handleImgClick = (imgPath) => {
        setSelectedImg(imgPath);
    };

    const handleImgClose = () => {
        setSelectedImg(null);
    };

    useEffect(() => {
        axios.get('http://localhost:3000/inbodylist')
            .then(response => {
                setInbodyList(response.data.list);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    const handleImageChange = (event) => {
        const selectedFile = event.target.files[0];
        setuploadFile(selectedFile);
        setPreviewUrl(URL.createObjectURL(selectedFile));

    }

    const handleClick = () => {
        fileInputRef.current.click();
    };

    const deleteClick = () => {
        setPreviewUrl(null);
        setuploadFile(null);
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append("uploadFile", uploadFile);

        axios
            .post("http://localhost:3000/ocr_fileUpload", formData)
            .then((response) => {
                console.log(response.data);
            });
        window.location.reload();
    }

    return (
        <div>
            <hr/>
            <h2>Bodycom</h2>
            <ProfileCard/>
            <div className="upload-container">
                <div>체성분검사 업로드</div>
                <form onSubmit={handleSubmit}>
                    <div className="upload-wrapper">
                        <label>인바디 결과지를 업로드 해주세요</label>
                        {previewUrl ? (
                            <div className="image-wrapper">
                                <img style={{cursor: 'pointer'}}
                                     src={previewUrl}
                                     alt="인바디 이미지"
                                     onClick={handleClick}
                                     className="uploaded-image"
                                />
                                <button onClick={deleteClick}>삭제</button>
                            </div>
                        ) : (
                            <div className="image-wrapper">
                                <img style={{cursor: 'pointer'}}
                                     src="http://localhost:3000/images/inbody/uploadimage.png"
                                     alt="인바디 이미지"
                                     onClick={handleClick}
                                     className="upload-image"
                                />
                            </div>
                        )}
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            style={{display: "none"}}
                        />
                    </div>
                    <button type="submit">업로드</button>
                </form>
            </div>
            <div className="inbody-list-container">
                <h2>INBODY DATA LIST</h2>
                <div className="inbody-list-wrapper">
                    <ul className="inbody-list">
                        {inbodyList.map((inbody) => (
                            <li key={inbody.inbodyseq} className="inbody-item">
                                <img style={{cursor: 'pointer'}}
                                     src={`http://localhost:3000/images/inbody/${inbody.imgpath}`}
                                     alt="인바디 결과"
                                     className="inbody-image"
                                     onClick={() => handleImgClick(inbody.imgpath)}
                                />
                                <div className="inbody-item-text">
                                    <p>
                                        <strong>업로드 날짜:</strong> {inbody.uploaddate}
                                    </p>
                                    <p>
                                        <strong>체중:</strong> {inbody.weight}
                                    </p>
                                    <p>
                                        <strong>골격근량:</strong> {inbody.musclemass}
                                    </p>
                                    <p>
                                        <strong>체지방량:</strong> {inbody.bodyfatmass}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
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
        </div>
    )
}

export default BodyCom;