import { useState, useEffect, useCallback } from "react";

import useInfiniteScroll from "../../utils/useInfiniteScroll";
import axios from "../../utils/CustomAxios";
import SelectBodyPart from "./SelectBodyPart";
import HealthBox from "./HealthBox";
import MateNav from "./MateNav";
import ADDRESS_LIST from '../../asset/region.json';

import { Form, Button, Loader, Icon } from 'semantic-ui-react';
import { BbsWrapper } from "../bbs/bbsStyle";
import { Description } from "../auth/authStyle";
import { BodyWrap } from "./healthStyle";

export default function HealthList() {
    const [bbsList, setBbsList] = useState([]);
    const [page, setPage] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const [addressFirst, setAddressFirst] = useState(0);
    const [addressSecond, setAddressSecond] = useState(0);
    const [mdate, setMdate] = useState('');
    const [mtime, setMtime] = useState('');
    const [bodyPart, setBodyPart] = useState([false,false,false,false,false,false,false]);
    const [filtering, setfiltering] = useState(false);


    const getBbs = useCallback(async () => {
        setIsLoading(true);
        const paramObj = { "page":page, "addressFirst":addressFirst, "addressSecond":addressSecond,
                            "mdate":mdate, "mtime":mtime, "bodypart":bodyPart.join(",")  };
        console.log(paramObj);
        await axios.get('http://localhost:3000/mate/getlist', { params:paramObj })
            .then(function(res) {
                //console.log(res.data);

                setPage(page + 1);
                setBbsList(prev => [...prev, ...res.data]);
                setHasMore(res.data.length === 8);
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
    }, [filtering]);

    const target = useInfiniteScroll(async (entry, observer) => {
        if(hasMore && !isLoading) {
            await getBbs()
        }
    });

    // 시간대 옵션 생성
    const timeLoop = () => {
        const arr = [];
        for(let i = 0; i < 24; i++) {
            arr.push(<option key={i} value={`${i}:%`}>
                        {i < 10 ? `0${i}`:i} ~ {i < 9 ? `0${i+1}`:i+1}
                    </option>);
        }
        return arr;
    };

    return (
        <div>
            <MateNav /><br/>
            <Form size="tiny">
                <Form.Group widths='equal'>
                    <Form.Field>
                        <label>시도명</label>
                        <select value={addressFirst} onChange={(e) => setAddressFirst(e.target.value)}>
                            {ADDRESS_LIST.data.map((r, i) => {
                                return (
                                    <option key={i} value={i}>{r[0]}</option>
                                );
                            })}
                        </select>
                    </Form.Field>
                    <Form.Field>
                        <label>시군구명</label>
                        <select value={addressSecond} onChange={(e) => setAddressSecond(e.target.value)}>
                            {ADDRESS_LIST.data[addressFirst][1].map((r, i) => {
                                return (
                                    <option key={i} value={i}>{r}</option>
                                );
                            })}
                        </select>
                    </Form.Field>
                    <Form.Field>
                        <label>날짜</label>
                        <input type='date' value={mdate} onChange={(e) => {setMdate(e.target.value)}} />
                    </Form.Field>
                    <Form.Field>
                        <label>시간대</label>
                        <select value={mtime} onChange={(e) => setMtime(e.target.value)}>
                            <option value="">전체</option>
                            {timeLoop()}
                        </select>
                    </Form.Field>
                </Form.Group>
            </Form>
            
            <span style={{ fontSize:'0.95em', fontWeight:'700', marginRight:'12px' }}>운동 부위</span>
                <BodyWrap>
                    <SelectBodyPart bodyPart={bodyPart} setBodyPart={setBodyPart} />
                </BodyWrap>
            
            <Button size="small" onClick={() => {setfiltering(!filtering)}}
                style={{ width:'266px', height:'39px', margin:'0 0 0 12px', fontSize: '14px', letterSpacing: '5px'}}>
                <Icon name="filter" /> 필터 검색
            </Button>
            <br/><br/>

            <BbsWrapper>
                {bbsList.map((bbs, i) => (
                    <HealthBox key={i} data={bbs} />
                ))}
            </BbsWrapper>

            {isLoading && hasMore && <><br/><Loader active inline='centered' /></>}
            {hasMore ? 
                <div ref={target}>(〜￣▽￣)〜</div> : 
                <Description><br/>마지막 게시글입니다.</Description>}
        </div>
    );
}
