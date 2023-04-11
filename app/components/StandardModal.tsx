import React, { FC } from "react";
import { Modal, StyleSheet, TouchableOpacity } from "react-native";
import View from "./View";
import colors from "../styles/colors";
import { STANDARD_PADDING } from "../styles/globalStyles";

type Props = {
  title: string;
  handleClose: () => void;
  visible: boolean;
  handleBackClose: () => void;
};

const StandardModal: FC<Props> = ({
  children,
  handleClose,
  title,
  visible,
  handleBackClose,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleBackClose}
    >
      <View style={styles.container}>
        <View style={styles.innerContainer}>
          {/* <View style={styles.topRow}>
            <TouchableOpacity onPress={handleClose}>
              <Icon
                name="times-circle"
                size={20}
                style={{ alignSelf: "flex-end" }}
                color={colors.grey}
              />
            </TouchableOpacity>
            <Text type="h2" weight="bold" style={{ marginBottom: 5 }}>
              {title}
            </Text>
          </View> */}
          {children}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "rgba(52, 52, 52, 0.23)",
    // opacity:0.23,
    flex: 1,
    justifyContent: "center",
    padding: 15,
    width: "100%",
  },
  innerContainer: {
    backgroundColor: colors.white,
    opacity: 1,
    borderRadius: 16,
    padding: STANDARD_PADDING,
    width: "100%",
  },
  topRow: {
    justifyContent: "space-between",
  },
});

export default StandardModal;
