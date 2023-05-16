import React, { useState, useEffect } from 'react';
import { Button, Icon, Modal, Popup } from 'semantic-ui-react';
import axios from '../../utils/CustomAxios';
import { useNavigate } from 'react-router-dom';
import BodyGalleryComment from './BodyGalleryComment';

const FloatingMenu = ({ bbsseq, updateLikeCount, memberseq }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(0);
  const [isWriter, setIsWriter] = useState(false);
  const [activeItem, setActiveItem] = useState('');
  const [heartIcon, setHeartIcon] = useState('heart outline');
  const [showReportPopup, setShowReportPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);

  let navigate = useNavigate();

  useEffect(() => {
    const s = localStorage.getItem("memberseq");
    if (s !== null) {
    setIsLoggedIn(s);
    setIsWriter(parseInt(s) === parseInt(memberseq));
    } else {
    setIsWriter(false);
    }
    setActiveItem('');
    }, [isLoggedIn, bbsseq]);

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
    }else if (name === 'comment') {
      setShowCommentModal(true);
    }else if (name === 'edit') {
      navigate(`/community/gallery/update/${bbsseq}`);
    }else if (name === 'delete') {
      setShowDeletePopup(true);
    }
  };

  const closeModal = () => {
    setShowCommentModal(false);
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
    backgroundColor: '#E6EAFF',
    transform: 'translateY(-50%)',
    marginBottom: '16px',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', position: 'sticky', top: '50%' }}>
    {isLoggedIn && (
      <>
        <Popup
          trigger={
            <Button
              circular
              size='large'
              icon={heartIcon}
              name='like'
              active={activeItem === 'like'}
              onClick={handleItemClick}
              style={buttonStyle}
            />
          }
          content='좋아요' // 툴팁 추가
          position='right center'
        />
        <Popup
          trigger={
            <Button
              circular
              size='large'
              icon='comment'
              name='comment'
              active={activeItem === 'comment'}
              onClick={handleItemClick}
              style={buttonStyle}
            />
          }
          content='댓글'
          position='right center'
        />
        <Modal open={showCommentModal} onClose={closeModal} style={{ maxWidth: '550px', width: '100%' }}>
          <Modal.Content>
            <BodyGalleryComment memberseq={isLoggedIn} bbsseq={bbsseq} closeModal={closeModal} />
          </Modal.Content>
        </Modal>
        <Popup
          trigger={
            <Button
              circular
              size='large'
              icon='exclamation triangle'
              name='report'
              active={activeItem === 'report'}
              onClick={handleItemClick}
              style={buttonStyle}
            />
          }
          content='신고하기'
          position='right center'
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
            <Popup
              trigger={
                <Button
                  circular
                  size='large'
                  icon='pencil'
                  name='edit'
                  active={activeItem === 'edit'}
                  onClick={handleItemClick}
                  style={buttonStyle}
                />
              }
              content='수정하기'
              position='right center'
            />
            <Popup
              trigger={
                <Button
                  circular
                  size='large'
                  icon='trash'
                  name='delete'
                  active={activeItem === 'delete'}
                  onClick={handleItemClick}
                  style={buttonStyle}
                />
              }
              content='삭제하기'
              position='right center'
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
