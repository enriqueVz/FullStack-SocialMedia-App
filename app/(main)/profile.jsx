import { Alert, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ScreenWrapper from '../../components/ScreenWrapper'
import { useAtuh } from '../../contexts/AuthContext'
import { useRouter } from 'expo-router'
import Header from '../../components/Header'
import { hp, wp } from "../../constants/helpers/common";
import { TouchableOpacity } from 'react-native'
import Icon from '../../assets/icons'
import { theme } from '../../constants/theme'
import { supabase } from '../../lib/supabase'
import Avatar from '../../components/Avatar'


const Profile = () => {
    const {user, setAuth} = useAtuh();
    const router = useRouter();

    const onLogout = async ()=>{
        // setAuth(null);
        const {error} = await supabase.auth.signOut();
        if(error){
            Alert.alert('Logout', "Error saliendo del user")
        }
    }

    const handleLogout = async ()=>{
        Alert.alert('Confirm', "Are you sure you want to log out?", [
            {
                text: 'Cancel',
                onPress: ()=> console.log('modal cancelled'),
                style: 'cancel'
            },
            {
                text: 'Logout',
                onPress: ()=> onLogout(),
                style: 'destructive'
            }
        ])
    }
  return (
    <ScreenWrapper bg={"white"}>
        <UserHeader user={user} router={router} handleLogout={handleLogout} />
    </ScreenWrapper>
  )
}

const UserHeader = ({user, router, handleLogout}) => {
    return (
        <View style={{flex: 1, backgroundColor: 'white', paddingHorizontal: wp(4)}}>
            <View>
                <Header title="Profile" mb={30}/>
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} >
                    <Icon name="logout" color={theme.colors.rose} />
                </TouchableOpacity>
            </View>

            <View style={styles.container}>
                <View style={{gap: 15}}>
                    <View style={styles.avatarContainer}>
                        <Avatar
                            uri={user?.image}
                            size={hp(12)}
                            rounded={theme.radius.xxl*1.4}
                        />
                        <Pressable style={styles.editIcon} onPress={()=> router.push('editProfile')}>
                            <Icon name="edit" strokeWidth={2.5} size={20} />
                        </Pressable>
                    </View>

                    {/* username and adress */}
                    <View style={{alignItems: 'center', gap: 4}}>
                        <Text style={styles.userName}>{user && user.name}</Text>
                        <Text style={styles.infoText}>{user && user.address}</Text>
                    </View>
                    {/*EMAIL, PHONE & BIO */}
                    <View style={{gap: 10}}>
                        <View style={styles.info}>
                            <Icon name="mail" size={20} color={theme.colors.textLight} />
                            <Text style={styles.infoText}>
                                {user && user.email}
                            </Text>
                        </View>

                        {
                            user && user.phoneNumber && (

                                <View style={styles.info}>
                                    <Icon name="call" size={20} color={theme.colors.textLight} />
                                    <Text style={styles.infoText}>
                                        {user && user.phoneNumber}
                                    </Text>
                                </View>

                            )
                        }

                        {
                            user && user.bio && (
                                <Text style={styles.infoText}>{user.bio}</Text>
                            )
                        }

                    </View>
                </View>
            </View>
        </View>
    )
}
export default Profile

const styles = StyleSheet.create({

    container: {
        flex: 1,
    },

    headerContainer: {
        marginHorizontal: wp(4),
        marginBottom: 20
    },

    headerShape: {
        width: wp(100),
        height: hp(20)
    },

    avatarContainer: {
        height: hp(12),
        width: hp(12),
        alignSelf: 'center'
    },

    editIcon: {
        position: 'absolute',
        bottom: 0,
        right: -12,
        padding: 7,
        borderRadius: 50,
        backgroundColor: 'white',
        shadowColor: theme.colors.textLight,
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.4,
        shadowRadius: 5,
        elevation: 7
    },

    userName: {
        fontSize: hp(3),
        fontWeight: '500',
        color: theme.colors.textDark
    },

    info: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },

    infoText: {
        fontSize: hp(1.6),
        fontWeight: '500',
        color: theme.colors.textLight
    },

    logoutButton: {
        position: 'absolute',
        right: 0,
        padding: 5,
        borderRadius: theme.radius.sm,
        backgroundColor: '#fee2e2'
    },

    listStyle: {
        paddingHorizontal: wp(4),
        paddingBottom: 30,
    },

    noPosts: {
        fontSize: hp(2),
        textAlign: 'center',
        color: theme.colors.text
    }
})