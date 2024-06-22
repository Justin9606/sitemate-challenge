import React, {useState, useEffect} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Alert,
  Text,
  Button,
  TouchableOpacity,
} from 'react-native';
import styled from 'styled-components/native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

// Reusable component (see components folder)
import ArticleItem from '../components/ArticleItem';
// Types from Article.ts
import {Article} from '../types';
import {RootStackParamList} from '../types';
// Custom hook
import useApiRequest from '../hooks/useApiRequest';
import useDebounce from '../hooks/useDebounce';

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Articles'
>;

const HomeScreen: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const debouncedQuery = useDebounce(query, 300); // Debounced query
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const {data, loading, error} = useApiRequest<{articles: Article[]}>(
    '/everything',
    {
      q: debouncedQuery || 'everything', // Default to 'everything' if searchQuery is empty
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

  const handleArticlePress = (title: string, url: string) => {
    navigation.navigate('WebView', {title, url});
  };

  return (
    <Container>
      <SearchBox>
        <StyledInput
          placeholder="Search for news..."
          value={query}
          onChangeText={setQuery}
        />
        <Button title="Search" onPress={() => setQuery(query)} />
      </SearchBox>
      {loading && <ActivityIndicator size="large" />}
      {!loading && !error && filteredArticles && (
        <FlatList
          data={filteredArticles}
          keyExtractor={(item, index) => item.url + index}
          renderItem={({item}) => {
            return (
              <TouchableOpacity
                onPress={() => handleArticlePress(item.title, item.url)}>
                <ArticleItem article={item} />
              </TouchableOpacity>
            );
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

const StyledInput = styled.TextInput`
  flex: 1;
  border: 1px solid #ccc;
  padding: 10px;
  margin-right: 10px;
`;
