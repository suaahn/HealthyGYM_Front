import { useEffect, useRef, useState } from "react";
import axios from '../../utils/CustomAxios';
import { Button, Input, Label, Modal, Table } from "semantic-ui-react";

export default function Chatting(props) {
    const [memberseq, setMemberseq] = useState(parseInt(localStorage.getItem("memberseq"), 10));
    const [messages, setMessages] = useState([]); // 대화기록
    const [recommendmealrecv, setRecommendmealRecv] = useState([]); // 추천받은 음식들 배열로 받기
    const [writemessage, setWriteMessage] = useState(""); // 사용자가 보내는 쪽지
    
    const scrollRef = useRef();

    useEffect(function(){
        loadMessages(props.memberseq, memberseq);
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, []);

    const loadMessages = (target, memberseq) => {
        axios.post("http://localhost:3000/getmessages", null, {
            params: { target: target, memberseq: memberseq }
          })
          .then((res) => {
            console.log(res.data);
            setMessages(res.data.message);
            setRecommendmealRecv(res.data.fooddto);
            //setFirstOpen(true);
          })
          .catch((error) => {
            console.log(error);
          });
    };

    const renderModalContent = () => {
        return (
          <div>
            {messages.map((message) => (
              <div key={message.msgseq} >
                <div  className="message-container">
                <div className={message.memberseq === memberseq ? 'message-receiver' : 'message-sender'}>
                <p>{message.message}</p>
                </div>
                </div>
                
                {/* 추천해준 식단이 있는경우. */}
                {recommendmealrecv.filter((meal) => meal.msgseq === message.msgseq).length > 0 && (
                  <div className="recommend-meal-container">
                    {renderRecommendMeal(recommendmealrecv.filter((meal) => meal.msgseq === message.msgseq))}
                  </div>
                )}

              </div>
            ))}
          </div>
        );
      };

    // Enter 입력시
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
          sendMessage();
        }
      };

      // 메시지 전송
      const sendMessage = () => {
        axios({
          method: "post",
          url: "http://localhost:3000/sendmessage",
          params: {
            target: props.memberseq,
            memberseq: memberseq,
            writemessage: writemessage
          },
        })
          .then((res) => {
            console.log(res);
      
            // 사용자 후처리
      
            // 채팅방에 처리
            const lastMessage = messages[messages.length - 1]; // 이전 메시지 중 마지막 메시지 가져오기
            const newMsgseq = lastMessage ? lastMessage.msgseq + 1 : 1; // 이전 메시지의 msgseq 값에 1을 더한 값
            const newMessage = { msgseq: newMsgseq, memberseq: memberseq, message: writemessage };
      
            setMessages((prevMessages) => [...prevMessages, newMessage]);
      
            // 채팅글 지우기
            setWriteMessage("");
      
            // 스크롤을 최하단으로 이동
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      
            // 가장 마지막대화 처리
          })
          .catch((error) => {
            console.log(error);
          });
      };

    const renderRecommendMeal = (recommendMeal) => {

        // 렌더링용
        const breakfastList = recommendMeal.filter((meal) => meal.whenmeal === 1);
        const lunchList = recommendMeal.filter((meal) => meal.whenmeal === 2);
        const dinnerList = recommendMeal.filter((meal) => meal.whenmeal === 3);

        // 총 영양성분 계산용
        const totalCalories = recommendMeal.reduce((acc, meal) => acc + parseInt(meal.nutrcont1), 0);
        const totalCarbo = recommendMeal.reduce((acc, meal) => acc + parseInt(meal.nutrcont2), 0);
        const totalProtein = recommendMeal.reduce((acc, meal) => acc + parseInt(meal.nutrcont3), 0);
        const totalFat = recommendMeal.reduce((acc, meal) => acc + parseInt(meal.nutrcont4), 0);

        return (
          <div>
              <Table  style={{ tableLayout: "fixed" }}>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell style={{ width: "80px", textAlign: "center"}}>분류</Table.HeaderCell>
                  <Table.HeaderCell style={{ width: "190px", textAlign: "center" }}>식품명</Table.HeaderCell>
                  <Table.HeaderCell style={{ width: "100px", textAlign: "center"}}>1회 제공량</Table.HeaderCell>
                  <Table.HeaderCell style={{ width: "60px", textAlign: "center"}}>Kcal</Table.HeaderCell>
                </Table.Row>
              </Table.Header>

                <Table.Body>

                {breakfastList.length > 0 && (
                  <>
                    <Table.Row>
                      <Table.Cell colSpan="4">
                        <Label ribbon>아침식단</Label>
                      </Table.Cell>
                    </Table.Row>
                    {breakfastList.map((meal, index) => (
                      <Table.Row key={`${meal.recseq}-${index}`}>
                      <Table.Cell>{index+1}</Table.Cell>
                      <Table.Cell>{meal.desckor}</Table.Cell>
                      <Table.Cell style={{ textAlign: "center"}}>{meal.servingwt}g</Table.Cell>
                      <Table.Cell style={{ textAlign: "center"}}>{Math.floor(meal.nutrcont1)}</Table.Cell>
                      </Table.Row>
                    ))}
                  </>
                )}

                {dinnerList.length > 0 && (
                  <>
                    <Table.Row>
                      <Table.Cell colSpan="4">
                        <Label ribbon>점심식단</Label>
                      </Table.Cell>
                    </Table.Row>
                    {dinnerList.map((meal, index) => (
                      <Table.Row key={`${meal.recseq}-${index}`}>
                      <Table.Cell>{index+1}</Table.Cell>
                      <Table.Cell>{meal.desckor}</Table.Cell>
                      <Table.Cell style={{ textAlign: "center"}}>{meal.servingwt}g</Table.Cell>
                      <Table.Cell style={{ textAlign: "center"}}>{Math.floor(meal.nutrcont1)}</Table.Cell>
                      </Table.Row>
                    ))}
                  </>
                )}

                  {lunchList.length > 0 && (
                  <>
                    <Table.Row>
                      <Table.Cell colSpan="4">
                        <Label ribbon>저녁식단</Label>
                      </Table.Cell>
                    </Table.Row>
                    {lunchList.map((meal, index) => (
                      <Table.Row key={`${meal.recseq}-${index}`}>
                      <Table.Cell>{index+1}</Table.Cell>
                      <Table.Cell>{meal.desckor}</Table.Cell>
                      <Table.Cell style={{ textAlign: "center"}}>{meal.servingwt}g</Table.Cell>
                      <Table.Cell style={{ textAlign: "center"}}>{Math.floor(meal.nutrcont1)}</Table.Cell>
                      </Table.Row>
                    
                    ))}
                  </>
                )}
                </Table.Body>

                <Table.Footer>
                  <Table.Row>
                  <Table.HeaderCell 
                    textAlign="left"
                    style={{
                      fontWeight: "bold",
                      fontSize: "10pt",
                      color: "#666666",
                      marginBottom: "1rem"
                    }}
                    colSpan={4} // colSpan 속성 추가
                  >
                    총 {recommendMeal.length}개 
                    <br/>
                    {(totalCalories)}Kcal 
                    &nbsp;&nbsp;
                    탄수화물 {(totalCarbo)}g
                    &nbsp;&nbsp;
                    단백질 {(totalProtein)}g 
                    &nbsp;&nbsp;
                    지방 {(totalFat)}g
                  </Table.HeaderCell>
                  </Table.Row>
                  
                </Table.Footer>
              </Table>
          </div>
        );
      };

    

    return (
        <Modal
            onClose={() => props.setSecondOpen(false)}
            onOpen={() => props.setSecondOpen(true)}
            open={props.secondOpen}
            className="message-modal2"
            ref={scrollRef}
          >
            <Modal.Header>
                <img src={`http://localhost:3000/images/profile/${props.profile}`} width="30" /> "{props.nickname}" 님과의 쪽지
            </Modal.Header>
            <Modal.Content scrolling>
              {renderModalContent()}
            </Modal.Content>
            <Modal.Actions>
              {/* 데이터 입력 및 전송 */}
              <Input
                fluid
                placeholder="메시지 입력.."
                type="text"
                value={writemessage || ''}
                onChange={(e) => setWriteMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                size='large'
                action={{
                  color: 'teal',
                  labelPosition: 'left',
                  icon: 'paper plane outline',
                  content: '전송',
                  onClick: sendMessage
                }}
              />
                  <br/>
                
              <Button onClick={() => props.setSecondOpen(false)}>Close</Button>
            </Modal.Actions>
          </Modal>
    );
}