import {useParams} from "react-router-dom";
import {useMemo} from "react";
import UserProfileCard from "./UserProfileCard";

// 유저페이지 입구, 유저의 memberseq값 prop
function UserPage(){

    const { memberseq } = useParams();
    const usertoken = useMemo(() => ({memberseq: memberseq}), [memberseq]);

    return(
        <>
            <UserProfileCard usertoken={usertoken}/>
        </>
    );
}
export default UserPage;