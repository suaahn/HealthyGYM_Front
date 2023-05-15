import React, { useState, useEffect } from 'react';
import { Button, Comment, Form } from 'semantic-ui-react';
import axios from 'axios';
import Moment from 'react-moment';
import 'moment/locale/ko';

export default function BodyGalleryComment(props) {
  const [showAllComments, setShowAllComments] = useState(false);
  const [commentList, setCommentList] = useState([]);
  const [comment, setComment] = useState('');
  const [reply, setReply] = useState('');
  const [showReplyForm, setShowReplyForm] = useState(false);

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
    findAllBodyComment();
  }, []);

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleReplyChange = (e) => {
    setReply(e.target.value);
  };

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

  const handleReplySubmit = (e) => {
    e.preventDefault();
    const data = {
      memberseq: props.memberseq,
      bbsseq: props.bbsseq,
      commentseq: props.commentseq,
      profile: props.profile,
      nickname: props.nickname,
      cmtcontent: reply 
    };
    axios.post('http://localhost:3000/BodyGallery/saveBodyReply', data, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        console.log(res.data);
        if(res.data === "Successfully Reply saved"){
          // 답글 등록에 성공하면, 댓글 목록을 다시 불러옴
          findAllBodyComment();
          }else{
            alert("등록되지 않았습니다");
        }
      })
      .catch(function(err){
        alert(err);
      })
  };

  const renderComment = (comment) => (
    <Comment key={comment.id}>
      <Comment.Avatar src={`http://localhost:3000/images/profile/${localStorage.getItem('profile')}`} />
      <Comment.Content>
        <Comment.Author as='a'>{comment.nickname}</Comment.Author>
        <Comment.Metadata>
          <Moment fromNow>{comment.regdate}</Moment>
        </Comment.Metadata>
        <Comment.Text>{comment.cmtcontent}</Comment.Text>
        <Comment.Actions>
          <Comment.Action onClick={() => setShowReplyForm(!showReplyForm)}>
            Reply
          </Comment.Action>
        </Comment.Actions>
        {showReplyForm && (
          <Form reply onSubmit={handleReplySubmit}>
            <Form.Input
              placeholder='답글을 작성하세요'
              value={reply}
              onChange={handleReplyChange}
            />
            <Button content='Add Reply' labelPosition='left' icon='edit' primary />
          </Form>
        )}
        {comment.replies && (
          <Comment.Group>
            {comment.replies.map((comment) => (
              <Comment key={comment.id}>
                <Comment.Avatar src={`http://localhost:3000/images/profile/${localStorage.getItem('profile')}`} />
                <Comment.Content>
                  <Comment.Author as='a'>{comment.nickname}</Comment.Author>
                  <Comment.Metadata>
                    <div>{comment.regdate}</div>
                  </Comment.Metadata>
                  <Comment.Text>{comment.cmtcontent}</Comment.Text>
                </Comment.Content>
              </Comment>
            ))}
          </Comment.Group>
        )}
      </Comment.Content>
    </Comment>
  );

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
        <Button content='Add Comment' labelPosition='left' icon='edit' primary />
      </Form>
    </Comment.Group>
  );
}

