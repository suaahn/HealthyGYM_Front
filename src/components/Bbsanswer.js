import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
// import Session from "react-session-api";

import axios from 'axios';

function Bbsanswer(){
    let history = useNavigate();

    const [bbs, setBbs] = useState();
    const [loading, setLoading] = useState(false);

    let params = useParams();
    console.log(params.seq);

    const [seq] = useState(params.seq);
    const [id, setId] = useState('');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    
    const titleChange = (e) => setTitle(e.target.value);
    const contentChange = (e) => setContent(e.target.value);

    const bbsData = async(seq) => {
        const response = await axios.get('http://localhost:3000/getBbs', { params:{"seq":seq} });

        // console.log("bbs:" + JSON.stringify(response.data));
        setBbs(response.data);

        setLoading(true);   // 여기서 rendering 해 준다
    }

    useEffect(()=>{
        bbsData(params.seq); 

        // setId(Session.get("login").id); 
        let str = localStorage.getItem('login')        
        if(str !== null){
            let login = JSON.parse(str);
            setId(login.id);
        }else{
            alert('login해 주십시오');
            history('/login');
        }

    }, [params.seq, history])

    function answerBbs(){
        axios.post("http://localhost:3000/answerBbs", null, 
                    { params:{ "seq":seq, "id":id, "title":title, "content":content } })
             .then(res => {
                console.log(res.data);
                if(res.data === "YES"){
                    alert("추가 글이 성공적으로 등록되었습니다");
                    history('/bbslist');    // bbslist로 이동
                }else{
                    alert("등록되지 않았습니다");
                }
             })
             .catch(function(err){
                alert(err);
             })   
    }


    if(loading === false){
        return <div>Loading...</div>
    }

    return (
        <div>
            <h2>부모글</h2>

            <table border="1">
            <colgroup>
            <col width="200"/><col width="500"/>
            </colgroup>
            <tbody>
            <tr>
                <th>작성자</th>
                <td>{bbs.id}</td>
            </tr>
            <tr>
                <th>제목</th>
                <td>{bbs.title}</td>
            </tr>
            <tr>
                <th>작성일</th>
                <td>{bbs.wdate}</td>
            </tr>
            <tr>
                <th>조회수</th>
                <td>{bbs.readcount}</td>
            </tr>
            <tr>
                <th>내용</th>
                <td>
                    <textarea rows="10" cols="50" value={bbs.content} readOnly></textarea>
                </td>
            </tr>
            </tbody>
            </table>

            <h2>답글</h2>
            
            <table border="1">
            <colgroup>
                <col width="200"/><col width="500"/>
            </colgroup>
            <tbody>
            <tr>
                <th>아이디</th>
                <td>
                    <input type="text" size="50" value={id} readOnly/>
                </td>
            </tr>
            <tr>
                <th>제목</th>
                <td>
                    <input type="text" size="50" value={title} onChange={titleChange}/>
                </td>	
            </tr>
            <tr>
                <th>내용</th>
                <td>
                    <textarea rows="10" cols="50" value={content} onChange={contentChange}></textarea>
                </td>
            </tr>
            <tr>
                <td colSpan="2" align="center">
                    <input type="button" onClick={answerBbs} value="작성완료" />
                </td>
            </tr>
            </tbody>
            </table>            

        </div>
    );
}

export default Bbsanswer;