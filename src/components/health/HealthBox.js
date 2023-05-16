import React, { useEffect, useState } from 'react';
import Moment from 'react-moment'; // npm i moment react-moment
import 'moment/locale/ko';
import { Link } from "react-router-dom";
import { Icon } from 'semantic-ui-react';
import ADDRESS_LIST from '../../asset/region.json';
import { InfoDiv } from '../bbs/bbsStyle';

import { HealthInfoDiv, HealthTitleLink, ProfileDiv } from './healthStyle';

export default function HealthBox(props) {
    const [bodyPart, setBodyPart] = useState([false,false,false,false,false,false,false]);
    const koBody = ["등", "가슴", "어깨", "팔", "복근", "하체", "유산소"];
    const addressFirst = ADDRESS_LIST.data[props.data.addressfirst][0];

    useEffect(() => {

        setBodyPart([props.data.back, props.data.chest, props.data.shoulder, props.data.arm, props.data.abs, props.data.leg, props.data.run]);
        
    }, []);

    return (
        <div>
            <ProfileDiv>
                <Link to={`/mate/health/view/${props.data.bbsseq}`}>
                    <img
                        src={`http://localhost:3000/images/profile/${props.data.profile}`}
                        alt="프로필"
                        width="30"
                        height="30"
                    />
                    <span>{props.data.nickname}</span>
                </Link>
            </ProfileDiv>

            <HealthTitleLink to={`/mate/health/view/${props.data.bbsseq}`}>{props.data.title}</HealthTitleLink>
            
            <HealthInfoDiv>
                <Link to={`/mate/health/view/${props.data.bbsseq}`}>
                    <span>{addressFirst}</span>
                    {addressFirst === "전체" ?
                    <span> 지역</span>
                    : 
                    <span> {ADDRESS_LIST.data[props.data.addressfirst][1][props.data.addresssecond]}</span>
                    }
                    <span style={{ borderLeft:'2px solid rgba(34,36,38,.15)', margin:'0 10px', padding:'0 10px'}}>{props.data.mdate} {props.data.mtime}</span>
                    <div>
                        <span style={{ borderRight:'2px solid rgba(34,36,38,.15)', marginRight:'10px', paddingRight:'10px'}}>운동 부위</span>
                        {bodyPart.map((v, i) => {
                        if(v == 0) return;
                        return (
                            <span key={i}>{koBody[i]} </span>
                        );
                    })}</div>
                </Link>
            </HealthInfoDiv>
            
            <InfoDiv>
                <span>
                    <Icon name='eye' size='tiny' />
                    <span>{props.data.readcount}</span>
                </span>
                <span>
                    <Icon name='clock outline' size='tiny' />
                    <Moment fromNow>{props.data.wdate}</Moment>
                </span>
            </InfoDiv>
        </div>
    );
}
