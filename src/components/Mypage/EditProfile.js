import {useEffect, useRef, useState} from "react";
import axios from '../../utils/CustomAxios';
import "./MypageCss/EditProfile.css";
import {Form, Input} from "semantic-ui-react";
import AuthenticationService from "../auth/AuthenticationService";
import {Description, Msg} from "../auth/authStyle";

// 회원정보 수정
function EditProfile({token}) {

    const [memberseq, setMemberseq] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [emailname, setEmailname] = useState('');
    const [emaildomain, setEmaildomain] = useState('');
    const [gender, setGender] = useState('');
    const [age, setAge] = useState('');
    const [phone, setPhone] = useState('');
    const [mbti, setMbti] = useState('');
    const [profile, setProfile] = useState('default.png');
    const [image, setImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const fileInputRef = useRef();

    const [oldnickname, setOldNickname] = useState('');
    const [nickname, setNickname] = useState('');
    const [nicknameMsg, setNicknameMsg] = useState('');
    const [checkNickname, setCheckNickname] = useState(false);


    useEffect(() => {
        axios
            .post("http://localhost:3000/members/findmember", token)
            .then((response) => {
                setMemberseq(response.data.memberseq);
                setEmail(response.data.email);
                setProfile(response.data.profile);
                setNickname(response.data.nickname);
                setOldNickname(response.data.nickname);
                setEmailname(response.data.email.match(/(.*)@/)[1]);
                setEmaildomain(response.data.email.match(/@(.*)/)[1]);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [token]);

    useEffect(() => {
        axios
            .post("http://localhost:3000/members/findmemberinfo", token)
            .then((response) => {
                setName(response.data.name);
                setAge(response.data.age);
                setGender(response.data.gender);
                setPhone(response.data.phone);
                setMbti(response.data.mbti);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [token]);

    const handleNameChange = (event) => {
        setName(event.target.value);
    }

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
                if(!res.data || (nickname === oldnickname)) {
                    setNicknameMsg('');
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

    const handleGenderChange = (event) => {
        setGender(event.target.value);
    }

    const handleAgeChange = (event) => {
        setAge(event.target.value);
    }

    const handlePhoneChange = (event) => {
        setPhone(event.target.value);
    }

    const handleMbtiChange = (event) => {
        setMbti(event.target.value);
    }

    const handleImageChange = (event) => {
        const selectedFile = event.target.files[0];

        if (selectedFile) {
            setImage(selectedFile);
            setPreviewUrl(URL.createObjectURL(selectedFile));
        } else {
            // 이미지 첨부가 취소된 경우 처리할 코드 작성
            setPreviewUrl(null);
            setImage(null);
        }
    };


    const handleClick = () => {
        fileInputRef.current.click();
    };

    const deleteClick = () => {
        setPreviewUrl(null);
        setImage(null);
    }

    const handleDelete = (memberseq) => {
        const requestBody = {
            memberseq: memberseq,
        };

        // 확인 메시지 표시
        if (window.confirm("회원탈퇴를 진행하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) {
            axios.post("http://localhost:3000/memberdelete", requestBody, {
                headers: {
                    "Content-Type": "application/json",
                },
            }).then((response) => {
                AuthenticationService.logout();
                alert("탈퇴 되었습니다.");
                window.location.reload();
            });
        }
    };



    const handleSubmit = (event) => {
        event.preventDefault();

        if (image != null) {
            const formData = new FormData();
            formData.append("memberseq", memberseq);
            formData.append("email", email);
            formData.append("nickname", nickname);
            formData.append("gender", gender);
            formData.append("name", name);
            formData.append("age", age);
            formData.append("phone", phone);
            formData.append("mbti", mbti);
            formData.append("profile", profile);
            formData.append("image", image);

            axios
                .post("http://localhost:3000/members/profileupdate", formData)
                .then((response) => {
                    alert("회원정보가 성공적으로 변경되었습니다.");
                    localStorage.setItem('profile', response.data);
                    window.location.reload();
                });
        } else {
            const requestBody = {
                memberseq: memberseq,
                email: email,
                nickname: nickname,
                gender: gender,
                name: name,
                age: age,
                phone: phone,
                mbti: mbti,
                profile: profile,
                image: null,
            };

            axios.post("http://localhost:3000/members/profileupdatenull", requestBody, {
                headers: {
                    "Content-Type": "application/json",
                },
            }).then((response) => {
                alert("회원정보가 성공적으로 변경되었습니다.");
                window.location.reload();
            });
        }
    };

    return (
        <div className='edit-container'>
            <div className='edit-head'>
                <div className='edit-title'>회원정보수정</div>
                <div className='edit-delete-btn' onClick={() => handleDelete(memberseq)}>탈퇴하기</div>
            </div>
            <Form onSubmit={handleSubmit}>
                <input type="hidden" name="memberseq" value={memberseq}/>
                <div className='mypage-editprofile-01'>
                    <div className='mypage-editprofile-02'>
                        <div className='mypage-editprofile-04'>
                            이메일
                        </div>
                        <div className='mypage-editprofile-05'>
                            *필수항목
                        </div>
                    </div>
                    <div className='mypage-editprofile-03'>
                        <div className='mypage-editprofile-06'>
                            <div className='mypage-editprofile-07'>
                                <Input type="text" value={emailname} readOnly/>
                                <div className='mypage-editprofile-08'>@</div>
                                <Input type="text" value={emaildomain} readOnly/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='mypage-editprofile-23'>
                    <div className='mypage-editprofile-22'>
                        <div className='mypage-editprofile-04'>
                            별명
                        </div>
                        <div className='mypage-editprofile-05'>
                            *필수항목
                        </div>
                    </div>
                    <div className='mypage-editprofile-03'>
                        {/*<div className='mypage-editprofile-06'>*/}
                        {/*    <Input type="text" value={nickname} onChange={handleNicknameChange}/>*/}
                        {/*</div>*/}
                        {/*{!isNicknameAvailable && <div className="error-message">중복된 닉네임입니다.</div>}*/}
                        <div>
                            <div><Description>다른 유저와 겹치지 않도록 입력해주세요. (2~15자)</Description></div>
                        <Input className='mypage-editprofile-21' value={nickname} onChange={onChangeNickname} placeholder="별명 (2~15자)" />
                        <div><Msg>{nicknameMsg}</Msg></div>
                    </div>
                    </div>
                </div>
                <div className='mypage-editprofile-12'>
                    <div className='mypage-editprofile-02'>
                        <div className='mypage-editprofile-13'>
                            성별
                        </div>
                    </div>
                    <div className='mypage-editprofile-03'>
                        <div className='mypage-editprofile-06'>
                            <div className='mypage-editprofile-09'>
                                <div className='mypage-editprofile-11'>
                                    <Input type="Radio" name="gender" value="male" checked={gender === "male"}
                                           onChange={handleGenderChange}/></div>

                                <div className='mypage-editprofile-10'>남성</div>

                                <div className='mypage-editprofile-11'>
                                    <Input type="Radio" name="gender" value="female" checked={gender === "female"}
                                           onChange={handleGenderChange}/></div>

                                <div className='mypage-editprofile-10'>여성</div>

                            </div>
                        </div>
                    </div>
                </div>
                <div className='mypage-editprofile-01'>
                    <div className='mypage-editprofile-02'>
                        <div className='mypage-editprofile-04'>
                            이름
                        </div>
                    </div>
                    <div className='mypage-editprofile-03'>
                        <div className='mypage-editprofile-06'>
                            <input type="text" value={name} onChange={handleNameChange}/>
                        </div>
                    </div>
                </div>
                <div className='mypage-editprofile-01'>
                    <div className='mypage-editprofile-02'>
                        <div className='mypage-editprofile-04'>
                            나이
                        </div>
                    </div>
                    <div className='mypage-editprofile-03'>
                        <div className='mypage-editprofile-06'>
                            <input type="text" value={age} onChange={handleAgeChange}/>
                        </div>
                    </div>
                </div>
                <div className='mypage-editprofile-01'>
                    <div className='mypage-editprofile-02'>
                        <div className='mypage-editprofile-04'>
                            전화번호
                        </div>
                    </div>
                    <div className='mypage-editprofile-03'>
                        <div className='mypage-editprofile-06'>
                            <input type="text" value={phone} onChange={handlePhoneChange}/>
                        </div>
                    </div>
                </div>
                <div className='mypage-editprofile-01'>
                    <div className='mypage-editprofile-02'>
                        <div className='mypage-editprofile-04'>
                            mbti
                        </div>
                    </div>
                    <div className='mypage-editprofile-03'>
                        <div className='mypage-editprofile-06'>
                            <div className='mypage-editprofile-14'>
                                <select value={mbti} onChange={handleMbtiChange}>
                                    <option value={null}>선택</option>
                                    <option value="ISTJ">ISTJ</option>
                                    <option value="ISFJ">ISFJ</option>
                                    <option value="INFJ">INFJ</option>
                                    <option value="INTJ">INTJ</option>
                                    <option value="ISTP">ISTP</option>
                                    <option value="ISFP">ISFP</option>
                                    <option value="INFP">INFP</option>
                                    <option value="INTP">INTP</option>
                                    <option value="ESTP">ESTP</option>
                                    <option value="ESFP">ESFP</option>
                                    <option value="ENFP">ENFP</option>
                                    <option value="ENTP">ENTP</option>
                                    <option value="ESTJ">ESTJ</option>
                                    <option value="ESFJ">ESFJ</option>
                                    <option value="ENFJ">ENFJ</option>
                                    <option value="ENTJ">ENTJ</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='mypage-editprofile-17'>
                    <div className='mypage-editprofile-02'>
                        <div className='mypage-editprofile-04'>
                            프로필 이미지
                        </div>
                    </div>
                    <div className='mypage-editprofile-06'>
                        <div className='mypage-editprofile-15'>
                            {previewUrl ? (
                                <div style={{position: "relative"}}>
                                    <img className='mypage-editprofile-19'
                                         src={previewUrl}
                                         alt="프로필 이미지"
                                         onClick={handleClick}
                                         style={{cursor: 'pointer'}}
                                         width="200"
                                         height="200"
                                    />
                                    <button className='mypage-editprofile-20'
                                            onClick={deleteClick}
                                            style={{
                                                position: "absolute",
                                                top: 10,
                                                right: 10
                                            }}
                                    >
                                        삭제
                                    </button>
                                </div>

                            ) : (
                                <div>
                                    <img
                                        src={`http://localhost:3000/images/profile/${profile}`}
                                        alt="프로필 이미지"
                                        onClick={handleClick}
                                        style={{ borderRadius: '50%', overflow:'hidden', objectFit: 'cover',cursor: 'pointer'}}
                                        width="200"
                                        height="200"
                                    />
                                </div>
                            )}
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                style={{display: "none"}}
                            />
                        </div>
                    </div>
                </div>
                <div className='mypage-editprofile-01'>
                    <div className='mypage-editprofile-02'>
                        <div className='mypage-editprofile-04'>
                        </div>
                    </div>
                    <div className='mypage-editprofile-03'>
                        <div className='mypage-editprofile-06'>
                            <button className='mypage-editprofile-18' type="submit" disabled={!(checkNickname)}>회원 정보 수정</button>
                        </div>
                    </div>
                </div>
            </Form>
        </div>
    );
}

export default EditProfile;