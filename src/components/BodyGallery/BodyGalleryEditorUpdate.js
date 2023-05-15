import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import axios from 'axios';

import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import '@toast-ui/editor/dist/i18n/ko-kr';
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { Form, Button, Loader } from 'semantic-ui-react';

export default function BodyGalleryEditor() {
    let navigate = useNavigate();
    const { bbsseq } = useParams();

    const [memberseq, setMemberseq] = useState(0);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [imageArr, setImageArr] = useState([]);
    const [loading, setLoading] = useState(false);

    // Editor DOM 선택용
    const editorRef = useRef();

    // login 되어 있는지 검사하고 member_seq 얻기
    useEffect(() => {
        const s = localStorage.getItem("memberseq");
        if(s !== null){
            setMemberseq(s);
        } else {
            alert('로그인 후 수정 가능합니다.');
            navigate('/login');
        }

        const fetchBodyDetail = async() => {
            const response = await axios.get(`http://localhost:3000/BodyGallery/findBodyById/${bbsseq}`, { params:{"bbsseq":bbsseq} })
                .then((res) => {
                    console.log(JSON.stringify(res.data));
                    setTitle(res.data.title);
                    setContent(res.data.content);
                    setLoading(true);   // 여기서 rendering해줌
                })
                .catch((error) => {
                    alert(error);
                });
        }

        fetchBodyDetail();
    }, [bbsseq, navigate]);

    // 등록 버튼 핸들러
    const handleUpdateButton = () => {
        let markdown = editorRef.current?.getInstance()?.getMarkdown();
        
        if(title.trim() === ''){
            alert('제목을 입력해주세요.');
            return;
        } else if(markdown.length === 0) {
            alert('내용을 입력해주세요.');
            return;
        } else if(imageArr.length === 0) {
            alert('이미지는 1개 이상 등록해주세요');
            return;
        }

        // 이미지 배열 비교 및 삭제 
        // 유저가 게시글 작성하는 과정에서 등록한 이미지를 삭제하는 경우가 있기 때문에 최종 등록된 내용과 비교한다.
        let [deleteImg, contentImgUpdate] = imageFilter(markdown);
        
        if(deleteImg !== null) {
            deleteImg.forEach(img => {

                let imageRef = ref(storage, "https://firebasestorage.googleapis.com/v0/b/healthygym-8f4ca.appspot.com/o/files%"+img+"?alt=media");
                deleteObject(imageRef).then(() => {
                    console.log("이미지 삭제 완료");
                }).catch((error) => {
                    console.log("이미지 삭제 실패"); 
                });
            });
        }

        // 요청 parameter 객체로 만들기
        const BbsDto = {
            "bbsseq": bbsseq, // 반드시 반드시 반드시 parameter로 넣어야 한다!!
            "memberseq":memberseq, 
            "title":title,
            "content":content,
            "bbstag":2,
            "thumnail":contentImgUpdate[0]
        };

         // updateBody 실행 확인
         axios.post("http://localhost:3000/BodyGallery/updateBody", BbsDto, {
            headers: {
              'Content-Type': 'application/json'
            }
          })
            .then(res => {
                console.log(res.data);
                if(res.data === "Successfully updated"){
                    setTitle(title);
                    setContent(editorRef.current.getInstance().getHTML()); // 수정된 게시글 내용을 저장함
                    setImageArr(imageArr);
                    navigate(`/community/2`);
                }else{
                    alert("수정되지 않았습니다");
                }
              })
              .catch(function(err){
                alert(err);
              })
    };
    
    // 파이어베이스 설정 : 나의 firebase로 설정해서 이미지 잘 들어오는 지 확인 
    // firebase app named ' default ' already exists 에러 발생
    // 이미 설정한 init과 충돌 발생하는 것으로 예상됨
    const firebaseConfig = {
        apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
        authDomain: "healthygym-8f4ca.firebaseapp.com",
        projectId: "healthygym-8f4ca",
        storageBucket: "healthygym-8f4ca.appspot.com",
        messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.REACT_APP_FIREBASE_APP_ID,
        measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
    };

    const firebaseApp = initializeApp(firebaseConfig);
    const storage = getStorage(firebaseApp);

    
    // 이미지 업로드 핸들러 : toast editor에서 image OK 버튼 누르는 순간 동작
    const onUploadImage = async (blob, dropImage) => {
        console.log(blob);
        
        const [url, filename] = await uploadImage(blob); // 업로드된 이미지 서버 url
        console.log(url);
        dropImage(url, 'alt_text'); // 에디터에 이미지 추가

        // 이미지 배열에 저장
        setImageArr(prev => [...prev, filename]);
    };
    const uploadImage = async (blob) => { 
    	try{ // firebase Storage Create Reference 파일경로 / 파일명 . 확장자
            const filename = Date.now();
        	const storageRef = ref(storage, `files/${filename + '.' + blob.type.substring(6, 10)}`); 
            // firebase upload 
            const snapshot = await uploadBytes(storageRef, blob); 
            
            return [await getDownloadURL(storageRef), filename]; 
        } catch (err){ 
        	console.log(err) 
            return false; } 
    }

    // 본문과 imageArr 비교하여 삭제할 이미지들 반환
    const imageFilter = (ele) => {
        let deleteImg = imageArr;
        let contentImgUpdate = contentToArray(ele);

        for(let i = 0; i < imageArr.length; i++) {
            for(let j = 0; j < contentImgUpdate.length; j++) {
                if(imageArr[i] === contentImgUpdate[j]) {
                    deleteImg.splice(i, 1);
                }
            }
        }
        console.log(deleteImg);
        return [deleteImg, contentImgUpdate];
    }
    // 본문 마크다운에서 이미지 이름을 배열로 빼내기
    const contentToArray = (ele) => {
        let contentStr = ele.split("![alt_text]").filter(str=>str.includes("https://firebasestorage.googleapis.com/"));
        for(let j = 0; j < contentStr.length; j++) {
            contentStr[j] = contentStr[j].substring(contentStr[j].indexOf("%")+1, contentStr[j].indexOf("?"));
        }
       return contentStr;
    }

    if(loading === false){
        return <Loader active />
    }
    
    return (
        <div className="edit_wrap">
            <br/>
            <h2>글쓰기</h2>
            <Form>
            <select onChange={(e) => {if(e.target.value < 3||4) navigate("/write"); else if(e.target.value === 5) navigate("/mate/health/write"); else navigate("/meallist")}}>
                    <optgroup label='커뮤니티'>
                        <option value={2} selected>바디갤러리</option>
                        <option value={3}>정보</option>
                        <option value={4}>자유</option>
                    </optgroup>
                    <optgroup label='헬친'>
                        <option value={5}>헬스메이트</option>
                        <option value={10}>식단메이트</option>
                    </optgroup>
                </select><br/>
                <input
                    type="text"
                    id="title"
                    name="title"
                    placeholder="제목을 입력해주세요"
                    value={title}
                    onChange={(e)=>setTitle(e.target.value)}
                />
            </Form><br/>

            <Editor
                placeholder="내용을 입력해주세요."
                initialValue={content}
                previewStyle={window.innerWidth > 1000 ? 'vertical' : 'tab'} // 미리보기 스타일 지정
                height="300px" // 에디터 창 높이
                initialEditType="wysiwyg" // 초기 입력모드 설정
                language="ko-KR"
                toolbarItems={[           // 툴바 옵션 설정
                    ['heading', 'bold', 'italic', 'strike'],
                    ['hr', 'quote'],
                    ['ul', 'ol', 'task'],
                    ['table', 'image', 'link'],
                    ['code', 'codeblock'],
                    ['scrollSync']
                ]}
                useCommandShortcut={false} // 키보드 입력 컨트롤 방지
                ref={editorRef}
                onChange={() => setContent(editorRef.current.getInstance().getHTML())}
                hooks={{ addImageBlobHook: onUploadImage }}
            /><br/>
            <Button onClick={handleUpdateButton} 
                style={{ color:'white', backgroundColor:'#5271FF', display: 'block', margin: 'auto' }}>
                수 정
            </Button>

        </div>
    );
}