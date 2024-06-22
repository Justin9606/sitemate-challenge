import React, {useState, useEffect} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Alert,
  Text,
  TextInput,
} from 'react-native';
import styled from 'styled-components/native';

// Reusable component (see components folder)
import ArticleItem from '../components/ArticleItem';
// Types from Article.ts
import {Article} from '../types';
// Custom hook
import useApiRequest from '../hooks/useApiRequest';
import useDebounce from '../hooks/useDebounce';

const HomeScreen: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const debouncedQuery = useDebounce(query, 300); // Debounced query

  const {data, loading, error} = useApiRequest<{articles: Article[]}>(
    '/everything',
    {
      q: debouncedQuery || 'everything',
      apiKey: 'ddb7bd6495e7436f9bed691b844c0a4c',
    },
  );

  useEffect(() => {
    if (error) {
      Alert.alert('Oops!', error, [{text: 'OK'}]);
    }
  }, [error]);

  // Filter out articles with title '[Removed]'
  const filteredArticles = data?.articles.filter(
    article => article.title !== '[Removed]',
  );

  return (
    <Container>
      <SearchBox>
        <StyledInput
          placeholder="Search for news..."
          value={query}
          onChangeText={setQuery}
        />
      </SearchBox>
      {loading && <ActivityIndicator size="large" />}
      {!loading && !error && filteredArticles && (
        <FlatList
          data={filteredArticles}
          keyExtractor={(item, index) => item.url + index}
          renderItem={({item}) => {
            return <ArticleItem article={item} />;
          }}
        />
      )}
      {!loading &&
        !error &&
        (!filteredArticles || filteredArticles.length === 0) && (
          <Text>No articles found</Text>
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

const StyledInput = styled(TextInput)`
  flex: 1;
  border: 1px solid #ccc;
  padding: 10px;
`;
