import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Viewer } from '@toast-ui/react-editor';
import { useParams } from 'react-router-dom';
import { Card, Image, Grid } from 'semantic-ui-react';
import FloatingMenu from './FloatingMenu';
import Moment from 'react-moment';
import 'moment/locale/ko';

export default function BodyGalleryDetail() {
  const { bbsseq } = useParams();
  const [detail, setDetail] = useState(null);
  const [likeCount, setLikeCount] = useState(); 

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
            <Image
              floated="left"
              size="mini"
              src={`http://localhost:3000/images/profile/${localStorage.getItem('profile')}`}
              alt="profile"
            />
            {nickname}
            <Card.Meta style={{ float: 'right' }}>
              <Moment fromNow>{wdate}</Moment>
            </Card.Meta>
          </Card.Content>
          <Card.Content style={{ padding: '20px' }}>
            <Card.Header>{title}</Card.Header>
            <hr />
            <Card.Description>
              <Viewer initialValue={content} />
            </Card.Description>
          </Card.Content>
          <Card.Content extra>
            <p>조회수: {readcount}</p>
            <p>추천수: {likeCount}</p>
          </Card.Content>
        </Card>
      </Grid.Column>
      <Grid.Column width={1}>
        <FloatingMenu isLoggedIn={true} isWriter={true} bbsseq={bbsseq} updateLikeCount={updateLikeCount} />
      </Grid.Column>
    </Grid>
  );
}

