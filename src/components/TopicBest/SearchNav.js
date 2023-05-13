import React from 'react';
import { Menu, Dropdown } from 'semantic-ui-react';

export default function SearchNav(props) {

  const leftOptions = [
    { key: 'all', text: '전체', value: '0' },
    { key: 'bodyGallery', text: '바디갤러리', value: '2' },
    { key: 'info', text: '정보', value: '3' },
    { key: 'free', text: '자유', value: '4' },
    { key: 'mealRecommend', text: '식단추천', value: '11' },
    { key: 'healthMate', text: '운동메이트', value: '5' },
    { key: 'mealMate', text: '식단메이트', value: '10' },
  ];

  const rightOptions = [
    { key: 'recommend', text: '추천순', value: 'likecount desc, wdate' },
    { key: 'latest', text: '최신순', value: 'wdate' },
  ];

  return (
    <Menu secondary>
      <Menu.Item>
        <Dropdown
          selection
          options={leftOptions}
          defaultValue='all'
          value={props.bbstag}
          onChange={(e, { value }) => props.setBbstag(value)}
          style={{ padding:'9px 16px'}}
        />
      </Menu.Item>
      <Menu.Menu position='right'>
        <Menu.Item>
          <Dropdown
            selection
            options={rightOptions}
            defaultValue='likecount desc, wdate'
            value={props.order}
            onChange={(e, { value }) => props.setOrder(value)}
            style={{ padding:'9px 16px'}}
          />
        </Menu.Item>
      </Menu.Menu>
    </Menu>
  );
}
