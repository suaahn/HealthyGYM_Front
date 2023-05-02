import React, { useState } from 'react';
import Moment from 'react-moment'; // npm i moment react-moment
import 'moment/locale/ko';

import CommentForm from './CommentForm';
import commenticon from "../../asset/icon_comment.png";
import clockicon from "../../asset/icon_clock.png";

export default function CommentDetail(props){
    const [display, setDisplay] = useState(false);

    const handleReply = () => {
        if(localStorage.getItem("memberseq") == null) {
            alert('로그인 후 작성 가능합니다.');
            return;
        }
        setDisplay(!display);
    }
    return (
        <div>
            {/* <img src={props.data.profile} alt='' style={{ border-radius: '100%' }} /> */}
            <p>{props.data.nickname}</p>
            <p>{props.data.cmtcontent}</p>

            <span>
                <img alt='' src={clockicon} width={15} />
                <Moment fromNow>{props.data.regdate}</Moment>
            </span>
            
            {props.data.step===0?
                <span onClick={handleReply}>
                    <img alt='' src={commenticon} width={15} />
                    대댓글
                </span>
                :''
            }
            
            {display &&
                <CommentForm 
                    bbsseq={props.data.bbsseq} 
                    getComments={props.getComments}
                    commentseq={props.data.commentseq}
                    setDisplay={setDisplay} />
            }
            <hr/>
        </div>
    );
}
