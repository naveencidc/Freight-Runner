/*************************************************
 * FreightRunner
 * @exports
 * @function SplashScreen.tsx
 * @extends Component
 * Created by Naveen E on 07/06/2022
 * Copyright © 2022 FreightRunner. All rights reserved.
 *************************************************/

'use strict';

import React, {useEffect, useContext, useState} from 'react';
import {StyleSheet} from 'react-native';
import {Logo, Screen} from '../components';
import storage from '../helpers/storage';
// import { NavigationProps } from "../navigation";
import {
  getOnbardingStatus,
  navigateToScreen,
  refershToken,
  checkMinimumVersion,
} from '../services/userService';
import {MyContext} from './../../app/context/MyContextProvider';

function SplashScreen({navigation}: any) {
  const global = useContext(MyContext);
  useEffect(() => {
    try {
      async function fetchAPI() {
        const notificationPayload = await storage.get('notificationPayload');
        // const updateAvailable = await checkMinimumVersion({navigation});
        // if (updateAvailable !== undefined) {
        const refershTokenResponse = await refershToken({navigation});
        if (refershTokenResponse && refershTokenResponse.data) {
          // if (updateAvailable) {
          //   navigation.navigate('UpdateScreen', {
          //     isCompulsory: false,
          //     isLoggedIn: true,
          //   });
          // } else {
          const refershTokenResponse = await navigateToScreen(
            {navigation},
            global,
            notificationPayload,
          );
          // }
        }
        // }
      }
      setTimeout(() => {
        fetchAPI();
      }, 5000);
    } catch (error) {
      console.log('error', error.respons);
    }
    return async () => {
      await storage.remove('notificationPayload');
      const notificationPayload = await storage.get('notificationPayload');
      // Here goes the code you wish to run on unmount
    };
  }, []);

  return (
    <Screen style={styles.container}>
      <Logo />
    </Screen>
  );
}

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
