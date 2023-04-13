import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import axios from 'axios';

// import Session from "react-session-api";

function BbsWrite(){

    let history = useNavigate();

    const [id, setId] = useState('');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    // login 되어 있는지 검사
    useEffect(()=>{
        // let login = Session.get("login");
        let str = localStorage.getItem('login')        
        if(str !== null){
            let login = JSON.parse(str);
            setId(login.id);
        }else{
            alert('login해 주십시오');
            history('/login');
        }
    }, [history]);    

    const idChange = (e) => setId(e.target.value);
    const titleChange = (e) => setTitle(e.target.value);
    const contentChange = (e) => setContent(e.target.value);

    

    const writeBbs = () => {
        if(title === undefined || title.trim() === ''){
            alert('제목을 입력해 주십시오');
            return;
        }

        axios.post("http://localhost:3000/bbswrite", null, 
                    { params:{ "id":id, "title":title, "content":content } })
             .then(res => {
                console.log(res.data);
                if(res.data === "YES"){
                    alert("성공적으로 등록되었습니다");
                    history('/bbslist');    // bbslist로 이동
                }else{
                    alert("등록되지 않았습니다");
                }
             })
             .catch(function(err){
                alert(err);
             })   
    }

    return (
        <div>
            <table className="table table-sm">
            <colgroup>
                <col width="100px"/><col width="500px"/>
            </colgroup>
            <tbody>
            <tr>
                <th>아이디</th>
                <td>
                    <input type="text" value={id} onChange={idChange} className="form-control form-control-lg" />
                </td>
            </tr>
            <tr>
                <th className="align-middle">제목</th>
                <td>
                    <input type="text" value={title} onChange={titleChange} size="50px" className="form-control form-control-lg" placeholder="제목기입"/>
                </td>
            </tr>
            <tr>	
                <td colSpan="2">
                    <textarea rows="18" value={content} onChange={contentChange} className="form-control" placeholder="내용기입"></textarea>
                </td>
            </tr>
            <tr>
                <td colSpan="2" align="right" style={{ paddingTop:"20px" }}>
                    <button type="button" onClick={()=>writeBbs()} className="btn btn-primary">글작성 완료</button>
                </td>
            </tr>
            </tbody>
            </table>
        </div>
    )
}

export default BbsWrite;

