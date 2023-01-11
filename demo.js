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
const log4js = __importStar(require("log4js"));
const lib_1 = require("./lib");
const accountName = "";
const accountKey = "";
const sysLogTableNamePrefix = "";
const customappender = new lib_1.AzureTableStorageAppender().configure({
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
