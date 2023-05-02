import { useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Cookies } from 'react-cookie';

import AuthenticationService from './AuthenticationService';

// 소셜 로그인
export default function LoginCallback() {
    const history = useNavigate();
    const cookies = new Cookies();

    const { provider } = useParams();
    //console.log(provider);
    const code = new URL(window.location.href).searchParams.get("code");

    useEffect(() => {
        axios.get(`http://localhost:3000/auth/${provider}`, { params: {"code":code} })
        .then(function(res){
            console.log(res.data);

            if (res.data.provider === provider) {

                AuthenticationService.registerSuccessfulLoginForJwt(res.data.seq,
                                                    res.data.token.accessToken, 
                                                    res.data.token.refreshToken);
                history("/");
            } else {
                const provider = res.data.provider;
                alert(provider, "로 가입된 이메일입니다.");
                history("/");
            }
        }).catch(function(err){
            alert(err);
        });
    }, []);

    
    return (
        <>
            <div>Loading</div>
        </>
    );

}