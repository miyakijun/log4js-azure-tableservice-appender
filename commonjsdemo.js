const log4js = require("log4js");
const AzureTableStorageAppender =
  require("./lib/index").AzureTableStorageAppender;

const accountName = "";
const accountKey = "";
const sysLogTableNamePrefix = "";

const customappender = new AzureTableStorageAppender().configure({
  accountName,
  accountKey,
   sysLogTableNamePrefix,
});

const cfg = {
  replaceConsole: true,
  appenders: {
    console: {
      type: "console",
      layout: {
        type: "pattern",
        pattern: "%[[%d][%p][%f{2}:%l]%] %m",
      },
    },
    custom: {
      type: customappender,
    },
  },
  categories: {
    default: {
      appenders: ["console", "custom"],
      level: "all",
      enableCallStack: true,
    },
  },
};

let logger = log4js.configure(cfg).getLogger();
logger.info("Hello World!");
logger.info({ name: "name", age: 20, city: "New York!!!" });
