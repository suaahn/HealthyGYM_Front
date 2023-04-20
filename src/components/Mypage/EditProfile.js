import {useEffect, useRef, useState} from "react";
import axios from "axios";

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
    const [image, setImage] = useState(null);

    const [previewUrl, setPreviewUrl] = useState(null);

    const fileInputRef = useRef();

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

    const handleImageChange = (event) => {
        const selectedFile = event.target.files[0];
        setImage(selectedFile);
        setPreviewUrl(URL.createObjectURL(selectedFile));

    }

    const handleClick = () => {
        fileInputRef.current.click();
    };

    const deleteClick = () => {
        setPreviewUrl(null);
        setImage(null);
    }

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
                    console.log(response.data);
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
                console.log(response.data);
            });
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="hidden" name="memberseq" value={memberseq}/>
            <div>
                <label>
                    이메일:
                    <input type="email" value={email} onChange={handleEmailChange}/>
                </label>
            </div>
            <div>
                <label>
                    별명:
                    <input type="text" value={nickname} onChange={handleNicknameChange}/>
                </label>
            </div>
            <div>
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
            </div>
            <div>
                <label>
                    이름:
                    <input type="text" value={name} onChange={handleNameChange}/>
                </label>
            </div>
            <div>
                <label>
                    나이:
                    <input type="text" value={age} onChange={handleAgeChange}/>
                </label>
            </div>
            <div>
                <label>
                    전화번호:
                    <input type="text" value={phone} onChange={handlePhoneChange}/>
                </label>
            </div>
            <div>
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
            </div>

            <div>
                <label>프로필 이미지:</label>
                {previewUrl ? (
                    <div>
                        <img src={previewUrl}
                             alt="프로필 이미지"
                             onClick={handleClick}
                             style={{cursor: "pointer"}}
                             width="130"
                             height="130"
                        />
                        <button onClick={deleteClick}>삭제</button>
                    </div>
                ) : (
                    <div>
                        <img
                            src={`http://localhost:3000/images/${profile}`}
                            alt="프로필 이미지"
                            onClick={handleClick}
                            style={{cursor: "pointer"}}
                            width="130"
                            height="130"
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
            <button type="submit">회원 정보 수정</button>
        </form>
    );
}

export default EditProfile;