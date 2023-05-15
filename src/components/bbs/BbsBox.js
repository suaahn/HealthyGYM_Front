import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Moment from 'react-moment'; // npm i moment react-moment
import 'moment/locale/ko';
import { Icon } from 'semantic-ui-react';
import { ContentLink, ImgLayer, InfoDiv, TitleLink } from './bbsStyle';
import { ProfileDiv } from '../health/healthStyle';

export default function BbsBox(props) {
    const [imgNum, setImgNum] = useState(0);

    useEffect(() => {

        if(props.data.content !== undefined) {
    
            const imgArr = props.data.content.split('<img').filter(str=>str.includes("src"));
            if(imgArr.length > 0) setImgNum(imgArr.length);
        }
    }, []);

    const removeImageTags = (content) => {
        const imgRegex = /<img\b[^>]*>/gi;
        return content.replace(imgRegex, "");
    };

    
    return (
        <div>
            <div style={{ position:'relative'}}>

                <TitleLink to={`/view/${props.data.bbsseq}`}>{props.data.title}</TitleLink>
                <ContentLink to={`/view/${props.data.bbsseq}`}
                    dangerouslySetInnerHTML={{
                                                __html: removeImageTags(props.data.content),
                                            }} />
                <ProfileDiv>
                    <Link to={`/view/${props.data.bbsseq}`}>
                    <img
                        src={`http://localhost:3000/images/profile/${props.data.profile}`}
                        alt="프로필"
                        width="30"
                        height="30"
                    />
                    <span>{props.data.nickname}</span>
                    </Link>
                </ProfileDiv>

                <span style={{ position:'absolute', top:'0', right:'0'}}>
                    {props.data.thumnail !== undefined && 
                        <img style={{ objectFit:'cover'}}
                            src={`https://firebasestorage.googleapis.com/v0/b/healthygym-8f4ca.appspot.com/o/files%${props.data.thumnail}?alt=media`} 
                            alt=''
                            width={70}
                            height={70}/>
                    }
                    {imgNum > 1 &&
                        <ImgLayer>
                            +{imgNum - 1}
                        </ImgLayer>
                    }
                </span>
            </div>
            
            <InfoDiv>
                <span>
                    <Icon name='eye' size='tiny' />
                    <span>{props.data.readcount}</span>
                </span>
                <span>
                    <Icon name='thumbs up outline' size='tiny' />
                    <span>{props.data.likecount}</span>
                </span>
                <span>
                    <Icon name='comment outline' size='tiny' />
                    <span>{props.data.cmtcount}</span>
                </span>
                <span>
                    <Icon name='clock outline' size='tiny' />
                    <Moment fromNow>{props.data.wdate}</Moment>
                </span>
            </InfoDiv>
        </div>
    );
}
