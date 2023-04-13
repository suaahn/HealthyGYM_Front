import React, { useEffect, useState } from "react";

import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

import axios from "axios";

function Login(){
    const history = useNavigate();

    const [id, setId] = useState('');
    const [pwd, setPwd] = useState('');

    const [cookies, setCookies] = useCookies('id');
    const [saveId, setSaveId] = useState(false);

    const idChange = (e) => setId(e.target.value);
    const pwdChange = (e) => setPwd(e.target.value);

    const checkHandler = () => {
        // alert(saveId);              
        setSaveId(!saveId); // true => false, false => true            
        if(!saveId === true && id !== ""){            
            setCookies("user_id", id);
        }else{            
            setCookies("user_id", '');
        }
    }

    function login(){
        axios.post("http://localhost:3000/login", null, {params:{'id':id, 'pwd':pwd}})
            .then(function(res){
                // alert(res.data);
                if(res.data !== null && res.data !== ""){
                    alert('환영합니다');
                    
                    // Session.set("login", res.data);
                    localStorage.setItem("login", JSON.stringify(res.data));
                    history('/bbswrite');
                }else{
                    alert('id나 password를 확인해 주십시오');
                }
            })
            .catch(function(err){
                alert(err);
            })
    }

    useEffect(()=>{
        let user_id = cookies.user_id;
        if(user_id !== undefined && user_id !== ""){
            setId(user_id);
            setSaveId(true);
        }else{
            setId('');
            setSaveId(false);
        }
    }, [cookies]);


    return (
        <div style={{height: '50vh'}}>       
            <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-4">   
                    
                <div className="d-flex flex-row align-items-center justify-content-center justify-content-lg-start">
                    <p className="lead fw-normal mb-0 me-3">Sign in with</p>            
                </div>
            
                <div className="divider d-flex align-items-center my-4">
                    <p className="text-center fw-bold mx-3 mb-0">Or</p>
                </div>                        
                
                <div className="form-outline mb-3">
                    <input type="text" value={id} onChange={idChange} className="form-control form-control-lg" placeholder="Enter a valid id" />
                    <label className="form-label" htmlFor="form3Example3">Id</label>
                </div>                        
                
                <div className="form-outline mb-3">
                    <input type="password" value={pwd} onChange={pwdChange} className="form-control form-control-lg" placeholder="Enter password" />
                    <label className="form-label" htmlFor="form3Example4">Password</label>
                </div>
                
                <div className="d-flex justify-content-between align-items-center">                            
                    <div className="form-check mb-0">
                    <input className="form-check-input me-2" type="checkbox" checked={saveId} onChange={checkHandler} />
                    <label className="form-check-label" htmlFor="form2Example3">
                        Remember me
                    </label>
                    </div>
                    <a href="#!" className="text-body">Forgot password?</a>
                </div>
                    
                <div className="text-center text-lg-start mt-4 pt-2">        
                    <button onClick={login} className="btn btn-primary btn-lg">Login</button>
                    <p className="small fw-bold mt-2 pt-1 mb-0">Don't have an account? 
                    &nbsp;<a href="/regi" className="link-danger">Register</a> 
                    </p>
                </div>                        
            </div>              
        </div>
    );
}

export default Login;