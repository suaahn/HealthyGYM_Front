// 식단공유 작성

import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';

import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"

function Meallist() {
  

  const [search, setSearch] = useState('');
  const [result, setResult] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [totalCalories, settotalCalories] = useState(0);

  let history = useNavigate();

  const [memberseq, setMemberseq] = useState(1);  // 1로 가정 했습니다. // 경고
  const bbstag = 10;
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');


  // login 되어 있는지 검사하고 member_seq 얻기  세션 추가 해야함.


  // Editor DOM 선택용
  const editorRef = useRef();  

  // 공공데이터 포털 API / JSON 형태로 받기
  const SearchMealList = () => {
    if(search === undefined || search.trim() === ""){
      alert("검색어를 입력해주세요");
      return;
    }
    console.log(search);
    axios.get("http://localhost:3000/FindMealList", { params: { "search":search } })
    .then(function(resp){
      console.log(resp);
      console.log(resp.data);
      setResult(resp.data);
    })
    .catch(function(err){
      alert(err);
    })
  }

  const addToSelectedItems = (item) => {
    setSelectedItems([...selectedItems, item]);
    settotalCalories(totalCalories + parseFloat(item.nutrcont1));
  }

  // 등록 버튼 핸들러
  const handleRegisterButton = () => {
    // 입력한 내용을 HTML 태그 형태로 출력
    // console.log(editorRef.current.getInstance().getHTML());
    // 입력한 내용을 MarkDown 형태로 출력
    // console.log(editorRef.current.getInstance().getMarkdown());
    // 제목 출력
    // console.log(title, memberseq, bbstag);

    if(title.trim() === ''){
      alert('제목을 입력해주세요.');
      return;
  } else if(editorRef.current.getInstance().getMarkdown().length === 0) {
      alert('내용을 입력해주세요.');
      return;
  }
  /*
  const foodDtos = selectedItems.map(item => {
    return {
      desckor: item.desckor,
      servingwt: item.servingwt,
      nutrcont1: item.nutrcont1,
      nutrcont2: item.nutrcont2,
      nutrcont3: item.nutrcont3,
      nutrcont4: item.nutrcont4,
      nutrcont5: item.nutrcont5,
      nutrcont6: item.nutrcont6,
      nutrcont7: item.nutrcont7,
      nutrcont8: item.nutrcont8,
      nutrcont9: item.nutrcont9,
      bgnyear: item.bgnyear,
      animalplant: item.animalplant

      
    };
    console.log(foodDtos);
  });
  */

 
    



    // 각자 사용 시 params 변경하면 됨!!!!
    axios.post("http://localhost:3000/writemeal1", null, 
    {params:{  "memberseq":memberseq, "title":title, "content":content, "bbstag":bbstag}})
          .then(res => {
            // console.log("return data" + res.data);
            // console.log("title : " + title);
            // console.log("content : "+ content);
            // console.log("bbstag : " + bbstag);
            if(selectedItems.length !== 0){
               // DB에 저장하기 위해 선택된 항목들을 JSON으로 담기.
                const selectedItemsJson = JSON.stringify(selectedItems);
                console.log(selectedItemsJson);
                axios.post('http://localhost:3000/writemeal2', selectedItemsJson, {
                headers: {
                  'Content-Type': 'application/json',
                },
              })
              .then(response => {
                if(res.data === "OK"){
                    alert("성공적으로 등록되었습니다");
                    history('/mealviews');
                }else{
                    alert("등록되지 않았습니다");
                }
              })
              .catch(error => {
                console.error(error);
              });
            } // 2중 axios 끝


            if(res.data === "OK"){
                alert("성공적으로 등록되었습니다");
                history('/mealviews');
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
  };

  const uploadImage = async(blob) => { 
    try{ //firebase Storage Create Reference 파일 경로 / 파일 명 . 확장자 
        const storageRef = ref(storage, `files/${generateName() + '.' + blob.type.substring(6, 10)}`); 
          //firebase upload 
          const snapshot = await uploadBytes(storageRef, blob); 
          // 무슨 기능인지 잘 모르겠습니다. 추후 이미지 기능 모두 구현되면 그때 잡을게요
          
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

  // 함수 끝 구조 생성
  return (
    <div>
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

      <br/> 
      <button onClick={handleRegisterButton}>등록</button>


      <br/> <br/><br/> <br/>
      <input type="text" value={search} size="30" onChange={(e) => setSearch(e.target.value)} placeholder="검색 리스트" />

      <br />
      <br />

      <button type="button" onClick={() => SearchMealList()} className="btn btn-primary">검색</button>

      <br />
      <div className="d-flex flex-wrap">
        {result.map((item, index) => (
          <div className="card m-2" style={{ width: "200px" }} key={index} onClick={() => addToSelectedItems(item)}>
            <div className="card-body">
              <h5 className="card-title">{item.desckor}</h5>
              <p className="card-text">{item.nutrcont1} kcal</p>
            </div>
          </div>
        ))}
      </div>
      <p></p>

      <div>
        <p>선택한 음식들:</p>
        <ul>
          {selectedItems.map((item, index) => (
            <li key={index}>
              {item.desckor} / {item.nutrcont1} kcal
            </li>
          ))}
        </ul>
        <p>총 칼로리: {totalCalories} kcal</p>
      </div>
    </div>
  )
}

export default Meallist;
