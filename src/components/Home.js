import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Divider, Icon, Label } from "semantic-ui-react";
import HomeBbs from "./HomeBbs";
import { HomeBestDiv, HomeHalfDiv } from "./homeStyle";

export default function Home() {
  const [list, setList] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3000/homebest")
    .then(res => {
      //console.log(JSON.stringify(res.data));
      setList(res.data);
    })
    .catch(error => {
      console.log(error);
    })
  }, []);

  return (
    <div className="clearfix">
      <HomeBestDiv>
        <h3>
          <Icon name="chess queen" /> 토픽 베스트
        </h3>
        <Link to="/community/1">더보기{'>'}</Link>
        <Divider />
        <ul>
          {list.map((item, i) => {
            return (
              <li key={i}>
                <Link to={`/view/${item.bbsseq}`}>
                  <Label size="small">
                    {item.bbstag === 2 ? "바디갤": item.bbstag === 3 ? "정보": item.bbstag === 4 ? "자유": "식단추천"}
                  </Label>
                  &nbsp;&nbsp;{item.title}
                </Link>
                <span>
                  <Icon name='thumbs up outline' />
                  {item.likecount}
                </span>
                <span>
                  <Icon name='eye' />
                  {item.readcount}
                </span>
              </li>
            );
          })}
        </ul>
      </HomeBestDiv>

      <HomeHalfDiv>
        <h3>
          <Icon name="comment alternate" flipped='horizontally' /> 정보게시판
        </h3>
        <Link to="/community/3">더보기{'>'}</Link>
        <Divider />
        {<HomeBbs bbstag={3} />}
      </HomeHalfDiv>

      <HomeHalfDiv style={{ marginLeft:'4%' }}>
        <h3>
          <Icon name="comment alternate" flipped='horizontally' /> 자유게시판
        </h3>
        <Link to="/community/4">더보기{'>'}</Link>
        <Divider />
        {<HomeBbs bbstag={4} />}
      </HomeHalfDiv>

      <HomeHalfDiv>
        <h3>
          <Icon name="image" /> 바디갤러리
        </h3>
        <Link to="/community/2">더보기{'>'}</Link>
        <Divider />
        {<HomeBbs bbstag={2} />}
      </HomeHalfDiv>

      <HomeHalfDiv style={{ marginLeft:'4%' }}>
        <h3>
          <Icon name="comments" flipped='horizontally' /> 식단추천
        </h3>
        <Link to="/community/11">더보기{'>'}</Link>
        <Divider />
        {<HomeBbs bbstag={11} />}
      </HomeHalfDiv>
    </div>
  );
}

