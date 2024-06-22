import React, {useEffect, useState} from 'react';
import {ActivityIndicator, FlatList, Button, Alert} from 'react-native';
import styled from 'styled-components/native';

//custom hook
import useApiRequest from '../hooks/useApiRequest';
//re-usable component (see components folder)
import ArticleItem from '../components/ArticleItem';
//types from Article.ts
import {Article} from '../types';

const HomeScreen: React.FC = () => {
  const [query, setQuery] = useState<string>('');

  const [searchQuery, setSearchQuery] = useState<string>('');
  const {data, loading, error} = useApiRequest<{article: Article[]}>(
    '/everything',
    {
      q: searchQuery,
      from: '2024-06-22',
      sortBy: 'publishedAt',
    },
  );

  //showing alert if there is an error
  useEffect(() => {
    if (error) {
      Alert.alert(
        'Oops!',
        'Something went wrong. Please check your internet connection and try again later.',
      );
    }
  }, [error]);

  //handler for text input change
  const handleInputChange = (text: string) => {
    setQuery(text);
  };

  const handleSearchPress = () => {
    if (query.trim()?.length === 0) {
      Alert.alert('Oops!', 'Please enter some text to search', [{text: 'Ok'}]);
      return;
    }
    setSearchQuery(query);
  };

  return (
    <Container>
      <SearchBox>
        <InputField
          placeholder={'Search for news...'}
          value={query}
          onChange={handleInputChange as any}
        />
        <Button title={'Search'} onPress={handleSearchPress} />
      </SearchBox>
      {loading && <ActivityIndicator size={'large'} />}

      {!loading && !error && (
        <FlatList
          data={data?.article}
          keyExtractor={item => item.url}
          renderItem={({item}) => <ArticleItem article={item} />}
        />
      )}
    </Container>
  );
};

export default HomeScreen;

const Container = styled.View`
  flex: 1;
  padding: 20px;
  background-color: #f5f5f5;
`;

const SearchBox = styled.View`
  flex-direction: row;
  margin-bottom: 20px;
`;

const InputField = styled.TextInput`
  flex: 1;
  border-width: 1px;
  border-color: #ccc;
  margin-right: 10px;
`;
