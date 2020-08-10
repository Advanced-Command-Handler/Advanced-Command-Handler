[![deepcode](https://www.deepcode.ai/api/gh/badge?key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwbGF0Zm9ybTEiOiJnaCIsIm93bmVyMSI6IkF5ZnJpIiwicmVwbzEiOiJBZHZhbmNlZC1Db21tYW5kLUhhbmRsZXIiLCJpbmNsdWRlTGludCI6ZmFsc2UsImF1dGhvcklkIjoxODI3OCwiaWF0IjoxNTk2MTQ5NTU5fQ.f_qKncJz52oZZtkPN02PCG4sFUypAqP27ZV8sbpvVlw)](https://www.deepcode.ai/app/gh/Ayfri/Advanced-Command-Handler/_/dashboard?utm_content=gh%2FAyfri%2FAdvanced-Command-Handler)
###### This is an Advanced Command Handler which uses classes for commands.

# Configuration

To install dependencies, use `npm install`.
To start the bot, use `npm run start` or `npm run start_shards` if you want the bot to be sharded.
You can edit config in `informations/config.json`.

In `owners` you have to add your ID (in a String). 
You have to add at least one prefix in `prefixes` to start the bot.

# Templates

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

**You have to put the command into a folder into the `commands` dir.**

The `administration` category has its permissions managed automatically.

Permissions are automatically handled if you add ones.

## Events

```js
module.exports = async(client, ...EventArguments) => {
    // Your code goes here.
};
```

The file's name define wich event it handle.

# Logger

`Logger` is a class in the `utils` folder to helps you creating logs.
It has multiple **static** methods :

| Name | Description | Color |
| --- | --- | --- |
| `comment( message, typeToShow = 'comment' )` | Let you log something with the showed type `COMMENT`, theses only logs if the static field `logComments` is set to true. | grey : `#6e6f77` |
| `error( message, typeToShow = 'error' )` | Let you log something with the showed type `ERROR`. | red :`#b52825` |
| `event( message, typeToShow = 'event' )` | Let you log something with the showed type `EVENT`. | `#43804e` |
| `info( message, typeToShow = 'info' )` | Let you log something with the showed type `INFO`. | blue : `#2582ff` |
| `log( message, type = 'log', color = 'log' )` | Let you log something with the showed type `LOG`, you can change the color. | default :`#cccccc` |
| `test( message, typeToShow = 'test' )` | Let you log something with the showed type `TEST`. | white : `#ffffff` |
| `warn( message, typeToShow = 'warn' )` | Let you log something with the showed type `WARN`. | yellow : `#eeee23` |
| `setColor(color = 'default', text = '', colorAfter = '')` | Let you change the color after the function or the color of the `text`only, and let you change the color after the `text` if you set the argument. | `color` |

### Examples

```js
Logger.log('Loading bot.', 'loading');
/* Logging (in one line) :
"[year-month-day hour:minute:second]" : #847270
"[LOADING] Loading bot." : #cccccc
*/

Logger.error(`${setColor('orange', 'Command')} is not allowed.`, );
/* Logging (in one line) :
"[year-month-day hour:minute:second]" : #847270
"[ERROR] " : #b52825
"Command" : #e76a1f
" is not allowed." : #b52825
*/
```

**Every numbers are yellow by default.**

### Colors

Colors are defined in static public object in the `Logger` class so you can change them.

These are the actual colors :

```js
static colors = {
        red    : '#b52825',
        orange : '#e76a1f',
        gold   : '#deae17',
        yellow : '#eeee23',
        green  : '#3ecc2d',
        teal   : '#11cc93',
        blue   : '#2582ff',
        indigo : '#524cd9',
        violet : '#7d31cc',
        magenta: '#b154cf',
        pink   : '#d070a0',
        brown  : '#502f1e',
        black  : '#000000',
        grey   : '#6e6f77',
        white  : '#ffffff',
        default: '#cccccc'    
}
```

# Helps

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
        value: 'value'
    }],
    author: {
        name: 'name',
        icon_url: 'icon_url'
    }
}

// BetterEmbed
const embed = new BetterEmbed({
    image: 'url',
    author: 'name',
    authorIcon : 'icon_url'
});
embed.fields.push({
    name: 'name',
    value: 'value'
});

// Using templates
BetterEmbed.templates.funny = {
    title: '${client.user.username} says that you are funny !'
}

const embed = BetterEmbed.fromTemplate('funny', {client: message.client});
message.channel.send({embed: embed.build()});
```

This can simplify your embeds declarations, and know that RichEmbeds are very heavy on memory.

#### Useful functions

There are multiple utils functions in the `functions` folder :

| Name | Description | Returning |
| --- | --- | --- |
| `argError( channel, error, command )` | Send an embed who explain the argument error and show the syntax. | Embed Object |
| `async getThing( datatype, text )` | Search for the `dataType`(like an user or command) into the client and in the `text`and if `text` is a message it will looks into his mentions. | Object (datatype) or false |

The `Command` class has a method `deleteMessage( message )` to safully delete messages without sending Errors *(missing permissions)*.

**The `Client` class has multiples methods also :**

| Name | Description | Returning |
| --- | --- | --- |
| `hasPermission( message, permission )` | Check if bot has permission `permission`. | Boolean |
| `isOwner( id )` | Check if the `id` is in the owners (configuration). | Boolean |

### That's all for now :D
