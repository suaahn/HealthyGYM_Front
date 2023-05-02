import { useCallback, useRef, useState } from "react";
import axios from '../../utils/CustomAxios';
import styled from "styled-components"; // npm i styled-components

export default function CommentForm(props) {
    const [text, setText] = useState('');
    // 비로그인 시 댓글 토글 막기 -> BbsComment에서

    // 댓글 줄바꿈에 따라 늘어나는 textarea
    const textAreaRef = useRef(null);
    
    const handleResizeHeight = useCallback(() => {
        if (textAreaRef === null || textAreaRef.current === null) {
            return;
        }
        textAreaRef.current.style.height = '76px';
        textAreaRef.current.style.height = textAreaRef.current.scrollHeight + 'px';
    }, []);
    
    const textHandler = (e) => {
        setText(e.target.value);
        handleResizeHeight();
    }

    // 댓글 등록
    const submitHandler = () => {
        if(text.trim() === ''){
            alert('내용을 입력해주세요.');
            return;
        }

        // 대댓글 등록
        if(props.commentseq !== undefined) {
            axios.post("http://localhost:3000/writebbsreply", null, 
                        { params:{ "memberseq":localStorage.getItem("memberseq"), 
                            "bbsseq":props.bbsseq, "commentseq":props.commentseq, "cmtcontent":text } })
                 .then(res => {
                    console.log(res.data);
                    if(res.data === "OK"){
                        alert("성공적으로 등록되었습니다");
                        setText("");
                        props.getComments();
                        props.setDisplay(false);
                    }else{
                        alert("등록되지 않았습니다");
                    }
                 })
                 .catch(function(err){
                    alert(err);
                 })

        // 댓글 등록
        } else {
            axios.post("http://localhost:3000/writebbscomment", null, 
                        { params:{ "memberseq":localStorage.getItem("memberseq"), 
                            "bbsseq":props.bbsseq, "cmtcontent":text } })
                 .then(res => {
                    console.log(res.data);
                    if(res.data === "OK"){
                        alert("성공적으로 등록되었습니다");
                        props.getComments();
                        setText("");
                    }else{
                        alert("등록되지 않았습니다");
                    }
                 })
                 .catch(function(err){
                    alert(err);
                 })
            
        }
    }

    return(
        <div>
            <TextArea
                value={text}
                onChange={(e) => textHandler(e)} 
                ref={textAreaRef}
                placeholder='댓글을 남겨주세요.'
            />
            <button type='button' onClick={submitHandler}>등록</button>
        </div>
    );
}
const TextArea = styled.textarea`
  resize: none;
  overflow: hidden;
  display: block;
  box-sizing: border-box;
  min-height: 76px;
  width: 100%;
  padding: 12px;
  outline: none;
  line-height: 20px;
  border-radius: 3px;
  caret-color: black;
  &:focus {
    background: white;
  }
`;