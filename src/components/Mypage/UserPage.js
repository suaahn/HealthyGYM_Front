import {useParams} from "react-router-dom";
import {useMemo} from "react";
import UserProfileCard from "./UserProfileCard";

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