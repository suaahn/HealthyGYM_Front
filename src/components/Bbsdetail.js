import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from 'axios';

import "./Bbsdetail.css";

function Bbsdetail(){
    let history = useNavigate();

    const [bbs, setBbs] = useState();

    // 데이터를 모두 읽어 들일 때까지 rendering을 조절하는 변수
    const [loading, setLoading] = useState(false);

    let params = useParams();
    console.log(params.seq);

    const bbsData = async(seq) => {
        const response = await axios.get('http://localhost:3000/getBbs', { params:{"seq":seq} });

        // console.log("bbs:" + JSON.stringify(response.data));
        setBbs(response.data);

        setLoading(true);   // 여기서 rendering 해 준다
    }

    useEffect(()=>{
        bbsData(params.seq);
    }, [params.seq])

    if(loading === false){
        return <div>Loading...</div>
    }
    
    const answerBbs = () => {        
        history("/bbsanswer/" + bbs.seq);
    }

    const updateBbs = () => {
        history("/bbsupdate/" + bbs.seq);
    }

    // login한 id와 작성자 id와 같을 시에는 버튼을 보여준다
    function UpdateButtonLoad(){
        let str = localStorage.getItem('login');
        let login = JSON.parse(str);

        if(login.id !== bbs.id){
            return ""
        }
        return (
            <span>
                &nbsp;<button type="button" onClick={updateBbs} className="btn btn-primary">글 수정</button>
            </span>                        
        )
    }

    return (
        <div>
            <table className="table table-striped table-sm">
            <colgroup>
                <col style={{width: '150px'}}/>
                <col style={{width: '500px'}}/>
            </colgroup>
            <tbody>
            <tr>
                <th>작성자</th>
                <td style={{ textAlign:"left" }}>{bbs.id}</td>
            </tr>

            <tr>
                <th>작성일</th>
                <td style={{ textAlign:"left" }}>{bbs.wdate}</td>
            </tr>
            <tr>
                <th>조회수</th>
                <td style={{ textAlign:"left" }}>{bbs.readcount}</td>
            </tr>
            <tr>	
                <td colSpan="2" style={{ fontSize:'22px', fontWeight: 'bold', textAlign:"left" }}>{bbs.title}</td>
            </tr>
            <tr>	
                <td colSpan="2" style={{ backgroundColor:'white' }}>
                    <pre id="content" style={{ fontSize:'20px', fontFamily:'고딕, arial', backgroundColor:'white', textAlign:"left" }}>{bbs.content}</pre>
                </td>
            </tr>
            </tbody>
            </table>

            <button type="button" onClick={answerBbs} className="btn btn-primary">답글작성</button>

            <UpdateButtonLoad />

        </div>
    )
}

export default Bbsdetail;

