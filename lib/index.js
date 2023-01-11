"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AzureTableStorageAppender = void 0;
const data_tables_1 = require("@azure/data-tables");
const uuid = __importStar(require("uuid"));
class AzureTableStorageAppender {
    mongodbAppender(config) {
        const tableCredential = new data_tables_1.AzureNamedKeyCredential(config.accountName, config.accountKey);
        const tableServiceClient = new data_tables_1.TableServiceClient(`https://${config.accountName}.table.core.windows.net`, tableCredential);
        const tableStorageAppender = {
            configure: () => {
                const appenderFunction = async (loggingEvent) => {
                    const date = new Date();
                    const tableName = `${config.sysLogTableNamePrefix}${date.getUTCFullYear()}${(date.getUTCMonth() + 1)
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
                    const customColumn = {};
                    for (let e of logContent) {
                        if (typeof e === 'string') {
                            customColumn.message = e;
                        }
                        else {
                            for (let key in e) {
                                customColumn[key] = e[key];
                            }
                        }
                    }
                    let entity = {
                        ...customColumn,
                        ...defaultColumns,
                    };
                    const tableClient = new data_tables_1.TableClient(`https://${config.accountName}.table.core.windows.net`, tableName, tableCredential);
                    try {
                        await tableClient.createEntity(entity);
                    }
                    catch (err) {
                        console.error(err);
                    }
                };
                return appenderFunction;
            },
        };
        return tableStorageAppender;
    }
    configure(config) {
        return this.mongodbAppender(config);
    }
}
exports.AzureTableStorageAppender = AzureTableStorageAppender;
