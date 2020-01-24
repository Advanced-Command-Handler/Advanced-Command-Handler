This is a brand new Command Handler which uses classes for commands.

## Configuration

To install dependencies, use `npm install`.
To start the bot, use `npm run start` or `npm run start_shards` if you want the bot to be sharded.
You can edit config in `informations/config.json`.

In `owners` you have to add your ID (in a String). 
You have to add at least one prefix in `prefixes` to start the bot.

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

#### BetterEmbed

This is a class for creating Object Embed but a little bit simplier like this :

```js
// Embed Objet :
const embed = {
    image: {
        url: 'url'
    },
    fields: [{
        name: 'name',
        value: 'value',
    }]
    author: {
        name: 'name',
        icon_url: 'icon_url'
    }
}

// BetterEmbed
const embed = new BetterEmbed({
    image: 'url',
    author: 'name',
    author_icon : 'icon_url'
});
embed.fields.push({
    name: 'name',
    value: 'value'
});
```

This can simplify your embeds declarations, and know that RichEmbeds are very heavy on memory.

#### Useful functions

There are multiple utils functions in the `functions` folder :

| Name | Description | Returning |
| --- | --- | --- |
| argError( channel, error, command ) | Send an embed who explain the argument error and show the syntax. | Embed Object |
| async getThing( datatype, text ) | Search for the `dataType`(like an user or command) into the client and in the `text`and if `text` is a message it will looks into his mentions. | Object (datatype) or false |

The `Command` class has a method `deleteMessage( message )` to safully delete messages without sending Errors *(missing permissions)*.

The `Client` class has multiples methods also :

| Name | Description | Returning |
| --- | --- | --- |
| isOwner( id ) | Check if the `id` is in the owners (configuration). | Boolean |
| hasPermission( message, permission ) | Check if bot has permission `permission`. | Boolean |

### That's all for now :D

#### I will update this if I see optimisations or bugs ^^
