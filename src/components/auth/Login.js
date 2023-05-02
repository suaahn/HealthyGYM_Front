import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { Link, useNavigate } from 'react-router-dom';

import AuthenticationService from './AuthenticationService';

import kakao from '../../asset/btn_kakao_login.png';
import google from '../../asset/btn_google_signin.png'

export default function Login() {
    const history = useNavigate();

    const [id, setId] = useState('');
    const [pwd, setPwd] = useState('');

    const [cookies, setCookies] = useCookies('id');
    const [saveId, setSaveId] = useState(false);
    
    const idChange = (e) => setId(e.target.value);
    const pwdChange = (e) => setPwd(e.target.value);

    const checkHandler = () => {
        // alert(saveId);              
        setSaveId(!saveId);         
        if(!saveId === true && id !== ""){            
            setCookies("user_id", id);
        }else{            
            setCookies("user_id", '');
        }
    }

    const loginKakao = () => {
        const KAKAO_CLIENT_id = '42e83bbe9bdc554d4bdc9ef3a4dc7b8a';
        const KAKAO_REDIRECT_URL = 'http://localhost:9100/login/callback/kakao';
        const KAKAO_OAUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_id}&redirect_uri=${KAKAO_REDIRECT_URL}&response_type=code&prompt=login`;
        window.location.href = KAKAO_OAUTH_URL;
    }
    const loginGoogle = () => {
        const GOOGLE_CLIENT_id = '1087556149477-h0s5bq18kpqmk1ndd3vg3vbpkvf6vvn6.apps.googleusercontent.com';
        const GOOGLE_REDIRECT_URL = 'http://localhost:9100/login/callback/google';
        window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_id}&redirect_uri=${GOOGLE_REDIRECT_URL}&response_type=code&scope=email profile`;
    }

    function loginClicked() {
        AuthenticationService
        .executeJwtAuthenticationService(id, pwd)
        .then((res) => {
            //console.log(res.data);
            AuthenticationService.registerSuccessfulLoginForJwt(res.data.seq, 
                                                res.data.token.accessToken, 
                                                res.data.token.refreshToken);
            history('/');
        }).catch(() =>{
            alert('로그인 실패');
        });
    };
    
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
        <>
            <input type="email" value={id} onChange={idChange} placeholder="이메일" />
            <br/>
            <input type="password" value={pwd} onChange={pwdChange} placeholder="비밀번호" />
            <br/>
            <input type="checkbox" checked={saveId} onChange={checkHandler} />
            <label>아이디 저장</label>
            <br/>
            <button type="button" onClick={loginClicked}>로그인</button>
            
            <div>
                비밀번호 찾기
                <Link to="/signup">회원가입</Link>
            </div>

            <section>
                <div>SNS계정으로 간편 로그인/회원가입</div>
                <div>
                    <img src={google} alt='google' onClick={loginGoogle} width={300} />
                </div>
                <img src={kakao} alt='kakao' onClick={loginKakao}/>
                
            </section>
        </>
    );
}