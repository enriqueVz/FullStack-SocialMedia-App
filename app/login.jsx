import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useRef, useState } from "react";
import ScreenWrapper from "../components/ScreenWrapper";
import { theme } from "../constants/theme";
import Icon from "../assets/icons";
import { StatusBar } from "expo-status-bar";
import BackButton from "../components/BackButton";
import { useRouter } from "expo-router";
import { hp, wp } from "../constants/helpers/common";
import Input from "../components/input";
import Button from "../components/Button"
import { supabase } from "../lib/supabase";

const Login = () => {
  const router = useRouter();
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async () =>{
        if(!emailRef.current || !passwordRef.current){
          Alert.alert('Login', "Por favor, rellena todos los campos!");
          return;
        }

        let email = emailRef.current.trim();
        let password = passwordRef.current.trim();
        setLoading(true);
        const {error} = await supabase.auth.signInWithPassword({
          email,
          password
        });

        console.log('error: ', error);
        if(error){
          Alert.alert('Login', error.message);
        }
  }


  return (
    <ScreenWrapper bg="white">
      <StatusBar style="dark" />
      <View style={styles.container}>
        <BackButton router={router}></BackButton>

        {/*WELCOME TEXT*/}
        <View>
          <Text style={styles.welcomeText}>Hey,</Text>
          <Text style={styles.welcomeText}>Welcome back!</Text>
        </View>

        {/*Form*/}
        <View style={styles.form}>
          <Text style={{ fontSize: hp(1.5), color: theme.colors.text }}>
            Please, log in to continue
          </Text>
          <Input
            icon={<Icon name="mail" size={26} strokeWidth={1.6}></Icon>}
            placeholder="Introduzca su email"
            onChangeText={value => emailRef.current = value}
          />

          <Input
            icon={<Icon name="lock" size={26} strokeWidth={1.6}></Icon>}
            placeholder="Introduzca su contraseña"
            secureTextEntry 
            onChangeText={value => passwordRef.current = value}
          />
          <Text style={styles.forgotPassword}>
            Forgot password?
          </Text>

          {/*BOTON */}
          <Button title={'Login'} loading={loading} onPress={onSubmit}>
          </Button>

        </View>
        {/*FOOTER */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            ¿No tienes una cuenta?
          </Text>
          <Pressable onPress={()=> router.push('signUp')}>
            <Text style={[styles.footerText, {color: theme.colors.primaryDark, fontWeight: theme.fonts.semibold}]}>Sign up!</Text>
          </Pressable>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 45,
    paddingHorizontal: wp(5),
  },

  welcomeText: {
    fontSize: hp(4),
    fontWeight: theme.fonts.bold,
    color: theme.colors.text,
  },

  form: {
    gap: 25,
  },

  forgotPassword: {
    textAlign: "right",
    fontWeight: theme.fonts.semibold,
    color: theme.colors.text,
  },

  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },

  footerText: {
    textAlign: "center",
    color: theme.colors.text,
    fontSize: hp(1.6),
  },
});
