import { Comment, Form, Button, Modal } from 'semantic-ui-react';
import { useState } from 'react';

export default function BodyGalleryComment() {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const handleReplyClick = () => {
    setShowReplyForm(!showReplyForm);
  };

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  return (
    <>
      <Comment.Group>
        <Comment>
          <Comment.Avatar src='https://react.semantic-ui.com/images/avatar/small/joe.jpg' />
          <Comment.Content>
            <Comment.Author as='a'>Joe Henderson</Comment.Author>
            <Comment.Metadata>
              <div>1 day ago</div>
            </Comment.Metadata>
            <Comment.Text>
              The hours, minutes and seconds stand as visible reminders that your
              effort put them all there.
            </Comment.Text>
            <Comment.Actions>
              <Comment.Action onClick={handleReplyClick}>Reply</Comment.Action>
              <Comment.Action onClick={handleModalOpen}>Reply in modal</Comment.Action>
            </Comment.Actions>
            {showReplyForm && (
              <Form reply>
                <Form.TextArea />
                <Button content='Add Reply' labelPosition='left' icon='edit' primary />
              </Form>
            )}
          </Comment.Content>
          <Comment.Group>
            <Comment>
              <Comment.Avatar src='https://react.semantic-ui.com/images/avatar/small/elliot.jpg' />
              <Comment.Content>
                <Comment.Author as='a'>Elliot Fu</Comment.Author>
                <Comment.Metadata>
                  <div>20 minutes ago</div>
                </Comment.Metadata>
                <Comment.Text>Thanks for your support!</Comment.Text>
              </Comment.Content>
            </Comment>
          </Comment.Group>
        </Comment>
      </Comment.Group>

      <Modal open={modalOpen} onClose={handleModalClose}>
        <Modal.Header>Reply to Joe Henderson</Modal.Header>
        <Modal.Content>
          <Form reply>
            <Form.TextArea />
            <Button content='Add Reply' labelPosition='left' icon='edit' primary />
          </Form>
        </Modal.Content>
      </Modal>
    </>
  );
}

