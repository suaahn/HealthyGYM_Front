import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Moment from 'react-moment'; // npm i moment react-moment
import 'moment/locale/ko';

import readicon from "../../asset/icon_readcount.png";
import likeicon from "../../asset/icon_like.png";
import commenticon from "../../asset/icon_comment.png";
import clockicon from "../../asset/icon_clock.png";
import styled from 'styled-components';

export default function BbsBox(props) {
    const [imgNum, setImgNum] = useState(0);

    useEffect(() => {

        if(props.data.content !== undefined) {
    
            const imgArr = props.data.content.split('<img').filter(str=>str.includes("src"));
            if(imgArr.length > 0) setImgNum(imgArr.length);
        }
    }, []);

    
    return (
        <div>
            <div style={{ height:'80px', position:'relative'}}>
                <Link to={`/viewer/${props.data.bbsseq}`}>{props.data.title}</Link>
                <p>{props.data.nickname}</p>

                <span style={{ position:'absolute', top:'0', right:'0'}}>
                    {props.data.thumnail !== undefined && 
                        <img 
                            src={`https://firebasestorage.googleapis.com/v0/b/healthygym-8f4ca.appspot.com/o/files%${props.data.thumnail}?alt=media`} 
                            alt=''
                            width={80}
                            height={80}/>
                    }
                    {imgNum > 1 &&
                        <ImgLayer>
                            +{imgNum - 1}
                        </ImgLayer>
                    }
                </span>
            </div>
            
            <div>
                <span>
                    <img alt='' src={readicon} width={15} />
                    {props.data.readcount}
                </span>
                <span>
                    <img alt='' src={likeicon} width={15} />
                    {props.data.likecount}
                </span>
                <span>
                    <img alt='' src={commenticon} width={15} />
                    {props.data.cmtcount}
                </span>
                <span>
                    <img alt='' src={clockicon} width={15} />
                    <Moment fromNow>{props.data.wdate}</Moment>
                </span>
            </div>
        </div>
    );
}

const ImgLayer = styled.div`
    position: absolute;
    top: 0;
    text-align: center;
    width: 80px;
    height: 80px;
    line-height: 80px;
    background: rgba(0,0,0,0.5);
    color: white;
`