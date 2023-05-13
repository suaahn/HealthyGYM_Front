import React from 'react';
import Moment from 'react-moment'; // npm i moment react-moment
import 'moment/locale/ko';
import { Link } from 'react-router-dom';

import defaultImage from '../../asset/GYM.png';

export default function Card(props) {

  let linkTo;
  switch (props.data.bbsseq) {
    case 2:
      linkTo = `/community/view/${props.data.bbsseq}`;
      break;
    case 3:
    case 4:
      linkTo = `/view/${props.data.bbsseq}`;
      break;
    case 5:
      linkTo = `/mate/health/view/${props.data.bbsseq}`;
      break;
    case 10:
      linkTo = `/mate/meal/${props.data.bbsseq}`;
      break;
    default:
      linkTo = `/view/${props.data.bbsseq}`;
  }

  return (
    <div className="ui card">
      <div className="content">
        <div className="right floated meta">
          <Moment fromNow>{props.data.wdate}</Moment>
        </div>
        <img className="ui avatar image"
          src={`http://localhost:3000/images/profile/${localStorage.getItem('profile')}`} 
          alt="profile" />{props.data.nickname} 
      </div>
      <div className="image">
        <img 
          src={props.data.thumnail ? `https://firebasestorage.googleapis.com/v0/b/healthygym-8f4ca.appspot.com/o/files%${props.data.thumnail}?alt=media` : defaultImage} 
          alt="thumbnail"/>
      </div>
      <div className="content" style={{textAlign:'center', fontWeight:'bold'}}>
        <Link to={linkTo}>{props.data.title}</Link>
      </div>
      <div className="content">
        <span className="right floated">
          <i className="heart outline like icon"></i>
          {props.data.likecount}
        </span>
        <i className="comment icon"></i>
        {props.data.cmtcount}
      </div>
    </div>      
  );
}
