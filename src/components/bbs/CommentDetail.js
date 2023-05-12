import React, { useReducer, useState } from 'react';
import Moment from 'react-moment'; // npm i moment react-moment
import 'moment/locale/ko';

import CommentForm from './CommentForm';
import { Button, Divider, Dropdown, Form, Icon, Modal } from 'semantic-ui-react';
import { InfoDiv } from './bbsStyle';
import { useNavigate } from 'react-router-dom';
import axios from '../../utils/CustomAxios';
import '../../App.css'

export default function CommentDetail(props){
    const [display, setDisplay] = useState(false);
    const [updateMode, setUpdateMode] = useState(false);
    const [text, setText] = useState('');
    let navigate = useNavigate();

    const handleReply = () => {
        if(localStorage.getItem("memberseq") == null) {
            alert('로그인 후 작성 가능합니다.');
            return;
        }
        setDisplay(!display);
    };
    // 댓글 수정
    const handleUpdateClick = () => {
        if(text.trim() === ''){
            alert('내용을 입력해주세요.');
            return;
        }
        axios.post("http://localhost:3000/updatebbscomment", null, 
                        { params:{ "commentseq":props.data.commentseq, "cmtcontent":text } })
        .then(res => {
            console.log(res.data);
            if(res.data === "OK"){
                alert("댓글이 수정되었습니다");
                navigate(0);
            }else{
                alert("다시 시도해주세요");
            }
        })
        .catch(function(err){
            alert(err);
        })
    };
    // 댓글 삭제
    const handleDeleteClick = async () => {
        // 삭제 확인 모달창
        dispatch({ type: 'close' });
        
        await axios.post(`http://localhost:3000/deletebbscomment?commentseq=${props.data.commentseq}`)
        .then((res) => {
            if(res.data === "OK") {
                alert("글이 삭제되었습니다.");
                navigate(0);
            }
        })
        .catch((error) => {
            alert(error);
        });
    };
    // 삭제 모달창
    const [state, dispatch] = useReducer(exampleReducer, {
        open: false,
        dimmer: undefined,
    });
    const { open, dimmer } = state;
    function exampleReducer(state, action) {
        switch (action.type) {
            case 'close':
                return { open: false };
            case 'open':
                return { open: true, dimmer: action.dimmer };
            default:
                throw new Error('Unsupported action');
        }
    };

    return (
        <div className={props.data.step === 0 ? 'comment-box':'reply-box'}>
            {/* <img src={props.data.profile} alt='' style={{ border-radius: '100%' }} /> */}
            <p>{props.data.nickname}</p>
            {!updateMode ? 
            <p>{props.data.cmtcontent}</p>
            :<Form>
                <textarea style={{ height:'auto', minHeight: '76px', resize: 'none', overflow: 'hidden'}}
                    value={text}
                    onChange={(e) => setText(e.target.value)} 
                    placeholder='댓글을 남겨주세요.'
                ></textarea>
                <div style={{ margin: '5px 0px 20px auto'}}>
                    <Button onClick={handleUpdateClick}>
                        <Icon name='edit' />등 록
                    </Button>
                    <Button onClick={() => setUpdateMode(false)}>취소</Button>
                </div>
            </Form>
            }
            <InfoDiv>
                <span>
                    <Icon name='clock outline' />
                    <Moment fromNow>{props.data.regdate}</Moment>
                </span>
                
                {props.data.step === 0 &&
                    <span onClick={handleReply}>
                        <Icon name='comment outline' />
                        <span>대댓글</span>
                    </span>
                }
                <span>
                    {props.data.memberseq == localStorage.getItem('memberseq') &&
                    <Dropdown>
                        <Dropdown.Menu>
                            <Dropdown.Item text='수정' onClick={() => {setUpdateMode(true); setText(props.data.cmtcontent);}} />
                            <Dropdown.Item text='삭제' onClick={() => dispatch({ type: 'open', size: 'mini' })} />
                        </Dropdown.Menu>
                    </Dropdown>
                    }
                </span>
            </InfoDiv>

            <Modal
                size="mini"
                open={open}
                dimmer={dimmer}
                onClose={() => dispatch({ type: 'close' })}
            >
                <Modal.Content>
                    <p>게시글을 삭제하시겠습니까?</p>
                </Modal.Content>
                <Modal.Actions>
                <Button onClick={() => dispatch({ type: 'close' })}>
                    취소
                </Button>
                <Button positive onClick={() => handleDeleteClick()}>
                    확인
                </Button>
                </Modal.Actions>
            </Modal>

            {display &&
                <CommentForm 
                    bbsseq={props.data.bbsseq} 
                    getComments={props.getComments}
                    commentseq={props.data.commentseq}
                    setDisplay={setDisplay}
                    setCmtList={props.setCmtList}
                    setPage={props.setPage} />
            }
            
        </div>
    );
}
