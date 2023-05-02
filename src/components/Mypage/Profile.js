import ProfileCard from "./ProfileCard";
import {Link} from "react-router-dom";
import "./Profile.css";

function Profile() {
    return (
        <div style={{display: 'flex', flexDirection: 'row'}}>
            <ProfileCard/>
            <div className='card-container'>
                <b>나의 헬친</b>
                <div className='box1'>
                    <Link to="/mypage/mate">
                        <div style={{color: '#666', fontSize: '0.8rem'}}>
                            <b style={{fontSize: '18px', fontWeight: 'normal'}}>+ </b>나의 헬친을 등록해주세요
                        </div>
                    </Link>
                </div>
                <b>나의 체성분 변화</b>
                <div className='box1' style={{color: '#666'}}>
                    <Link to="/mypage/bodycom">
                        <div style={{color: '#666', fontSize: '0.8rem'}}>
                            <b style={{fontSize: '18px', fontWeight: 'normal'}}>+ </b>나의 체성분을 등록해주세요
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}


export default Profile;