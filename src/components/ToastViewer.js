import React, { useEffect, useState } from 'react';
import { Viewer } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor-viewer.css';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function ToastViewer() {
    let history = useNavigate();

    const [bbs, setBbs] = useState();
    const [loading, setLoading] = useState(false); // 데이터를 모두 읽어 들일 때까지 rendering을 조절하는 변수

    let params = useParams();
    console.log(params.seq);

    const bbsData = async(seq) => {
        const response = await axios.get('http://localhost:3000/freebbsdetail', { params:{"bbs_seq":seq} });

        console.log("bbs:" + JSON.stringify(response.data));
        setBbs(response.data);

        setLoading(true);   // 여기서 rendering 해 준다
    }

    useEffect(()=>{
        bbsData(params.seq);
    }, [params.seq])

    if(loading === false){
        return <div>Loading...</div>
    }

    return (
      <div>
        <h3>{bbs.title}</h3>
        <Viewer initialValue={bbs.content || ''} />
      </div>
    );
}

export default ToastViewer;