import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  TextInput
} from 'react-native';
import { useGetPostsQuery, Posts, useSearchPostsQuery } from '../store/apiSlice';
import PostItem from '../components/PostItem';
import debounce from 'lodash/debounce';


const HomeScreen = () => {
  const LIMIT = 10;
  const [skip, setSkip] = useState(0);
  const [allPosts, setAllPosts] = useState<Posts[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortMode, setSortMode] = useState<'none' | 'likes' | 'views'>('none');
  const [searchInput, setSearchInput] = useState('');


  const {
    data: searchData,
    isFetching: isSearching,
  } = useSearchPostsQuery(searchQuery, {
    skip: searchQuery.trim() === '', // skip if query is empty
  });


  const filteredPosts = (searchQuery.trim() === '' ? allPosts : searchData?.posts || [])
    .slice() // copy array before sorting
    .sort((a, b) => {
      if (sortMode === 'likes') return b.reactions.likes - a.reactions.likes;
      if (sortMode === 'views') return b.views - a.views;
      return 0;
    });

  const { data, error, isLoading, isFetching, refetch } = useGetPostsQuery({ limit: LIMIT, skip });

  const handleLoadMore = () => {
    if (!isFetching && data && allPosts.length < data.total) {
      setSkip((prev) => prev + LIMIT);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setSkip(0);
    await refetch(); // optional but ensures API call refresh
    setRefreshing(false);
  }, [refetch]);

  useEffect(() => {
    if (data?.posts) {
      if (skip === 0) {
        setAllPosts(data.posts); // initial load
      } else {
        setAllPosts((prev) => [...prev, ...data.posts]);
      }
    }
  }, [data]);


  const debouncedSearch = useCallback(
    debounce((query: string) => {
      setSearchQuery(query);
    }, 300), // 300ms debounce
    []
  );


  if (isLoading && skip === 0) return <ActivityIndicator style={{ marginTop: 40 }} />;
  if (error) return <Text>Error fetching posts</Text>;
  return (
    <>
      <View style={styles.filterContainer}>
        <TouchableOpacity style={[
          styles.commentButton,
          sortMode === 'likes' && { backgroundColor: '#0056b3' },
        ]}
          onPress={() =>
            setSortMode((prev) => (prev === 'likes' ? 'none' : 'likes'))
          }>
          <Text style={styles.commentButtonText}>most liked</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[
          styles.commentButton,
          sortMode === 'views' && { backgroundColor: '#0056b3' },
        ]}
          onPress={() =>
            setSortMode((prev) => (prev === 'views' ? 'none' : 'views'))
          }>
          <Text style={styles.commentButtonText}>most viewed</Text>
        </TouchableOpacity>
      </View>
      <TextInput
        placeholder="Search..."
        value={searchInput}
        onChangeText={(text) => {
          setSearchInput(text);
          debouncedSearch(text);
        }}
        style={styles.input}
      />
      <FlatList
        data={filteredPosts}
        renderItem={({ item }) => <PostItem post={item} />}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 20 }}
        initialNumToRender={5}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={isFetching || isSearching ? <ActivityIndicator /> : null}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
    </>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
    padding: 10,
    margin: 10
  },
  filterContainer: {
    flexDirection: "row",
    margin: 10,
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  commentButton: {
    marginTop: 10,
    paddingVertical: 10,
    backgroundColor: '#007bff',
    borderRadius: 6,
    alignItems: 'center',
    padding: 10,
    marginRight: 10
  },
  commentButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default HomeScreen;
