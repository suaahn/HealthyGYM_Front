import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Icon } from "semantic-ui-react";
import { UnorderedList } from "./homeStyle";

export default function HomeBbs(props) {
    const [list, setList] = useState([]);
    const [url, setUrl] = useState("/view/");

    useEffect(() => {
      
      axios.get('http://localhost:3000/homebbs', { params:{"bbstag":props.bbstag} })
      .then(res => {
        //console.log(JSON.stringify(res.data));
        setList(res.data);
        if(props.bbstag == 2) {
          setUrl("/community/gallery/view/");
        }
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
                        <Link to={`${url}${item.bbsseq}`}>{item.title}</Link>
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

