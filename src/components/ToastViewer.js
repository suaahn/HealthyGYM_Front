import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

import { Viewer } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor-viewer.css';

import BbsComment from "./BbsComment.js";

import clockicon from "../asset/icon_clock.png";
import readicon from "../asset/icon_readcount.png";
import doticon from "../asset/icon_dot.png";
import likeicon from "../asset/icon_like.png";
import likefilledicon from "../asset/icon_like_filled.png";
import commenticon from "../asset/icon_comment.png";

function ToastViewer() {
    let history = useNavigate();

    const [memberseq, setMemberseq] = useState(1);  // 로그인 아이디로 세팅해야함!!!
    const [detail, setDetail] = useState();
    const [loading, setLoading] = useState(false); // 데이터를 모두 읽어 들일 때까지 rendering을 조절하는 변수
    const [like, setLike] = useState(false);      // 로그인한 유저의 좋아요 여부
    const [likecount, setLikecount] = useState(0);  // 게시글의 좋아요 수

    let params = useParams();
    console.log(params.seq);

    const detailData = async(seq) => {
        const response = await axios.get('http://localhost:3000/freebbsdetail', { params:{"bbsseq":seq} });

        console.log(JSON.stringify(response.data));
        setDetail(response.data[0]);
        setLikecount(response.data[0].likecount);
        // setLike();

        setLoading(true);   // 여기서 rendering해줌
    }

    useEffect(()=>{
        detailData(params.seq);
    }, [params.seq])

    const likeHandler = async() => {
      if(like) {

      } else {
        await axios.get('http://localhost:3000/likebbs', { params:{"bbsseq":params.seq, "memberseq":memberseq} })
            .then(function(res){
                console.log(res.data);
                // setLikecount(likecount + 1);
                // setLike(!like);
            })
            .catch(function(err){
                console.log(err);
            })
      }
    }

    if(loading === false){
        return <div>Loading...</div>
    }

    return (
      <div>
        <div>
          <h3>{detail.title}</h3>
          <p>{detail.nickname}</p>
          <span>
            <img alt="clock" src={clockicon} width="15"/>
            {detail.wdate}
          </span>
          <span>
            <img alt="eye" src={readicon} width="15"/>
            {detail.readcount}
          </span>
          <span><img alt="dot" src={doticon} width="15"/></span>
        </div><hr/>

        <Viewer initialValue={detail.content || ''} />

        <span>
          {like?
          <img alt="thumb" src={likefilledicon} width="15" onClick={likeHandler}/>
          :<img alt="thumb" src={likeicon} width="15" onClick={likeHandler}/>}
          
          {likecount}
        </span>

        <hr/>
        <BbsComment bbsseq={params.seq} />
      </div>
    );
}

export default ToastViewer;