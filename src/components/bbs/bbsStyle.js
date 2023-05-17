import { Link } from "react-router-dom";
import styled from "styled-components";

export const BbsWrapper = styled.div`
    &>div {
        display: inline-block; 
        box-sizing: border-box;
        width: 50%;
        border-bottom: 1px solid rgba(34,36,38,.15);
        padding: 15px;
    }
    &>div:nth-child(2n+1) {
        border-right: 1px solid rgba(34,36,38,.15);
    }
`;
export const ImgLayer = styled.div`
    position: absolute;
    top: 0;
    text-align: center;
    width: 70px;
    height: 70px;
    line-height: 70px;
    background: rgba(0,0,0,0.5);
    color: white;
`;
export const TitleLink = styled(Link)`
    color: black;
    font-size: 18px;
    font-weight: 600;
    width:420px; 
    height:40px; 
    margin-bottom: 4px;
    word-wrap:break-word; 
    white-space:normal; 
    overflow:hidden; 
    display:-webkit-box; 
    -webkit-line-clamp:2;
    -webkit-box-orient:vertical;
    :hover {
        color: black;
    }
`;
export const ContentLink = styled(Link)`
    color: black;
    width:420px; 
    height:37px; 
    margin-bottom: 14px;
    word-wrap:break-word; 
    white-space:normal; 
    overflow:hidden; 
    display:-webkit-box; 
    -webkit-line-clamp:2;
    -webkit-box-orient:vertical;
    :hover {
        color: black;
    }
`;
export const InfoDiv = styled.div`
    color: #94969b;
    font-size: 12px;
    display: flex;
    &>span {
        margin-right: 10px;
    }
    &>span:last-child {
        margin-left: auto;
    }
    &>span>span {
        margin-left: 5px;
    }
    &>span>time {
        margin-left: 5px;
    }
`;
export const InfoSpan = styled.span`
  color:#94969b;
  &>span {
    margin-right: 8px;
  }
  &>span>span {
    margin: 0 3px;
  }
`;
export const URLShareButton = styled.button`
	width: 35px;
	height: 35px;
	color: white;
	border-radius: 24px;
	border: 0px;
    margin-right: 5px;
	font-weight: 700;
	font-size: 12px;
	cursor: pointer;
	background-color: #5271FF;
	&:hover {
		background-color: #80AAFF;
	}
`;
export const KakaoShareButton = styled.a`
  display: inline-block;
  width: 35px;
  cursor: pointer;
  &:hover {
    opacity: 0.5;
  }
`;