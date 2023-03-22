import React, {ReactNode} from 'react';
import {
  ScrollView,
  StatusBar,
  StyleProp,
  StyleSheet,
  View,
  ViewProps,
  ViewStyle,
  SafeAreaView,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import colors from '../styles/colors';
import {PLATFORM} from '../styles/globalStyles';

type Props = ViewProps & {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  type?: 'awareScroll' | 'scroll';
};

function Screen({children, style, type}: Props) {
  let Component;
  if (type === 'awareScroll') {
    Component = KeyboardAwareScrollView;
  } else if (type === 'scroll') {
    Component = ScrollView;
  } else {
    Component = View;
  }

  return (
    <SafeAreaView style={styles.outerContainer}>
      {PLATFORM === 'ios' ? <StatusBar barStyle="dark-content" /> : null}
      <Component style={[styles.containerStyle, style]}>{children}</Component>
    </SafeAreaView>
  );
}

export default Screen;

type ScreenStyleSheet = {
  containerStyle: ViewStyle;
  outerContainer: ViewStyle;
};

const styles = StyleSheet.create<ScreenStyleSheet>({
  containerStyle: {
    flex: 1,
  },
  outerContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
