import React, { useState, useEffect } from 'react';
import { Button, Comment, Form, Dropdown } from 'semantic-ui-react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

function MealComment(props) {
  const [memberseq, setMemberseq] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showForm2, setShowForm2] = useState(false);
  const [commentcontent, setCommentcontent] = useState('');
  const [comments, setComments] = useState([]);
  const [commentcnt, setCommentcnt] = useState();

  const [loginnickname, setLoginnickname] = useState('');

  // console.log(props);

  
  


  
  const [showReplies, setShowReplies] = useState(false);

  const options = [
    { key: 'm', text: '댓글 관리', value: 'm' },
    { key: 'delete', text: '삭제', value: 'delete' },
  ]

  const handleCommentOptionChange = (comment, e, { value }) => {
    if (value === 'delete') {
      deleteComment(comment.bbscommentdto.commentseq);
    } 
  }
  

  const deleteComment = async (commentseq) => {
    // 삭제 처리 로직 구현
    
    // console.log(commentseq);

    const res = await axios.post("http://localhost:3000/deletemealcomment", {commentseq: commentseq});


    // console.log(res.data);
    if(res.data === "OK"){
      alert("삭제 되었습니다.");
      window.location.reload();
    }
  }

  let history = useNavigate();

  const getnickname = async (s) => {
    const res = await axios.get("http://localhost:3000/getnickname" , {
      params: { memberseq: s},
    });
    
    setLoginnickname(res.data);
  }

  useEffect(() => {

      

      // login 되어 있는지 검사하고 member_seq 얻기
      const s = parseInt(localStorage.getItem("memberseq"), 10);
      if (s !== null && !isNaN(s) && s !== "NaN") {
        //console.log(s);
          setMemberseq(s);
          // console.log(memberseq);
          getnickname(s);
      } 
      
    
      

      const loadComments = async () => {
        const res = await axios.get("http://localhost:3000/getmealcomments", {
          params: { bbsseq: props.bbsdto.bbsseq },
        });
        // console.log(res.data);
        const newComments = res.data;
        const newCommentcnt = props.commentcnt;
        setComments(newComments);
        setCommentcnt(newCommentcnt);
      };
      loadComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    const s = parseInt(localStorage.getItem("memberseq"), 10);
    // console.log(s);
    if (s === null || isNaN(s) || s === "NaN") {
      alert('로그인 후 댓글 작성이 가능합니다.');
      history('/login');
    } 

    const data = {
      bbsseq: props.bbsdto.bbsseq,
      memberseq: memberseq,
      commentcontent: commentcontent,
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
              nickname: `${loginnickname}`, // 작성자의 닉네임 
              profile: `${localStorage.getItem("profile")}` // 프로필 이미지 URL
            }            
          };
          // console.log(newComment.bbscommentdto);
          // console.log(newComment.bbscommentdto.commentseq);
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
    const s = parseInt(localStorage.getItem("memberseq"), 10);
    // console.log(s);
    if (s === null || isNaN(s) || s === "NaN") {
      alert('로그인 후 댓글 작성이 가능합니다.');
      history('/login');
    } 
    

    const data = {
      bbsseq: props.bbsdto.bbsseq,
      memberseq: memberseq,
      commentcontent: commentcontent,
      ref: parentCommentId
    };
    console.log(parentCommentId);
    console.log(data);
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
              nickname: `${loginnickname}`, // 작성자의 닉네임
              profile: `${localStorage.getItem("profile")}` // 프로필 이미지 URL
            }            
          };
          // console.log(newComment);
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
    
    <Comment.Group >
      <h4>댓글 &nbsp;{commentcnt}개</h4>
      {comments.map((comment, index) => (
        
        comment.bbscommentdto.ref === 0 && (
          <Comment key={index} style={{width:"840px"}}>     
            <Comment.Avatar as='a' src={`http://localhost:3000/images/profile/${comment.memberdto.profile}`} />
            <Comment.Content>
            <div style={{ width:"800px"}}>
              <Comment.Author as='a' href={`http://localhost:9100/userpage/${comment.memberdto.memberseq}/profile`}>{comment.memberdto.nickname} </Comment.Author>
              
              <Comment.Metadata>
              <div style={{ display: "flex", width: "700px", justifyContent: "space-between" }}>
                <div>{comment.bbscommentdto.regdate}</div>
                {memberseq === comment.bbscommentdto.memberseq && (
                  <Dropdown  floating inline options={options} defaultValue='m' onChange={(e, data) => handleCommentOptionChange(comment, e, data)}/>
                )}
                
              </div>

                
              </Comment.Metadata>
              </div>
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
                        <Button size='mini' onClick={() => toggleShowReplies(comment.bbscommentdto.commentseq)}>
                          {showReplies[comment.bbscommentdto.commentseq] ? "답글 숨기기" : `답글 ${comments.filter((subComment) => subComment.bbscommentdto.ref === comment.bbscommentdto.commentseq).length} 개 모두보기`}
                        </Button>


                        {showReplies[comment.bbscommentdto.commentseq] && (
                        <Comment.Group>
                          {comments.map((subComment, subIndex) => (
                            subComment.bbscommentdto.ref === comment.bbscommentdto.commentseq && (
                              <Comment key={subIndex}>
                                <Comment.Avatar as='a' src={`http://localhost:3000/images/profile/${subComment.memberdto.profile}`} />
                                <Comment.Content>
                                  <div style={{ width:"800px"}}>
                                  <Comment.Author as='a' href={`http://localhost:9100/userpage/${subComment.memberdto.memberseq}/profile`}>{subComment.memberdto.nickname}</Comment.Author>

                                  
                                  <Comment.Metadata>
                                  <div style={{ display: "flex", width: "650px", justifyContent: "space-between" }}>
                                      <div>{subComment.bbscommentdto.regdate}</div>
                                      {memberseq === subComment.bbscommentdto.memberseq && (
                                        <Dropdown  floating inline options={options} defaultValue='m' onChange={(e, data) => handleCommentOptionChange(subComment, e, data)}/>
                                      )}
                                  </div>
                                  </Comment.Metadata>
                                  </div>
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
                  <Form.TextArea value={commentcontent} onChange={(e) => setCommentcontent(e.target.value)} style={{width:"750px"}}/>
                  <Button content='대댓글 작성' labelPosition='left' icon='edit' primary />
                  <Button content='취소' labelPosition='right' icon='close' onClick={() => setShowForm2(false)} />
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
        <Form reply onSubmit={handleCommentSubmit} >
          <Form.TextArea value={commentcontent} onChange={(e) => setCommentcontent(e.target.value)} style={{width: '840px'}}/>
          <Button content='댓글 작성' labelPosition='left' icon='edit' primary />
          <Button content='취소' labelPosition='right' icon='close' onClick={handleCancelClick} />
        </Form>
      )}
    </Comment.Group>
    
  );
}

  export default MealComment;