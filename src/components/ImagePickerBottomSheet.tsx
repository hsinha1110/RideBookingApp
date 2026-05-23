import React from 'react';

import {
  Alert,
  Modal,
  Pressable,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';

import ImagePicker from 'react-native-image-crop-picker';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import TextComp from '@/components/TextComp';

//====================================================
// TYPES
//====================================================

interface Props {
  visible: boolean;

  onClose: () => void;

  onImageSelect: (image: any) => void;
}

//====================================================
// COMPONENT
//====================================================

const ImagePickerBottomSheet = ({ visible, onClose, onImageSelect }: Props) => {
  //====================================================
  // SAFE AREA
  //====================================================

  const insets = useSafeAreaInsets();

  //====================================================
  // OPEN CAMERA
  //====================================================

  const openCamera = async () => {
    try {
      onClose();

      //==============================================
      // OPEN CAMERA
      //==============================================

      const image = await ImagePicker.openCamera({
        width: 300,

        height: 300,

        cropping: true,

        compressImageQuality: 0.7,

        mediaType: 'photo',
      });

      onImageSelect(image);
    } catch (error: any) {
      console.log(error, '======= CAMERA ERROR =======');

      Alert.alert('Error', 'Failed to open camera');
    }
  };

  //====================================================
  // OPEN GALLERY
  //====================================================

  const openGallery = async () => {
    try {
      onClose();

      //==============================================
      // OPEN GALLERY
      //==============================================

      const image = await ImagePicker.openPicker({
        width: 300,

        height: 300,

        cropping: true,

        compressImageQuality: 0.7,

        mediaType: 'photo',
      });

      onImageSelect(image);
    } catch (error: any) {
      console.log(error, '======= GALLERY ERROR =======');

      Alert.alert('Error', 'Failed to open gallery');
    }
  };

  //====================================================
  // UI
  //====================================================

  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      statusBarTranslucent
    >
      {/* BACKDROP */}

      <Pressable style={styles.overlay} onPress={onClose}>
        {/* BOTTOM SHEET */}

        <Pressable
          style={[
            styles.bottomSheet,
            {
              paddingBottom: insets.bottom + 20,
            },
          ]}
        >
          {/* DRAG LINE */}

          <View style={styles.dragLine} />

          {/* CAMERA */}

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={openCamera}
            style={styles.button}
          >
            <TextComp text="Open Camera" />
          </TouchableOpacity>

          {/* GALLERY */}

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={openGallery}
            style={styles.button}
          >
            <TextComp text="Choose From Gallery" />
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default ImagePickerBottomSheet;

//====================================================
// STYLES
//====================================================

const styles = StyleSheet.create({
  overlay: {
    flex: 1,

    backgroundColor: 'rgba(0,0,0,0.5)',

    justifyContent: 'flex-end',
  },

  bottomSheet: {
    backgroundColor: '#fff',

    borderTopLeftRadius: 30,

    borderTopRightRadius: 30,

    paddingTop: 14,

    paddingHorizontal: 20,
  },

  dragLine: {
    width: 60,

    height: 5,

    borderRadius: 10,

    backgroundColor: '#D9D9D9',

    alignSelf: 'center',

    marginBottom: 20,
  },

  button: {
    paddingVertical: 20,
  },
});
