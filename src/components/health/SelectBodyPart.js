import { Button } from 'semantic-ui-react';
import styled from 'styled-components';

export default function SelectBodyPart(props) {
    
    const koBody = ["등", "가슴", "어깨", "팔", "복근", "하체", "유산소"];

    const changeButton = (index) => {
        props.setBodyPart((current) => {
            const newArr = [...current];
            newArr[index] = !newArr[index];
            return newArr;
        });
    };

    return (
        <>
            {koBody.map((value, i) => {
                return (
                    <Button circular basic size='small' key={i} style={{ fontWeight:'600'}}
                        onClick={() => {changeButton(i)}}
                        className={props.bodyPart[i] ? "active":""}>
                        &nbsp;{value}&nbsp;
                    </Button>
                );
            })}
        </>
    );
}
