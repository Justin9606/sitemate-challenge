import React from 'react';
import styled from 'styled-components/native';

//types from Article.ts
import {Article} from '../types';

type Props = {
  article: Article;
};

const ArticleItem: React.FC<Props> = ({article}) => {
  return (
    <ItemContainer>
      <Title>{article.title}</Title>
      <Description>{article.description}</Description>
    </ItemContainer>
  );
};

export default ArticleItem;

const ItemContainer = styled.View`
  padding: 20px;
  border-bottom-width: 1px;
  border-bottom-color: #ccc;
  background-color: #fff;
  width: 100%;
`;

const Title = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #2c2b2b;
`;

const Description = styled.Text`
  font-size: 16px;
  color: #666;
`;
