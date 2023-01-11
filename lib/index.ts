import {
  AzureNamedKeyCredential,
  TableServiceClient,
  TableClient,
} from "@azure/data-tables";
import * as log4js from "log4js";
import { LoggingEvent } from "log4js";
import * as uuid from "uuid";
interface ILogConfig {
  accountName: string;
  accountKey: string;
  sysLogTableNamePrefix: string;
}
export class AzureTableStorageAppender {

  mongodbAppender(config: ILogConfig):log4js.AppenderModule {
    const tableCredential = new AzureNamedKeyCredential(
      config.accountName,
      config.accountKey
    );
    const tableServiceClient = new TableServiceClient(
      `https://${config.accountName}.table.core.windows.net`,
      tableCredential
    );


    const tableStorageAppender = {
      configure: () => {
        const appenderFunction = async (loggingEvent: LoggingEvent) => {

          const date = new Date();
          const tableName = `${
            config.sysLogTableNamePrefix
          }${date.getUTCFullYear()}${(date.getUTCMonth() + 1)
            .toString()
            .padStart(2, "0")}${date.getUTCDate().toString().padStart(2, "0")}`;

          // If the table 'newTable' already exists, createTable doesn't throw
          await tableServiceClient.createTable(tableName);
         
          const logContent = loggingEvent.data.flat();

          const defaultColumns = {
            partitionKey: loggingEvent.level.levelStr,
            rowKey: uuid.v1().replace(/-/gi, ""),
            logTime: loggingEvent.startTime.toString(),
            logTimeStamp: loggingEvent.startTime.getTime().toString(),
          };


          const customColumn: any = {};
          for(let e of logContent) {
            if(typeof e === 'string') {
              customColumn.message = e;
            } else {
               for(let key in e as object){
                customColumn[key] = e[key];
               }
            }
          }

          let entity = {
            ...customColumn,
            ...defaultColumns,
          };

          const tableClient = new TableClient(
            `https://${config.accountName}.table.core.windows.net`,
            tableName,
            tableCredential
          );
          
          try {
            await tableClient.createEntity(entity);
          } catch (err) {
            console.error(err);
          }
        };
        return appenderFunction;
      },
    };
    return tableStorageAppender;
  }
  configure(config:ILogConfig) {
    return this.mongodbAppender(config);
  }
}