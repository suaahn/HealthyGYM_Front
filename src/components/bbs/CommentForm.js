import { useCallback, useRef, useState } from "react";
import axios from '../../utils/CustomAxios';
import styled from "styled-components"; // npm i styled-components
import { Button, Form, Icon } from "semantic-ui-react";

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
        if(localStorage.getItem('memberseq') === undefined || localStorage.getItem('memberseq') === null) {
            alert('로그인 후 댓글을 작성할 수 있습니다.');
            return;
        }
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
                        alert("댓글이 등록되었습니다");
                        setText("");
                        props.setCmtList([]);
                        props.getComments(0);
                        props.setDisplay(false);
                        props.setPage(0);
                    }else{
                        alert("다시 시도해주세요");
                    }
                 })
                 .catch(function(err){
                    alert(err);
                 });

        // 댓글 등록
        } else {
            axios.post("http://localhost:3000/writebbscomment", null, 
                        { params:{ "memberseq":localStorage.getItem("memberseq"), 
                            "bbsseq":props.bbsseq, "cmtcontent":text } })
                 .then(res => {
                    console.log(res.data);
                    if(res.data === "OK"){
                        alert("댓글이 등록되었습니다");
                        props.setCmtList([]);
                        props.getComments(0);
                        setText("");
                        props.setPage(0);
                    }else{
                        alert("다시 시도해주세요");
                    }
                 })
                 .catch(function(err){
                    alert(err);
                 });
            
        }
    }

    return(
        <Form>
            <textarea style={{ height:'auto', minHeight: '76px', resize: 'none', overflow: 'hidden'}}
                value={text}
                onChange={(e) => textHandler(e)} 
                ref={textAreaRef}
                placeholder='댓글을 남겨주세요.'
            />
            <Button onClick={submitHandler} style={{ display: 'block', margin: '5px 0px 20px auto'}}>
                <Icon name='edit' />
                등 록
            </Button>
        </Form>
    );
}
