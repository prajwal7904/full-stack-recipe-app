import { View, Text, KeyboardAvoidingView, Platform, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native'
import {useRouter} from'expo-router';
import { useState } from 'react';
import {authStyles, AuthStyles} from "../../assets/styles/auth.styles.js"
import {useSignIn} from '@clerk/clerk-expo';
import {Image} from 'expo-image'
import { COLORS } from '../../constants/colors.js';
import {Ionicons} from '@expo/vector-icons'


const SignInScreen = () => {
  const router=useRouter();

  const { signIn, setActive, isLoaded}=useSignIn();

  const[email,setEmail]=useState("");
  const[password,setPassword]=useState("");
  const[showPassword,setShowPassword]=useState(false);
  const[loading,setLoading]=useState(false);

const handleSignIn = async () => {
  if (!email || !password) {
    Alert.alert("Error", "Please fill all the fields");
    return;
  }
  if (!isLoaded) return;

  setLoading(true);
  try {
    const signinAttempt = await signIn.create({
      identifier: email,
      password
    });

    if (signinAttempt.status === "complete") {
      await setActive({ session: signinAttempt.createdSessionId });
      router.replace("/(tabs)"); // Navigate to home
    } else {
      Alert.alert("Error", "Sign In Failed", "Please Try Again");
      console.error(JSON.stringify(signinAttempt, null, 2));
    }
  } catch (err) {
    Alert.alert("Error", err.errors?.[0]?.message || "Sign in Failed");
    console.error(JSON.stringify(err, null, 2));
  } finally {
    setLoading(false);
  }
};

  return (
    <View style={authStyles.container}>
     <KeyboardAvoidingView style={authStyles.keyboardView} behavior={Platform.OS==="android"?"padding":"height"} keyboardVerticalOffset={Platform.OS==="android"?"64":0}>
      <ScrollView contentContainerStyle={authStyles.scrollContent}showsVerticalScrollIndicator={false}>
        <View style={authStyles.imageContainer}>
          <Image source={require("../../assets/images/i1.png")}
          style={authStyles.image}
          contentFit='contain'
          />
        </View>
        <Text style={authStyles.title}>Welcome Back</Text>
        {/* EMAIL FORM */}
        <View style={authStyles.formContainer}>
          <View style={authStyles.inputContainer}>
            <TextInput style={authStyles.textInput} placeholder='Enter Email' placeholderTextColor={COLORS.textLight} value={email} autoCapitalize='none' keyboardType='email-address' onChangeText={setEmail}/>
           
          </View>
          {/* PASSWORD  */}
           <View style={authStyles.inputContainer}>
            <TextInput style={authStyles.textInput} placeholder='Enter Password' placeholderTextColor={COLORS.textLight} value={password} autoCapitalize='none' secureTextEntry={!showPassword} onChangeText={setPassword}/>
            <TouchableOpacity style={authStyles.eyeButton} onPress={()=>setShowPassword(!showPassword)}>
            <Ionicons name={showPassword?"eye-outline":"eye-off-outline"} size={20} color={COLORS.textLight}/>
            
            </TouchableOpacity>

          

          </View>

          <TouchableOpacity style={[authStyles.authButton,loading && authStyles.buttonDisabled]} onPress={handleSignIn} disabled={loading} activeOpacity={0.8}>
            <Text style={authStyles.buttonText}>{loading?"Signing In":"Sign In"}</Text>

          </TouchableOpacity>
          {/* sign up link */}
          <TouchableOpacity style={authStyles.linkContainer} onPress={()=>router.push("/(auth)/sign-up")}>
            <Text style={authStyles.linkText}>Don&apos;t have an account?<Text style={authStyles.link}>Sign Up</Text></Text>

          </TouchableOpacity>
        </View>

      </ScrollView>

     </KeyboardAvoidingView>
    </View>

  )
}

export default SignInScreen