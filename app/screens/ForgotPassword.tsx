/*************************************************
 * FreightRunner
 * @exports
 * @function ForgotPassword.tsx
 * @extends Component
 * Created by Naveen E on 06/05/2022
 * Copyright © 2022 FreightRunner. All rights reserved.
 *************************************************/

'use strict';

import React, {FC, useState, useContext} from 'react';
import {
  Alert,
  Dimensions,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import * as yup from 'yup';
import {
  CustomButton,
  Logo,
  Screen,
  Text,
  TruckImages,
  View,
} from '../components';
import colors from '../styles/colors';
import {STANDARD_PADDING} from '../styles/globalStyles';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import {
  forgotPassword,
  resendOTP,
  validateOTP,
} from '../services/registrationService';
import {SnackbarContext, SnackbarContextType} from '../context/SnackbarContext';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
const CELL_COUNT = 6;
type Props = {navigation: any};
type FormValues = {email: string};

const validationSchema = yup.object().shape({
  email: yup
    .string()
    .required('Please enter a valid email address')
    .email('Please enter a valid email address'),
});

const ForgotPassword: FC<Props> = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const [isShowMailInput, setisShowMailInput] = useState(true);
  const [forgotMail, setforgotMail] = useState('');
  const [timer, settimer] = useState(60);
  const [numberOfAttempt, setnumberOfAttempt] = useState(0);
  const {setMessage, setVisible} =
    useContext<SnackbarContextType>(SnackbarContext);
  const [validateEmail, setValidateEmail] = useState('Email');

  const [value, setValue] = useState('');
  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  const runTimmer = () => {
    var timesRun = 0;
    var interval = setInterval(function () {
      timesRun += 1;
      settimer(prevCount => prevCount - 1);
      if (timesRun === 60) {
        clearInterval(interval);
        settimer(60);
      }
      //do whatever here..
    }, 1000);
    // if (timer === undefined) {
    //   settimer(60);
    //   setInterval(() => {
    //     settimer(prevCount => prevCount - 1);
    //   }, 1000);
    // } else if (timer === 60) {
    //   settimer(undefined);
    // }
  };
  console.log('runTimmer--', timer);
  const submitForgotPassword = async () => {
    if (isShowMailInput) {
      if (forgotMail.trim().length === 0) {
        setValidateEmail('Please enter a valid email');
      } else if (_validateEmail(forgotMail) === false) {
        setValidateEmail('Please enter a valid email');
      } else {
        setLoading(true);
        console.log('-forgotMail-', forgotMail);
        await forgotPassword({email: forgotMail})
          .then(async response => {
            setLoading(false);
            console.log('Forgot password response', response);
            if (response.status === 200) {
              setLoading(false);
              setisShowMailInput(false);
              runTimmer();
              setMessage("OTP has been sent to user's registered email.");
              setVisible(true);
            }
          })
          .catch(e => {
            setLoading(false);
            console.log('Forgot password error', e.response);
            Alert.alert('Error', e.response.data.message);
          });
      }
    } else {
      console.log('Forgot password:,', value.length);
      if (value.length < 6) {
        Alert.alert('Error', 'Please enter a valid OTP');
      } else {
        setLoading(true);
        await validateOTP({email: forgotMail, otp: value})
          .then(async response => {
            setLoading(false);
            console.log('validateOTP response', response);
            if (response.status === 200) {
              setLoading(false);
              navigation.navigate('CreatePassword', {
                resetToken: response.data.resetToken,
              });
              setMessage('OTP verified successfully');
              setVisible(true);
            }
          })
          .catch(e => {
            setLoading(false);
            console.log('OTP verified error', e.response);
            Alert.alert('Error', e.response.data.message);
          });
      }
    }
  };
  const _validateEmail = text => {
    if (text.trim().length > 0) {
      let reg =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (reg.test(text) === false) {
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  };

  const _updateEmail = email => {
    setforgotMail(email);
    if (_validateEmail(email)) {
      setValidateEmail('Email');
    }
  };

  return (
    <Screen style={styles.container}>
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        indicatorStyle="white">
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
              backgroundColor: colors.white,
              height: deviceHeight / 1,
            }}>
            <TruckImages />
            <View style={{paddingHorizontal: 20, marginTop: deviceHeight / 9}}>
              <View style={{alignItems: 'center'}}>
                <Text
                  style={{
                    fontWeight: '600',
                    fontSize: 14,
                    color: colors.background,
                  }}>
                  FORGOT PASSWORD! PLEASE ENTER{' '}
                  {isShowMailInput ? 'YOUR MAIL' : 'OTP'}
                </Text>
                <Text
                  style={{
                    color: '#808F99',
                    fontSize: 13,
                    marginTop: deviceHeight / 90,
                    fontWeight: '500',
                  }}>
                  Verification code {isShowMailInput ? 'will be' : 'has been'}{' '}
                  sent to your registered email.
                </Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  marginVertical: deviceHeight / 60,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                {isShowMailInput ? (
                  <View
                    style={{
                      paddingHorizontal: deviceWidth / 30,
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      backgroundColor: '#F5F4F7',
                      borderColor: '#EDEDED',
                      borderTopWidth: 1,
                      borderBottomWidth: 1,
                      paddingVertical: 10,
                      flex: 1,
                      marginTop: deviceHeight / 40,
                      borderRadius: 8,
                      shadowOffset: {width: -2, height: 2},
                      shadowColor: '#171717',
                      shadowOpacity: 0.2,
                      shadowRadius: 2,
                      elevation: 3,
                    }}>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: '500',
                        color:
                          validateEmail === 'Please enter a valid email'
                            ? 'red'
                            : 'gray',
                      }}>
                      {validateEmail}
                    </Text>
                    <View style={{flexDirection: 'row', marginVertical: 5}}>
                      <TextInput
                        autoCapitalize="none"
                        autoCorrect={false}
                        style={{
                          padding: 0,
                          fontWeight: '600',
                          fontSize: 16,
                          flex: 1,
                        }}
                        onChangeText={e => {
                          _updateEmail(e);
                        }}
                        value={forgotMail}
                        placeholder=""
                        keyboardType="email-address"
                        returnKeyType="next"
                        blurOnSubmit={false}
                      />
                    </View>
                  </View>
                ) : (
                  <CodeField
                    ref={ref}
                    {...props}
                    value={value}
                    onChangeText={setValue}
                    cellCount={CELL_COUNT}
                    rootStyle={styles.codeFieldRoot}
                    keyboardType="number-pad"
                    textContentType="oneTimeCode"
                    renderCell={({index, symbol, isFocused}) => (
                      <View
                        key={index}
                        style={{
                          backgroundColor: '#F5F4F7',
                          marginRight: index === 2 ? 10 : 0,
                          alignItems: 'center',
                          justifyContent: 'center',
                          height: 63,
                          width: 36,

                          borderColor: '#EDEDED',
                          borderWidth: 1,
                        }}>
                        {/* <Text>a</Text> */}
                        <View
                          // Make sure that you pass onLayout={getCellOnLayoutHandler(index)} prop to root component of "Cell"
                          onLayout={getCellOnLayoutHandler(index)}
                          style={[styles.cellRoot, styles.focusCell]}>
                          {/* <TextInput
                            placeholder="-"
                            value={symbol}
                            style={{
                              fontSize: 22,
                              fontWeight: "bold"
                            }}
                          ></TextInput> */}
                          <Text
                            style={
                              isFocused || symbol
                                ? styles.cellText
                                : styles.cellTextgray
                            }>
                            {isFocused ? <Cursor /> : symbol ? symbol : '-'}
                          </Text>
                        </View>
                      </View>
                    )}
                  />
                )}
              </View>
              {!isShowMailInput ? (
                <View
                  style={{
                    alignItems: 'center',
                    marginVertical: deviceHeight / 20,
                    flexDirection: 'row',
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      color: '#808F99',
                      fontSize: 13,
                      // marginTop: deviceHeight / 90,
                      fontWeight: '500',
                    }}>
                    Didn't receive OTP?{' '}
                  </Text>
                  {timer === 60 ? (
                    <TouchableOpacity
                      onPress={async () => {
                        if (numberOfAttempt <= 2) {
                          await resendOTP({email: forgotMail})
                            .then(async response => {
                              setLoading(false);
                              console.log('Resend OTP response', response);
                              if (response.status === 200) {
                                setnumberOfAttempt(prevCount => prevCount + 1);
                                runTimmer();
                                setMessage(
                                  "OTP has been sent to user's registered email.",
                                );
                                setVisible(true);
                              }
                            })
                            .catch(e => {
                              console.log('Resend OTP error', e.response);
                              Alert.alert('Error', e.response.data.message);
                            });
                        } else {
                          Alert.alert(
                            'Error',
                            'You have reached maximum number of attempt',
                          );
                        }
                      }}>
                      <Text
                        style={{
                          color: '#1C6191',
                          fontSize: 13,
                          fontWeight: '500',
                          alignSelf: 'center',
                        }}>
                        {' '}
                        Resend OTP
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <Text
                      style={{
                        color: '#808F99',
                        fontSize: 13,
                        // marginTop: deviceHeight / 90,
                        fontWeight: '500',
                      }}>
                      {' '}
                      in {timer}s
                    </Text>
                  )}
                </View>
              ) : (
                <View style={{marginVertical: deviceHeight / 20}}></View>
              )}

              <CustomButton
                titleColor={colors.white}
                borderColor=""
                onPress={() => submitForgotPassword()}
                title={isShowMailInput ? 'Send OTP' : 'Submit'}
                backgroundColor={colors.btnColor}
                btnLoading={loading}></CustomButton>
            </View>
            <View
              style={{
                marginTop: deviceHeight / 12,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}></View>
            <View
              style={{
                marginTop: 10,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={{}}>
                <Text
                  style={{
                    color: 'black',
                    textAlign: 'center',
                    textDecorationLine: 'underline',
                  }}>
                  Back
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  backButton: {
    alignItems: 'center',
    borderRadius: 9,
    borderWidth: 1,
    borderColor: colors.primary,
    height: 48,
    justifyContent: 'center',
    marginRight: 10,
    width: 48,
  },
  container: {},
  button: {
    minHeight: 48,
  },
  buttonContainer: {
    justifyContent: 'center',
  },
  marginBottom: {
    marginBottom: STANDARD_PADDING,
  },
  title: {
    textAlign: 'center',
  },
  codeFieldRoot: {
    marginTop: deviceHeight / 40,
    width: 330,
    // marginLeft: "auto",
    // marginRight: "auto"
  },
  cellRoot: {
    width: 20,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: 'red',
    borderBottomWidth: 0,
    bottom: 5,
  },
  cellText: {
    color: '#000',
    fontSize: 36,
    textAlign: 'center',
  },
  cellTextgray: {
    color: 'lightgray',
    fontSize: 36,
    textAlign: 'center',
  },
  focusCell: {
    // borderBottomColor: "#007AFF",
    // borderBottomWidth: 2
  },
});

export default ForgotPassword;
