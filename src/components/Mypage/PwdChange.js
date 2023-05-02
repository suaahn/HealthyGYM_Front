import {useEffect, useMemo, useState} from "react";
import axios from "axios";

function PwdChange() {
    const [memberseq, setMemberseq] = useState('');
    const [pwd, setPwd] = useState("");
    const [confirmPwd, setConfirmPwd] = useState("");
    const [message, setMessage] = useState("");

    const authToken = localStorage.getItem("auth_token");
    const token = useMemo(() => ({ authToken: authToken }), [authToken]);

    useEffect(() => {
        axios
            .post("http://localhost:3000/members/findmember",token)
            .then((response) => {
                setMemberseq(response.data.memberseq);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [token]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (pwd !== confirmPwd) {
            setMessage("비밀번호가 일치하지 않습니다.");
        } else {
            try {
                await axios.post(
                    "http://localhost:3000/members/pwdupdate",
                    {
                        memberseq: memberseq,
                        pwd: pwd
                    }
                );
                setMessage("비밀번호가 성공적으로 변경되었습니다.");
            } catch (error) {
                console.error(error);
                setMessage("비밀번호경 중 오류가 발생했습니다.");
            }
        }
    };

    return (
        <div>
            <h1>비밀번호 변경</h1>
            <form onSubmit={handleSubmit}>
                <input type="hidden" name="memberseq" value={memberseq}/>
                <div>
                    <h3><label htmlFor="pwd">새 비밀번호</label></h3>
                    <p>영문,숫자를 포함한 8자 이상의 비밀번호를 입력해주세요.</p>
                    <input
                        type="password"
                        id="pwd"
                        value={pwd}
                        onChange={(event) => setPwd(event.target.value)}
                    />
                </div>
                <div>
                    <br></br>
                    <h3><label htmlFor="confirmPwd">비밀번호 확인</label></h3>
                    <input
                        type="password"
                        id="confirmPwd"
                        value={confirmPwd}
                        onChange={(event) => setConfirmPwd(event.target.value)}
                    />
                </div>
                {message && <div>{message}</div>}
                <br></br>
                <button type="submit">비밀번호 변경</button>
            </form>
        </div>
    );
}

export default PwdChange;