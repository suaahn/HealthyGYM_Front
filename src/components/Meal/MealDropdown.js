import React from 'react'
import { Dropdown } from 'semantic-ui-react'
import axios from "axios";

// TODO: This is missing functionality for sub-menu here from SUI core examples.
// The "Publish To Web" item should contain a sub-menu.

function MealDropDown(props) {


  const handleEditClick = () => {
    // 수정 버튼을 클릭하면 bbsseq를 서버로 전송하여 게시물을 수정하는 로직을 구현합니다.
    console.log(`Edit post with bbsseq: ${props.bbsdto.bbsseq}`);

  };

  const handleDeleteClick = () => {
    // 삭제 버튼을 클릭하면 bbsseq를 서버로 전송하여 게시물을 삭제하는 로직을 구현합니다.
    console.log(`Delete post with bbsseq: ${props.bbsdto.bbsseq}`);

    try {
      const res = axios.post(
        "http://localhost:3000/deletemealpost",
        null,
        { params: { bbsseq: props.bbsdto.bbsseq } }
      );
      console.log(res);
      if(res === "Success"){
        alert("삭제하였습니다.");

        // navigate로 다시 이동해야함. 부분 렌더링 불가.
      }
  
    } catch (error) {
      console.log(error);
      alert("삭제에 실패했습니다.");
    }
  };

  return (
    <Dropdown text="글 관리">
      <Dropdown.Menu>
        <Dropdown.Item text="수정" onClick={handleEditClick} />
        <Dropdown.Item text="삭제" onClick={handleDeleteClick} />
      </Dropdown.Menu>
    </Dropdown>
  );
}


export default MealDropDown;
