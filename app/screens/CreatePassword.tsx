/*************************************************
 * FreightRunner
 * @exports
 * @function CreatePassword.tsx
 * @extends Component
 * Created by Naveen E on 06/05/2022
 * Copyright © 2022 FreightRunner. All rights reserved.
 *************************************************/

'use strict';

import React, {useContext, useEffect, useState} from 'react';
import * as yup from 'yup';
import {StyleSheet, TextInput, Dimensions, Alert, Platform} from 'react-native';
import {
  Text,
  Logo,
  Screen,
  View,
  CustomButton,
  TruckImages,
} from '../components';
import Icon from 'react-native-vector-icons/FontAwesome5';
import colors from '../styles/colors';
import {DEVICE_WIDTH, fontSizes} from '../styles/globalStyles';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {resetPassword} from '../services/registrationService';
import {SnackbarContext, SnackbarContextType} from '../context/SnackbarContext';
import FastImage from 'react-native-fast-image';
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

type Props = {navigation: any};

function CreatePassword({navigation}: Props, route: any) {
  const [loading, setLoading] = useState(false);
  const [checkMaxLength, setCheckMaxLength] = useState(false);
  const [checkNumber, setCheckNumber] = useState(false);
  const [checkCapitalLetter, setCheckCapitalLetter] = useState(false);
  const [checkSpecialCharacter, setSpecialCharacter] = useState(false);
  const [newHidePass, setNewHidePass] = useState(false);
  const [confirmHidePass, setConfirmHidePass] = useState(false);
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const {setMessage, setVisible} =
    useContext<SnackbarContextType>(SnackbarContext);
  let resetToken: String;
  resetToken = route.params?.resetToken;
  console.log(resetToken, 'RESET___TOKEN');

  const validateResetPassword = async () => {
    if (newPassword.trim().length > 7 && confirmPassword.trim().length === 0) {
      Alert.alert('Error', 'Please enter your confirm password');
    } else if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Your password does not match');
    } else {
      setLoading(true);
      await resetPassword({
        token: resetToken,
        newPassword: newPassword,
        confirmNewPassword: confirmPassword,
      })
        .then(async response => {
          setLoading(false);
          console.log('RESET password response', response);
          if (response.status === 200) {
            setLoading(false);
            navigation.navigate('LoginScreen');
            setMessage('Password Updated Successfully');
            setVisible(true);
          }
        })
        .catch(e => {
          setLoading(false);
          console.log('Reset Password Error', e.response);
          Alert.alert('Error', e.response.data.message);
        });
    }
  };

  const _verifyPassword = newPwd => {
    setNewPassword(newPwd);
    if (newPwd.match(/[A-Z]/) != null) {
      setCheckCapitalLetter(true);
    } else {
      setCheckCapitalLetter(false);
    }
    if (newPwd.match(/[0-9]/) != null) {
      setCheckNumber(true);
    } else {
      setCheckNumber(false);
    }
    if (newPwd.match(/[!@$%&]/)) {
      setSpecialCharacter(true);
    } else {
      setSpecialCharacter(false);
    }
    if (
      checkCapitalLetter &&
      checkNumber &&
      checkSpecialCharacter &&
      checkMaxLength &&
      newPwd.length > 7
    ) {
      setCheckMaxLength(true);
    } else if (newPwd.length > 7) {
      setCheckMaxLength(true);
    } else {
      setCheckMaxLength(false);
    }
  };

  return (
    <Screen style={styles.container}>
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View style={{flex: 1, flexDirection: 'column'}}>
          <View
            style={{
              flex: 1,
              backgroundColor: 'black',
              height: deviceHeight / 3.5,
            }}>
            <View
              style={{
                paddingTop: Platform.OS === 'android' ? 0 : deviceHeight / 25,
              }}>
              <Logo />
            </View>
          </View>
          <View
            style={{
              flex: 2,
              backgroundColor: 'white',
              height: deviceHeight / 1,
            }}>
            <TruckImages />
            <View style={{paddingHorizontal: 20, marginTop: deviceHeight / 10}}>
              <View
                style={{alignItems: 'center', marginBottom: deviceHeight / 30}}>
                <Text style={{fontSize: 14, fontWeight: '700'}}>
                  RESET PASSWORD
                </Text>
              </View>
              <View
                style={{
                  paddingHorizontal: 20,
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  marginVertical: deviceHeight / 80,
                  backgroundColor: '#F5F4F7',
                  borderColor: '#EDEDED',
                  borderTopWidth: 1,
                  borderBottomWidth: 1,
                  paddingVertical: deviceHeight / 50,
                }}>
                <Text
                  style={{
                    fontSize: fontSizes.small,
                    fontWeight: '500',
                    color: 'gray',
                  }}>
                  New Password
                </Text>
                <View style={{flexDirection: 'row'}}>
                  <TextInput
                    style={{
                      padding: 0,
                      fontWeight: '600',
                      fontSize: fontSizes.regular,
                      flex: 1,
                      marginTop: 5,
                    }}
                    onChangeText={newPwd => {
                      _verifyPassword(newPwd);
                    }}
                    value={newPassword}
                    placeholder=""
                    keyboardType="default"
                    maxLength={20}
                    secureTextEntry={!newHidePass ? true : false}
                  />

                  <Icon
                    name={!newHidePass ? 'eye-slash' : 'eye'}
                    size={16}
                    color={colors.background}
                    style={{alignItems: 'center', justifyContent: 'center'}}
                    onPress={() => setNewHidePass(!newHidePass)}
                  />
                </View>
              </View>
              {checkCapitalLetter &&
              checkNumber &&
              checkSpecialCharacter &&
              checkMaxLength &&
              newPassword === confirmPassword ? null : (
                <View style={{paddingVertical: 5}}>
                  <Text style={{fontSize: fontSizes.regular}}>
                    Password must:
                  </Text>
                  <View style={{flexDirection: 'row', marginTop: 10}}>
                    <FastImage
                      style={{width: 18, height: 18, alignSelf: 'center'}}
                      source={
                        checkMaxLength
                          ? require('../assets/images/passwordChecked.png')
                          : require('../assets/images/passwordUnchecked.png')
                      }
                      resizeMode={FastImage.resizeMode.contain}
                    />
                    <Text
                      style={{
                        fontSize: fontSizes.small,
                        paddingHorizontal: 10,
                      }}>
                      Be a minimum of eight character
                    </Text>
                  </View>
                  <View style={{flexDirection: 'row', marginTop: 10}}>
                    <FastImage
                      style={{width: 18, height: 18, alignSelf: 'center'}}
                      source={
                        checkCapitalLetter
                          ? require('../assets/images/passwordChecked.png')
                          : require('../assets/images/passwordUnchecked.png')
                      }
                      resizeMode={FastImage.resizeMode.contain}
                    />
                    <Text
                      style={{
                        fontSize: fontSizes.small,
                        paddingHorizontal: 10,
                      }}>
                      Have at least one capital letter
                    </Text>
                  </View>
                  <View style={{flexDirection: 'row', marginTop: 10}}>
                    <FastImage
                      style={{width: 18, height: 18, alignSelf: 'center'}}
                      source={
                        checkNumber
                          ? require('../assets/images/passwordChecked.png')
                          : require('../assets/images/passwordUnchecked.png')
                      }
                      resizeMode={FastImage.resizeMode.contain}
                    />
                    <Text
                      style={{
                        fontSize: fontSizes.small,
                        paddingHorizontal: 10,
                      }}>
                      Have at least one number
                    </Text>
                  </View>
                  <View style={{flexDirection: 'row', marginTop: 10}}>
                    <FastImage
                      style={{width: 18, height: 18, alignSelf: 'center'}}
                      source={
                        checkSpecialCharacter
                          ? require('../assets/images/passwordChecked.png')
                          : require('../assets/images/passwordUnchecked.png')
                      }
                      resizeMode={FastImage.resizeMode.contain}
                    />
                    <Text
                      style={{
                        fontSize: fontSizes.small,
                        paddingHorizontal: 10,
                      }}>
                      Have at least one special character
                    </Text>
                  </View>
                </View>
              )}

              <View
                style={{
                  paddingHorizontal: 20,
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  marginVertical: deviceHeight / 80,
                  backgroundColor: '#F5F4F7',
                  borderColor: '#EDEDED',
                  borderTopWidth: 1,
                  borderBottomWidth: 1,
                  paddingVertical: deviceHeight / 55,
                }}>
                <Text
                  style={{
                    fontSize: fontSizes.small,
                    fontWeight: '500',
                    color: 'gray',
                  }}>
                  Confirm New Password
                </Text>
                <View style={{flexDirection: 'row'}}>
                  <TextInput
                    secureTextEntry={!confirmHidePass ? true : false}
                    style={{
                      padding: 0,
                      fontWeight: '600',
                      fontSize: fontSizes.regular,
                      flex: 1,
                      marginTop: 5,
                    }}
                    onChangeText={confirmPwd => {
                      setConfirmPassword(confirmPwd);
                    }}
                    value={confirmPassword}
                    placeholder=""
                    maxLength={20}
                    keyboardType="default"
                  />
                  <Icon
                    name={!confirmHidePass ? 'eye-slash' : 'eye'}
                    size={16}
                    color={colors.background}
                    style={{alignItems: 'center', justifyContent: 'center'}}
                    onPress={() => setConfirmHidePass(!confirmHidePass)}
                  />
                </View>
              </View>
              <View style={{marginVertical: deviceHeight / 30}}>
                <CustomButton
                  titleColor={colors.white}
                  borderColor={
                    checkCapitalLetter &&
                    checkNumber &&
                    checkSpecialCharacter &&
                    checkMaxLength
                      ? '#1F1F1F'
                      : '#454545'
                  }
                  onPress={() => validateResetPassword()}
                  title="Submit"
                  backgroundColor={
                    checkCapitalLetter &&
                    checkNumber &&
                    checkSpecialCharacter &&
                    checkMaxLength
                      ? '#1F1F1F'
                      : '#454545'
                  }
                  btnLoading={loading}
                  disableButton={
                    checkCapitalLetter &&
                    checkNumber &&
                    checkSpecialCharacter &&
                    checkMaxLength
                      ? false
                      : true
                  }></CustomButton>
              </View>
            </View>
            <View style={{marginTop: deviceHeight / 8}}>
              <Text
                style={{
                  color: 'black',
                  textAlign: 'center',
                  textDecorationLine: 'underline',
                }}>
                Contact Us
              </Text>
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </Screen>
  );
}

export default CreatePassword;

const styles = StyleSheet.create({
  container: {
    // paddingHorizontal: STANDARD_PADDING
  },
  buttons: {
    alignSelf: 'center',
    width: '95%',
  },
  passwordViewContainer: {
    flexDirection: 'column',
  },
  passwordMustMainContainer: {
    flexDirection: 'column',
  },
  passwordMustContainer: {
    flexDirection: 'row',
  },
  confirmPasswordContainer: {
    flexDirection: 'column',
    marginTop: 25,
  },
  passwordMustIcon: {
    marginTop: 10,
  },
  icon: {
    marginTop: -40,
    left: DEVICE_WIDTH - 65,
  },
  loadingContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});

export const CreatePasswordValidator = yup.object().shape({
  password: yup.string().required('Please provide your password.'),
  confirmPassword: yup
    .string()
    .required('Please provide your confirmPassword.'),
});
