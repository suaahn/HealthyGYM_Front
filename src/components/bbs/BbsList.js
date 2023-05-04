import React, { useState, useEffect, useCallback } from 'react';
import axios from '../../utils/CustomAxios';
import { Link, useParams } from 'react-router-dom';
import styled from "styled-components"; // npm i styled-components

import BbsBox from './BbsBox';
import useInfiniteScroll from '../../utils/useInfiniteScroll';

export default function BbsList() {

    const [bbsList, setBbsList] = useState([]);
    const [page, setPage] = useState(0);
    const [order, setOrder] = useState('wdate');
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    let { bbstag: bbstag} = useParams();

    const getBbs = useCallback(async () => {
        setIsLoading(true);

        await axios.get('http://localhost:3000/bbslist', { params:{ "bbstag":bbstag, "page":page, "order":order  } })
            .then(function(res) {
                console.log(res.data);

                setPage(page + 1);
                setBbsList(prev => [...prev, ...res.data]);
                setHasMore(res.data.length === 3);
            })
            .catch(function(err){
                console.log(err);    
            });

        setIsLoading(false);
    }, [page]);

    useEffect(() => {
        setHasMore(true);
        setBbsList([]);
        setPage(0);
    }, [order, bbstag]);

    const target = useInfiniteScroll(async (entry, observer) => {
        if(hasMore && !isLoading) {
            await getBbs()
        }
    })
    
    return (
        <div>
            <div>
                <Link to="/topics/0">토픽 베스트</Link>
                &nbsp;&nbsp;&nbsp;
                <Link to="/topics/1">운동루틴</Link>
                &nbsp;&nbsp;&nbsp;
                <Link to="/topics/2">바디갤러리</Link>
                &nbsp;&nbsp;&nbsp;
                <Link to="/topics/3">정보게시판</Link>
                &nbsp;&nbsp;&nbsp;
                <Link to="/topics/4">자유게시판</Link>
                &nbsp;&nbsp;&nbsp;
                <Link to="/topics/11">식단추천게시판</Link>
                &nbsp;&nbsp;&nbsp;
                <select value={order} onChange={(e) => setOrder(e.target.value)}>
                    <option value='wdate'>최신순</option>
                    <option value='likecount desc, wdate'>추천순</option>
                </select>
            </div>

            <BbsWrapper>
                {bbsList.map((bbs, i) => (
                    <BbsBox key={i} data={bbs} />
                ))}
            </BbsWrapper>

            {isLoading && <p>Loading</p>}
            {hasMore ? <div ref={target}>target</div> : null}
        </div>
    );
}

const BbsWrapper = styled.div`
    &>div {
        display: inline-block; 
        box-sizing: border-box;
        width: 50%;
        border-bottom: 1px solid lightgray;
    }
    &>div:nth-child(2n+1) {
        border-right: 1px solid lightgray;
    }
`


