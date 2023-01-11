# log4js-azure-tableservice-appender

> This is a log4js appender that can write logs to a table in an Azure storage account.



## usage
```ts
import * as log4js from "log4js";
import { AzureTableStorageAppender } from "log4js-azure-tableservice-appender";


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
logger.info({ name: "John", age: 30, city: "New York" });
```

