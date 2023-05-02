import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import AuthEmail from "./AuthEmail";

export default function Signup() {
    const [email, setEmail] = useState('');
    const [domain, setDomain] = useState('');
    const [domainIndex, setDomainIndex] = useState(0);
    const [emailMsg, setEmailMsg] = useState('');
    const [mailKey, setMailKey] = useState('');         // 이메일 인증코드
    const [isLoading, setIsLoading] = useState(false);  // 이메일 발송 중

    const [pwd, setPwd] = useState('');
    const [pwdMsg, setPwdMsg] = useState('');
    const [confirmPwd, setConfirmPwd] = useState('');
    const [confirmPwdMsg, setConfirmPwdMsg]= useState('');

    const [nickname, setNickname] = useState('');
    const [nicknameMsg, setNicknameMsg] = useState('');

    const [isAllchecked, setIsAllchecked] = useState(false);    // 약관 전체 동의
    const [isAgechecked, setIsAgechecked] = useState(false);
    const [isUsechecked, setIsUsechecked] = useState(false);

    // 유효성 검증
    const [checkEmail, setCheckEmail] = useState(false);
    const [checkPwd, setCheckPwd] = useState(false);
    const [checkNickname, setCheckNickname] = useState(false);
    const [checkAuth, setCheckAuth] = useState(false);
    
    let navigate = useNavigate();

////// 이메일 핸들러 & 유효성 검증 & 중복검사 //////
    const onChangeEmail = (e) => {
        const currEmail = e.target.value;
        setEmail(currEmail);

        if(validateEmail(currEmail, domain)) {
            existsEmail(currEmail, domain);
        }
    };

    const onChangeDomain = (e) => {
        const currDomain = e.target.value;
        setDomain(currDomain);

        if(validateEmail(email, currDomain)) {
            existsEmail(email, currDomain);
        }
    };

    const onSelect = (e) => {
        let selected = e.target.value; 
        setDomainIndex(selected);

        // 이메일 도메인 직접입력 선택
        if(selected === "10") {
            setDomain('');
            return;
        }
        // 이메일 도메인 선택
        switch (selected) {
            case "1":   selected = 'naver.com'; break;
            case "2":   selected = 'gmail.com'; break;
            case "3":   selected = 'hanmail.net'; break;
            case "4":   selected = 'daum.net'; break;
            default:    selected = 'outlook.com'; break;
        }
        setDomain(selected);
        if(validateEmail(email, selected)) {
            existsEmail(email, selected);
        }
    };

    const validateEmail = (email, domain) => {
        if(email.match(/[a-zA-Z0-9+-\_.]+/) && domain.match(/[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/)) {
            setEmailMsg('');
            return true;
        }
        setEmailMsg('이메일 형식이 올바르지 않습니다.');
        return false;
    };
    
    const existsEmail = async (email, domain) => {
        
        await axios.get(`http://localhost:3000/checkemail?email=${email}@${domain}`)
        .then((res) => {
            console.log(res.data);
            if(res.data === "OK") {
                setEmailMsg('');
                setCheckEmail(true);
            } else if(res.data === "kakao") {
                setEmailMsg("이미 카카오톡 간편가입으로 가입된 이메일입니다. '카카오톡' 버튼을 눌러 로그인해주세요.");
                setCheckEmail(false);
            } else {
                setEmailMsg("이미 구글 간편가입으로 가입된 이메일입니다. '구글' 버튼을 눌러 로그인해주세요.");
                setCheckEmail(false);
            }
        }).catch((err) => {
            alert('error');
        });
    };

////// 비밀번호 핸들러 & 유효성 검증 //////
    const onChangePwd = (e) => {
        const currPwd = e.target.value;
        setPwd(currPwd);

        if(validatePwd(currPwd)) {
            setCheckPwd(false);
        }
    };

    const onChangeConfirmPwd = (e) => {
        setConfirmPwd(e.target.value);
        if(pwd === e.target.value) {
            setCheckPwd(true);
            setConfirmPwdMsg('');
        } else {
            setCheckPwd(false);
            setConfirmPwdMsg('비밀번호가 일치하지 않습니다.');
        }
    };
    
    const validatePwd = (pwd) => {
        if(pwd === "") {
            setPwdMsg('필수 입력 항목입니다.');
            return false;
        } else if(!pwd.match(/^(?=.*[a-zA-Z])(?=.*[0-9]).{8,20}$/)) {
            setPwdMsg('비밀번호는 영문, 숫자를 포함하여 8자 이상이어야 합니다.');
            return false;
        }
        setPwdMsg('');
        return true;
    };

////// 닉네임 핸들러 & 유효성 검증 & 중복검사 //////
    const onChangeNickname = (e) => {
        const currNickname = e.target.value;
        setNickname(currNickname);
        
        if(validateNickname(currNickname)) {
            existsNickname(currNickname);
        } else {
            setCheckNickname(false);
        }
    };

    const existsNickname = async (nickname) => {
   
        await axios.get(`http://localhost:3000/checknickname?nickname=${nickname}`)
        .then((res) => {
            //console.log(res.data);
            if(!res.data) {
                setNicknameMsg('사용 가능한 닉네임입니다.');
                setCheckNickname(true);
            } else {
                setNicknameMsg('이미 사용중인 닉네임입니다.');
                setCheckNickname(false);
            }
        }).catch((err) => {
            alert('error');
        });

    };

    const validateNickname = (nickname) => {
        if(nickname === '') {
            setNicknameMsg('필수 입력 항목입니다.');
            return false;
        } else if(nickname.length < 2 || nickname.length > 15) {
            setNicknameMsg('2 ~ 15자로 입력해주세요.');
            return false;
        } else if(nickname.match(/\s/g)) {
            setNicknameMsg('공백은 사용할 수 없습니다.');
            return false;
        }
        return true;
    }

////// 전체 약관 동의 //////
    const checkAll = () => {
        if(isAllchecked) {
            setIsAgechecked(false);
            setIsUsechecked(false);
            setIsAllchecked(false);
        } else {
            setIsAgechecked(true);
            setIsUsechecked(true);
            setIsAllchecked(true);
        }
    };

////// 이메일 인증 //////
    const authEmailBtn = () => {
        setIsLoading(true);
        axios.get(`http://localhost:3000/authemail?email=${email}@${domain}`)
        .then((res) => {
            //console.log(res);
            setMailKey(res.data);
            setIsLoading(false);
        })
        .catch((err) => {
            alert('error');
            setIsLoading(false);
        });
    };
    
////// 회원가입 버튼 //////
    const signupBtn = () => {
        const mem = {
            "email":email+'@'+domain,
            "pwd":pwd,
            "nickname":nickname
        };

        axios.post("http://localhost:3000/auth/signup", null, { params:mem })
        .then((res) => {
            console.log(res.data);
            if(res.data === "OK") {
                alert('회원 가입을 축하합니다!');
                navigate('/login');
            } else {
                alert('가입 실패');
            }
        })
        .catch((err) => {
            alert('error');
        });
    };

    return (
        <>
            <h2>회원가입</h2>

            <section>
                <div>SNS계정으로 간편 로그인/회원가입</div>
                
                
            </section>
            <hr/>
            <div>
                <div>
                    <span>
                        <label>이메일</label>
                        <input value={email} onChange={onChangeEmail} disabled={checkAuth} placeholder="이메일" />
                    </span>
                    <span>@</span>
                    <span>
                        <input value={domain} onChange={onChangeDomain} disabled={domainIndex !== "10" || checkAuth} />
                        <select value={domainIndex} onChange={onSelect} disabled={checkAuth}>
                            <option value={0} hidden>선택해주세요</option>
                            <option value={1}>naver.com</option>
                            <option value={2}>gmail.com</option>
                            <option value={3}>hanmail.net</option>
                            <option value={4}>daum.net</option>
                            <option value={5}>outlook.com</option>
                            <option value={10}>직접 입력</option>
                        </select>
                </span>
                    <div>{emailMsg}</div>
                </div>
                <div>
                    <button type="button" onClick={authEmailBtn} disabled={!checkEmail || checkAuth}>
                        {checkAuth ? <span>이메일 인증 완료</span> : isLoading ? <span>loading</span> : <span>이메일 인증하기</span>}
                    </button>
                    {(mailKey !== '') && !checkAuth 
                    && <AuthEmail mailKey={mailKey} setCheckAuth={setCheckAuth} authEmailBtn={authEmailBtn} />}
                </div><hr/>

                <div>
                    <label>비밀번호</label>
                    <div>영문, 숫자를 포함한 8자 이상의 비밀번호를 입력해주세요.</div>
                    <input type="password" value={pwd} onChange={onChangePwd} placeholder="비밀번호" />
                    <div>{pwdMsg}</div>
                </div>

                <div>
                    <label>비밀번호 확인</label>
                    <input type="password" value={confirmPwd} onChange={onChangeConfirmPwd} placeholder="비밀번호 확인" />
                    <div>{confirmPwdMsg}</div>
                </div><hr/>

                <div>
                    <label>닉네임</label>
                    <div>다른 유저와 겹치지 않도록 입력해주세요. (2~15자)</div>
                    <input value={nickname} onChange={onChangeNickname} placeholder="별명 (2~15자)" />
                    <div className={checkNickname ? 'success' : 'error'}>{nicknameMsg}</div>
                </div><hr/>
                
                <div>
                    <label>약관동의</label>
                    <div>
                        <input type="checkbox" onChange={checkAll} checked={isAgechecked && isUsechecked} />
                        <span>전체동의</span>
                        <input type="checkbox" onChange={() => setIsAgechecked(!isAgechecked)} checked={isAgechecked} />
                        <span>만 14세 이상입니다 (필수)</span>
                        <input type="checkbox" onChange={() => setIsUsechecked(!isUsechecked)} checked={isUsechecked} />
                        <span>이용약관 (필수)</span>
                    </div>
                </div>

                <div>
                    <button type="button" onClick={signupBtn} disabled={!(isAllchecked && checkEmail && checkPwd && checkNickname && checkAuth)}>회원가입하기</button>
                </div>

                <p>이미 아이디가 있으신가요?</p>
                <Link to="/login">로그인</Link>
            </div>
        </>
    );
}