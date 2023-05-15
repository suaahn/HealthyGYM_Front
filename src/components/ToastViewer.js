import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from '../utils/CustomAxios';
import Moment from 'react-moment'; // npm i moment react-moment
import 'moment/locale/ko';

import { Viewer } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor-viewer.css';
import { CopyToClipboard } from "react-copy-to-clipboard"; // npm i react-copy-to-clipboard
import { Cookies } from 'react-cookie';
import BbsComment from "./bbs/BbsComment.js";
import BbsDropdown from "./bbs/BbsDropdown";
import { shareKakao } from "../utils/shareKakao.js";
import MealRecommend from './Message/MealRecommend.js';

import { Divider, Icon, Loader } from 'semantic-ui-react';
import { InfoSpan, KakaoShareButton, URLShareButton } from './bbs/bbsStyle';
import kakao from "../asset/btn_kakao.png";
import { ProfileDiv } from './health/healthStyle';

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
        detailData(bbsseq, s, true); // 첫 조회일 경우 조회수 up
        // 다음날 0시까지 쿠키 저장
        let d = new Date();
        cookies.set(bbsseq, 1, { 
          path: '/', 
          expires: new Date(d.getFullYear(), d.getMonth(), d.getDate()+1, 0, 0)
        });
      } else {
        detailData(bbsseq, s, false);
      }

      // 카카오톡 sdk 추가
      const script = document.createElement("script");
      script.src = "https://developers.kakao.com/sdk/js/kakao.js";
      script.async = true;
      document.body.appendChild(script);

      return () => document.body.removeChild(script);
    }, [bbsseq]);

    // 게시글 가져오기
    const detailData = async (seq, memberseq, visit) => {
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
          <ProfileDiv>
              <Link to={`/userpage/${detail.memberseq}/profile`}>
              <img
                  src={`http://localhost:3000/images/profile/${detail.profile}`}
                  alt="프로필"
                  width="30"
                  height="30"
              />
              <span style={{ fontWeight:'400'}}>{detail.nickname}</span>
              </Link>
          </ProfileDiv>
          
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

export default ToastViewer;