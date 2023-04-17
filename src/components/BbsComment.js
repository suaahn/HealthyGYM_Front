import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function BbsComment(props) {
    const [cmtlist, setCmtlist] = useState([]);

    const commentData = async() => {
        await axios.get('http://localhost:3000/freebbscomment', { params:{"bbsseq":props.bbsseq} })
            .then(function(res){
                console.log(JSON.stringify(res.data));
                setCmtlist(res.data);
            })
            .catch(function(err){
                console.log(err);    
            })

    }

    useEffect(() => {
        commentData();
    }, []);

    return (
        <div>
            <h3>댓글 {cmtlist.length}</h3>

            <div>
                {
                    cmtlist.map(function(cmt, i){
                        return (
                            <CmtDetail data={cmt} key={i} />
                        )
                    })
                } 
            </div>

        </div>
    );
}

function CmtDetail(props){
    return (
        <div>
            <p>{props.data.nickname}</p>
            <p>{props.data.cmtcontent}</p>
        </div>
    );
}
