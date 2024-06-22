import React, {useState, useEffect, useRef} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Alert,
  Text,
  Animated,
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

  const inputWidthAnim = useRef(new Animated.Value(1)).current; // Initial width scale for the input

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

  useEffect(() => {
    Animated.timing(inputWidthAnim, {
      toValue: query ? 0.9 : 1, // Shrink to 90% if there's text, expand to 100% if not
      useNativeDriver: false, // Width animation can't use native driver
      duration: 300,
    }).start();
  }, [query]);

  const handleClearPress = () => {
    setQuery('');
  };

  // Filter out articles with title '[Removed]'
  const filteredArticles = data?.articles.filter(
    article => article.title !== '[Removed]',
  );

  return (
    <Container>
      <SearchBox>
        <AnimatedInput
          placeholder="Search for news..."
          value={query}
          onChangeText={setQuery}
          style={{flex: inputWidthAnim}}
        />
        {query.length > 0 && (
          <ClearButton onPress={handleClearPress}>
            <ClearText>Clear</ClearText>
          </ClearButton>
        )}
      </SearchBox>
      {loading && <ActivityIndicator size="large" />}
      {!loading && !error && filteredArticles && (
        <FlatList
          data={filteredArticles}
          keyExtractor={(item, index) => item.url + index}
          renderItem={({item}) => {
            return (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('WebView', {
                    title: item.title,
                    url: item.url,
                  })
                }>
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
  align-items: center;
  margin-bottom: 20px;
`;

const StyledInput = styled.TextInput`
  border: 1px solid #ccc;
  padding: 10px;
`;
const ClearButton = styled.TouchableOpacity`
  margin-left: 10px;
`;
const ClearText = styled.Text`
  color: #007aff;
  font-size: 16px;
`;

const AnimatedInput = Animated.createAnimatedComponent(StyledInput);
