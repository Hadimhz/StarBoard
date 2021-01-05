# StarBoard

This allows your to check how many time a user boosted your server, feel free to use that in your code.

## Setup:
- Clone the repo.
- configure the application (`config.json`)
- Install Node Packages. (`npm i`)
- run the app! `node src/index.js`

## Config:

### token:
<br>

This field is for your Discord **Bot** token.

### guild:
<br>

Guild ID which the app will be checking.

### channel:
<br>

Channel ID which the app will send messages in.

### reaction:
<br>

Must be a [unicode](https://coolsymbol.com/emojis/emoji-for-copy-and-paste.html).

### minReactions:
<br>

The minimum emojis required for the message to be starred.

### requiresStaffReaction:
<br>

If the bot should require a staff to react with {reaction} if so, the bot will only send a message if the user has one of the roles specified in {staffRoles}.

### staffRoles:
<br>

Staff roles ID that will be used if the bot requires a staff reaction to post the message.
