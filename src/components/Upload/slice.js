import SparkMD5 from "spark-md5";
import { httpRequest } from "./ajax";

export const changeBuffer = (file) => {
  return new Promise((resolve, reject) => {
    let fileReader = new FileReader();
    fileReader.readAsArrayBuffer(file);
    fileReader.onload = (ev) => {
      let buffer = ev.target.result;
      let spark = new SparkMD5.ArrayBuffer();
      let HASH;
      let suffix;
      spark.append(buffer);
      HASH = spark.end();
      suffix = /\.([a-zA-Z0-9]+)$/.exec(file.name)[1];
      resolve({
        HASH,
        suffix,
        buffer,
        filename: `${HASH}.${suffix}`,
      });
    };
  });
};

export const sliceUpload = async (rawFile) => {
  try {
    let uploadIndex = 0;
    // 1.将file转换为buffer格式 用于前端分片
    const { buffer, suffix, HASH, filename } = await changeBuffer(rawFile);
    // 获取后端保存的已经上传的切片
    let alreadyList = [];
    const data = await getAlreadyChunks(HASH);
    console.log(data, typeof data);
    alreadyList = data.fileList;

    // 2.进行分片
    let max = 1024 * 1024 * 10;
    let count = Math.ceil(rawFile.size / max);
    if (count > 50) {
      // 如果分片个数大于20 则按照分片个数20来重新计算每个分片的大小
      max = rawFile.size / 50;
      count = 50;
    }
    const sliceList = [];
    let index = 0;
    while (index < count) {
      let file = rawFile.slice(index * max, (index + 1) * max);
      let filename = `${HASH}_${index + 1}`;

      sliceList.push({
        file,
        filename,
      });
      // httpRequest({
      //   method: "post",
      //   file,
      //   name: "chunk",
      //   data: {
      //     filename: filename,
      //   },
      //   action: "http://localhost:8888/upload/chunk",
      //   onSuccess: (res, file) => {
      //     console.log(res, file);
      //   },
      // });
      index++;
    }

    sliceList.forEach(({ file, filename }) => {
      if (alreadyList.length && alreadyList.includes(filename)) {
        // 此切片已经上传过 不需要重新上传
        complete();
        return;
      }

      httpRequest({
        method: "post",
        file,
        name: "chunk",
        data: {
          filename: filename,
        },
        action: "http://localhost:8888/upload/chunk",
        onSuccess: (res, file) => {
          console.log(res, file);
          complete();
        },
      });
    });

    function complete() {
      uploadIndex++;
      if (uploadIndex >= count) {
        mergeChunks(HASH, count, suffix);
      }
    }
  } catch (error) {
    console.log(error);
  }
};

function mergeChunks(HASH, count, suffix) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    let url = `http://localhost:8888/upload/merge?HASH=${HASH}&count=${count}&suffix=${suffix}`;
    xhr.responseType = "json"; // 设置返回类型为JSON

    xhr.onload = () => {
      resolve(xhr.response);
    };
    xhr.open("get", url);
    // xhr.setRequestHeader("Content-Type", "x-www-form-urlencoded");
    // let data = JSON.stringify({ HASH, count, suffix });
    xhr.send();
  });
}

function getAlreadyChunks(HASH) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    let url = `http://localhost:8888/upload/already?HASH=${HASH}`;
    xhr.responseType = "json"; // 设置返回类型为JSON

    xhr.onload = () => {
      resolve(xhr.response);
    };
    xhr.open("get", url);
    xhr.send();
  });
}
