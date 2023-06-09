import React, { useState, useEffect, useCallback } from 'react';
import axios from '../../utils/CustomAxios';
import { useParams } from 'react-router-dom';
import useInfiniteScroll from '../../utils/useInfiniteScroll';
import Card from '../BodyGallery/card';
import SearchNav from './SearchNav';
import { Loader } from 'semantic-ui-react';
import { Description } from '../auth/authStyle';

export default function SearchList() {

    const [bbsList, setBbsList] = useState([]);
    const [page, setPage] = useState(0);
    const [order, setOrder] = useState('likecount desc, wdate');
    const [bbstag, setBbstag] = useState('0');
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    let   {search: search} = useParams();

    const getBbs = useCallback(async () => {
        setIsLoading(true);

        await axios.get('http://localhost:3000/findBbsByKeyword', { params:{ "bbstag":bbstag, "page":page, "order":order, "search":search } })
      .then(function(res) {
        //console.log(res.data);

        setPage(page + 1);
        setBbsList(prev => [...prev, ...res.data]);
        setHasMore(res.data.length === 3);
      })
      .catch(function(err){
        console.log(err);
      });

    setIsLoading(false);
  }, [search, page, order, bbsList]);

    useEffect(() => {
        setHasMore(true);
        setBbsList([]);
        setPage(0);
    }, [order, bbstag, search]);

    const target = useInfiniteScroll(async (entry, observer) => {
        if(hasMore && !isLoading) {
            await getBbs()
        }
    })

    return (
        <div>
          <Description style={{ fontWeight: 'bold', marginLeft: '20px', fontSize:'20px', color:'black'}}>
            {search} 검색결과
          </Description>
            <div className="ui container" style={{ marginTop: '20px'}}>
            <SearchNav setOrder={setOrder} order={order} setBbstag={setBbstag} bbstag={bbstag}  />
            <div className="ui three cards" style={{ margin: '15px'}}>
              {bbsList.length === 0 ? (
                    <Description style={{fontWeight:'bold'}}>게시글이 없습니다.</Description>
                ) : (
                    bbsList.map(bbs => (
                        <Card key={bbs.id} data={bbs} />
                    ))
              )}
            </div>
            </div>
            {isLoading && hasMore && <><br/><Loader active inline='centered' /></>}
            {hasMore ? 
                <div ref={target}>&nbsp;</div> : 
                <Description><br/>마지막 게시글입니다.</Description>}
        </div>
    );
}