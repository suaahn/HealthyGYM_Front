import React, { useState, useEffect } from 'react';
import { Button, Icon, Modal } from 'semantic-ui-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FloatingMenu = ({ bbsseq, updateLikeCount }) => {
  const [isLoggedIn, setIsLoggedIn] = useState();
  const [isWriter, setIsWriter] = useState(false);
  const [activeItem, setActiveItem] = useState('');
  const [heartIcon, setHeartIcon] = useState('heart outline');
  const [showReportPopup, setShowReportPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);

  let navigate = useNavigate();

  useEffect(() => {
    const s = localStorage.getItem("memberseq");
    if (s !== null) {
      setIsLoggedIn(s);
      setIsWriter(parseInt(s) === parseInt(isLoggedIn));
    } else {
      setIsWriter(false);
    }
    setActiveItem('');
  }, [isLoggedIn]);

  // 좋아요 확인
  useEffect(() => {
    if(isLoggedIn !== 0) {
      axios.get(`http://localhost:3000/BodyGallery/findBodyLike/${bbsseq}?memberseq=${isLoggedIn}`)
      .then(res => {
        if (res.data === 1) {
          setHeartIcon('heart');
        }
      })
      .catch(err => console.log(err));
    }
  }, [bbsseq, isLoggedIn]);

  const handleItemClick = (e, { name }) => {
    setActiveItem(name);
    if (name === 'like') {
      if (heartIcon === 'heart outline') {
        axios.post(`http://localhost:3000/BodyGallery/saveBodyLike/${bbsseq}`, { memberseq: isLoggedIn, bbsseq }, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then(res => {
          if (res.data === "Successfully saved") {
            setHeartIcon('heart');
            updateLikeCount(prevCount => prevCount + 1);
          }
        })
        .catch(err => console.log(err));
      } else {
        axios.post(`http://localhost:3000/BodyGallery/deleteBodyLike/${bbsseq}?memberseq=${isLoggedIn}`, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then(res => {
          if (res.data === "Successfully deleted") {
            setHeartIcon('heart outline');
            updateLikeCount(prevCount => prevCount - 1);
          }
        })
        .catch(err => console.log(err));
      }
    }else if (name === 'report') {
      setShowReportPopup(true);
    }else if (name === 'edit') {
      navigate(`/community/BodyGallery/update/${bbsseq}`);
    }else if (name === 'delete') {
      setShowDeletePopup(true);
    }
  };
  // 게시글 신고
  const handleReportButtonClick = () => {
    axios.post(`http://localhost:3000/BodyGallery/updateBodyReport/${bbsseq}`)
    .then(response => {
      console.log(response.data);
      if (response.data === "Successfully updated") {
        setShowReportPopup(false);
      } else {
        setShowReportPopup(false);
      }
    })
    .catch(error => {
      setShowReportPopup(false);
    });
  };
  // 게시글 삭제
  const handleDeleteButtonClick = () => {
    axios.post(`http://localhost:3000/BodyGallery/deleteBodyById/${bbsseq}`)
    .then(response => {
      console.log(response.data);
      if (response.data === "Successfully deleted") {
        setShowDeletePopup(false);
        navigate(`/community/2`);
      } else {
        setShowDeletePopup(false);
      }
    })
    .catch(error => {
      setShowDeletePopup(false);
    });
  };

  const buttonStyle = {
    backgroundColor: '#5271FF',
    transform: 'translateY(-50%)',
    marginBottom: '16px',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', position: 'sticky', top: '50%' }}>
      {isLoggedIn && (
        <>
          <Button
            circular
            size='large'
            icon={heartIcon}
            name='like'
            active={activeItem === 'like'}
            onClick={handleItemClick}
            style={buttonStyle}
          />
          <Button
            circular
            size='large'
            icon='comment'
            name='comment'
            active={activeItem === 'comment'}
            onClick={handleItemClick}
            style={buttonStyle}
          />
          <Button
            circular
            size='large'
            icon='exclamation triangle'
            name='report'
            active={activeItem === 'report'}
            onClick={handleItemClick}
            style={buttonStyle}
          />
          <Modal open={showReportPopup} size='mini'>
            <Modal.Header>게시글을 신고하시겠습니까?</Modal.Header>
            <Modal.Actions>
              <Button onClick={handleReportButtonClick} color='red'>Yes</Button>
              <Button onClick={() => setShowReportPopup(false)}>No</Button>
            </Modal.Actions>
          </Modal>
          {isWriter && (
            <>
              <Button
                circular
                size='large'
                icon='pencil'
                name='edit'
                active={activeItem === 'edit'}
                onClick={handleItemClick}
                style={buttonStyle}
              />
              <Button
                circular
                size='large'
                icon='trash'
                name='delete'
                active={activeItem === 'delete'}
                onClick={handleItemClick}
                style={buttonStyle}
              />
              <Modal open={showDeletePopup} size='mini'>
                <Modal.Header>게시글을 삭제하시겠습니까?</Modal.Header>
                <Modal.Actions>
                  <Button onClick={handleDeleteButtonClick} color='red'>Yes</Button>
                  <Button onClick={() => setShowDeletePopup(false)}>No</Button>
                </Modal.Actions>
              </Modal>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default FloatingMenu;
