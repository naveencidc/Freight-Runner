/*************************************************
 * FreightRunner
 * @exports
 * @function UpdateScreen.tsx
 * @extends Component
 * Created by Naveen E on 22/11/2022
 * Copyright © 2022 FreightRunner. All rights reserved.
 *************************************************/

'use strict';

import React, {useContext, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ViewStyle,
  Image,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import {Text, Logo, View, CustomButton} from '../components';
import colors from '../styles/colors';
import {
  PLATFORM,
  STANDARD_PADDING,
  DEVICE_WIDTH,
  fontFamily,
  fontSizes,
} from '../styles/globalStyles';
import {User} from '../types/global';
import storage from '../helpers/storage';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import FastImage from 'react-native-fast-image';
import {Images} from '../assets/images';
import {MyContext} from './../../app/context/MyContextProvider';
import Config from 'react-native-config';
import {navigateToScreen} from '../services/userService';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

type FormValues = {
  email: string;
  password: string;
};

function UpdateScreen({navigation}: any, route: any) {
  let isCompulsory = route.params?.isCompulsory;
  const global = useContext(MyContext);

  const _skipUpdate = async () => {
    const notificationPayload = await storage.get('notificationPayload');
    const refershTokenResponse = await navigateToScreen(
      {navigation},
      global,
      notificationPayload,
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        indicatorStyle="white">
        <View style={{marginTop: 15}}>
          <Logo />
        </View>

        {/**Truck Images */}
        <View style={{paddingTop: deviceHeight / 20}}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <FastImage
              source={Images.blackTruck}
              style={{
                height: deviceHeight / 7.5,
                width: deviceWidth / 2.05,
                alignSelf: 'flex-end',
              }}
            />
            <FastImage
              source={Images.redTruck}
              style={{height: deviceHeight / 7, width: deviceWidth / 2.05}}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              marginTop: deviceHeight / 90,
              justifyContent: 'space-between',
            }}>
            <FastImage
              source={Images.longTruck}
              style={{height: deviceHeight / 5.5, width: deviceWidth / 1.65}}
            />
            <FastImage
              source={Images.brownTruck}
              style={{height: deviceHeight / 8, width: deviceWidth / 2.7}}
            />
          </View>
        </View>
        {/**Truck Images */}
        <Text
          style={{
            fontSize: fontSizes.medium,
            fontWeight: '600',
            color: 'white',
            textAlign: 'center',
            marginVertical: deviceHeight / 25,
            paddingHorizontal: 15,
          }}>
          {Platform.OS === 'ios'
            ? 'There is a newer version available for download! Please update the app by visiting the App Store.'
            : 'There is a newer version available for download! Please update the app by visiting the Play Store.'}
        </Text>
        <View
          style={{
            paddingHorizontal: deviceWidth / 20,
            marginTop: deviceHeight / 50,
          }}>
          <CustomButton
            titleColor={colors.white}
            borderColor={colors.white}
            onPress={() => navigation.navigate('LoginScreen')}
            title="Update"
            backgroundColor={colors.background}></CustomButton>
          {!isCompulsory ? (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <TouchableOpacity
                onPress={() => _skipUpdate()}
                style={{
                  marginTop: deviceHeight / 35,
                  flexDirection: 'row',
                }}>
                <Text
                  style={{
                    color: colors.white,
                    textAlign: 'center',
                    textDecorationLine: 'underline',
                    fontWeight: 'bold',
                  }}>
                  Skip
                </Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

export default UpdateScreen;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 0,
    backgroundColor: colors.background,
    flex: 1,
  },
});
