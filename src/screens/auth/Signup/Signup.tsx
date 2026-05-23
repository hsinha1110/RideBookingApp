import React, { FC, useState } from 'react';

import { View, Alert, TouchableOpacity, Image, ScrollView } from 'react-native';

import { useDispatch } from 'react-redux';

import WrapperContainer from '@/components/WrapperContainer';
import TextComp from '@/components/TextComp';
import TextInputComp from '@/components/TextInputComp';
import ButtonComp from '@/components/ButtonComp';
import RoleTabs from '@/components/RolesTab';
import ImagePickerBottomSheet from '@/components/ImagePickerBottomSheet';

import useStyles from '@/screens/auth/Signup/styles';
import { useNavigation } from '@react-navigation/native';
import { signUpAsyncThunk } from '@/redux/thunk/thunk';
import { AppDispatch } from '@/redux/store';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@/screens/types';

const DEFAULT_IMAGE = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';

const Signup: FC = () => {
  const styles = useStyles();

  const dispatch = useDispatch<AppDispatch>();

  //====================================================
  // STATES
  //====================================================

  const [fullName, setFullName] = useState('');

  const [email, setEmail] = useState('');

  const [phoneNumber, setPhoneNumber] = useState('');

  const [password, setPassword] = useState('');

  const [userType, setUserType] = useState<'rider' | 'driver'>('rider');

  const [profileImage, setProfileImage] = useState<any>(null);

  const [modalVisible, setModalVisible] = useState(false);

  const [loading, setLoading] = useState(false);

  //====================================================
  // SIGNUP
  //====================================================

  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const handleSignup = async () => {
    if (!fullName || !email || !phoneNumber || !password) {
      Alert.alert('Error', 'Please fill all fields');

      return;
    }

    try {
      setLoading(true);

      //==========================================
      // FORM DATA
      //==========================================

      const formData = new FormData();

      formData.append('fullName', fullName);

      formData.append('email', email);

      formData.append('phoneNumber', phoneNumber);

      formData.append('password', password);

      formData.append('userType', userType);

      //==========================================
      // IMAGE
      //==========================================

      if (profileImage) {
        formData.append('profileImage', {
          uri: profileImage.path,

          type: profileImage.mime,

          name: `profile_${Date.now()}.jpg`,
        } as any);
      }

      console.log(formData, '======= SIGNUP FORM DATA =======');

      const response = await dispatch(signUpAsyncThunk(formData)).unwrap();

      console.log(response, '======= SIGNUP SUCCESS =======');

      Alert.alert('Success', response?.message || 'Signup Successful');
    } catch (error: any) {
      console.log(error, '======= SIGNUP ERROR =======');

      Alert.alert('Error', error?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <WrapperContainer style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* HEADER */}

          <View style={styles.titleSection}>
            <TextComp text="Create Account" style={styles.createText} />

            <TextComp text="Signup to continue" style={styles.signupText} />
          </View>

          {/* PROFILE IMAGE */}

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setModalVisible(true)}
            style={{
              alignSelf: 'center',

              marginBottom: 20,
            }}
          >
            <Image
              source={{
                uri: profileImage?.path || DEFAULT_IMAGE,
              }}
              style={{
                width: 110,

                height: 110,

                borderRadius: 100,
              }}
            />
          </TouchableOpacity>

          {/* ROLE TABS */}

          <RoleTabs selectedRole={userType} onChangeRole={setUserType} />

          {/* FULL NAME */}

          <TextInputComp
            placeholder="Full Name"
            value={fullName}
            onChangeText={setFullName}
            containerStyle={styles.input}
          />

          {/* EMAIL */}

          <TextInputComp
            placeholder="Email Address"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            containerStyle={styles.input}
          />

          {/* PHONE */}

          <TextInputComp
            placeholder="Phone Number"
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            containerStyle={styles.input}
          />

          {/* PASSWORD */}

          <TextInputComp
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            containerStyle={styles.input}
          />

          {/* BUTTON */}

          <ButtonComp
            title={
              loading
                ? 'Please wait...'
                : userType === 'rider'
                ? 'Signup as Rider'
                : 'Signup as Driver'
            }
            onPress={handleSignup}
            disabled={loading}
          />
          <View style={styles.bottomContainer}>
            <TextComp
              text="Already have an account?"
              style={styles.bottomText}
            />

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.goBack()}
            >
              <TextComp text=" Login" style={styles.signupText} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* IMAGE PICKER */}

      <ImagePickerBottomSheet
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onImageSelect={setProfileImage}
      />
    </WrapperContainer>
  );
};

export default Signup;
