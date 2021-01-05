"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchAllReactionUsers = void 0;
let fetchAllReactionUsers = async (reaction) => {
    var _a;
    while (reaction.count != reaction.users.cache.size) {
        await reaction.users.fetch({ limit: 100, after: (_a = reaction.users.cache.last()) === null || _a === void 0 ? void 0 : _a.id });
    }
};
exports.fetchAllReactionUsers = fetchAllReactionUsers;
