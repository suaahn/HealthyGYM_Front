import React, { useState } from 'react';


function Modal(props) {
  const [bbsseq, setBbsseq] = useState(props.bbsseq);

  const handleEdit = () => {
    <p>test</p>
  };

  const handleDelete = () => {
    <p>test2</p>
  };

  // if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>게시물 수정/삭제</h2>
        <div className="modal-buttons">
          <button onClick={handleEdit}>수정</button>
          <button onClick={handleDelete}>삭제</button>
        </div>
        <button className="close-btn">
          X
        </button>
      </div>
    </div>
  );
}

export default Modal;
