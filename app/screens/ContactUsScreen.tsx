/*************************************************
 * FreightRunner
 * @exports
 * @function ContactUsScreen.tsx
 * @extends Component
 * Created by Naveen E on 24/05/2022
 * Copyright © 2022 FreightRunner. All rights reserved.
 *************************************************/

import React, {useContext, useEffect, useState} from 'react';
import {
  Alert,
  StyleSheet,
  ViewStyle,
  Platform,
  TouchableOpacity,
  TextInput,
  Dimensions,
  ImageStyle,
  TextStyle,
  FlatList,
  Linking,
} from 'react-native';
import {Screen, Text, View} from '../components';
import colors1 from '../styles/colors';
import HeaderWithBack from '../components/HeaderWithBack';
import FastImage from 'react-native-fast-image';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const openUrl = url => {
  Linking.canOpenURL(url).then(supported => {
    if (supported) {
      Linking.openURL(url)
        .then(data => console.log('then', data))
        .catch(err => {
          Alert.alert("can't open this url");
          throw err;
        });
    } else {
      Alert.alert("can't open this url");
    }
    return false;
  });
};
function ContactUs({navigation}: any, route: any) {
  let isFrom = route.params?.isFrom;

  return (
    <Screen style={styles.container}>
      <HeaderWithBack
        title="CONTACT US"
        onPress={() => {
          if (isFrom === 'landing') {
            navigation.navigate('Landing');
          } else {
            navigation.goBack();
          }
        }}
        showOnlyHeader={false}
        isRightText={false}
        rightText="SELECT ALL"
        rightOnPress={() => navigation.goBack()}></HeaderWithBack>
      <View style={{flex: 1}}>
        <View
          style={{
            alignItems: 'center',
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'center',
          }}>
          <View style={{alignItems: 'center'}}>
            <View style={{flexDirection: 'row'}}>
              <FastImage
                resizeMode={'contain'}
                source={require('../../app/assets/images/mail.png')}
                style={{height: 20, width: 20}}
              />
              <Text
                style={{
                  color: colors1.background,
                  paddingHorizontal: 10,
                  textDecorationLine: 'underline',
                }}>
                hd_hotshot@gmail.com
              </Text>
            </View>
            <View style={{flexDirection: 'row', marginTop: 10}}>
              <FastImage
                resizeMode={'contain'}
                source={require('../../app/assets/images/call.png')}
                style={{height: 20, width: 20}}
              />
              <Text
                style={{
                  color: colors1.background,
                  paddingHorizontal: 10,
                  textDecorationLine: 'underline',
                }}>
                + (134) 123 3431
              </Text>
            </View>
          </View>
        </View>
        <View style={{}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View
              style={{
                height: 1.5,
                backgroundColor: 'lightgray',
                flex: 1,
              }}></View>
            <Text style={{marginHorizontal: 10, color: colors1.background}}>
              Follow us on
            </Text>
            <View
              style={{
                height: 1.5,
                backgroundColor: 'lightgray',
                flex: 1,
              }}></View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: deviceHeight / 25,
            }}>
            <TouchableOpacity
              onPress={() => {
                openUrl(
                  'https://www.instagram.com/thefreightrunner/?igshid=MTA0ZTI1NzA%3D',
                );
              }}>
              <FastImage
                resizeMode={'contain'}
                source={require('../../app/assets/images/instagram-logo.png')}
                style={{height: 32, width: 32}}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                openUrl(
                  'https://www.facebook.com/people/FreightRunner/100083562846673',
                );
              }}>
              <FastImage
                resizeMode={'contain'}
                source={require('../../app/assets/images/fb.png')}
                style={{height: 35, width: 35, marginHorizontal: 40}}
              />
            </TouchableOpacity>
            <FastImage
              resizeMode={'contain'}
              source={require('../../app/assets/images/twiter.png')}
              style={{height: 35, width: 35}}
            />
          </View>
        </View>
      </View>
    </Screen>
  );
}

type Styles = {
  buttons: ViewStyle;
  container: ViewStyle;
  bottom: ViewStyle;
  signUpButton: ViewStyle;
  name: ViewStyle;
  termsBotton: ViewStyle;
  termsLink: ViewStyle;
  dropdown3BtnStyle: ViewStyle;
  dropdown3BtnChildStyle: ViewStyle;
  dropdown3BtnImage: ImageStyle;
  dropdown3BtnTxt: TextStyle;
  dropdown3DropdownStyle: ViewStyle;
  dropdown3RowStyle: ViewStyle;
  dropdown3RowChildStyle: ViewStyle;
  dropdownRowImage: ImageStyle;
  dropdown3RowTxt: TextStyle;
};

const styles = StyleSheet.create<Styles>({
  buttons: {
    alignSelf: 'center',
    marginTop: 10,
    width: '95%',
  },
  bottom: {
    flexDirection: 'row',
    marginLeft: 25,
    alignSelf: 'center',
    marginTop: 20,
  },
  termsBotton: {
    flexDirection: 'row',
    marginLeft: Platform.OS === 'ios' ? 30 : 5,
    marginTop: -15,
  },
  termsLink: {
    marginTop: -13,
    marginLeft: Platform.OS === 'ios' ? -25 : 0,
  },
  signUpButton: {
    marginTop: -15,
    marginLeft: -25,
  },
  name: {
    fontSize: 12,
  },
  container: {
    backgroundColor: 'white',
    // paddingHorizontal: STANDARD_PADDING
  },
  dropdown3BtnStyle: {
    width: '100%',
    paddingHorizontal: 0,
  },
  dropdown3BtnChildStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdown3BtnImage: {width: 45, height: 45, resizeMode: 'cover'},
  dropdown3BtnTxt: {
    flex: 0.8,
    color: '#444',
    // textAlign: 'center',
    fontWeight: '600',
    fontSize: 18,
  },
  dropdown3DropdownStyle: {backgroundColor: '#EFEFEF', borderRadius: 5},
  dropdown3RowStyle: {
    // backgroundColor: 'slategray',
    borderBottomColor: '#EFEFEF',
    height: 50,
  },
  dropdown3RowChildStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 18,
  },
  dropdownRowImage: {width: 45, height: 45, resizeMode: 'contain'},
  dropdown3RowTxt: {
    color: 'black',
    fontWeight: '500',
    fontSize: 18,
    // marginHorizontal: 12,
    flex: 1,
  },
});

export default ContactUs;
