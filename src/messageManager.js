"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initialize = exports.add = void 0;
const discord_js_1 = __importDefault(require("discord.js"));
const index_1 = require("./index");
const config_json_1 = __importDefault(require("./config.json"));
const quick_db_1 = __importDefault(require("quick.db"));
let queue = [];
let send = async (channel, message, stars, edit) => {
    if (stars < config_json_1.default.minReactions)
        return;
    let embed = new discord_js_1.default.MessageEmbed().setColor("GOLD")
        .setAuthor(message.author.tag).setDescription('**__Message Content:__**\n' + message.content
        + '\n\n``` ```' + `[Click Here To View The Message](${message.url})`)
        .setFooter('in #' + message.channel.name)
        .setThumbnail(message.author.avatarURL() || message.author.defaultAvatarURL);
    if (edit == null) {
        channel === null || channel === void 0 ? void 0 : channel.send(config_json_1.default.reaction + "#" + stars, embed).then(m => {
            quick_db_1.default.set(message.id + '.embedMessage', m.id);
        });
    }
    else {
        channel.messages.fetch(edit).then(m => {
            m.edit(config_json_1.default.reaction + "#" + stars, embed);
        }).catch(e => {
            channel === null || channel === void 0 ? void 0 : channel.send(config_json_1.default.reaction + "#" + stars, embed).then(m => {
                quick_db_1.default.set(message.id + '.embedMessage', m.id);
            });
        });
    }
};
let initialize = () => {
    setInterval(async () => {
        let guild = index_1.client.guilds.cache.get(config_json_1.default.guild);
        let channel = guild === null || guild === void 0 ? void 0 : guild.channels.cache.get(config_json_1.default.channel);
        let temp = queue;
        queue = [];
        if (config_json_1.default.devDebug)
            console.log('Updating messages!');
        for (let starred of temp) {
            let data = quick_db_1.default.get(starred);
            if (data == null)
                return;
            const c = guild === null || guild === void 0 ? void 0 : guild.channels.cache.get(data.channelID);
            if (c == null || c.isText() == false)
                return quick_db_1.default.delete(starred);
            let msg = await c.messages.fetch(data.messageID).catch(() => quick_db_1.default.delete(starred));
            if (msg == null)
                return;
            await send(channel, msg, data.count, data.embedMessage).catch(e => console.log(e));
        }
    }, 30000);
};
exports.initialize = initialize;
let add = (ID) => {
    if (config_json_1.default.devDebug)
        console.log('Added a message to the queue (' + ID + ')');
    if (queue.includes(ID))
        return;
    else
        queue.push(ID);
};
exports.add = add;
