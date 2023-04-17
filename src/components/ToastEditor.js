import { useRef, useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';

import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"

export default function ToastEditor() {
    let history = useNavigate();

    const [memberseq, setMemberseq] = useState(1);
    const [bbstag, setBbstag] = useState(0);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    // login 되어 있는지 검사하고 member_seq 얻기


    // Editor DOM 선택용
    const editorRef = useRef();

    // 등록 버튼 핸들러
    const handleRegisterButton = () => {
        // 입력한 내용을 HTML 태그 형태로 출력
        // console.log(editorRef.current.getInstance().getHTML());
        // 입력한 내용을 MarkDown 형태로 출력
        // console.log(editorRef.current.getInstance().getMarkdown());
        // 제목 출력
        // console.log(title, memberseq, bbstag);

        if(bbstag === 0) {
            alert('토픽을 선택해주세요');
            return;
        } else if(title.trim() === ''){
            alert('제목을 입력해주세요.');
            return;
        } else if(editorRef.current.getInstance().getMarkdown().length === 0) {
            alert('내용을 입력해주세요.');
            return;
        }
        // 각자 사용 시 params 변경하면 됨!!!!
        axios.post("http://localhost:3000/writefreebbs", null, 
                    { params:{ "memberseq":memberseq, "title":title, "content":content, "bbstag":bbstag } })
             .then(res => {
                console.log(res.data);
                if(res.data === "OK"){
                    alert("성공적으로 등록되었습니다");
                    history('/');
                }else{
                    alert("등록되지 않았습니다");
                }
             })
             .catch(function(err){
                alert(err);
             })
    };
    
    // 파이어베이스 설정
    const firebaseConfig = {
        apiKey: "AIzaSyDpYZJPtXWK2JyTQW9vxbxiiysDhOGhx7k",
        authDomain: "healthygym-8f4ca.firebaseapp.com",
        projectId: "healthygym-8f4ca",
        storageBucket: "healthygym-8f4ca.appspot.com",
        messagingSenderId: "1087556149477",
        appId: "1:1087556149477:web:078cd9ec747dc5c863740c",
        measurementId: "G-HBKWRZVGEQ"
    };

    const firebaseApp = initializeApp(firebaseConfig); 
    const storage = getStorage(firebaseApp); 

    // 이미지 업로드 핸들러
    const onUploadImage = async (blob, dropImage) => {

        console.log(blob);
        
        const url = await uploadImage(blob); //업로드된 이미지 서버 url
        dropImage(url, 'alt_text'); //에디터에 이미지 추가

        /* DB, 로컬 경로에 저장 (보안이슈로 이미지 미리보기 안됨)
        let formData = new FormData();
        formData.append("imgfile", blob);

        axios({
            method:'post',
            url:'http://localhost:3000/uploadfile',
            data: formData
          })
          .then((result)=>{
           console.log('요청성공');
           console.log(result.data);
           if(result !== 'toobig' && result !== 'notimage') {
            dropImage(result.data);
           }
        })
          .catch((error)=>{
          console.log(error);
        })
        */
    };
    const uploadImage = async(blob) => { 
    	try{ //firebase Storage Create Reference 파일 경로 / 파일 명 . 확장자 
        	const storageRef = ref(storage, `files/${generateName() + '.' + blob.type.substring(6, 10)}`); 
            //firebase upload 
            const snapshot = await uploadBytes(storageRef, blob); 
            
            return await getDownloadURL(storageRef); 
        } catch (err){ 
        	console.log(err) 
            return false; } 
    }

    // 랜덤 파일명 생성 
    const generateName = () => { 
    	const ranTxt = Math.random().toString(36).substring(2,10); //랜덤 숫자를 36진수로 문자열 변환 
        const date = new Date(); 
        const randomName = ranTxt+'_'+date.getFullYear()+''+date.getMonth()+1+''+date.getDate()+''+date.getHours()+''+date.getMinutes()+''+date.getMinutes()+''+date.getSeconds(); 
        return randomName; 
    }
        

    return (
        <div className="edit_wrap">
            <h2>글쓰기</h2><hr/>

            <select value={bbstag} defaultValue={0} onChange={(e) => setBbstag(e.target.value)}>
                <option value={0} hidden>토픽을 선택해주세요</option>
                <optgroup label='커뮤니티'>
                    <option value={1}>바디갤러리</option>
                    <option value={2}>정보</option>
                    <option value={3}>자유</option>
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
                hooks={{
                    addImageBlobHook: onUploadImage
                }}
            />
            <button onClick={handleRegisterButton}>등록</button>

        </div>
    );
}