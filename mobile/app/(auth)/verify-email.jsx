import { View, Text, Alert, KeyboardAvoidingView, Platform, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { useSignUp } from '@clerk/clerk-expo';
import { authStyles } from '../../assets/styles/auth.styles';
import { Image } from 'expo-image';
import { COLORS } from '../../constants/colors';

const VerifyEmail = ({ email, onBack }) => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerification = async () => {
    if (!isLoaded) return;

    setLoading(true);
    try {
      const signupAttempt = await signUp.attemptEmailAddressVerification({ code });

      if (signupAttempt.status === 'complete') {
        await setActive({ session: signupAttempt.createdSessionId });
        Alert.alert('Success', 'Email verified and account created!');
        // You can redirect here using router.push("/home") if needed
      } else {
        Alert.alert('Error', 'Verification failed. Please try again.');
        console.error(JSON.stringify(signupAttempt, null, 2));
      }
    } catch (err) {
      Alert.alert('Error', err.errors?.[0]?.message || 'Verification failed');
      console.error(JSON.stringify(err, null, 2));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={authStyles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={authStyles.keyboardView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <ScrollView contentContainerStyle={authStyles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={authStyles.imageContainer}>
            <Image source={require('../../assets/images/i3.png')} style={authStyles.image} contentFit="contain" />
          </View>

          <Text style={authStyles.title}>Verify your Email</Text>
          <Text style={authStyles.subtitle}>We've sent a verification code to {email}</Text>

          <View style={authStyles.formContainer}>
            <View style={authStyles.inputContainer}>
              <TextInput
                style={authStyles.textInput}
                placeholder="Enter Verification Code"
                placeholderTextColor={COLORS.textLight}
                value={code}
                onChangeText={setCode}
                keyboardType="number-pad"
                autoCapitalize="none"
              />
            </View>

            <TouchableOpacity
              style={[authStyles.authButton, loading && authStyles.buttonDisabled]}
              onPress={handleVerification}
              disabled={loading}
              activeOpacity={0.8}
            >
              <Text style={authStyles.buttonText}>{loading ? 'Verifying...' : 'Verify Email'}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={authStyles.linkContainer} onPress={onBack}>
              <Text style={authStyles.link}>Back to Sign Up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default VerifyEmail;
