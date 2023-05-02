import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";

import { Icon, Popup, Card, Input, Dropdown } from 'semantic-ui-react'
import { Viewer } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor-viewer.css';
import clockicon from "../../asset/icon_clock.png";
// import doticon from "../../asset/icon_dot.png";
import likeicon from "../../asset/icon_like.png";
import likefilledicon from "../../asset/icon_like_filled.png";
import comment from "../../asset/icon_comment.png";
import MealDropDown from "./MealDropdown";
import MealComment from "./MealComment";

import "./MealViews.css";




/*
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
*/

function MealViews() {
  let history = useNavigate();

  const [memberseq, setMemberseq] = useState(1);  // 로그인 아이디로 세팅해야함!!!

  const [currentPage, setCurrentPage] = useState(0);
  const [posts, setPosts] = useState([]);
  // const [view, setView] = useState(false); 

  const [loading, setLoading] = useState(false);

  const options = [
    { key: 'all', text: '전체보기', value: 'all' },
    { key: 'follow', text: '팔로잉한 유저만 보기', value: 'follow' },
    { key: 'title', text: '제목', value: 'title'},
    { key: 'author', text: '닉네임', value: 'author' },
    { key: 'content', text: '내용', value: 'content' },
  ];

  const [search, setSearch] = useState(''); // 검색어 상태
  const [select, setSelect] = useState('all'); // 선택 옵션 상태

  



  // const [isModalOpen, setIsModalOpen] = useState(false);

  // const openModal = () => setIsModalOpen(true);
  // const closeModal = () => setIsModalOpen(false);




  const styleLink = document.createElement("link");
  styleLink.rel = "stylesheet";
  styleLink.href = "https://cdn.jsdelivr.net/npm/semantic-ui/dist/semantic.min.css";
  document.head.appendChild(styleLink);



  useEffect(() => {
    const loadPosts = async () => {

      setLoading(true); // 호출 시작을 나타내는 상태 값 설정
      console.log('Search:', search);
      console.log('Select:', select);
      const res = await axios.get("http://localhost:3000/posts", {
        params: { page: currentPage, limit: 5, memberseq:memberseq, search:search, select:select },
        
      });
       console.log(res);
      // console.log(res.data[0].fooddto.length);
      const newPosts = res.data;
      setPosts((prevPosts) => [...prevPosts, ...newPosts]);
    };
    loadPosts();
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const handleScroll = () => {
    if(loading === false){
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;

    if (scrollTop + clientHeight >= scrollHeight - 5 && posts.length) {
      setCurrentPage((prevPage) => prevPage + 1);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }
  }
  else{
    
  }

  };

  const handleSearch = async () => {
    setCurrentPage(0); // 페이지 초기화
    setPosts([]); // 게시물 초기화
    
    setLoading(true); // 호출 시작을 나타내는 상태 값 설정
    // console.log('Search:', search);
    // console.log('Select:', select);
    const res = await axios.get("http://localhost:3000/posts", {
      params: { page: 0, limit: 5, memberseq: memberseq, search:search, select:select },
    });
    console.log(res);
    const newPosts = res.data;
    setPosts([...newPosts]);
    setLoading(false);
  };
  
  const handleSelect = (event, data) => {
    setSelect(data.value); // 선택 옵션 상태 업데이트
    
  };
  



  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [posts]);


  // 백엔드 구현 끝. 렌더링해주는 작업 필요.
  const likeHandler = async (bbsseq) => {
    try {
      const res = await axios.post(
        "http://localhost:3000/likemealpost",
        null,
        { params: { bbsseq: bbsseq, memberseq: memberseq } }
      );
      // console.log(res);
  
      // 좋아요 수 업데이트
      setPosts(prevPosts => {
        return prevPosts.map(prevPost => {
          if (prevPost.bbsdto.bbsseq === bbsseq) {
            const islike = !prevPost.islike;
            const likecount = prevPost.bbsdto.likecount + (islike ? 1 : -1);
            return { ...prevPost, islike, bbsdto: { ...prevPost.bbsdto, likecount } };
          }
          return prevPost;
        });
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleWriteClick = () => {
    history("/meallist");
    // console.log("클릭");
  };

  const handleUpperClick = () => {
    window.scrollTo(0, 0);
  };

  // const handleShowAllClick = () => {
  //   setListstate(1);
  //   setCurrentPage(0); // 페이지 초기화
  //   setPosts([]); // 게시물 초기화
  // };
  
  // const handleFollowingUsersOnlyClick = () => {
  //   setListstate(2);
  //   setCurrentPage(0); // 페이지 초기화
  //   setPosts([]); // 게시물 초기화
  // };


  

  return (
    <div>
    <Input
      action={
        <Dropdown
          button
          basic
          floating
          options={options}
          defaultValue='all'
          onChange={handleSelect} // 선택 옵션 변경 시 상태 업데이트
        />
      }
      icon='search'
      iconPosition='left'
      placeholder='Search...'
      value={search}
      onChange={(event, data) => setSearch(data.value)} // 검색어 입력 시 상태 업데이트
      onKeyDown={(event) => {
        if (event.key === 'Enter') {
          handleSearch(); // 엔터 키를 누르면 검색 수행
        }
      }}
    />
    <br/><br/><br/>
  

        <div className="write-button-container" onClick={handleWriteClick}>
          <Popup trigger={<Icon size='large' circular name='edit' />} wide='very'>
            <div >
              회원 여러분들만의 식단 레시피를 공유해주세요!!
            </div>
          </Popup>
        </div>
          
          <div className="upper-button-container" onClick={handleUpperClick}>
          <Popup trigger={<Icon size='large' circular name='arrow up' />} wide='very'>
            <div >
              맨 위로 이동하기
            </div>
          </Popup>
        </div>
  


       {posts.map((post, index) => (
        <div key={`${post.id}-${index}`} className="post">
          <div>
          <h2>{post.bbsdto.title}</h2>
          {/* 게시물 작성자의 프로필 이미지 불러오기 추가해야함. */}
          <p>{post.bbsdto.nickname}</p>

          <span style={{ whiteSpace: "nowrap" }}>
            <img alt="clock" src={clockicon} width="15" />
            {post.bbsdto.wdate}
          </span>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;


          {/* 로그인 유저 닉네임과 동일한 경우에만 수정 삭제 가능하도록. 확인검사해야함.*/}
          <MealDropDown bbsdto={post.bbsdto}/>
          {/* 신고 기능도 있으면 좋겠네요. */}



          </div><hr/>



          <Viewer initialValue={post.bbsdto.content || ''} />

          <br/><br/>
          
          

          {post.fooddto.length > 0 ? (




            <div>
              <h4>Food List</h4>
              <Card.Group>
                {post.fooddto.map((food, index) => (
                  <Card key={`${food.bbsseq}-${index}`} style={{ marginBottom: '1em' }}>
                    <Card.Content>
                      <Card.Header>{food.desckor}</Card.Header>
                      <Card.Meta>
                        <div>
                          <strong>1회 제공량:</strong> {food.servingwt}g
                        </div>
                        <div>
                          <strong>열량:</strong> {food.nutrcont1}kcal
                        </div>
                        <div>
                          <strong>탄수화물:</strong> {food.nutrcont2}g
                        </div>
                        <div>
                          <strong>단백질:</strong> {food.nutrcont3}g
                        </div>
                        <div>
                          <strong>지방:</strong> {food.nutrcont4}g
                        </div>
                      </Card.Meta>
                      {/* <Card.Description>
                        Matthew is a pianist living in Nashville.
                      </Card.Description> */}
                    </Card.Content>
                  </Card>
                ))}
              </Card.Group>

            </div>
          ) : null}

          <br/><br/>
          {/* 좋아요 */}
          <span>
          {post.islike ?
            <img alt="thumb" src={likefilledicon} width="15" onClick={() => likeHandler(post.bbsdto.bbsseq)} /> 
            : 
            <img alt="thumb" src={likeicon} width="15" onClick={() => likeHandler(post.bbsdto.bbsseq)} />
          }
          &nbsp;&nbsp;
          {post.bbsdto.likecount}
          </span>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

          {/* 코멘트 개수 */}
          <span>
          <img alt="clock" src={comment} width="15" />
          &nbsp;&nbsp;
          {post.commentcnt}
          </span>

          <br /><br />
          <hr />

          
          {/* 댓글 삭제만 구현하려고해요.. */}
          <MealComment bbsdto={post.bbsdto} commentcnt={post.commentcnt}/>
          


          
          <br /><br /><br />

          

        </div>
      ))}


    </div>
  );
}

export default MealViews;