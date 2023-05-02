import React, { useState, useEffect } from 'react';
import { Button, Comment, Form } from 'semantic-ui-react';
import axios from "axios";

function MealComment(props) {
  const [memberseq, setMemberseq] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [showForm2, setShowForm2] = useState(false);
  const [commentcontent, setCommentcontent] = useState('');
  const [comments, setComments] = useState([]);
  const [commentcnt, setCommentcnt] = useState([]);


  
  const [showReplies, setShowReplies] = useState(false);


  




  useEffect(() => {
    const loadComments = async () => {
      const res = await axios.get("http://localhost:3000/getmealcomments", {
        params: { bbsseq: props.bbsdto.bbsseq, memberseq: memberseq },
      });
      const newComments = res.data;
      const newCommentcnt = props.commentcnt;
      setComments(newComments);
      setCommentcnt(newCommentcnt);
    };
    loadComments();
  }, [props.bbsdto.bbsseq]);

  const handleCommentClick = () => {
    setShowForm(true);
    setShowForm2(false);
  };

  const handleCancelClick = () => {
    setShowForm(false);
    setShowForm2(false);
    setCommentcontent("");
  };

  const toggleShowReplies = (commentSeq) => {
    setShowReplies(prevState => ({ ...prevState, [commentSeq]: !prevState[commentSeq] }));
  };


  

  // const handleReplyClick = () => {
  //   setShowForm2(true);
  // };

  const handleCommentSubmit = () => {
    const data = {
      bbsseq: props.bbsdto.bbsseq,
      memberseq: memberseq,
      commentcontent: commentcontent
    };
    axios
      .post("http://localhost:3000/wrtiemealcomment", data)
      .then(response => {
        if (response.data === "Success") {
          alert("댓글을 작성했습니다.");
          handleCancelClick();
          const newComment = {
            bbscommentdto: {
              commentseq: response.data.commentseq, // 새로운 댓글의 ID 
              cmtcontent: commentcontent,
              regdate: new Date().toISOString(),
              ref: 0
            },
            memberdto: {
              nickname: "Your Nickname" // 작성자의 닉네임 (필요한 정보로 변경해야함!!!!!!!!!)
            }
          };
          setComments(prevComments => [...prevComments, newComment]); // 새로운 댓글 추가
          setCommentcnt(prevCount => prevCount + 1); // 댓글 개수 상태 업데이트
          setCommentcontent(""); // 댓글 내용 초기화
        }
      })
      .catch(error => {
        console.log(error);
      });
  };
  

  const handleReplySubmit = (parentCommentId) => {
    const data = {
      bbsseq: props.bbsdto.bbsseq,
      memberseq: memberseq,
      commentcontent: commentcontent,
      ref: parentCommentId
    };
    // console.log(parentCommentId);
    axios
      .post("http://localhost:3000/wrtiemealcomment2", data)
      .then(response => {
        if (response.data === "Success") {
          alert("대댓글을 작성했습니다.");
          handleCancelClick();
          const newComment = {
            bbscommentdto: {
              commentseq: response.data.commentseq, // 새로운 댓글의 ID 
              cmtcontent: commentcontent,
              regdate: new Date().toISOString(),
              ref: parentCommentId
            },
            memberdto: {
              nickname: "Your Nickname" // 작성자의 닉네임 (필요한 정보로 변경해야함!!!!!!!!!)
            }
          };
          setComments(prevComments => [...prevComments, newComment]); // 새로운 댓글 추가
          setCommentcnt(prevCount => prevCount + 1); // 댓글 개수 상태 업데이트
          setCommentcontent(""); // 댓글 내용 초기화
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (
    
    <Comment.Group>
      <h4>댓글 &nbsp;{commentcnt}개</h4>
      {comments.map((comment, index) => (
        
        comment.bbscommentdto.ref === 0 && (
          <Comment key={index}>     
            <Comment.Avatar as='a' src='https://react.semantic-ui.com/images/avatar/small/joe.jpg' />
            <Comment.Content>
              <Comment.Author as='a'>{comment.memberdto.nickname}</Comment.Author>
              <Comment.Metadata>
                <div>{comment.bbscommentdto.regdate}</div>
              </Comment.Metadata>
              <Comment.Text>
                <p>{comment.bbscommentdto.cmtcontent}</p>
              </Comment.Text>
              <Comment.Actions>
                <Comment.Action onClick={() => setShowForm2(comment.bbscommentdto.commentseq)}>Reply</Comment.Action> 
                {comment.bbscommentdto.childcnt > 0 && (
                  <Comment.Action onClick={() => setShowReplies((prevShowReplies) => ({ ...prevShowReplies, [comment.bbscommentdto.commentseq]: !prevShowReplies[comment.bbscommentdto.commentseq] }))}>
                    {showReplies[comment.bbscommentdto.commentseq] ? "Hide Replies" : "Show Replies"}
                  </Comment.Action>
                )}
              </Comment.Actions>

                  {/* 대댓글 개수 */}
                  {comments.filter((subComment) => subComment.bbscommentdto.ref === comment.bbscommentdto.commentseq).length >0 && (
                    <div>
                        <button onClick={() => toggleShowReplies(comment.bbscommentdto.commentseq)}>
                          {showReplies[comment.bbscommentdto.commentseq] ? "답글 숨기기" : `답글 ${comments.filter((subComment) => subComment.bbscommentdto.ref === comment.bbscommentdto.commentseq).length} 개 모두보기`}
                        </button>


                        {showReplies[comment.bbscommentdto.commentseq] && (
                        <Comment.Group>
                          {comments.map((subComment, subIndex) => (
                            subComment.bbscommentdto.ref === comment.bbscommentdto.commentseq && (
                              <Comment key={subIndex}>
                                <Comment.Avatar as='a' src='https://react.semantic-ui.com/images/avatar/small/jenny.jpg' />
                                <Comment.Content>
                                  <Comment.Author as='a'>{subComment.memberdto.nickname}</Comment.Author>
                                  <Comment.Metadata>
                                    <div>{subComment.bbscommentdto.regdate}</div>
                                  </Comment.Metadata>
                                  <Comment.Text>
                                    <p>{subComment.bbscommentdto.cmtcontent}</p>
                                  </Comment.Text>
                                </Comment.Content>
                              </Comment>
                            )
                          ))}
                        </Comment.Group>
                      )}
                    </div>
                  )}
                 

              

              {showForm2 === comment.bbscommentdto.commentseq && (
                <Form reply onSubmit={() => handleReplySubmit(comment.bbscommentdto.commentseq)}>
                  <Form.TextArea value={commentcontent} onChange={(e) => setCommentcontent(e.target.value)} />
                  <Button content='Add Reply' labelPosition='left' icon='edit' primary />
                  <Button content='Cancel' labelPosition='right' icon='close' onClick={() => setShowForm2(false)} />
                </Form>
              )}
            </Comment.Content>
          </Comment>
        )
      ))}
  
      {!showForm && (
        <Comment>
          <Comment.Actions>
            <Comment.Action onClick={handleCommentClick}><b>댓글 작성하기...</b></Comment.Action> 
          </Comment.Actions>
        </Comment>
      )}  
  
      {showForm && ( // 댓글을 작성할 수 있는 폼을 보여줌
        <Form reply onSubmit={handleCommentSubmit}>
          <Form.TextArea value={commentcontent} onChange={(e) => setCommentcontent(e.target.value)} />
          <Button content='Add Comment' labelPosition='left' icon='edit' primary />
          <Button content='Cancel' labelPosition='right' icon='close' onClick={handleCancelClick} />
        </Form>
      )}
    </Comment.Group>
  );
}

  export default MealComment;