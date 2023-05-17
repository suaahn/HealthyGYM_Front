import React, { useState } from 'react';
import Map from './Map';
import MateNav from '../health/MateNav';

const LandingPage = () => {
    // 입력 폼 변화 감지하여 입력 값 관리
    const [Value, setValue] = useState("");
    // 제출한 검색어 관리
    const [Keyword, setKeyword] = useState("");
    // 입력 폼 변화 감지하여 입력 값을 state에 담아주는 함수
    const keywordChange = (e) => {
        e.preventDefault();
        setValue(e.target.value);
    };
    // 제출한 검색어 state에 담아주는 함수
    const submitKeyword = (e) => {
        e.preventDefault();
        setKeyword(Value);
    };
    return (
    <div>
      <div>
        <MateNav />
        <div>
          <form onSubmit={ submitKeyword } style={{textAlign:'center', margin:'15px'}}>
              <div className="ui large icon input">
              <input type="text" onChange={ keywordChange } placeholder="검색어를 입력하세요" required />
              <i className="search icon"></i>
            </div>
          </form>
        </div>
        {/* 제출한 검색어 넘기기 */}
        <Map searchKeyword={ Keyword }/>
      </div>
    </div>
    );
};
export default LandingPage;