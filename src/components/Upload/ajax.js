export function httpRequest(options) {
  const xhr = new XMLHttpRequest();
  console.log(options);
  const action = options.action;
  // 下载相关事件在 XMLHttpRequest 对象上被触发
  // 上传相关事件在 XMLHttpRequest.upload 对象上被触发
  xhr.upload.addEventListener("progress", (e) => {
    const processEvent = e;
    let percent = 0;
    if (e.lengthComputable) {
      percent = (e.loaded / e.total) * 100;
    }
    processEvent.percentage = percent;
    options.onProgress && options.onProgress(processEvent);
  });

  const headers = options.headers;
  if (headers) {
    Object.entries(headers).forEach(([key, value]) => {
      xhr.setRequestHeader(key, value);
    });
  }

  const formData = new FormData();

  if (options.data) {
    Object.entries(options.data).forEach(([key, value]) => {
      console.log(key, value);
      formData.append(key, value);
    });
  }
  formData.append(options.name, options.file);

  xhr.responseType = "json"; // 设置返回类型为JSON
  xhr.onload = function () {
    options.onSuccess(xhr.response);
  };

  // 监听error事件
  xhr.addEventListener("error", (err) => {
    options.onError && options.onError(err);
  });
  xhr.open(options.method, action, true);
  console.log(options.name, options.file);
  xhr.send(formData);

  return xhr;
}
