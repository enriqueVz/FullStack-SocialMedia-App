import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { fetchPostsDetails } from '../../services/postService';
import { useLocalSearchParams } from 'expo-router';

const PostDetails = () => {
    const {postId} = useLocalSearchParams();

    const [post, setPost] = useState(null);

    useEffect(()=>{
        getPostDetails();
    }, []);

    const getPostDetails = async ()=>{

        let res = await fetchPostsDetails(postId);
        console.log('got post details: ', res);
    }
  return (
    <View>
      <Text>P</Text>
    </View>
  )
}

export default PostDetails

const styles = StyleSheet.create({})