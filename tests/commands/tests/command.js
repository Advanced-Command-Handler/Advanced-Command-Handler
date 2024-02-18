import {Command, commandArgument, stringArgument} from 'advanced-command-handler';
import {join} from 'path';

export default class CommandCommand extends Command {
	name = 'command';
	aliases = ['manageCommand', 'cmd'];
	description = 'Let you manage command, enable or disable some.';
	tags = ['ownerOnly'];

	registerSubCommands() {
		this.subCommand(
			'enable',
			{
				aliases: ['e'],
				arguments: {
					category: stringArgument(),
					command: stringArgument(),
				},
				description: 'Enable a command.',
			},
			async ctx => {
				const commandText = `${await ctx.argument('category')}/${await ctx.argument('command')}`;
				/** @type {Command} */
				let command = await ctx.argument('command');
				if (command && ctx.handler.findCommand(command)) return ctx.reply(`Command \`${commandText}\` already enabled.`);

				command = await ctx.handler.loadCommand(join(ctx.handler.commandsDir, await ctx.argument('category')), await ctx.argument('command'));
				if (command) {
					command.registerSubCommands?.();
					return ctx.reply(`Command \`${commandText}\` loaded !`);
				} else await ctx.reply(`Command \`${commandText}\` not found or failed to load, see logs.`);
			}
		);

		this.subCommand(
			'disable',
			{
				aliases: ['d'],
				arguments: {
					command: commandArgument(),
				},
				description: 'Disable a command.',
			},
			async ctx => {
				const command = await ctx.argument('command');
				ctx.handler.unloadCommand(command.name);
				await ctx.reply(`Command \`${command.name}\` unloaded !`);
			}
		);

		this.subCommand(
			'list',
			{
				aliases: ['l', 'ls'],
				description: 'List the commands enabled.',
			},
			ctx => ctx.sendGlobalHelpMessag,
			e()
		);
	}

	run(ctx) {
		if (!ctx.isCallingASubCommand) ctx.sendHelpMessage(this.name);
	}
}
