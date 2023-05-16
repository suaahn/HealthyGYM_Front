import React, { useState, useEffect } from 'react';
import { Button, Comment, Form } from 'semantic-ui-react';
import axios from '../../utils/CustomAxios';
import Moment from 'react-moment';
import 'moment/locale/ko';

export default function BodyGalleryComment(props) {
  const [isLoggedIn, setIsLoggedIn] = useState(0);
  const [showAllComments, setShowAllComments] = useState(false);
  const [commentList, setCommentList] = useState([]);
  const [comment, setComment] = useState('');

  // 전체 댓글 조회
  const findAllBodyComment = () => {
    axios.get(`http://localhost:3000/BodyGallery/findAllBodyComment/${props.bbsseq}`)
      .then(res => {
        console.log(res.data);
        setCommentList(res.data);
      })
      .catch(function(err){
        alert(err);
      });
  }

  useEffect(() => {
    const s = localStorage.getItem("memberseq");
    if (s !== null) {
      setIsLoggedIn(s);
    } 
  }, [isLoggedIn]);

  useEffect(() => {
    findAllBodyComment();
  }, []);

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  // 댓글 등록
  const handleCommentSubmit = (e) => {
    e.preventDefault();
    const data = {
      memberseq: props.memberseq,
      bbsseq: props.bbsseq,
      commentseq: props.commentseq,
      profile: props.profile,
      nickname: props.nickname,
      cmtcontent: comment 
    };
    axios.post('http://localhost:3000/BodyGallery/saveBodyComment', data, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        console.log(res.data);
        if(res.data === "Successfully Comment saved"){
          // 댓글 등록에 성공하면, 댓글 목록을 다시 불러옴
          findAllBodyComment();
        }else{
            alert("등록되지 않았습니다");
        }
      })
      .catch(function(err){
        alert(err);
      })
  };

  const renderComment = (comment) => {
    return (
      <Comment key={comment.id}>
        <Comment.Avatar src={`http://localhost:3000/images/profile/${localStorage.getItem('profile')}`} />
        <Comment.Content>
          <Comment.Author as='a'>{comment.nickname}</Comment.Author>
          <Comment.Metadata>
            <Moment fromNow>{comment.regdate}</Moment>
          </Comment.Metadata>
          <Comment.Text>{comment.cmtcontent}</Comment.Text>
          {isLoggedIn && parseInt(isLoggedIn) === comment.memberseq && (
            <Comment.Action onClick={() => handleDeleteComment(comment.commentseq)}>
              삭제
            </Comment.Action>
        )}
        </Comment.Content>
      </Comment>
    );
  };

  // 삭제 버튼 클릭 시 호출되는 함수
  const handleDeleteComment = (commentseq) => {
    axios.post(`http://localhost:3000/BodyGallery/deleteCommentWithoutReply/${commentseq}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        console.log(res.data);
        if(res.data === "Successfully Comment deleted"){
          // 댓글 삭제에 성공하면, 댓글 목록을 다시 불러옴
          findAllBodyComment();
        }else{
            alert("삭제되지 않았습니다");
        }
      })
      .catch(function(err){
        alert(err);
      })
  };

  const visibleComments = showAllComments ? commentList : commentList.slice(0, 5);
  const hiddenComments = showAllComments ? [] : commentList.slice(5);

  return (
    <Comment.Group>
      <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
        {visibleComments.map(renderComment)}
        {hiddenComments.length > 0 && (
          <Comment>
            <Comment.Content>
              <Comment.Action onClick={() => setShowAllComments(true)}>
                댓글 더보기
              </Comment.Action>
            </Comment.Content>
          </Comment>
        )}
      </div>
      <Form reply onSubmit={handleCommentSubmit}>
        <Form.TextArea
          placeholder='댓글을 작성하세요'
          value={comment}
          onChange={handleCommentChange}
        />
        <Button content='댓글 작성' labelPosition='left' icon='edit' primary />
      </Form>
    </Comment.Group>
  );
}

