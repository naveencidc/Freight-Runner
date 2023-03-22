import * as React from 'react';
import {
  Animated,
  SafeAreaView,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from 'react-native';

import {Text} from '.';
import colors from '../styles/colors';

type Props = {
  visible: boolean;
  duration?: number;
  onDismiss: () => void;
  style?: StyleProp<ViewStyle>;
};

type State = {
  opacity: Animated.Value;
  hidden: boolean;
};

const DURATION_SHORT = 4000;
const DURATION_MEDIUM = 7000;
const DURATION_LONG = 10000;

class Snackbar extends React.Component<Props, State> {
  static DURATION_SHORT = DURATION_SHORT;
  static DURATION_MEDIUM = DURATION_MEDIUM;
  static DURATION_LONG = DURATION_LONG;
  static defaultProps = {
    duration: DURATION_MEDIUM,
  };

  state = {
    opacity: new Animated.Value(0.0),
    hidden: !this.props.visible,
  };

  componentDidMount() {
    if (this.props.visible) {
      this._show();
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.visible !== this.props.visible) {
      this._toggle();
    }
  }

  componentWillUnmount() {
    if (this._hideTimeout) {
      clearTimeout(this._hideTimeout);
    }
  }

  _toggle = () => {
    if (this.props.visible) {
      this._show();
    } else {
      this._hide();
    }
  };

  _show = () => {
    if (this._hideTimeout) {
      clearTimeout(this._hideTimeout);
    }
    this.setState({
      hidden: false,
    });
    Animated.timing(this.state.opacity, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start(({finished}) => {
      if (finished) {
        const {duration} = this.props;
        const isInfinity =
          duration === Number.POSITIVE_INFINITY ||
          duration === Number.NEGATIVE_INFINITY;

        if (finished && !isInfinity) {
          this._hideTimeout = setTimeout(this.props.onDismiss, duration);
        }
      }
    });
  };

  _hide = () => {
    if (this._hideTimeout) {
      clearTimeout(this._hideTimeout);
    }

    Animated.timing(this.state.opacity, {
      toValue: 0,
      duration: 100,
      useNativeDriver: true,
    }).start(({finished}) => {
      if (finished) {
        this.setState({hidden: true});
      }
    });
  };

  _hideTimeout?: number;

  render() {
    const {children, visible, style} = this.props;

    if (this.state.hidden) {
      return null;
    }

    return (
      <SafeAreaView pointerEvents="box-none" style={styles.wrapper}>
        <Animated.View
          pointerEvents="box-none"
          accessibilityLiveRegion="polite"
          style={
            [
              styles.container,
              {
                opacity: this.state.opacity,
                transform: [
                  {
                    scale: visible
                      ? this.state.opacity.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.9, 1],
                        })
                      : 1,
                  },
                ],
              },
              {backgroundColor: colors.white},
              style,
            ] as StyleProp<ViewStyle>
          }>
          <Text style={styles.content}>{children}</Text>
        </Animated.View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    bottom: 0,
    position: 'absolute',
    width: '100%',
    zIndex: 10000,
  },
  container: {
    alignItems: 'center',
    borderColor: colors.green,
    borderRadius: 5,
    borderWidth: 1,
    elevation: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 8,
  },
  content: {
    color: colors.green,
    flex: 1,
    flexWrap: 'wrap',
    marginHorizontal: 16,
    marginVertical: 14,
  },
});

export default Snackbar;
