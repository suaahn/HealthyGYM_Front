import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Regi(){
    let history = useNavigate();

    const [id, setId] = useState('');
    const [pwd, setPwd] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const idChange = (e) => setId(e.target.value);
    const pwdChange = (e) => setPwd(e.target.value);
    const nameChange = (e) => setName(e.target.value);
    const emailChange = (e) => setEmail(e.target.value);

    function idChkBtn(){
        axios.post("http://localhost:3000/idcheck", null, { params:{ "id":id } })
             .then(function(res){
                if(res.data === 'YES'){
                    alert('이 아이디는 사용할 수 있습니다');
                }else{
                    alert('사용중인 아이디입니다');
                    setId('');
                }
             })
             .catch(function(err){
                alert(err);
             })
    }

    function account(){
        axios.post("http://localhost:3000/addmember", null, { params:{'id':id, 'pwd':pwd, 'name':name, 'email':email} })
             .then(function(res){
                if(res.data === "YES"){
                    alert('정상적으로 가입되었습니다');
                    history('/login');
                }else{
                    alert('다시 가입해 주십시오');
                }
             })
             .catch(function(err){
                alert(err);
             })
    }

    return (
        <div className='col-md-8 col-lg-6 col-xl-4 offset-xl-4'>            

            <h4 className="card-title mt-3 text-center">회원가입</h4>	

            <div className="form-group input-group">
                <div className="input-group-prepend">
                    <span className="input-group-text"> <i className="fa fa-user"></i> </span>
                </div>
                <input type="text" value={id} className="form-control" placeholder="id" onChange={idChange}/>   
                
            </div> 

            <div className="form-group input-group">
                <button type="button" onClick={()=>idChkBtn()} className="btn btn-danger">id check</button> 
                <p id="idcheck"></p> 
            </div>    
                
            <div className="form-group input-group">
                <div className="input-group-prepend">
                    <span className="input-group-text"> <i className="fa fa-user"></i> </span>
                </div>
                <input value={name} className="form-control" placeholder="Full name" type="text" onChange={nameChange}/>
            </div> 

            <div className="form-group input-group">
                <div className="input-group-prepend">
                    <span className="input-group-text"> <i className="fa fa-envelope"></i> </span>
                </div>
                <input value={email} className="form-control" placeholder="Email address" type="email" onChange={emailChange}/>
            </div> 

            <div className="form-group input-group">
                <div className="input-group-prepend">
                    <span className="input-group-text"> <i className="fa fa-phone"></i> </span>
                </div>
                <select className="custom-select" defaultValue='0'>
                    <option value="0">+02</option>
                    <option value="1">+032</option>
                    <option value="2">+041</option>
                    <option value="3">+053</option>
                </select>
                <input name="" className="form-control" placeholder="Phone number" type="text"/>
            </div> 
            <div className="form-group input-group">
                <div className="input-group-prepend">
                    <span className="input-group-text"> <i className="fa fa-building"></i> </span>
                </div>
                <select className="form-control" defaultValue='J'>
                    <option value='J'>직업</option>
                    <option value='D'>디자이너</option>
                    <option value='P'>프로그래머</option>
                    <option value="B">자영업</option>
                </select>
            </div> 
            <div className="form-group input-group">
                <div className="input-group-prepend">
                    <span className="input-group-text"> <i className="fa fa-lock"></i> </span>
                </div>
                <input value={pwd} className="form-control" placeholder="Create password" type="password" onChange={pwdChange}/>
            </div> 

            <div className="form-group input-group">
                <div className="input-group-prepend">
                    <span className="input-group-text"> <i className="fa fa-lock"></i> </span>
                </div>
                <input className="form-control" placeholder="Repeat password" type="password"/>
            </div> 
                                                
            <div className="form-group">
                <button onClick={account} className="btn btn-primary btn-block"> Create Account  </button>
            </div> 
            <p className="text-center">Have an account? <a href="/login">Log In</a> </p>       
                
        </div>
    )
}

export default Regi;