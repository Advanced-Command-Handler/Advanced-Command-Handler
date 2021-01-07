<mark>This is an Advanced Command Handler, which uses classes for commands.</mark>

[![npm](https://img.shields.io/npm/dt/advanced-command-handler?logo=npm&style=for-the-badge)](https://www.npmjs.com/package/advanced-command-handler)
[![npm](https://img.shields.io/npm/v/advanced-command-handler?logo=npm&style=for-the-badge)](https://www.npmjs.com/package/advanced-command-handler)
[![GitHub issues](https://img.shields.io/github/issues-raw/ayfri/advanced-command-handler?logo=github&style=for-the-badge)](https://github.com/Ayfri/Advanced-Command-Handler/issues)
![GitHub last commit (branch)](https://img.shields.io/github/last-commit/ayfri/advanced-command-handler/master?logo=github&style=for-the-badge)

[![npm install](https://nodei.co/npm/advanced-command-handler.png?downloads=true&stars=true)](https://www.npmjs.com/package/advanced-command-handler)

# Index

-   [Configuration](#configuration)
-   [Command Handler](#commandhandler-namespace)
    -   [CommandHandler Events](#commandhandler-events)
-   [Classes](#classes)
    -   [Client](#client-class)
    -   [Templates](#templates)
        -   [Commands](#commands)
        -   [Command Class](#command-class)
        -   [Events](#events)
        -   [Event Class](#event-class)
-   [Defaults](#defaults)
    -   [Events](#defaults-events)
-   [Utils](#utils)
    -   [Logger](#logger-class)
        -   [Example](#example)
        -   [Colors](#colors)
    -   [BetterEmbed](#betterembed-class)
    -   [Useful functions](#useful-functions)

# Configuration

To install the command handler, install [`Node.js`](https://nodejs.org/en/) (in the latest LTS version) and then in a terminal run this command where you want your bot `npm i advanced-command-handler`.
After, you create your main file and adds this into it :

```js
const {CommandHandler} = require('advanced-command-handler');

CommandHandler.create({
	// Optionnals :
	commandsDir: 'name of the dir',
	eventsDir: 'name of the dir',
	prefixes: ['!', 'coolPrefix '],
	owners: ['Discord IDs'],
});

CommandHandler.launch({
	token: 'YOUR TOKEN GOES HERE',
	// Optionnal :
	clientOptions: {
		// Client Options, see Discord.js#ClientOptions
	},
});
```

> Note:
> You can see some more advanced examples in [this repo](https://github.com/Ayfri/advanced-command-handler-examples).

# CommandHandler Namespace

| Field                           | Description                                                                                        | Type                                    |
| ------------------------------- | -------------------------------------------------------------------------------------------------- | --------------------------------------- |
| `create(options)`               | Creates the command handler, creates the [Client](#client-class).                                  | `CommandHandler`                        |
| `getPrefixFromMessage(message)` | Get the prefix from the message or null if not found.                                              | `string \| null`                        |
| `launch(options)`               | Launch the Command Handler by logging in the [Client](#client-class) and fetching Commands/Events. | `CommandHandler`                        |
| `setDefaultCommands()`          | Sets the default Commands, see [Default Commands](#defaults-commands).                             | `CommandHandler`                        |
| `setDefaultEvents()`            | Sets the default Events [Default Events](#defaults-events).                                        | `CommandHandler`                        |
| `client`                        | Represents the [Client](#client-class) of the bot.                                                 | `AdvancedClient extends Discord.Client` |
| `commands`                      | All the commands that have been found by the command handler at launch.                            | `Discord.Collection<String, Command>`   |
| `cooldowns`                     | The cooldowns of the bot mapped as `<UserID, cooldownInSeconds>`                                   | `Discord.Collection<SnowFlake, number>` |
| `prefixes`                      | Prefixes that you put in the `create` function.                                                    | `String[]`                              |
| `owners`                        | Owners that you put in the `create` function.                                                      | `SnowFlake[]`                           |
| `version`                       | The version of the handler (equivalent to `package.json` version).                                 | `string`                                |

### CommandHandler events

The CommandHandler class is extending the `EventEmitter` class, which means that there are events that can be hooked.

| Event Name     | When Fired                                  |
| -------------- | ------------------------------------------- |
| `create`       | When creating the CommandHandler.           |
| `launch`       | When starting to launch the CommandHandler. |
| `loadEvents`   | When loading the events.                    |
| `loadCommands` | When loading the commands.                  |
| `launched`     | When the CommandHandler is started.         |
| `error`        | When a CommandHandlerError is thrown.       |

# Classes

# Client Class

| Name                                 | Description                                         | Returning |
| ------------------------------------ | --------------------------------------------------- | --------- |
| `hasPermission(message, permission)` | Check if bot has permission `permission`.           | Boolean   |
| `isOwner(id)`                        | Check if the `id` is in the owners (configuration). | Boolean   |

# Templates

## Commands

```js
const {Command} = require('advanced-command-handler');
module.exports = new Command(
	{
		name: '',
		description: '',
		// Optionnals :
		usage: '',
		category: '',
		tags: [],
		aliases: [],
		userPermissions: [],
		clientPermissions: [],
		channels: [],
		cooldown: 10,
	},
	async (handler, message, args) => {
		// Your code goes here.
	}
);
```

> Note:
> Command function car get any argument you put with a custom message event.

**You have to put the command into a category folder into your commands folder like in the example.**

## Command class

| Method                          | Description                                                                                                                                       | Returning Type        |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- |
| `getMissingPermission(message)` | Returns the missing permissions.                                                                                                                  | `PermissionsString[]` |
| `getMissingTags(message)`       | Returns the missing tags.                                                                                                                         | `Tag[]`               |
| `isInRightChannel(message)`     | Returns `true` if the command has been executed in a channel present in the `channels` property (if present, otherwise `true`) otherwise `false`. | `Boolean`             |

## Events

```js
const {Event} = require('advanced-command-handler');
module.exports = new Event(
	{
		name: '',
		//optionnal :
		once: true,
	},
	async (handler, ...EventArguments) => {
		// Your code goes here.
	}
);
```

## Event Class

| Method           | Description                                      | Returning Type |
| ---------------- | ------------------------------------------------ | -------------- |
| `bind(client)`   | Bind the Event to the [Client](#client-class).   | `void`         |
| `unbind(client)` | Unbind the Event to the [Client](#client-class). | `void`         |

# Defaults

To use the default Commands/Events, use the `setDefaultEvents` and `setDefaultCommands` functions in the [CommandHandler Namespace](#commandhandler-namespace).

## Defaults Events

There is for now only one Default Event which is the `message` event.

## Defaults Commands

There is for now only one default Command which is the `ping` command.

# Utils

## Logger Class

`Logger` is a class in the `utils` folder to help you logging things. It has multiple **static** methods :

| Name                                          | Description                                                                                                                                         | Color              |
| --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ |
| `comment( message, color = 'comment' )`       | Let you log something with the showed type `COMMENT`, theses only logs if the static field `logComments` is set to true.                            | grey : `#6e6f77`   |
| `error( message, color = 'error' )`           | Let you log something with the showed type `ERROR`.                                                                                                 | red :`#b52825`     |
| `event( message, color = 'event' )`           | Let you log something with the showed type `EVENT`.                                                                                                 | `#43804e`          |
| `info( message, color = 'info' )`             | Let you log something with the showed type `INFO`.                                                                                                  | blue : `#2582ff`   |
| `log( message, type = 'log', color = 'log' )` | Let you log something with the showed type `LOG`, you can change the color.                                                                         | default :`#cccccc` |
| `test( message, color = 'test' )`             | Let you log something with the showed type `TEST`.                                                                                                  | white : `#ffffff`  |
| `warn( message, color = 'warn' )`             | Let you log something with the showed type `WARN`.                                                                                                  | yellow : `#eeee23` |
| `setColor(color = 'default', text = '')`      | Let you change the color after the function or the color of the `text` only, and let you change the color after the `text` if you set the argument. | `color`            |

### Example

```js
const {Logger} = require('advanced-command-handler');
Logger.error(`${Logger.setColor('orange', 'Command')} is not allowed.`, 'PermissionError');
```

Give the following result in the console (screen made on `WebStorm`).

**Every number is yellow by default.**

### Colors

Colors are set out in a static public object in the `Logger` class, so you can change them.

These are the current colors :

```js
colors = {
	red: '#b52825',
	orange: '#e76a1f',
	gold: '#deae17',
	yellow: '#eeee23',
	green: '#3ecc2d',
	teal: '#11cc93',
	blue: '#2582ff',
	indigo: '#524cd9',
	violet: '#7d31cc',
	magenta: '#b154cf',
	pink: '#d070a0',
	brown: '#502f1e',
	black: '#000000',
	grey: '#6e6f77',
	white: '#ffffff',
	default: '#cccccc',
};
```

## BetterEmbed class

| Name             | Description                                                            |
| ---------------- | ---------------------------------------------------------------------- |
| `checkSize()`    | Check the size of the Embed and throw an error if a field is too long. |
| `cutIfTooLong()` | Check the size of the Embed and cut the fields that are too long.      |

This is a class for creating Embed Object, but a bit simpler like this :

```js
// MessageEmbed :
const MessageEmbed = require('discord.js');
const embed = new MessageEmbed();
embed.setImage('url');
embed.setAuthor('name', 'icon_url');
embed.setTimestamp();
embed.setFooter(client.user.username, client.user.displayAvatarURL());
// ...
embed.setDescription(embed.description.slice(0, 2048));

// BetterEmbed
const {BetterEmbed} = require('advanced-command-handler');
const embed = BetterEmbed.fromTemplate('basic', {
	image: 'url',
	author: {
		name: 'name',
		icon_url: 'icon_url',
	},
});

embed.cutIfTooLong();

// Using templates
BetterEmbed.templates.funny = {
	title: '${client.user.username} says that you are funny !',
};

const embed = BetterEmbed.fromTemplate('funny', {client: message.client});
message.channel.send(embed);
```

This can simplify your embeds declarations.

## Useful functions

There are multiple utils functions in the `util` folder that you can use (require them like other classes).

| Name                                                                       | Description                                                                                                                                   | Returning                       |
| -------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| `argError(message, error, command)`                                        | Send an embed that explains the argument error and show correct the syntax.                                                                   | `BetterEmbed`                   |
| `async getThing(datatype, text)`                                           | Search for the `dataType` (like an user or command) into the client and in the `text`. If `text` is a message it will look into its mentions. | Datatype you entered or `false` |
| `permissionsError(message, missingPermissions, command, isFromBot = true)` | Send an embed that explains which permissions are missing.                                                                                    | `BetterEmbed`                   |

The `Command` class has a method `deleteMessage( message )` to safely delete messages without sending Errors _(missing permissions)_.

##### That's all for now :D
