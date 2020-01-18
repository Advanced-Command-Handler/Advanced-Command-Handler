# Advanced-Command-Handler

This is a brand new Command Handler which uses classes for commands.

## Configuration

To start the bot you have to start with NodeJS the `main.js` file. If you want the bot to be sharded, start with `index.js` file. There is a config file, `informations/config.json`.
In `owners` you have to add your ID (in a String). You have to add at least one prefix in `prefixes` to start the bot.

To install `depedencies`, you can simply run `npm install`.

## Templates

### Commands

```js
const Command = require('../../classes/Command.js');
module.exports = new Command({
    name: '',
    description: '',
    // Theses are optionnal :
    aliases: [],
    guildOnly: false,
    ownerOnly: false,
    userPermissions: [],
    clientPermissions: [],
    category: ''
}, async(client, message, args) => {
    // Your code goes here.
});
```

**You have to put the command into a file into the `commands` dir.**

The `administration` category has its permissions managed automatically.

Permissions are automatically handled if you add ones.

## Events

```js
module.exports = async(client, ...EventArguments) => {
    // Your code goes here.
};
```

The file's name define wich event it handle.

## Helps

The `ToolBox` class have multiples `static` methods to helps you.

| Name | Description | Returning |
| --- | --- | --- |
| isOwner( id ) | Check if the `id` is in the owners (configuration). | Boolean |
| getCommand( name ) | Search and return if a command exists with the name `name` or has the alias `name`. | Command or false |
| argError( channel, error, command) | Send an embed who explain the argument error and show the syntax. | void |
| hasPermisisonClient( message, permission ) | Check if bot has permission `permission`. | Boolean |
| hasPermisisonUser( message, permission ) | Cheif if user has permission `permission`. | Boolean |
| deleteMessage( message ) | Verify if the bot can delete the message and delete it if so. | void |
| missingPermission( permission, type ) | Return an embed who explain why the command cannot perform and the permisisons missing. | RichEmbed |
| embedGenerated( data ) | Create a new RichEmbed (with `data`) and add a `footer`and a `timestamp`. | RichEmbed |
| random( array ) | Return a random value of the array. | Object |
| async getThing( dataType, msg, text ) | Search for the `dataType`(like an user) into the client with the mentions and in the `text` (like the username). | Object (dataType) |

You can change or delete thses (or add one) but check before that it does not gradually affect the code.

### That's all now :D
### I will update this if I see optimisations or bugs ^^
