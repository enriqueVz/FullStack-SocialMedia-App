import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import {Stack, useRouter} from 'expo-router'
import { AuthProvider, useAtuh } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { getUserData } from '../services/userService'

const _layout = () =>{
    return (
        <AuthProvider>
            <MainLayout />
        </AuthProvider>
    )
}
const MainLayout = () => {
    const {setAuth, setUserData} = useAtuh();
    const router = useRouter();

    useEffect(()=>{
        supabase.auth.onAuthStateChange((_event, session) => {
            //console.log('session user: ', session?.user?.id);

            if(session) {
                setAuth(session?.user);
                UpdateUserData(session?.user, session?.user?.email);
                router.replace('/home');
            } else {
               setAuth(null);
               router.replace('/welcome')
            }
            
        })
    },[]);

    const UpdateUserData = async(user, email)=>{
        let res = await getUserData(user?.id);
        if(res.success) setUserData({...res.data, email});
    }

  return (
    <Stack 
        screenOptions={{
            headerShwown: false
        }}
    />
)
}

export default _layout