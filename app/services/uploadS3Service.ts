/*************************************************
 * FreightRunner
 * @exports
 * @function uploadS3Service.ts
 * @extends Component
 * Created by Naveen E on 23/06/2022
 * Copyright © 2022 FreightRunner. All rights reserved.
 *************************************************/

import { destroy, fetch, patch, post } from ".";
import { Registration } from "../types/global";
import fs from "react-native-fs";
import { decode } from "base64-arraybuffer";
import axios, { AxiosRequestConfig } from "axios";
import { Buffer } from "buffer";

/**
 * To get SignedUrl from s3 Need to send filename
 * @param fileName
 * @returns
 */
export const getPresignedUrl = (fileName: string) => {
  return fetch({
    endpoint: `s3/put-presigned-url?fileName=${fileName}`,
  });
};

export const getProfileImage = (fileName: string) => {
  return fetch({
    endpoint: `s3/get-presigned-url?fileName=${fileName}`,
  });
};

/**
 * To upload image or documents to s3 dirctly from mobile side
 * need path or uri need to convert path/ uri to base 64 and base64 to blob
 * Then need to upload using signedurl (call put method)
 * @param selectedObject
 * @param type
 * @returns
 */
export const uploadToS3 = async (
  selectedObject: object,
  type: string,
  global
) => {
  let fileName =
    type === "image" ? selectedObject.filename : selectedObject.name;
  let file = type === "image" ? selectedObject.path : selectedObject.uri;
  const signedUrl = await getPresignedUrl(fileName);
  global.myDispatch({ type: "UPLOADING_STARTED", payload: true });
  const base64 = await fs.readFile(file, "base64");
  const uploadFile = await axios({
    method: "PUT",
    url: signedUrl.data.url,
    data: decode(base64),
    headers: {
      "Content-Type": type === "image" ? "image/jpeg" : "application/pdf",
    },
    onUploadProgress: (progressEvent) => {
      let percentComplete =
        (progressEvent.loaded / progressEvent.total).toFixed(2) * 100;
      percentComplete = percentComplete.toFixed(0);
      console.log("-=-=-=-uploadper-=-=", percentComplete);
      global.myDispatch({
        type: "UPDATE_UPLOAD_PROGRESS",
        payload: percentComplete,
      });
    },
  });
  if (uploadFile.status === 200) {
    global.myDispatch({ type: "UPLOADING_FINALIZING", payload: true });
    return true;
  } else {
    global.myDispatch({ type: "HIDE_UPLOAD_DAILOG" });
    console.log("upload error");
    throw new Error("upload error");
    return false;
  }
};

/**
 * Upload Carrier e-sign to S3
 * @param fileName
 * @param signBase64
 * @param global
 * @returns
 */
export const uploadESignToS3 = async (
  fileName: string,
  signBase64: any,
  global: any
) => {
  const signedUrl: any = await getPresignedUrl(fileName);
  var buf = await Buffer.from(
    signBase64.replace(/^data:image\/\w+;base64,/, ""),
    "base64"
  );
  // global.myDispatch({ type: "UPLOADING_STARTED", payload: true });
  const uploadFile = await axios({
    method: "PUT",
    url: signedUrl.data.url,
    data: buf,
    headers: { "Content-Type": "image/jpeg" },
    onUploadProgress: (progressEvent: any) => {
      let percentComplete =
        (progressEvent.loaded / progressEvent.total).toFixed(2) * 100;
      percentComplete = percentComplete.toFixed(0);
      console.log("-=-=-=-uploadper-=-=", percentComplete);
      global.myDispatch({
        type: "UPDATE_UPLOAD_PROGRESS",
        payload: percentComplete,
      });
    },
  });
  if (uploadFile.status === 200) {
    // global.myDispatch({ type: "UPLOADING_FINALIZING", payload: true });
    return true;
  } else {
    // global.myDispatch({ type: "HIDE_UPLOAD_DAILOG" });
    console.log("upload error");
    throw new Error("upload error");
    return false;
  }
};

export const eSignUploadCompleted = (config: {
  load_id: number;
  partner_sign_url: string;
}) => {
  const { load_id, partner_sign_url } = config;
  return post({
    endpoint: `partner/send-signature`,
    data: {
      load_id: load_id,
      partner_sign_url: partner_sign_url,
    },
  });
};

export const deleteAWSImage = (config: { imageName: string }) => {
  const { imageName } = config;
  return destroy({
    endpoint: `s3/delete?fileName=${imageName}`,
  });
};

export const uploadDocument = (config: {
  user_id: number;
  document_type: string;
  file_path: string;
}) => {
  const { user_id, document_type, file_path } = config;
  return post({
    endpoint: `partner/${user_id}/upload-document`,
    data: {
      document_type: document_type,
      file_path: [file_path],
    },
  });
};

export const shipmentPhotosUploadCompleted = (config: {
  load_id: number;
  file_paths: Array<string>;
}) => {
  const { load_id, file_paths } = config;
  return post({
    endpoint: `partner/load-photos/${load_id}`,
    data: {
      file_paths: file_paths,
    },
  });
};

export const uploadMultipleImage = async (
  images,
  position,
  global,
  callback
) => {
  console.log("-uploadMultipleImage--", images, position);

  global.myDispatch({
    type: "UPDAT_FILE_COUNT",
    payload: { totalCount: images.length, activeCount: position + 1 },
  });

  if (!images[position].fileName)
    images[position].filename = images[position].path.split("/").pop();
  if (position === 0) {
    global.myDispatch({ type: "UPLOADING_INIT", payload: true });
  }

  let fileName = images[position].filename;
  let file = images[position].path;
  console.log("- images[position].filename--", fileName, file);
  const signedUrl = await getPresignedUrl(fileName);
  global.myDispatch({ type: "UPLOADING_STARTED", payload: true });
  const base64 = await fs.readFile(file, "base64");
  //Upload base64 encoded file to AWS
  const uploadFile = await axios({
    method: "PUT",
    url: signedUrl.data.url,
    data: decode(base64),
    headers: { "Content-Type": "image/jpeg" },
    onUploadProgress: (progressEvent) => {
      let percentComplete =
        (progressEvent.loaded / progressEvent.total).toFixed(2) * 100;
      percentComplete = percentComplete.toFixed(0);
      console.log("-=-=-=-uploadper-=-=", percentComplete);
      global.myDispatch({
        type: "UPDATE_UPLOAD_PROGRESS",
        payload: percentComplete,
      });
    },
  });
  if (uploadFile.status === 200) {
    if (images.length > position + 1) {
      uploadMultipleImage(images, position + 1, global, callback);
    } else {
      global.myDispatch({ type: "UPLOADING_FINALIZING", payload: true });
      callback(true);
    }
    // global.myDispatch({ type: "UPLOADING_FINALIZING", payload: true });
    // return true;
  } else {
    global.myDispatch({ type: "HIDE_UPLOAD_DAILOG" });
    console.log("upload error");
    callback(false);
  }
};
