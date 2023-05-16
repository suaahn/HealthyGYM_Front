import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Checkbox, Form } from 'semantic-ui-react';

import AuthenticationService from './AuthenticationService';

import { ReactComponent as Kakao } from '../../asset/logo_kakao.svg';
import { SocialButton, Description, LoginOtherSection } from './authStyle';
import google from '../../asset/logo_google2.png';
import gym from '../../asset/GYM.png';

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
    };

    const loginKakao = () => {
        const KAKAO_CLIENT_id = process.env.REACT_APP_KAKAO_CLIENT_ID;
        const KAKAO_REDIRECT_URL = process.env.REACT_APP_KAKAO_REDIRECT_URL;
        const KAKAO_OAUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_id}&redirect_uri=${KAKAO_REDIRECT_URL}&response_type=code&prompt=login`;
        window.location.href = KAKAO_OAUTH_URL;
    };
    const loginGoogle = () => {
        const GOOGLE_CLIENT_id = process.env.REACT_APP_GOOGLE_CLIENT_ID;
        const GOOGLE_REDIRECT_URL = process.env.REACT_APP_GOOGLE_REDIRECT_URL;
        window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_id}&redirect_uri=${GOOGLE_REDIRECT_URL}&response_type=code&scope=email profile`;
    };

    function loginClicked() {
        AuthenticationService
        .executeJwtAuthenticationService(id, pwd)
        .then((res) => {
            //console.log(res.data);
            if(res.data.token === "null") {
                alert("가입되지 않은 계정입니다.");
                return;
            }
            if(res.data.token === "deactivated") {
                alert("활동이 정지된 계정입니다.");
                return;
            }
            AuthenticationService.registerSuccessfulLoginForJwt(res.data.seq, res.data.profile, 
                                                                res.data.token.accessToken, 
                                                                res.data.token.refreshToken);
            history('/');
        }).catch((error) =>{
            let msg = "다시 로그인해주세요.";
            if (error.response && error.response.status === 401) {
                msg += "(" + error.response.message + ")";
            }
            localStorage.clear();
            alert(msg);
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
        <div style={{ width:'350px', margin:'20px auto', overflow:'hidden' }}>
            <img alt="건강해ZYM" src={gym} style={{ objectFit:'cover', transform:'scale(1.2)', width:"350px", height:'150px', margin: "0px auto", display: "block" }} />
            <Form size='large'>
                <Form.Field>
                    <input type="email" value={id} onChange={idChange} placeholder="이메일" />
                </Form.Field>
                <Form.Field>
                    <input type="password" value={pwd} onChange={pwdChange} placeholder="비밀번호" />
                </Form.Field>
            
                <Form.Field
                    control={Checkbox}
                    label='이메일 저장'
                    checked={saveId} onChange={checkHandler}
                />
                
                <Button size='large' id='login-button' onClick={loginClicked}>로그인</Button>
            </Form>
            
            <LoginOtherSection>

                <Link to="/password">비밀번호 재설정</Link>
                <span></span>
                <Link to="/signup">회원가입</Link>


                <Description style={{ margin:'35px 0 15px 0' }}>SNS계정으로 간편 로그인/회원가입</Description>
                <div>
                    <SocialButton onClick={loginGoogle}>
                        <img alt='' src={google} width={50}/>
                    </SocialButton>
                    <SocialButton onClick={loginKakao}>
                        <Kakao />
                    </SocialButton>
                </div>
                
            </LoginOtherSection>
        </div>
    );
}