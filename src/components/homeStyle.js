import { Link } from "react-router-dom";
import styled from "styled-components";

export const HomeBestDiv = styled.div`
    float: left;
    width: 100%;
    margin-bottom: 40px;
    &>h3 {
        display: inline;
    }
    &>a {
        float: right;
        color: black;
        margin: 5px;
    }
    &>ul {
        list-style: none;
        padding: 0;
        height: 280px;
    }
    &>ul li {
        position: relative;
        display: flex;
    }
    &>ul a {
        max-width: 85%;
        color: black;
        font-weight: 500;
        line-height: 2em;
        word-wrap:break-word;
        overflow:hidden; 
        display:-webkit-box; 
        -webkit-line-clamp:1;
        -webkit-box-orient:vertical;
    }
    &>ul a:hover {
        color: black;
    }
    &>ul>li>span {
        position: absolute;
        top: 0;
        width: 50px;
        margin: 3px 0;
        color: #94969b;
        font-size: 12px;
    }
    &>ul>li>span:nth-child(2) {
        right: 60px;
    }
    &>ul>li>span:last-child  {
        right: 0;
    }
`;
export const HomeHalfDiv = styled.div`
width: 48%; 
float: left;
margin-bottom: 40px;
&>h3 {
  display: inline;
}
&>a {
  float: right;
  color: black;
  margin: 5px;
}
`;
export const UnorderedList = styled.ul`
    list-style: none; 
    padding: 0; 
    height: 140px;
    &>li {
        position: relative;
    }
    & a {
        max-width: 465px;
        color: black;
        font-weight: 500;
        line-height: 2em;
        word-wrap:break-word;
        overflow:hidden; 
        display:-webkit-box; 
        -webkit-line-clamp:1;
        -webkit-box-orient:vertical;
    }
    & a:hover {
        color: black;
    }
    & span {
        position: absolute;
        top: 0;
        right: 0;
        width: 50px;
        margin: 3px 0;
        color: #94969b;
        font-size: 12px;
    }
`;

export const HomeHeader = styled.header`
    height : 70px; 
    position: fixed;
    width: 100%; 
    background-color: white; 
    z-index: 1000; 
    border-bottom: 2px solid rgba(34,36,38,.15);
    &>div {
      width: 1100px; 
      margin: auto; 
      display: flex; 
      align-items: center;
    }
    & a>img {
      vertical-align: middle;
      width: 150px;
      margin: 15px 15px 15px 0;
    }
    &>div>div {
      float: right;
      display: flex;
      margin-left: auto;
    }
`;

export const MenuSpan = styled.span`
  padding-right:10px; margin-right:10px; border-right:2px solid rgba(34,36,38,.15);
  &>a {
    font-weight: 600; 
    color: black; 
  }
  &+a {
    font-weight: 600; 
    color: black; 
  }
`;

export const MenuItem = styled(Link)`
  color: black;
  font-size: 18px;
  font-weight: bold;
  padding: 5px;
  margin: 10px;
  vertical-align: -webkit-baseline-middle;
  &:hover {
    color: #5271FF;
  }
  &.active {
    color: #5271FF;
  }
`;