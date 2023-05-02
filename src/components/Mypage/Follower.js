import {useEffect, useMemo, useState} from "react";
import axios from "axios";

function Follower() {

    const [followerList, setFollowerList] = useState([]);

    const authToken = localStorage.getItem("auth_token");
    const token = useMemo(() => ({ authToken: authToken }), [authToken]);

    useEffect(() => {
        axios.post('http://localhost:3000/members/follower',token)
            .then((response) => {
                setFollowerList(response.data.followDtoList);

            })
            .catch((error) => {
                console.error(error);
            });
    }, [token]);

    return (
        <div>
            <hr></hr>
            <h3>팔로워</h3>
            {followerList.length > 0 ? (
                followerList.map((follower) => (
                    <div key={follower.memberseq}>
                        <p><img
                            src={`http://localhost:3000/images/profile/${follower.profile}`}
                            alt="이미지"
                            width="30"
                            height="30"
                        /> {follower.foltarget}</p>
                    </div>
                ))
            ) : (
                <p>팔로워가 없습니다</p>
            )}
            <hr></hr>
        </div>
    )
}

export default Follower;