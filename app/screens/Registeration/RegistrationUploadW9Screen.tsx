/*************************************************
 * FreightRunner
 * @exports
 * @function RegistrationUploadW9Screen.tsx
 * @extends Component
 * Created by Naveen E on 13/06/2022
 * Copyright © 2022 FreightRunner. All rights reserved.
 *************************************************/

import React, { useContext, useEffect, useState, useRef } from "react";
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
  Image,
  PermissionsAndroid,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { Formik } from "formik";
import * as yup from "yup";
import {
  CustomButton,
  Logo,
  Screen,
  SimpleInput as Input,
  Text,
  View,
} from "../../components";
import {
  getTrailerTypeList,
  getW9Form,
  getPresignedUrl,
} from "../../services/registrationService";
import colors1 from "../../styles/colors";
import FastImage from "react-native-fast-image";
import ActionSheet from "react-native-actionsheet";
import ImagePicker from "react-native-image-crop-picker";
import DocumentPicker from "react-native-document-picker";
import Pdf from "react-native-pdf";
import RNFetchBlob from "react-native-blob-util";
import fs from "react-native-fs";
import { decode } from "base64-arraybuffer";
import { uploadDocument, uploadToS3 } from "../../services/uploadS3Service";
import {
  SnackbarContext,
  SnackbarContextType,
} from "../../context/SnackbarContext";
import storage from "../../helpers/storage";
var axios = require("axios");
import { MyContext } from ".././../../app/context/MyContextProvider";

const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;

function RegistrationUploadW9Screen({ navigation, route }) {
  const [w_9Details, setw_9Details] = useState({});
  const [loading, setLoading] = useState(false);
  const { setMessage, setVisible } =
    useContext<SnackbarContextType>(SnackbarContext);
  const global: any = useContext(MyContext);
  useEffect(() => {
    try {
      async function fetchAPI() {
        //To get w9 from detals
        const response = await getW9Form();
        console.log("---W-9Response--", response);
        if (response.data) {
          setw_9Details(response.data);
        }
      }
      fetchAPI();
    } catch (error) {
      Alert.alert("Error", "There was an error. Please try again.");
    }
  }, []);

  const downloadHistory = () => {
    const { config, fs } = RNFetchBlob;
    let option = {};
    let dirs =
      Platform.OS === "ios"
        ? RNFetchBlob.fs.dirs.DocumentDir
        : RNFetchBlob.fs.dirs.DownloadDir;
    let title = "w_9_form";
    let date = new Date();
    if (Platform.OS === "android") {
      option = {
        fileCache: true,
        appendExt: "pdf",
        path: `${dirs}/${title}`,
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          title: `${title}.pdf`,
          path: `${dirs}/${title}`,
        },
      };
    } else {
      option = {
        fileCache: true,
        appendExt: "pdf",
        title: `${title}.pdf`,
      };
    }
    console.log("------gggggggg---,", option);
    // let options = {
    //   fileCache: true,
    //   addAndroidDownloads: {
    //     //Related to the Android only
    //     useDownloadManager: true,
    //     notification: true,
    //     path: PictureDir + "/Report_Download" + Math.floor(date.getTime() + date.getSeconds() / 2),
    //     description: "Risk Report Download"
    //   }
    // };
    let downloadTask = RNFetchBlob.config(option).fetch(
      "GET",
      w_9Details.file_path,
      {}
    );
    downloadTask
      .progress({ count: 100 }, (received, total) => {
        let percentComplete = (received / total).toFixed(2) * 100;
        percentComplete = percentComplete.toFixed(0);
        console.log("-=-=-=-downloader-=-=", percentComplete);
      })
      .then((cache) => {
        if (Platform.OS === "ios") {
          RNFetchBlob.ios.openDocument(cache.data);
        } else {
          Alert.alert("Downloaded Successfully.");
        }
        downloadTask = undefined;
      })
      .catch((e) => {
        console.log("Error Download ", e);
        downloadTask = undefined;
      });
    // config(options)
    //   .fetch("GET", "https://dev-freight-runner.s3.us-east-2.amazonaws.com/1654860712922")
    //   .then(res => {
    //     //Showing alert after successful downloading
    //     console.log("res -> ", JSON.stringify(res));
    //     // alert('Report Downloaded Successfully.');
    //     Alert.alert("Report Downloaded Successfully.");
    //   });
  };

  const download = () => {
    //Function to check the platform
    //If iOS the start downloading
    //If Android then ask for runtime permission
    if (Platform.OS === "ios") {
      downloadHistory();
    } else {
      try {
        PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: "Storage Permission Required",
            message: "This app needs access to your storage to download file",
          }
        ).then((granted) => {
          console.log("---ASASASAS", granted);
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            //Once user grant the permission start downloading
            console.log("Storage Permission Granted.");
            downloadHistory();
          } else {
            //If permission denied then show alert 'Storage Permission Not Granted'
            Alert.alert("storage_permission");
          }
        });
      } catch (err) {
        //To handle permission related issue
        console.log("error", err);
      }
    }
  };

  const refActionSheet = useRef(null);
  const showActionSheet = () => {
    if (refActionSheet.current) {
      refActionSheet.current.show();
    }
  };
  //To Update Uploaded File name to our backend
  const uploadCompleted = async (item: any) => {
    const userDetail: any = await storage.get("userData");
    const finalUploadresponse = await uploadDocument({
      user_id: userDetail.user_id,
      document_type: "w9-form",
      file_path: item.filename,
    });
    console.log("fghjk", finalUploadresponse);
    if (finalUploadresponse.status === 201) {
      global.myDispatch({ type: "UPLOADING_COMPLETED", payload: true });
      global.myDispatch({ type: "HIDE_UPLOAD_DAILOG", payload: true });
      global.myDispatch({ type: "W_9_UPLOAD_STATUS_SUCESS" });
      setLoading(false);
      setMessage("W-9 uploaded successfully.");
      setVisible(true);
      navigation.goBack();
    } else {
      global.myDispatch({ type: "HIDE_UPLOAD_DAILOG", payload: true });
      setLoading(false);
      Alert.alert("Error", "There was an error. Please try again.");
    }
  };
  const openDocumentPicker = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
        allowMultiSelection: false,
      });
      console.log("------document picker---", res);
      if (res) {
        setLoading(true);
        global.myDispatch({ type: "UPLOADING_INIT", payload: true });
        const response = await uploadToS3(res[0], "document", global);
        console.log("----response s3--", response);
        if (response) {
          const userDetail = await storage.get("userData");
          await uploadDocument({
            user_id: userDetail.user_id,
            document_type: "w9-form",
            file_path: res[0].name,
          })
            .then((finalUploadresponse) => {
              console.log("fghjk", finalUploadresponse);
              if (finalUploadresponse.status === 201) {
                global.myDispatch({
                  type: "UPLOADING_COMPLETED",
                  payload: true,
                });
                global.myDispatch({
                  type: "HIDE_UPLOAD_DAILOG",
                  payload: true,
                });
                global.myDispatch({ type: "W_9_UPLOAD_STATUS_SUCESS" });
                setLoading(false);
                setMessage("W-9 uploaded successfully.");
                setVisible(true);
                navigation.goBack();
              } else {
                global.myDispatch({
                  type: "HIDE_UPLOAD_DAILOG",
                  payload: true,
                });
                setLoading(false);
                Alert.alert("Error", "There was an error. Please try again.");
              }
            })
            .catch(() => {
              global.myDispatch({ type: "HIDE_UPLOAD_DAILOG", payload: true });
              setLoading(false);
              Alert.alert("Error", "There was an error. Please try again.");
            });
        }
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
      } else {
        throw err;
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* <KeyboardAwareScrollView keyboardShouldPersistTaps="handled"> */}
      <View style={{ flex: 1 }}>
        <View
          style={{
            backgroundColor: "black",
            paddingTop: deviceHeight / 15,
            paddingLeft: 20,
          }}
        >
          <FastImage
            resizeMode={"contain"}
            source={require("../../../app/assets/images/fr_new_logo.png")}
            style={{
              // alignSelf: "center",
              width: 220,
              height: 100,
            }}
          />
        </View>
        <ScrollView style={{ flex: 1, flexDirection: "column" }}>
          <View
            style={{
              flex: 1,
              marginHorizontal: 60,
              borderColor: "black",
              borderWidth: 1,
              marginVertical: 20,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                download();
              }}
              style={{
                position: "absolute",
                backgroundColor: "black",
                zIndex: 100,
                right: 10,
                top: 10,
                padding: 10,
                borderRadius: 5,
              }}
            >
              <FastImage
                resizeMode={"contain"}
                source={require("../../../app/assets/images/pdfDownload.png")}
                style={{
                  // alignSelf: "center",
                  width: 30,
                  height: 35,
                }}
              />
            </TouchableOpacity>
            <Pdf
              trustAllCerts={false}
              source={{ uri: `${w_9Details.file_path}`, cache: true }}
              onLoadComplete={(numberOfPages, filePath) => {
                console.log(`Number of pages: ${numberOfPages}`);
              }}
              onPageChanged={(page, numberOfPages) => {
                console.log(`Current page: ${page}`);
              }}
              onError={(error) => {
                console.log(error);
              }}
              onPressLink={(uri) => {
                console.log(`Link pressed: ${uri}`);
              }}
              style={{ backgroundColor: "white", height: deviceHeight / 2.6 }}
            />
          </View>
          <View
            style={{
              // flex: 0.8,
              backgroundColor: "#F9F9F9",
              marginHorizontal: 60,
              marginBottom: 20,
              borderColor: "#9895F2",
              borderWidth: 1.5,
              borderStyle: "dashed",
              borderRadius: 5,
              // paddingVertical:10
            }}
          >
            <View style={{ alignItems: "center", paddingHorizontal: 45 }}>
              <FastImage
                resizeMode={"contain"}
                source={require("../../../app/assets/images/fileIcon.png")}
                style={{
                  // alignSelf: "center",
                  width: 60,
                  height: 60,
                  paddingVertical: deviceHeight / 40,
                }}
              />
              <Text
                style={{
                  textAlign: "center",
                  color: "#858C97",
                  paddingTop: 10,
                  fontSize: 14,
                }}
              >
                Hey, download the W-9 by clicking the above button.Fill in
                manually, affix your signature and upload it back here in!.
              </Text>
            </View>

            <View
              style={{
                paddingHorizontal: deviceWidth / 10,
                paddingVertical: deviceHeight / 45,
              }}
            >
              <CustomButton
                titleColor={colors1.white}
                borderColor={"#1F1F1F"}
                onPress={() => showActionSheet()}
                // onPress={() => navigation.navigate("LoginScreen")}
                //  onPress={() => navigation.goBack()}
                title="Upload"
                backgroundColor={colors1.background}
                btnLoading={loading}
              ></CustomButton>
            </View>
          </View>
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              marginVertical: 10,
            }}
          >
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ padding: 10 }}
            >
              <Text
                style={{ fontWeight: "700", textDecorationLine: "underline" }}
              >
                {"Back"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>

      {/* </KeyboardAwareScrollView> */}
      <ActionSheet
        ref={refActionSheet}
        title={"Select"}
        options={["Camera", "Gallery", "Document", "Cancel"]}
        cancelButtonIndex={3}
        onPress={async (index) => {
          if (index === 0) {
            ImagePicker.openCamera({
              // width: 300,
              // height: 300,
              // cropping: true
            })
              .then(async (item: any) => {
                if (!item.fileName) item.filename = item.path.split("/").pop();
                global.myDispatch({ type: "UPLOADING_INIT", payload: true });
                const response = await uploadToS3(item, "image", global);
                if (response) {
                  uploadCompleted(item);
                }
              })
              .catch((err) => {
                global.myDispatch({
                  type: "HIDE_UPLOAD_DAILOG",
                  payload: true,
                });
                setLoading(false);
                if (err.message !== "User cancelled image selection") {
                  Alert.alert("Error", "There was an error. Please try again.");
                }
              });
          } else if (index === 1) {
            ImagePicker.openPicker({
              multiple: false,
              mediaType: "photo",
              cropping: false,
              maxFiles: 5,
              compressImageQuality: Platform.OS === "ios" ? 0.4 : 0.8,
            })
              .then(async (item: any) => {
                if (!item.fileName) item.filename = item.path.split("/").pop();
                global.myDispatch({ type: "UPLOADING_INIT", payload: true });
                const response = await uploadToS3(item, "image", global);
                if (response) {
                  uploadCompleted(item);
                }
              })

              .catch((err) => {
                global.myDispatch({
                  type: "HIDE_UPLOAD_DAILOG",
                  payload: true,
                });
                setLoading(false);
                if (err.message !== "User cancelled image selection") {
                  Alert.alert("Error", "There was an error. Please try again.");
                }
              });
          } else if (index === 2) {
            openDocumentPicker();
          }
        }}
      />
    </SafeAreaView>
  );
}

type Styles = {
  container: ViewStyle;
};

const styles = StyleSheet.create<Styles>({
  container: {
    backgroundColor: "white",
    flex: 1,
    // paddingHorizontal: STANDARD_PADDING
  },
});

export default RegistrationUploadW9Screen;
