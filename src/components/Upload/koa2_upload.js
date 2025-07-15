const Koa = require("koa");
const koaRouter = require("@koa/router");
const bodyParser = require("koa-bodyparser");
const multer = require("@koa/multer");
const static = require("koa-static");
const cors = require("koa2-cors");
const fs = require("fs");
const path = require("path");
// 公共变量 上传的文件夹名字
const uploadDir = `sliceUpload`;

// 创建app对象
const app = new Koa();

// 静态资源库
app.use(static("./dist"));
app.use(static("./sliceUpload"));

// 使用 koa2-cors 中间件
app.use(
  cors({
    origin: function (ctx) {
      // 允许来自所有域名：不建议在生产中使用
      return "*";
      // 或者指定域名，例如：'http://example.com'
    },
    // exposeHeaders: ["WWW-Authenticate", "Server-Authorization"],
    maxAge: 5, // 指定本次预检请求的有效期，单位为秒。
    credentials: true, // 允许发送Cookie
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization", "Accept"],
  })
);

// 第三方中间件 解析post的body内的json数据
app.use(bodyParser());
const formParser = multer();

// 不需要设置存放的文件夹名字 需要自己手动写入相应的文件夹
const sliceUpload = multer();
// 执行下面这行代码 会自动创建一个upload文件夹
// const upload = multer({
//   dest: "./upload",
// });
// 自定义文件名字
const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, "./upload");
    },
    filename(req, file, cb) {
      cb(null, Date.now() + "_" + file.originalname);
    },
  }),
});

// 注册中间件
// app.use((ctx, next) => {
//   console.log("koa注册的中间");
//   ctx.body = "哈哈哈";
// });
// 创建路由
const userRouter = new koaRouter({ prefix: "/users" });
// 注册中间件
// userRouter.get("/", (ctx, next) => {
//   ctx.body = "users list data";
// });

// 错误信息处理
userRouter.get("/", (ctx, next) => {
  const isAuth = false;
  if (isAuth) {
    ctx.body = "user has sign in ";
  } else {
    // ctx.app 可以拿到koa实例 本质上是eventEmitter
    ctx.app.emit("error", -1003, ctx);
  }
});

// 独立的文件
app.on("error", (code, ctx) => {
  const errorCode = code;
  let message = "";
  switch (errorCode) {
    case -1003:
      message = "账号或密码错误";
      break;
    case -1003:
      message = "登录过期，请检查你的token信息";
      break;
    default:
      break;
  }
  const body = {
    code: errorCode,
    message,
  };
  ctx.body = body;
});

userRouter.get("/", (ctx, next) => {
  const id = ctx.params.id;
  ctx.body = "获取某个用户信息" + id;
});
//  post/body-raw
userRouter.post("/create", (ctx, next) => {
  // ctx.request.body 第三方中间库 会把body的json数据赋值
  console.log(ctx.request.body);
});
// post/urlencoded body-parser也将此类型数据解析并存到ctx.request.body
userRouter.post("/urlencoded", (ctx, next) => {
  // ctx.request.body 第三方中间库 会把body的json数据赋值
  console.log(ctx.request.body);
});

// post/form-data
userRouter.post("/formdata", formParser.any(), (ctx, next) => {
  console.log(ctx.request.body);
  ctx.body = "用户的formdata数据";
});

userRouter.put("/:id", (ctx, next) => {});

// 实现文件上传
userRouter.post("/avatar", upload.single("avatar"), (ctx, next) => {
  // 上传的文件信息 保存在ctx.request.file; mimetype文件类型 ; size 文件大小
  console.log(ctx.request.file);
  // fieldname 上传的文件字段名称   originalname原始文件名称
  ctx.body = "用户avatar上传";
});

userRouter.post("/photos", upload.array("photos"), (ctx, next) => {
  console.log(ctx.request.files);
  ctx.body = "文件上传成功";
});

userRouter.get("/resType", (ctx, next) => {
  // body的响应类型
  // ctx.body = Buffer.from("嘿嘿嘿");
});

// 上传路由
const uploadRouter = new koaRouter({ prefix: "/upload" });

uploadRouter.get("/already", (ctx, next) => {
  // 通过query获取上传的文件的hash名字
  let { HASH } = ctx.query;
  console.log(HASH, "BBBBBBB");
  let path = `${uploadDir}/${HASH}`;
  let fileList = [];
  try {
    fileList = fs.readdirSync(path);
    fileList = fileList.sort((a, b) => {
      let reg = /_(\d+)/;
      return reg.exec(a)[1] - reg.exec(b)[1];
    });
    ctx.body = {
      code: 0,
      fileList: fileList,
    };
  } catch (error) {
    console.log(error);
  }
});

// 切片合并
uploadRouter.get("/merge", (ctx, next) => {
  try {
    let { HASH, count, suffix } = ctx.query;

    let path = `${uploadDir}/${HASH}`;
    let fileList = [];
    // if (!fs.existsSync(path)) {
    //   console.log("切片路径不存在");
    //   return;
    // }
    // 从服务器文件夹里 读取出当前的切片的hash下的文件夹下的切片文件
    fileList = fs.readdirSync(path);
    // 判断是否切片数量已经符合
    if (fileList.length < count) {
      console.log("切片数量不一致");
      return;
    }
    // 将读取到的文件按照文件名字index排序
    // let suffix;
    fileList.sort((a, b) => {
      let reg = /_(\d+)/;
      return reg.exec(a)[1] - reg.exec(b)[1];
    });
    fileList.forEach((item) => {
      // !suffix ? (suffix = /\.([0-9a-zA-Z]+)$/.exec(item)[1]) : null;
      fs.appendFileSync(
        `${uploadDir}/${HASH}.${suffix}`,
        fs.readFileSync(`${uploadDir}/${HASH}/${item}`)
      );
      fs.unlinkSync(`${uploadDir}/${HASH}/${item}`);
      setTimeout(() => {
        fs.rmdirSync(`${uploadDir}/${HASH}`);
      }, 1000);
      ctx.body = {
        code: 200,
        data: {
          path: `${uploadDir}/${HASH}.${suffix}`,
        },
      };
    });
  } catch (error) {
    console.log(error);
  }
});

uploadRouter.post("/chunk", upload.single("chunk"), (ctx, next) => {
  // 可以通过ctx.request.body拿到前端通过formData传递过来的其他字段
  let filename = ctx.request.body.filename;
  let [, HASH] = /^([^_]+)_(\d+)/.exec(filename);

  let cachePath = `${uploadDir}/${HASH}`;

  try {
    // cachePath = path.resolve(__dirname, cachePath);
    !fs.existsSync(cachePath) ? fs.mkdirSync(cachePath) : null;
    let chunkPath = `${uploadDir}/${HASH}/${filename}`;

    if (fs.existsSync(chunkPath)) {
      // 如果当前切片已经上传 存在
      ctx.body = {
        code: 200,
        msg: "chunk has exists",
      };
      return;
    }
    writeFile(chunkPath, ctx.request.file);
    ctx.body = {
      code: 200,
      msg: "上传成功",
    };
  } catch (error) {
    console.log(error);
  }
});

const writeFile = (serverPath, file) => {
  try {
    let readStream = fs.createReadStream(file.path);
    let writeStream = fs.createWriteStream(serverPath);
    readStream.pipe(writeStream);
    readStream.on("end", () => {
      console.log({
        result: true,
        message: "上传成功！",
      });
      fs.unlinkSync(file.path);
    });
  } catch (err) {
    console.log({
      result: false,
      message: err,
    });
  }
};

app.use(uploadRouter.routes());
// 让路由中的中间件生效
app.use(userRouter.routes());
// 对于没有封装过的方法 不会再只是报错not found而是展示Method Not Allowed
app.use(userRouter.allowedMethods());

// 启动服务器
app.listen(8888, () => {
  console.log("koa服务器启动成功");
});

// mysql相关 聚合函数; group by; 创建外键 以及更新和删除限制; 多表查询
