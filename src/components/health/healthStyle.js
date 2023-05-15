import { Link } from "react-router-dom";
import styled from "styled-components";


export const BodyWrap = styled.div`
    background-color: #f7f9fc; width: 68.5%; 
    border-radius:3px; padding: 5.5px 30px; 
    display: inline-flex; justify-content: space-between;
`;
export const HealthTitleLink = styled(Link)`
    color: black;
    font-size: 14px;
    font-weight: 600;
    height:20px; 
    margin-bottom: 5px;
    white-space:normal; 
    overflow:hidden; 
    display:-webkit-box; 
    -webkit-line-clamp:1;
    -webkit-box-orient:vertical;
    :hover {
        color: black;
    }
`;
export const HealthInfoDiv = styled.div`
    font-size: 13px;
    line-height: 1.8;
    margin-bottom: 5px;
`;
export const ProfileDiv = styled.div`
    margin-bottom: 10px;
    & a {
        display: flex;
        color: black;
    }
    & a:hover {
        color: black;
    }
    & img {
        border-radius: 50%; 
        overflow:hidden;
        object-fit: cover;
    }
    & span {
        margin: auto 10px;
        font-weight: 600;
    }
`;
export const HealthTable = styled.table`
    & th,td {
        text-align: left;
        padding: 5px 20px 5px 5px;
    }
`;