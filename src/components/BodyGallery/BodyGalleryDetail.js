import React, { useEffect, useState } from 'react';
import axios from '../../utils/CustomAxios';
import { Viewer } from '@toast-ui/react-editor';
import { Link, useParams } from 'react-router-dom';
import { Card, Image, Grid, Divider } from 'semantic-ui-react';
import FloatingMenu from './FloatingMenu';
import Moment from 'react-moment';
import 'moment/locale/ko';

export default function BodyGalleryDetail() {
  const { bbsseq } = useParams();
  const [detail, setDetail] = useState(null);
  const [likeCount, setLikeCount] = useState(); 

  // floating Menu와 연결
  useEffect(() => {
    const memberseq = localStorage.getItem('memberseq');
    axios.get(`http://localhost:3000/BodyGallery/findBodyById/${bbsseq}?memberseq=${memberseq}`)
      .then(res => {
        setDetail(res.data);
        setLikeCount(res.data.likecount); 
      })
      .catch(err => console.error(err));
  }, [bbsseq]);

  
  const updateLikeCount = (newCount) => {
    setLikeCount(newCount);
  }

  if (!detail) return <div>Loading...</div>;

  const { nickname, wdate, readcount, title, content } = detail;

  return (
    <Grid>
      <Grid.Column width={15}>
        <Card fluid>
          <Card.Content>
            <Link to={`/userpage/${detail.memberseq}/profile`}> 
            <Image
              floated="left" 
              size="mini"
              src={`http://localhost:3000/images/profile/${detail.profile}`}
              alt="profile"
            />
            <span style={{ display:'inline-block', margin: '7px 0', fontSize:'15px', color:'black'}}>{nickname}</span>
            </Link>
            <Card.Meta style={{ float: 'right' }}>
              <Moment fromNow>{wdate}</Moment>
            </Card.Meta>
          </Card.Content>
          <Card.Content style={{ padding: '20px' }}>
            <Card.Header>{title}</Card.Header>
            <Divider />
            <Card.Description>
              <Viewer initialValue={content} />
            </Card.Description>
          </Card.Content>
          <Card.Content extra>
            <p>조회수 {readcount}</p>
            <p>추천수 {likeCount}</p>
          </Card.Content>
        </Card>
      </Grid.Column>
      <Grid.Column width={1}>
        <FloatingMenu isLoggedIn={true} memberseq={detail.memberseq} bbsseq={bbsseq} updateLikeCount={updateLikeCount} />
      </Grid.Column>
    </Grid>
  );
}

