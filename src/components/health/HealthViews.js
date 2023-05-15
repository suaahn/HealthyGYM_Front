import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from '../../utils/CustomAxios';
import Moment from 'react-moment'; // npm i moment react-moment
import 'moment/locale/ko';

import { Viewer } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor-viewer.css';
import { CopyToClipboard } from "react-copy-to-clipboard";

import { shareKakao } from "../../utils/shareKakao.js";
import ADDRESS_LIST from '../../asset/region.json';
import { Button, Divider, Grid, Icon, Label, Loader } from 'semantic-ui-react';
import kakao from "../../asset/btn_kakao.png";
import { InfoSpan, URLShareButton, KakaoShareButton } from '../bbs/bbsStyle';
import { HealthTable, ProfileDiv } from './healthStyle';
import { Cookies } from 'react-cookie';
import HealthDropdown from './HealthDropdown';
import Chatting from '../Message/Chatting';

export default function HealthViews() {
    const [memberseq, setMemberseq] = useState(0);
    const [detail, setDetail] = useState();
    const [loading, setLoading] = useState(false); // 데이터를 모두 읽어 들일 때까지 rendering을 조절하는 변수
    const [bodyPart, setBodyPart] = useState([false,false,false,false,false,false,false]);
    const [secondOpen, setSecondOpen] = useState(false)

    const { bbsseq } = useParams();
    const currentUrl = `http://localhost:9100/mate/health/view/${bbsseq}`;
    const koBody = ["등", "가슴", "어깨", "팔", "복근", "하체", "유산소"];
    const cookies = new Cookies();

    useEffect(()=>{
      const s = localStorage.getItem("memberseq");
      if(s !== null) setMemberseq(s);
      
      // 오늘 해당 게시글을 조회했는지 쿠키로 확인
      if(cookies.get(bbsseq) === undefined) {
        detailData(bbsseq, true); // 첫 조회일 경우 조회수 up
        // 다음날 0시까지 쿠키 저장
        let d = new Date();
        cookies.set(bbsseq, 1, { 
          path: '/', 
          expires: new Date(d.getFullYear(), d.getMonth(), d.getDate()+1, 0, 0)
        });
      } else {
        detailData(bbsseq, false);
      }

      // 카카오톡 sdk 추가
      const script = document.createElement("script");
      script.src = "https://developers.kakao.com/sdk/js/kakao.js";
      script.async = true;
      document.body.appendChild(script);

      return () => document.body.removeChild(script);
    }, [bbsseq]);

    // 게시글 가져오기
    const detailData = async (seq, visit) => {
        await axios.get('http://localhost:3000/mate/getdetail', { params:{"bbsseq":seq, "visit":visit} })
        .then((res) => {

            //console.log(memberseq);
            //console.log(JSON.stringify(res.data));
            setDetail(res.data[0]);
            setBodyPart([res.data[0].back, res.data[0].chest, res.data[0].shoulder, res.data[0].arm, res.data[0].abs, res.data[0].leg, res.data[0].run]);
            setLoading(true);   // 여기서 rendering해줌
        })
        .catch((err) => {
            alert(err);
        });
    }
    if(loading === false){
        return <Loader active inline='centered' />
    }

    return (
        <div>
            <div>
                <h3>{detail.title}</h3>
                <ProfileDiv>
                    <Link to={`/userpage/${detail.memberseq}/profile`}>
                        <img
                            src={`http://localhost:3000/images/profile/${detail.profile}`}
                            alt="프로필 이미지"
                            width="30"
                            height="30"
                        />
                        <span style={{ fontWeight:'400'}}>{detail.nickname}</span>
                    </Link>
                </ProfileDiv>
                <InfoSpan>
                    <span>
                        <Icon name='clock outline' />
                        <Moment fromNow>{detail.wdate}</Moment>
                    </span>
                    <span>
                        <Icon name='eye' />
                        <span>{detail.readcount}</span>
                    </span>

                    <HealthDropdown bbsseq={bbsseq} memberseq={detail.memberseq} />
                </InfoSpan>
            </div><Divider /><br/>
            
            <Grid divided>
                <Grid.Column width={10}>
                    <Viewer initialValue={detail.content || ''} />
                </Grid.Column>
                <Grid.Column width={6}>
                    <HealthTable>
                        <tbody>
                        <tr>
                            <th>지역</th>
                            <td>
                            {ADDRESS_LIST.data[detail.addressfirst][0]}&nbsp;
                            {ADDRESS_LIST.data[detail.addressfirst][0] !== "전체" && 
                            ADDRESS_LIST.data[detail.addressfirst][1][detail.addresssecond]
                            }</td>
                        </tr>
                        <tr>
                            <th>헬스장</th>
                            {detail.center ? <td>{detail.center}</td> : <td>-</td>}
                        </tr>
                        <tr>
                            <th>시간</th>
                            <td>{detail.mdate} {detail.mtime}</td>
                        </tr>
                        
                        <tr>
                            <th colSpan={2}>운동부위</th>
                        </tr>
                        <tr>
                            <td colSpan={2}>{bodyPart.map((v, i) => {
                                if(v == 0) return;
                                return (
                                    <Label circular key={i}>{koBody[i]}</Label>
                                );
                            })}</td>
                        </tr>
                        </tbody>
                    </HealthTable>
                </Grid.Column>
            </Grid>

            <div style={{ height:'35px', marginTop:'30px' }}>

                <div style={{ float:'right' }}>
                    <CopyToClipboard text={currentUrl} style={{ verticalAlign: "top"}}>
                        <URLShareButton>URL</URLShareButton>
                    </CopyToClipboard>
                    
                    <KakaoShareButton onClick={() => shareKakao(currentUrl, detail.title)}>
                        <img alt='share to kakao' src={kakao} width={35} />
                    </KakaoShareButton>
                </div>
                <Button onClick={() => {setSecondOpen(true);}} 
                    className={memberseq == detail.memberseq && 'disabled'}
                    style={{ color:'white', backgroundColor:'#5271FF'}}>
                    <Icon name='envelope' /> 쪽지 보내기
                </Button>
            </div>
            
            <Chatting secondOpen={secondOpen} setSecondOpen={setSecondOpen} 
                memberseq={detail.memberseq} nickname={detail.nickname} profile={detail.profile}/>
        </div>
    );
}
