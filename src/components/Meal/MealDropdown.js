import React from 'react'
import { Dropdown } from 'semantic-ui-react'
import { useNavigate } from "react-router-dom";
import axios from "axios";

// TODO: This is missing functionality for sub-menu here from SUI core examples.
// The "Publish To Web" item should contain a sub-menu.

function MealDropDown(props) {

  let navigate = useNavigate();


  const handleEditClick = () => {
    // 수정 버튼을 클릭하면 bbsseq를 수정폼으로 전송하여 게시물을 수정
    console.log(`Edit post with bbsseq: ${props.bbsdto.bbsseq}`);
    navigate(`/mate/meal/update/${props.bbsdto.bbsseq}`);

  };

  const handleDeleteClick = async () => {
    // 삭제 버튼을 클릭하면 bbsseq를 서버로 전송하여 게시물을 삭제
    // console.log(`Delete post with bbsseq: ${props.bbsdto.bbsseq}`);

    try {
      const res = await axios.post(
        "http://localhost:3000/deletemealpost",
        null,
        { params: { bbsseq: props.bbsdto.bbsseq } }
      );
      console.log(res);
      console.log(res.data);
      if (res.data === "Success") {
        alert("삭제하였습니다.");
  
        window.location.reload();
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
