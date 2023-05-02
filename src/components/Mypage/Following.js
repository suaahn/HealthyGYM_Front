import {useEffect, useMemo, useState} from "react";
import axios from "axios";

function Following() {

    const [followingList, setFollowingList] = useState([]);

    const authToken = localStorage.getItem("auth_token");
    const token = useMemo(() => ({ authToken: authToken }), [authToken]);

    useEffect(() => {
        axios.post('http://localhost:3000/members/follow',token)
            .then((response) => {
                setFollowingList(response.data.followDtoList);

            })
            .catch((error) => {
                console.error(error);
            });
    }, [token]);

    return (
        <div>
            <hr></hr>
            <h3>팔로잉</h3>
            {followingList.length > 0 ? (
                followingList.map((following) => (
                    <div key={following.memberseq}>
                        <p><img
                            src={`http://localhost:3000/images/profile/${following.profile}`}
                            alt="이미지"
                            width="30"
                            height="30"
                        /> {following.foltarget}</p>
                    </div>
                ))
            ) : (
                <p>팔로잉하는 유저가 없습니다</p>
            )}
            <hr></hr>
        </div>
    )
}

export default Following;