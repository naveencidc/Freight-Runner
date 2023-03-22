import React from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import Spinner from 'react-native-spinkit';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

type Props = {
  title: string;
  titleColor: string;
  backgroundColor: string;
  borderColor: string;
  onPress(): void;
  btnLoading: boolean;
  isFrom: string;
  disableButton: boolean;
  titleSize: number;
};

const CustomButton: React.FC<Props> = ({
  title,
  titleColor,
  backgroundColor,
  borderColor,
  onPress,
  btnLoading,
  isFrom,
  disableButton,
  titleSize,
}) => {
  return (
    <TouchableOpacity
      disabled={disableButton || btnLoading}
      onPress={onPress}
      style={{
        borderWidth: 1,
        borderColor: borderColor,
        padding: deviceHeight / 50,
        borderRadius: 30,
        backgroundColor: backgroundColor,
      }}>
      {btnLoading ? (
        <Spinner
          style={{alignSelf: 'center'}}
          isVisible={true}
          size={21}
          type={'Wave'}
          color={
            isFrom === 'TruckAndTrailerDetail' || isFrom === 'deleteBtn'
              ? '#B60F0F'
              : isFrom === 'withdraw'
              ? 'black'
              : 'white'
          }
        />
      ) : (
        <Text
          style={[
            styles.titleText,
            {color: titleColor, paddingVertical: 2, fontSize: titleSize},
          ]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
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

export default CustomButton;
