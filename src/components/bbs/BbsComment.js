import React, { useEffect, useState } from 'react';
import axios from '../../utils/CustomAxios';

import CommentForm from './CommentForm';
import CommentDetail from './CommentDetail';
import { Divider } from 'semantic-ui-react';

export default function BbsComment(props) {
    const [cmtList, setCmtList] = useState([]);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    const getComments = async (page) => {
        //console.log(page);
        await axios.get('http://localhost:3000/freebbscomment', { params:{"bbsseq":props.bbsseq, "page":page} })
            .then(function(res){
                //console.log(JSON.stringify(res.data));
                setCmtList(prev => [...prev, ...res.data]);
                setHasMore(res.data.length === 10);
            })
            .catch(function(err){
                console.log(err);    
            })
    }

    useEffect(() => {
        setCmtList([]);
        getComments(0);
        setPage(0);
    }, []);

    return (
        <>
            <h4>댓글 {cmtList.length}</h4>
            <CommentForm bbsseq={props.bbsseq} getComments={getComments} setCmtList={setCmtList} setPage={setPage} />
            
            <div>
                {cmtList.map(function(cmt, i) {
                    if(cmt.cmtdel === 0) {
                        return (
                            <CommentDetail key={i} data={cmt} getComments={getComments} setCmtList={setCmtList} setPage={setPage} />
                            );
                    } else {
                        return (
                            <div key={i} className={cmt.step === 0 ? 'comment-box':'reply-box'} 
                                style={{ color:'#94969b', height:'70px', lineHeight:'42px'}}>
                                작성자가 삭제한 댓글입니다.
                            </div>
                        );
                    }
                })}
                {hasMore && 
                <div onClick={() => {setPage(page + 1); getComments(page + 1);}}
                    style={{ textAlign:'center', cursor:'pointer', marginTop:'14px'}}>
                    + 댓글 더보기
                    <Divider />
                </div>
                }
            </div>
        </>
    );
}
