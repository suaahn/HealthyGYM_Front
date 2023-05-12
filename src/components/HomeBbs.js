import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Divider, Icon } from "semantic-ui-react";
import styled from "styled-components";
import { UnorderedList } from "./homeStyle";

export default function HomeBbs(props) {
    const [list, setList] = useState([]);

    useEffect(() => {
      axios.get('http://localhost:3000/homebbs', { params:{"bbstag":props.bbstag} })
      .then(res => {
        //console.log(JSON.stringify(res.data));
        setList(res.data);
      })
      .catch(error => {
        console.log(error);
      });
    }, []);
  
    return (
        <UnorderedList>
            {list.map((item, i) => {
                return (
                    <li key={i}>
                        <Link to={`/view/${item.bbsseq}`}>{item.title}</Link>
                        <span>
                            <Icon name='eye' />
                            {item.readcount}
                        </span>
                    </li>
                );
            })}
        </UnorderedList>
  );
}

