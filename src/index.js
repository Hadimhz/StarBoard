"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
const discord_js_1 = __importDefault(require("discord.js"));
const config_json_1 = __importDefault(require("./config.json"));
const quick_db_1 = __importDefault(require("quick.db"));
const messageReactionAdd = __importStar(require("./messageReactionAdd"));
const messageReactionRemove = __importStar(require("./messageReactionRemove"));
const messageManager_1 = require("./messageManager");
let client = new discord_js_1.default.Client({
    partials: ['MESSAGE', 'REACTION']
});
exports.client = client;
client.login(config_json_1.default.token);
messageReactionAdd.register();
messageReactionRemove.register();
client.on('ready', async () => {
    var _a;
    console.log((_a = client.user) === null || _a === void 0 ? void 0 : _a.tag, 'Online!');
    let guild = client.guilds.cache.get(config_json_1.default.guild);
    let starredMessages = quick_db_1.default.fetchAll();
    messageManager_1.initialize();
    for (const starred of starredMessages) {
        let data = starred.data;
        const channel = guild === null || guild === void 0 ? void 0 : guild.channels.cache.get(data.channelID);
        if (channel == null || channel.isText() == false)
            return quick_db_1.default.delete(starred.ID);
        let msg = await channel.messages.fetch(data.messageID).catch(() => quick_db_1.default.delete(starred.ID));
        if (msg == null)
            return;
    }
});
