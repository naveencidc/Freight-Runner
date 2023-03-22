/*************************************************
 * FreightRunner
 * @exports
 * @function Login.tsx
 * @extends Component
 * Created by Naveen E on 05/05/2022
 * Copyright © 2022 FreightRunner. All rights reserved.
 *************************************************/

'use strict';

import React, {useContext, useEffect, useRef, useState} from 'react';
import * as yup from 'yup';
import {
  ActivityIndicator,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ViewStyle,
  Dimensions,
  TextInput,
} from 'react-native';
import {Formik} from 'formik';
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
import {
  PLATFORM,
  STANDARD_PADDING,
  DEVICE_WIDTH,
  fontFamily,
  fontSizes,
} from '../styles/globalStyles';
import storage from '../helpers/storage';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import FastImage from 'react-native-fast-image';
import {
  getOnbardingStatus,
  LoginUser,
  navigateToScreen,
  navigateToScreenAfterApproval,
  setUserTokenRenewalTimer,
} from '../services/userService';
import {SnackbarContext, SnackbarContextType} from '../context/SnackbarContext';
import {MyContext} from './../../app/context/MyContextProvider';
import {extractError} from '../utilities/errorUtilities';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

type Props = NavigationProps;

type FormValues = {
  email: string;
  password: string;
};

const initialValues: FormValues = {
  email: '',
  password: '',
};

function LoginScreen({navigation}: any, route: any) {
  const [loading, setLoading] = useState(false);
  const [hidePass, setHidePass] = useState(true);
  const [userEmail, setUserEmail] = useState<string>('');
  const [userPassword, setUserPassword] = useState<string>('');
  const {setMessage, setVisible} =
    useContext<SnackbarContextType>(SnackbarContext);
  const global = useContext(MyContext);
  const [count, setCount] = useState(null);
  const [hidePassword, sethidePassword] = useState(false);
  console.log(global.myState);
  const [params, setparams] = useState({
    email: '',
    password: '',
  });

  useEffect(() => {
    getLocationPermissions();
  });

  const getLocationPermissions = async () => {
    if (PLATFORM === 'ios') return;

    try {
      const permissionsGranted = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );

      if (permissionsGranted === true) return;

      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Please allow location access.',
          message:
            'This app needs to access your location to function properly. Please allow location access.',
          buttonPositive: 'Allow',
          buttonNegative: 'Deny',
        },
      );
    } catch (err) {
      //
    }
  };

  const authenticateUser = async (values: FormValues) => {
    setLoading(true);
    try {
      await LoginUser({
        email: values.email,
        password: values.password,
      })
        .then(async response => {
          console.log(' Login response', response);
          if (response.status === 200) {
            await storage.set('tokens', response.data.tokens);
            setUserTokenRenewalTimer(
              response.data.tokens.access.expires_seconds,
              navigation,
            );
            await storage.set('userData', response.data.user);
            global.myDispatch({type: 'LOGIN_SUCCESS', payload: response.data});

            /**
             *  1 - Active	Profile approved by admin
                2-  Inactive
                3 - In review	Default status 
                4 - Rejected	Profile rejected by admin
                5 - re submitted (In review)	Re submited by driver
             */
            if (response.data.user.profile_status === 1) {
              const refershTokenResponse = await navigateToScreen(
                {navigation},
                global,
              );
            } else if (response.data.user.profile_status === 4) {
              navigation.navigate('RegistrationRejectedScreen');
            } else if (response.data.user.profile_status === 3) {
              const refershTokenResponse = await navigateToScreen(
                {navigation},
                global,
              );
            } else {
              console.log('Navigation Failed');
              await storage.remove('tokens');
            }
            setLoading(false);

            // setMessage("Login successfully.");
            // setVisible(true);
            // setLoading(false);
            // // navigation.navigate("RegistrationTrailerDetailScreen");
            // navigation.navigate("Home");
          }
        })
        .catch(e => {
          setLoading(false);
          console.log('login error', e.response);
          if (e.response.data.message === 'Incorrect email or password') {
            Alert.alert(
              'Error',
              'The provided username or password is incorrect',
            );
          } else if (e.response.data.code === 401) {
            Alert.alert(
              'Error',
              'You are not allowed to login, Contact your administrator',
            );
          }

          // returnResponse = e.response;
        });
    } catch (e) {
      const error = extractError(e);
      console.log('errorrr', error);
      setLoading(false);
    }
  };

  const validationSchema = yup.object().shape({
    email: yup
      .string()
      .required('Please enter a valid email address')
      .email('Please enter a valid email address'),
    password: yup.string().required('Please enter your password'),
  });
  const ref_password = useRef();

  return (
    <Screen style={styles.container}>
      <KeyboardAwareScrollView
        scrollEnabled={false}
        keyboardShouldPersistTaps="handled"
        indicatorStyle="white"
        showsVerticalScrollIndicator={false}>
        <Formik
          initialValues={{...params}}
          enableReinitialize={true}
          // onSubmit={authenticateUser}
          onSubmit={async (values, {resetForm}) => {
            await authenticateUser(values);
            resetForm();
          }}
          validationSchema={validationSchema}
          render={({
            handleBlur,
            handleChange,
            handleSubmit,
            setFieldValue,
            errors,
            values,
            touched,
          }) => {
            return (
              <>
                <View style={{flex: 1, flexDirection: 'column'}}>
                  <View
                    style={{
                      flex: 1,
                      backgroundColor: 'black',
                      height: deviceHeight / 3.5,
                    }}>
                    <View
                      style={{
                        paddingTop:
                          Platform.OS === 'android' ? 0 : deviceHeight / 25,
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
                    <View
                      style={{
                        paddingHorizontal: 20,
                        marginTop: deviceHeight / 8,
                      }}>
                      <View style={styles.textInputView}>
                        <View style={{flex: 1}}>
                          <Text
                            style={{
                              fontSize: fontSizes.xSmall,
                              fontWeight: '500',
                              color:
                                touched.email && errors.email
                                  ? colors.red
                                  : 'gray',
                            }}>
                            {touched.email && errors.email
                              ? errors.email
                              : 'Username'}
                          </Text>
                          <TextInput
                            style={{
                              padding: 0,
                              fontWeight: '600',
                              fontSize: fontSizes.regular,
                              marginTop: 5,
                            }}
                            autoCapitalize="none"
                            autoCorrect={false}
                            onChangeText={handleChange('email')}
                            onBlur={handleBlur('email')}
                            value={values.email}
                            placeholder=""
                            keyboardType="email-address"
                            returnKeyType="next"
                            onSubmitEditing={() => ref_password.current.focus()}
                            blurOnSubmit={false}
                          />
                        </View>
                        <FastImage
                          resizeMode={'contain'}
                          source={require('../../app/assets/images/Person.png')}
                          style={{height: 20, width: 20, alignSelf: 'center'}}
                        />
                      </View>
                      <View style={[styles.textInputView, {marginTop: 25}]}>
                        <View style={{flex: 1}}>
                          <Text
                            style={{
                              fontSize: 12,
                              fontWeight: '500',
                              color:
                                touched.password && errors.password
                                  ? colors.red
                                  : 'gray',
                            }}>
                            {touched.password && errors.password
                              ? errors.password
                              : 'Password'}
                          </Text>

                          <TextInput
                            ref={ref_password}
                            autoCapitalize="none"
                            autoCorrect={false}
                            secureTextEntry={!hidePassword ? true : false}
                            style={{
                              padding: 0,
                              fontWeight: '600',
                              fontSize: fontSizes.regular,
                              marginTop: 5,
                            }}
                            onChangeText={handleChange('password')}
                            onBlur={handleBlur('password')}
                            value={values.password}
                            placeholder=""
                            keyboardType="default"
                            returnKeyType="done"
                          />
                        </View>

                        <Icon
                          name={!hidePassword ? 'eye-slash' : 'eye'}
                          size={16}
                          color={colors.background}
                          style={{alignSelf: 'center'}}
                          onPress={() => sethidePassword(!hidePassword)}
                        />
                      </View>

                      <View style={{marginTop: 25, alignItems: 'flex-end'}}>
                        <TouchableOpacity
                          onPress={() => navigation.navigate('ForgotPassword')}>
                          <Text style={{color: '#0A5F8C', fontSize: 14}}>
                            Forgot password?
                          </Text>
                        </TouchableOpacity>
                      </View>
                      <View style={{marginTop: 25}}>
                        <CustomButton
                          titleColor={colors.white}
                          borderColor=""
                          onPress={handleSubmit}
                          // onPress={() => navigation.navigate("Home")}
                          title="Login"
                          backgroundColor={colors.background}
                          btnLoading={loading}></CustomButton>
                      </View>
                      <View style={{marginVertical: deviceHeight / 45}}>
                        <Text
                          onPress={() =>
                            navigation.navigate(
                              'RegistrationPersonalDetailScreen',
                            )
                          }
                          style={{
                            textAlign: 'center',
                            color: colors.background,
                          }}>
                          Don’t have an account yet?{' '}
                          <Text
                            style={{
                              fontWeight: '700',
                              textDecorationLine: 'underline',
                            }}>
                            Sign up here.
                          </Text>
                        </Text>
                        {/* <CustomButton
                          titleColor={colors.background}
                          borderColor={colors.background}
                          onPress={() => navigation.navigate("RegistrationPersonalDetailScreen")}
                          title="SignUp"
                          backgroundColor={colors.white}
                        ></CustomButton> */}
                      </View>
                    </View>

                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: deviceHeight / 35,
                      }}>
                      <TouchableOpacity
                        onPress={() => navigation.navigate('ContactUs')}
                        style={{}}>
                        <Text
                          style={{
                            color: colors.background,
                            textAlign: 'center',
                            textDecorationLine: 'underline',
                          }}>
                          Contact Us
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </>
            );
          }}
        />
      </KeyboardAwareScrollView>
    </Screen>
  );
}

export default LoginScreen;

const styles = StyleSheet.create({
  container: {},
  buttons: {
    alignSelf: 'center',
    marginTop: 10,
    width: '95%',
  },
  bottom: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 20,
  },
  signUpButton: {
    marginTop: Platform.OS === 'ios' ? -33 : -35,
    fontSize: 18,
    textDecorationLine: 'underline',
    fontFamily: 'NunitoSans-Regular',
  },
  forgotPasswordContainer: {
    paddingLeft: 2,
    marginTop: 25,
    marginBottom: STANDARD_PADDING,
  },
  forgotPasswordText: {
    color: colors.primary,
    fontSize: 13,
    textDecorationLine: 'underline',
    fontFamily: 'NunitoSans-Regular',
  },
  name: {
    fontSize: 14,
    fontFamily: 'NunitoSans-Regular',
  },
  passwordViewContainer: {
    flexDirection: 'column',
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
  textInputView: {
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F5F4F7',
    borderColor: '#EDEDED',
    borderWidth: 1,
    paddingVertical: deviceHeight / 85,
    borderRadius: 8,
    shadowOffset: {width: -2, height: 2},
    shadowColor: '#171717',
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
});

export const SignInAttemptValidator = yup.object().shape({
  email: yup.string().required('Please provide your email.'),
  password: yup.string().required('Please provide your password.'),
});
