import React from 'react';
import {
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {View} from '.';
import {fontSizes} from '../styles/globalStyles';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

type Props = {
  title: string;
  onPress(): void;
  isRightText: boolean;
  rightText: string;
  rightOnPress(): void;
  showOnlyHeader: boolean;
  isFrom: string;
  hideLeftSide: boolean;
  showCalender: boolean;
};

const HeaderWithBack: React.FC<Props> = ({
  title,
  onPress,
  isRightText,
  rightText,
  rightOnPress,
  showOnlyHeader,
  isFrom,
  hideLeftSide,
  showCalender,
}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        paddingVertical: deviceHeight / 80,
        // marginTop: Platform.OS === "ios" ? deviceHeight / 80 : null,
        paddingHorizontal: deviceWidth / 40,
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomColor: '#EDEDED',
        backgroundColor: 'white',
        borderBottomWidth: 1,
      }}>
      {!showOnlyHeader ? (
        !hideLeftSide ? (
          <TouchableOpacity
            onPress={onPress}
            style={{padding: 10, flex: isRightText ? 0.5 : 0.2}}>
            <FastImage
              resizeMode={'contain'}
              source={require('../../app/assets/images/backArrow.png')}
              style={{height: 15, width: 15}}
            />
          </TouchableOpacity>
        ) : (
          <View style={{padding: 10, flex: isRightText ? 0.5 : 0.2}}></View>
        )
      ) : null}

      <Text
        style={{
          padding: 10,
          fontWeight: '500',
          fontSize: 16,
          flex: 1,
          textAlign: 'center',
        }}>
        {title}
      </Text>

      {!showOnlyHeader ? (
        <TouchableOpacity
          onPress={rightOnPress}
          style={{
            padding: 10,
            flex: isRightText ? 0.5 : 0.2,
            alignItems: 'flex-end',
          }}>
          {isRightText ? (
            isFrom === 'LoadDetail' ? (
              <View
                style={{
                  flexDirection: 'row',
                  backgroundColor: '#F5F4F7',
                  alignItems: 'center',
                  paddingVertical: deviceHeight / 120,
                  paddingHorizontal: 8,
                  borderRadius: 5,
                }}>
                <FastImage
                  resizeMode={'contain'}
                  source={
                    showCalender
                      ? require('../../app/assets/images/calenderRemainder.png')
                      : require('../../app/assets/images/support.png')
                  }
                  style={{height: 18, width: 18}}
                />
                {!showCalender ? (
                  <Text
                    style={{
                      marginLeft: 5,
                      textAlign: 'right',
                      fontSize:
                        isFrom === 'TruckList' || isFrom === 'TrailerList'
                          ? fontSizes.regular
                          : fontSizes.small,
                      color: 'black',
                    }}>
                    {rightText}
                  </Text>
                ) : null}
              </View>
            ) : (
              <Text
                style={{
                  textAlign: 'right',
                  fontSize:
                    isFrom === 'TruckList' || isFrom === 'TrailerList'
                      ? fontSizes.regular
                      : fontSizes.small,
                  color: '#1C6191',
                }}>
                {rightText}
              </Text>
            )
          ) : null}
          {isFrom === 'loadRequest' ? (
            <View
              style={{
                flexDirection: 'row',
                backgroundColor: '#F5F4F7',
                alignItems: 'center',
                paddingVertical: deviceHeight / 120,
                paddingHorizontal: 8,
                borderRadius: 5,
              }}>
              <FastImage
                resizeMode={'contain'}
                source={require('../../app/assets/images/filter.png')}
                style={{height: 18, width: 18}}
              />
            </View>
          ) : null}

          {/* <FastImage
          resizeMode={'contain'}
          source={require('../../app/assets/images/backArrow.png')}
          style={{ height: 20, width: 20, backgroundColor: 'white', }}
        />   */}
          {/* <View  style={{ height: 20, width: 20 }}></View> */}
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

type Styles = {
  titleText: TextStyle;
};

const styles = StyleSheet.create<Styles>({
  titleText: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default HeaderWithBack;
