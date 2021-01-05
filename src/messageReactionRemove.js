"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = void 0;
const index_1 = require("./index");
const config_json_1 = __importDefault(require("./config.json"));
const quick_db_1 = __importDefault(require("quick.db"));
const utils_1 = require("./utils");
const messageManager_1 = require("./messageManager");
let register = () => {
    index_1.client.on('messageReactionRemove', async (reaction, user) => {
        var _a, _b, _c, _d;
        if (reaction.emoji.name != config_json_1.default.reaction || ((_a = reaction.message.guild) === null || _a === void 0 ? void 0 : _a.id) != config_json_1.default.guild)
            return;
        // If the message isn't cached cache it
        if (reaction.message.partial)
            await reaction.message.fetch();
        // if the reactions aren't cached, cache them
        if (reaction.partial)
            await reaction.fetch();
        let reactiondb = quick_db_1.default.get(reaction.message.id);
        if (reactiondb != null) {
            let channel = (_b = index_1.client.guilds.cache.get(config_json_1.default.guild)) === null || _b === void 0 ? void 0 : _b.channels.cache.get(config_json_1.default.channel);
            // Check If the reaction count meets the reaction requirements
            if (reaction.count != null && reaction.count < config_json_1.default.minReactions) {
                if (config_json_1.default.devDebug)
                    console.log(`Message doesn't meet the requirements (${reaction.count} out of ${config_json_1.default.minReactions})`);
                // Delete message and remove from database
                (_c = (await channel.messages.fetch(reactiondb.embedMessage))) === null || _c === void 0 ? void 0 : _c.delete();
                quick_db_1.default.delete(reaction.message.id);
                return;
            }
            // if a staff role is required...
            if ((config_json_1.default.requiresStaffReaction == true && config_json_1.default.staffRoles.length > 0)) {
                if (config_json_1.default.devDebug)
                    console.log('staff role required');
                // Check If there's uncached reaction, fetch all reaction
                if (reaction.count != reaction.users.cache.size) {
                    if (config_json_1.default.devDebug)
                        console.log(`found uncached reactions (${reaction.users.cache.size} out of ${reaction.count})`);
                    await utils_1.fetchAllReactionUsers(reaction);
                }
                // Check for staff members
                let members = await reaction.message.guild.members.fetch({ user: reaction.users.cache.map(user => user.id) });
                let hasPermissions = members.filter(member => config_json_1.default.staffRoles.some(roleID => member.roles.cache.get(roleID) != null));
                if (config_json_1.default.devDebug) {
                    console.log('Members ' + members.size);
                    console.log('hasPermissions ' + hasPermissions.map(member => member.displayName));
                }
                // IF there's none...
                if (hasPermissions.size == 0) {
                    // Delete message and remove from database
                    (_d = (await channel.messages.fetch(reactiondb.embedMessage))) === null || _d === void 0 ? void 0 : _d.delete();
                    quick_db_1.default.delete(reaction.message.id);
                    return;
                }
            }
            quick_db_1.default.set(reaction.message.id + '.count', reaction.count);
            messageManager_1.add(reaction.message.id);
        }
        else {
            if (reaction.count == 0)
                return;
            if (config_json_1.default.devDebug)
                console.log(`Message still meet the requirements (${reaction.count} out of ${config_json_1.default.minReactions})`);
            quick_db_1.default.set(reaction.message.id, {
                messageID: reaction.message.id,
                channelID: reaction.message.channel.id,
                user: reaction.message.author.id,
                count: reaction.count,
                embedMessage: null
            });
            messageManager_1.add(reaction.message.id);
        }
    });
    index_1.client.on('messageReactionRemoveAll', async (message) => {
        var _a, _b;
        let reactiondb = quick_db_1.default.get(message.id);
        let channel = (_a = index_1.client.guilds.cache.get(config_json_1.default.guild)) === null || _a === void 0 ? void 0 : _a.channels.cache.get(config_json_1.default.channel);
        if (reactiondb != null) {
            (_b = (await channel.messages.fetch(reactiondb.embedMessage))) === null || _b === void 0 ? void 0 : _b.delete();
            quick_db_1.default.delete(message.id);
        }
    });
};
exports.register = register;
