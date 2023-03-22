//imports
import {
  CommonActions,
  createNavigationContainerRef,
} from '@react-navigation/native';
import Snackbar from 'react-native-snackbar';
import {Alert} from 'react-native';

// // Components
// import { REGEX } from "./Constants";

export default class Utility {
  // used to show snackbar with text message
  static showSnackBar(text: string) {
    Snackbar.show({
      text,
    });
  }
  // used to show alert with yes and cancel actions
  static showAlertWithYesCancelAction(
    title: string,
    message: string,
    callback: Function,
  ) {
    Alert.alert(
      title,
      message,
      [
        {text: 'Yes', onPress: () => callback()},
        {text: 'Cancel', onPress: () => {}},
      ],
      {cancelable: false},
    );
  }
  // // function to validate whether the email is valid or not
  // static validateEmail = (email: string) => {
  //   return String(email).toLowerCase().match(REGEX.EMAIL);
  // };
  // // function to validate whether the password is valid or not
  // static validatePassword = (password: string) => {
  //   return String(password).toLowerCase().match(REGEX.PASSWORD);
  // };
}

export const navigationRef = createNavigationContainerRef();

export const navigate = (name: string, params: any) => {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
};

export const navigateBack = () => {
  if (navigationRef.isReady()) {
    navigationRef.goBack();
  }
};

export const navigateAndReset = (routes = [], index = 0) => {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(
      CommonActions.reset({
        index,
        routes,
      }),
    );
  }
};

export const navigateAndSimpleReset = (name: any, index = 0) => {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(
      CommonActions.reset({
        index,
        routes: [{name}],
      }),
    );
  }
};
