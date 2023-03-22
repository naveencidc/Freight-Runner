import React, {ReactNode} from 'react';
import {
  View as RNView,
  ViewProps,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';

type Props = {
  children?: ReactNode;
  row?: boolean;
  style?: StyleProp<ViewStyle>;
} & ViewProps;

type Ref = any;

const View: React.FC<Props> = props => {
  const {row, style, ...restProps} = props;
  return <RNView style={[style, row ? styles.row : null]} {...restProps} />;
};

type ViewStyleSheet = {
  row: ViewStyle;
};

const styles = StyleSheet.create<ViewStyleSheet>({
  row: {flexDirection: 'row'},
});

export default View;
