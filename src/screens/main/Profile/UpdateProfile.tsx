import React, { FC, useState } from 'react';

import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import DropDownPicker from 'react-native-dropdown-picker';

import { useDispatch, useSelector } from 'react-redux';

import { AppDispatch, RootState } from '@/redux/store';

import { updateProfileThunk, getProfileThunk } from '@/redux/thunk/thunk';

import TextInputComp from '@/components/TextInputComp';

import ButtonComp from '@/components/ButtonComp';

import ImagePickerBottomSheet from '@/components/ImagePickerBottomSheet';

import { moderateScale } from '@/styles/scaling';

//======================================================
// SCREEN
//======================================================

const UpdateProfile: FC = () => {
  //====================================================
  // REDUX
  //====================================================

  const dispatch = useDispatch<AppDispatch>();

  const { user } = useSelector((state: RootState) => state.auth);

  //====================================================
  // STATES
  //====================================================

  const [fullName, setFullName] = useState(user?.fullName || '');

  const [email, setEmail] = useState(user?.email || '');

  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');

  const [bio, setBio] = useState(user?.bio || '');

  const [gender, setGender] = useState(user?.gender || '');

  const [profileImage, setProfileImage] = useState<any>(null);

  const [modalVisible, setModalVisible] = useState(false);

  const [loading, setLoading] = useState(false);

  //====================================================
  // DROPDOWN
  //====================================================

  const [open, setOpen] = useState(false);

  const [items, setItems] = useState([
    {
      label: 'Male',
      value: 'male',
    },

    {
      label: 'Female',
      value: 'female',
    },

    {
      label: 'Other',
      value: 'other',
    },
  ]);

  //====================================================
  // UPDATE PROFILE
  //====================================================

  const handleUpdate = async () => {
    try {
      setLoading(true);

      const formData = new FormData();

      formData.append('fullName', fullName);

      formData.append('email', email);

      formData.append('phoneNumber', phoneNumber);

      formData.append('bio', bio);

      formData.append('gender', gender);

      //==============================================
      // IMAGE
      //==============================================

      if (profileImage) {
        formData.append('profileImage', {
          uri: profileImage.path,

          type: profileImage.mime,

          name: `profile_${Date.now()}.jpg`,
        } as any);
      }

      //==============================================
      // API
      //==============================================

      const response = await dispatch(updateProfileThunk(formData)).unwrap();

      console.log(response, '======= UPDATE PROFILE SUCCESS =======');

      //==============================================
      // REFRESH PROFILE
      //==============================================

      await dispatch(getProfileThunk());

      Alert.alert('Success', 'Profile Updated');
    } catch (error: any) {
      console.log(error, '======= UPDATE PROFILE ERROR =======');

      Alert.alert('Error', error?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  //====================================================
  // UI
  //====================================================

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* IMAGE */}

      <View style={{ marginTop: moderateScale(40) }}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setModalVisible(true)}
        >
          <Image
            source={{
              uri:
                profileImage?.path ||
                user?.profileImage ||
                'https://cdn-icons-png.flaticon.com/512/149/149071.png',
            }}
            style={styles.image}
          />
        </TouchableOpacity>
      </View>

      {/* FULL NAME */}

      <TextInputComp
        placeholder="Full Name"
        value={fullName}
        onChangeText={setFullName}
        containerStyle={styles.input}
      />

      {/* EMAIL */}

      <TextInputComp
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        containerStyle={styles.input}
      />

      {/* PHONE */}

      <TextInputComp
        placeholder="Phone Number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        containerStyle={styles.input}
      />

      {/* BIO */}

      <TextInputComp
        placeholder="Write your bio..."
        value={bio}
        onChangeText={setBio}
        multiline
        containerStyle={styles.bioInputContainer}
        inputStyle={styles.bioInput}
      />

      {/* GENDER */}

      <View style={styles.dropdownWrapper}>
        <Text style={styles.label}>Gender</Text>

        <DropDownPicker
          open={open}
          value={gender}
          items={items}
          setOpen={setOpen}
          setValue={setGender}
          setItems={setItems}
          placeholder="Select Gender"
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownContainer}
          zIndex={1000}
        />
      </View>

      {/* BUTTON */}

      <ButtonComp
        title={loading ? 'Updating...' : 'Update Profile'}
        onPress={handleUpdate}
        style={styles.button}
      />

      {/* IMAGE PICKER */}

      <ImagePickerBottomSheet
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onImageSelect={setProfileImage}
      />
    </ScrollView>
  );
};

export default UpdateProfile;

//======================================================
// STYLES
//======================================================

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,

    padding: moderateScale(20),

    backgroundColor: '#fff',
  },

  image: {
    width: moderateScale(120),

    height: moderateScale(120),

    borderRadius: moderateScale(100),

    alignSelf: 'center',

    marginBottom: moderateScale(30),
  },

  input: {
    marginBottom: moderateScale(16),
  },

  bioInputContainer: {
    height: moderateScale(120),

    alignItems: 'flex-start',

    paddingTop: moderateScale(14),

    marginBottom: moderateScale(20),
  },

  bioInput: {
    minHeight: moderateScale(80),

    textAlignVertical: 'top',
  },

  dropdownWrapper: {
    zIndex: 1000,

    marginBottom: moderateScale(24),
  },

  label: {
    fontSize: moderateScale(14),

    fontWeight: '600',

    color: '#000',

    marginBottom: moderateScale(8),
  },

  dropdown: {
    borderColor: '#ccc',

    minHeight: moderateScale(55),

    borderRadius: moderateScale(7),
  },

  dropdownContainer: {
    borderColor: '#ccc',

    borderRadius: moderateScale(7),
  },

  button: {
    marginTop: moderateScale(10),
  },
});
