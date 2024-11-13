import { StyleSheet, Text, View, Button, Alert, Pressable, FlatList } from "react-native";
import React, { useEffect, useState } from "react"
import ScreenWrapper from "../../components/ScreenWrapper";
import { useAtuh } from "../../contexts/AuthContext";
import { supabase } from "../../lib/supabase";
import { theme } from "../../constants/theme";
import {hp, wp } from "../../constants/helpers/common";
import Icon from "../../assets/icons";
import { useRouter } from "expo-router";
import Avatar from "../../components/Avatar";
import { fetchPosts } from "../../services/postService";
import PostCard from "../../components/postCard";
import Loading from '../../components/Loading'
import { getUserData } from '../../services/userService'



var limit = 0;
const Home = () => {

    const {user, setAuth} = useAtuh();
    const router= useRouter();

    const [posts, setPosts] = useState([]);
    const [hasMore, setHasMore] = useState(true);

    const handlePostEvent = async (payload)=>{
       if(payload.eventType == 'INSERT' && payload?.new?.id){
        let newPost = {...payload.new};
        let res = await getUserData(newPost.userId);
        newPost.user = res.success? res.data: {};
        setPosts(prevPosts => [newPost, ...prevPosts]);
       }
    }

    useEffect(()=>{

        let postChannel = supabase
        .channel('posts')
        .on('postgres_changes', {event: '*', schema: 'public', table: 'posts'}, handlePostEvent)
        .subscribe();

        //getPosts();

        return ()=>{
            supabase.removeChannel(postChannel);
        }
    },[])

    const getPosts = async ()=> {
        //Call the API here

        if(!hasMore) return null;
        limit = limit + 4;

        let res = await fetchPosts(limit);
        if(res.success){
            if(posts.length==res.data.length) setHasMore(false);
            setPosts(res.data);
        }
       
    }

   

    //console.log('user: ', user);
    
    //const onLogut = async ()=>{
    //   setAuth(null);
    //    const {error} = await supabase.auth.signOut();
    //      if(error){
    //        Alert.alert('Logout', "Error saliendo del user")
    //    }
    // }

    return (
        <ScreenWrapper bg="white">
                <View style={styles.container}>
                    {/*HEADER*/}
                    <View style={styles.header}>
                        <Text style={styles.title}>LinkUp</Text>
                        <View style={styles.icons}>
                            <Pressable onPress={() => router.push('notifications')}>
                                <Icon name="heart" size={hp(3.2)} strokeWidth={2} color={theme.colors.text} />
                            </Pressable>

                            <Pressable onPress={() => router.push('newPost')}>
                                <Icon name="plus" size={hp(3.2)} strokeWidth={2} color={theme.colors.text} />
                            </Pressable>

                            <Pressable onPress={() => router.push('profile')}>
                                <Avatar 
                                    uri={user?.image}
                                    size={hp(4.3)}
                                    rounded={theme.radius.sm}
                                    style={{borderWidth: 2}}
                                />
                            </Pressable>

                        </View>
                    </View>

                    {/* posts */}
                    <FlatList
                        data={posts}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.listStyle}
                        keyExtractor={item=> item.id.toString()}
                        renderItem={({item})=> <PostCard
                            item={item}
                            currentUser={user}
                            router={router}
                            />
                        }
                        onEndReached={()=>{
                            getPosts();
                           // console.log('got to the bottom');
                        }}
                        onEndReachedThreshold={0}
                        ListFooterComponent={hasMore? (
                            <View style={{marginVertical: posts.length==0? 200: 30}}>
                                <Loading />
                            </View>
                        ):(
                            <View style={{marginVertical: 30}}>
                                <Text style={styles.noPosts}>No more posts</Text>
                            </View>

                        )}
                    />
                </View>
            {/* <Button title="logout" onPress={onLogut} /> */}
        </ScreenWrapper>
    )
}

export default Home

const styles = StyleSheet.create({
    container: {
        flex: 1,
        //paddingHorizontal: wp(4)
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
        marginHorizontal: wp(4)
    },
    title: {
        color: theme.colors.text,
        fontSize: hp(3.2),
        fontWeight: theme.fonts.bold
    },
    avatarImage: {
        height: hp(4.3),
        width: hp(4.3),
        borderRadius: theme.radius.sm,
        borderCurve: 'continuous',
        borderColor: theme.colors.gray,
        borderWidth: 3
    },
    icons: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 18
    },
    listStyle: {
        paddingTop: 20,
        paddingHorizontal: wp(4)
    },
    noPosts: {
        fontSize: hp(2),
        textAlign:'center',
        color: theme.colors.text
    },
    pill: {
       position: 'absolute',
       right: -10,
       top: -4,
       height: hp(2.2),
       width: hp(2.2),
       justifyContent: 'center',
       alignItems: 'center',
       borderRadius: 20,
       backgroundColor: theme.colors.roseLight,
    },
    pillText: {
        color: 'white',
        fontSize: hp(1.2),
        fontWeight: theme.fonts.bold
    }
})