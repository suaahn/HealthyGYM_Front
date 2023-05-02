import React, { useEffect, useState } from 'react';
import axios from '../../utils/CustomAxios';

import CommentForm from './CommentForm';
import CommentDetail from './CommentDetail';

export default function BbsComment(props) {
    const [cmtList, setCmtList] = useState([]);

    const getComments = async() => {
        await axios.get('http://localhost:3000/freebbscomment', { params:{"bbsseq":props.bbsseq} })
            .then(function(res){
                console.log(JSON.stringify(res.data));
                setCmtList(res.data);
            })
            .catch(function(err){
                console.log(err);    
            })
    }
    // 비로그인 시 댓글 토글 막기

    useEffect(() => {
        getComments();
    }, []);

    return (
        <>
            <strong>댓글 {cmtList.length}</strong>
            <CommentForm bbsseq={props.bbsseq} getComments={getComments}/>
            
            <div>
                {cmtList.map(function(cmt, i) {
                    if(cmt.cmtdel === 0) {
                        return (
                            <CommentDetail key={i} data={cmt} getComments={getComments} />
                            );
                    } else {
                        return (
                            <div>작성자가 삭제한 댓글입니다.</div>
                        );
                    }
                })} 
            </div>
        </>
    );
}
