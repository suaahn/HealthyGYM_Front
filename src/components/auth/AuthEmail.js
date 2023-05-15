import { useState, useEffect } from "react";
import moment from "moment";
import { Input, Button } from 'semantic-ui-react';
import { Msg } from "./authStyle";

export default function AuthEmail(props) {
    const [code, setCode] = useState('');
    const [authMsg, setAuthMsg] = useState('');
    const [countdown, setCountdown] = useState('');
    const [targetTime, setTargetTime] = useState(moment().add(3, 'minutes'));
    let setTimer = null;

    const checkCode = () => {
        console.log(code, props.mailKey);
        if(code == props.mailKey) {
            props.setCheckAuth(true);
            setAuthMsg('');
        } else {
            setAuthMsg('올바른 인증 코드가 아닙니다.');
        }
    };

    const showRemaining = () => {
        // 현재 시간과 타겟 시간의 차이를 구한다.
        let diff = targetTime.diff(moment());
        let remainTime = moment.utc(diff).format('mm:ss');
        setCountdown(remainTime);
        
        if(diff <= 0) {
            clearInterval(setTimer);
            setCountdown('00:00');
            setAuthMsg('인증코드가 만료되었습니다.');
        }
    };
    
    const resend = () => {
        props.authEmailBtn();
        
        clearInterval(setTimer);    // 기존 타이머 초기화
        setAuthMsg('');
        setTargetTime(moment().add(3, 'minutes'));
    };

    useEffect(() => {
        // 3분 타이머 start
        setTimer = setInterval(showRemaining, 1000);

        return () => clearInterval(setTimer);
    }, [targetTime]);


    return (
        <div>
            <p>이메일로 전송된 인증코드를 입력해주세요.</p>
            <div style={{ height:'38px'}}>
            <Input value={code} onChange={(e) => setCode(e.target.value)} 
                placeholder="인증코드 입력" style={{ width:'320px', marginRight:'10px' }} />
            <Button onClick={checkCode} style={{ margin:'0'}}>확인</Button>
            <span style={{ fontWeight:'600', position:'relative', fontWeight:'600', left:'270px', bottom:'29px' }}>{countdown}</span>
            </div>
            <Msg>{authMsg}</Msg>
            <div style={{ marginBottom:'40px'}}>
                이메일을 받지 못하셨나요?&nbsp;
                <a href="#none" onClick={resend}>이메일 재전송하기</a>
            </div>
        </div>
    );
}