import {Link, Routes, Route, NavLink} from "react-router-dom";
import "./Mypage.css";
import {useEffect, useState} from "react";
import axios from "axios";

function Nav() {
    return (
        <div>
            <ul>
                <li><NavLink to="/mypage/profile">프로필</NavLink></li>
                <li><NavLink to="/mypage/bodycom">체성분</NavLink></li>
                <li><NavLink to="/mypage/mywrite">내가 쓴 글</NavLink></li>
                <li><NavLink to="/mypage/setting">설정</NavLink></li>
            </ul>
            <Routes>
                <Route path="profile" element={<Profile/>}></Route>
                <Route path="bodycom" element={<Bodycom/>}></Route>
                <Route path="mywrite" element={<Mywrite/>}></Route>
                <Route path="setting/*" element={<Setting/>}></Route>
            </Routes>

        </div>
    )
}

function Profile() {

    const [member, setMember] = useState([]);

    const [follow, setFollow] = useState([]);
    const [follower, setFollower] = useState([]);
    const [followNum, setFollowNum] = useState(0);
    const [followerNum, setFollowerNum] = useState(0);

    useEffect(() => {
        axios.get('http://localhost:3000/members/findmember')
            .then((response) => {
                setMember(response.data);

                // 데이터 확인용
                console.log(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    useEffect(() => {
        axios.get('http://localhost:3000/members/follow')
            .then((response) => {
                setFollow(response.data.followDtoList);
                setFollowNum(response.data.followNum);

                // 데이터 확인용
                console.log(response.data.followDtoList);
                console.log(response.data.followNum);
                console.log(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    // useEffect(() => {
    //     axios.get('http://localhost:3000/members/following')
    //         .then((response) => {
    //             setFollower(response.data.list);
    //
    //             // 데이터 확인용
    //             console.log(response.data);
    //         })
    //         .catch((error) => {
    //             console.error(error);
    //         });
    // }, []);

    return (
        <div>
            <h2>Profile</h2>
            <ul>
                <li>
                    <hr></hr>
                    <div>프로필 이미지 : {member.profile}</div>
                </li>
                <li>
                    <div>닉네임 : {member.nickname}</div>
                </li>
                <li><Link to="/mypage/follower">팔로워 0</Link></li>
                <li><Link to="/mypage/following">팔로잉 {followNum}</Link></li>
                <li><Link to="/mypage/setting">설정</Link></li>
                <hr></hr>

                <li>
                    <div>나의 헬친</div>
                </li>
                <li><Link to="/mypage/mate">+나의 헬친을 등록해주세요</Link></li>
                <li>
                    <div>나의 체성분 변화</div>
                </li>
                <li><Link to="/mypage/bodycom">+나의 체성분을 등록해주세요</Link></li>
            </ul>
        </div>
    )
}

function Bodycom() {

    const [member, setMember] = useState([]);

    const [follow, setFollow] = useState([]);
    const [follower, setFollower] = useState([]);
    const [followNum, setFollowNum] = useState(0);
    const [followerNum, setFollowerNum] = useState(0);

    useEffect(() => {
        axios.get('http://localhost:3000/members/findmember')
            .then((response) => {
                setMember(response.data);

                // 데이터 확인용
                console.log(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    useEffect(() => {
        axios.get('http://localhost:3000/members/follow')
            .then((response) => {
                setFollow(response.data.followDtoList);
                setFollowNum(response.data.followNum);

                // 데이터 확인용
                console.log(response.data.followDtoList);
                console.log(response.data.followNum);
                console.log(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    // useEffect(() => {
    //     axios.get('http://localhost:3000/members/following')
    //         .then((response) => {
    //             setFollower(response.data.list);
    //
    //             // 데이터 확인용
    //             console.log(response.data);
    //         })
    //         .catch((error) => {
    //             console.error(error);
    //         });
    // }, []);

    return (
        <div>
            <h2>Bodycom</h2>
            <ul>
                <li>
                    <hr></hr>
                    <div>프로필 이미지 : {member.profile}</div>
                </li>
                <li>
                    <div>닉네임 : {member.nickname}</div>
                </li>
                <li><Link to="/mypage/follower">팔로워 0</Link></li>
                <li><Link to="/mypage/following">팔로잉 {followNum}</Link></li>
                <li><Link to="/mypage/setting">설정</Link></li>
                <hr></hr>

                <li>
                    <div>체성분검사 업로드</div>
                </li>
                <li><Link to="/mypage/upload">Input Form</Link></li>
                <li>
                    <div>업로드 이력</div>
                </li>
                <li>
                    <div>날짜 골격근량 (+-) 체지방량 (+-) (삭제 버튼)</div>
                </li>
                <li>
                    <div>List ...</div>
                </li>
            </ul>
        </div>
    )
}

function Mywrite() {
    return (
        <div>
            <h2>Mywrite</h2>
            <ul>
                <li>
                    <hr></hr>
                    <div><h3>내가 쓴 글</h3></div>

                </li>
            </ul>
        </div>
    )
}

function EditProfile() {

    const [memberseq, setMemberseq] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [nickname, setNickname] = useState('');
    const [gender, setGender] = useState('');
    const [age, setAge] = useState('');
    const [phone, setPhone] = useState('');
    const [mbti, setMbti] = useState('');
    const [profile, setProfile] = useState('');

    useEffect(() => {
        axios
            .get("http://localhost:3000/members/findmember")
            .then((response) => {
                setMemberseq(response.data.memberseq);
                setEmail(response.data.email);
                setProfile(response.data.profile);
                setNickname(response.data.nickname);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    useEffect(() => {
        axios
            .get("http://localhost:3000/members/findmemberinfo")
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
    }, []);

    const handleNameChange = (event) => {
        setName(event.target.value);
    }

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    }

    const handleNicknameChange = (event) => {
        setNickname(event.target.value);
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

    const handleProfileChange = (event) => {
        setProfile(event.target.value);
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        axios.post('http://localhost:3000/members/profileupdate', {
            memberseq: memberseq,
            email: email,
            nickname: nickname,
            gender: gender,
            name: name,
            age: age,
            phone: phone,
            mbti: mbti,
            profile: profile
        })
            .then((response) => {
                console.log(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    return (
        <form onSubmit={handleSubmit}>
            <input type="hidden" name="memberseq" value={memberseq}/>
            <label>
                이메일:
                <input type="email" value={email} onChange={handleEmailChange}/>
            </label>
            <label>
                별명:
                <input type="text" value={nickname} onChange={handleNicknameChange}/>
            </label>
            <fieldset>
                <legend>성별:</legend>
                <label>
                    <input type="radio" name="gender" value="male" checked={gender === "male"}
                           onChange={handleGenderChange}/>
                    남성
                </label>
                <label>
                    <input type="radio" name="gender" value="female" checked={gender === "female"}
                           onChange={handleGenderChange}/>
                    여성
                </label>
            </fieldset>
            <label>
                이름:
                <input type="text" value={name} onChange={handleNameChange}/>
            </label>
            <label>
                나이:
                <input type="text" value={age} onChange={handleAgeChange}/>
            </label>
            <label>
                전화번호:
                <input type="text" value={phone} onChange={handlePhoneChange}/>
            </label>
            <label>
                Mbti:
                <select value={mbti} onChange={handleMbtiChange}>
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
            </label>
            <label>
                프로필 이미지:
                <input type="text" value={profile} onChange={handleProfileChange}/>
            </label>
            <button type="submit">회원 정보 수정</button>
        </form>
    );
}

function Pwdchange() {
    return (
        <div>
            <h2>비밀번호 변경</h2>
            <ul>
                <li>
                    <hr></hr>
                    <div><h3>Pwdchange</h3></div>

                </li>
            </ul>
        </div>
    )
}

function Setting() {
    return (
        <div>
            <hr></hr>
            <ul>
                <li><Link to="/mypage/setting/editprofile">회원정보 수정</Link></li>
                <li><Link to="/mypage/setting/pwdchange">비밀번호 변경</Link></li>
            </ul>
            <Routes>
                <Route path="editprofile" element={<EditProfile/>}></Route>
                <Route path="pwdchange" element={<Pwdchange/>}></Route>
            </Routes>
        </div>
    )
}

function Mypage() {
    return (
        <div>
            <h1>마이페이지</h1>
            <Nav></Nav>
        </div>
    )
}

export default Mypage;