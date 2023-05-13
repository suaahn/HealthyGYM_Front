import React, { useState, useEffect, useCallback } from 'react';
import axios from '../../utils/CustomAxios';
import { useParams } from 'react-router-dom';
import useInfiniteScroll from '../../utils/useInfiniteScroll';
import Card from '../BodyGallery/card';
import BbsNav from '../bbs/BbsNav';
import { Loader } from 'semantic-ui-react';
import { Description } from '../auth/authStyle';
import Carousel from '../bbs/Carousel';

export default function BodyGalleryList() {

    const [bbsList, setBbsList] = useState([]);
    const [page, setPage] = useState(0);
    const [order, setOrder] = useState('wdate');
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    let { bbstag: bbstag} = useParams();

    const getBbs = useCallback(async () => {
        setIsLoading(true);

        await axios.get('http://localhost:3000/findAllBest', { params:{ "bbstag":bbstag, "page":page, "order":order  } })
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
            <Carousel />
            <br/>
            <div className="ui container" style={{ marginTop: '20px'}}>
            <BbsNav setOrder={setOrder} order={order} />
            <div className="ui three cards" style={{ margin: '15px'}}>
                {bbsList.map(bbs => (
                <Card key={bbs.id} data={bbs} />
                ))}
            </div>
            </div>
            {isLoading && hasMore && <><br/><Loader active inline='centered' /></>}
            {hasMore ? 
                <div ref={target}>target</div> : 
                <Description><br/>마지막 게시글입니다.</Description>}
        </div>
    );
}