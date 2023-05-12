import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../utils/CustomAxios';
import Moment from 'react-moment'; // npm i moment react-moment
import 'moment/locale/ko';

import { Viewer } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor-viewer.css';
import { CopyToClipboard } from "react-copy-to-clipboard"; // npm i react-copy-to-clipboard
import BbsComment from "./bbs/BbsComment.js";
import BbsDropdown from "./bbs/BbsDropdown";
import { shareKakao } from "../utils/shareKakao.js";
import MealRecommend from './Message/MealRecommend.js';

import styled from 'styled-components';
import { Divider, Icon, Loader } from 'semantic-ui-react';

import kakao from "../asset/btn_kakao.png";
import { Cookies } from 'react-cookie';

function ToastViewer() {
    let history = useNavigate();
    const cookies = new Cookies();

    const [memberseq, setMemberseq] = useState(0);
    const [detail, setDetail] = useState();
    const [loading, setLoading] = useState(false); // 데이터를 모두 읽어 들일 때까지 rendering을 조절하는 변수
    const [liking, setLiking] = useState(false);      // 로그인한 유저의 좋아요 여부
    const [likecount, setLikecount] = useState(0);  // 게시글의 좋아요 수
    const [bbstag, setBbstag] = useState(0);

    const { bbsseq } = useParams();
    const currentUrl = `http://localhost:9100/view/${bbsseq}`;

    useEffect(()=>{
      const s = localStorage.getItem("memberseq");
      if(s !== null) setMemberseq(s);

      // 오늘 해당 게시글을 조회했는지 쿠키로 확인
      if(cookies.get(bbsseq) === undefined) {
        detailData(bbsseq, true); // 첫 조회일 경우 조회수 up
        // 다음날 0시까지 쿠키 저장
        let d = new Date();
        cookies.set(bbsseq, 1, { 
          path: '/', 
          expires: new Date(d.getFullYear(), d.getMonth(), d.getDate()+1, 0, 0)
        });
      } else {
        detailData(bbsseq, false);
      }

      // 카카오톡 sdk 추가
      const script = document.createElement("script");
      script.src = "https://developers.kakao.com/sdk/js/kakao.js";
      script.async = true;
      document.body.appendChild(script);

      return () => document.body.removeChild(script);
    }, [bbsseq]);

    // 게시글 가져오기
    const detailData = async (seq, visit) => {
        await axios.get('http://localhost:3000/freebbsdetail', { params:{"bbsseq":seq, "memberseq":memberseq, "visit":visit} })
        .then((res) => {
          //console.log(JSON.stringify(res.data));

          if(res.data[0].del === 1) {
            alert("삭제된 글입니다.");
            history(-1);
          }
          setBbstag(res.data[0].bbstag);
          setDetail(res.data[0]);
          setLikecount(res.data[0].likecount);
          setLiking(res.data[0].liking);
  
          setLoading(true);   // 여기서 rendering해줌
        })
        .catch((error) => {
          alert(error);
        });
    }

    // 좋아요 기능
    const likeHandler = async () => {
      if(memberseq !== null && memberseq !== 0) {

        if(liking) {  // 좋아요 해제
          await axios.post('http://localhost:3000/unlikebbs', null, { params:{"bbsseq":bbsseq, "memberseq":memberseq} })
              .then(function(res){
                  // console.log(res.data);
                  setLikecount(likecount - 1);
                  setLiking(!liking);
              })
              .catch(function(err){
                  console.log(err);
              })
        } else {  // 좋아요 누름
          await axios.post('http://localhost:3000/likebbs', null, { params:{"bbsseq":bbsseq, "memberseq":memberseq} })
              .then(function(res){
                  // console.log(res.data);
                  setLikecount(likecount + 1);
                  setLiking(!liking);
              })
              .catch(function(err){
                  console.log(err);
              })
        }
      }
    };

    if(loading === false){
        return <Loader active />
    }

    return (
      <div>
        <div>
          <h3>{detail.title}</h3>
          <p>{detail.nickname}</p>
          <InfoSpan>
            <span>
              <Icon name='clock outline' />
              <Moment fromNow>{detail.wdate}</Moment>
            </span>
            <span>
              <Icon name='eye' />
              <span>{detail.readcount}</span>
            </span>
          
          <BbsDropdown bbsseq={bbsseq} memberseq={detail.memberseq} />
          </InfoSpan>
        </div><Divider />
        
        <div style={{ minHeight:'150px'}}>
        <Viewer
          initialValue={detail.content || ''} 
          // 유튜브를 보기 위한 설정(iframe)
          customHTMLRenderer={{
            htmlBlock: {
              iframe(node) {
                return [
                  {
                    type: "openTag",
                    tagName: "iframe",
                    outerNewLine: true,
                    attributes: node.attrs,
                  },
                  { type: "html", content: node.childrenHTML },
                  {
                    type: "closeTag",
                    tagName: "iframe",
                    outerNewLine: false
                  }
                ];
            }}
          }}
        /></div>

        <br/>
        {/* 11번 만 보이게 */}
        {bbstag === 11 && (
          <div>
            <MealRecommend detail={detail}/>
          </div>
        )}
        <br/>

        <div style={{ height:'35px', marginTop:'30px' }}>

          <span style={{ display:'inline-block', margin:'7.5px 0px'}}>
            <Icon name={liking ? 'thumbs up' : 'thumbs up outline'} onClick={likeHandler} style={{ cursor:'pointer'}} />
            {likecount}
          </span>
          
          <div style={{ float:'right' }}>
            <CopyToClipboard text={currentUrl} style={{ verticalAlign: "top"}}>
              <URLShareButton>URL</URLShareButton>
            </CopyToClipboard>
            
            <KakaoShareButton onClick={() => shareKakao(currentUrl, detail.title)}>
              <img alt='share to kakao' src={kakao} width={35} />
            </KakaoShareButton>

          </div>
        </div>

        <Divider />
        <BbsComment bbsseq={bbsseq} />
      </div>
    );
}
const InfoSpan = styled.span`
  color:#94969b;
  &>span {
    margin-right: 8px;
  }
  &>span>span {
    margin: 0 3px;
  }
`;
const URLShareButton = styled.button`
	width: 35px;
	height: 35px;
	color: white;
	border-radius: 24px;
	border: 0px;
  margin-right: 5px;
	font-weight: 700;
	font-size: 12px;
	cursor: pointer;
	background-color: #5271FF;
	&:hover {
		background-color: #9EBFFF;
	}
`;
const KakaoShareButton = styled.a`
  display: inline-block;
  width: 35px;
  cursor: pointer;
  &:hover {
    opacity: 0.5;
  }
`;
export default ToastViewer;