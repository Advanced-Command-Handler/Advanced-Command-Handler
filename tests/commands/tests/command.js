const {argError, Command} = require('advanced-command-handler');
const {join} = require('path');

module.exports = class CommandCommand extends Command {
	name = 'command';
	aliases = ['manageCommand', 'cmd'];
	description = 'Let you manage command, enable or disable some.';
	tags = ['ownerOnly'];
	usage = 'command enable <category> <command>\ncommand disable <command>\ncommand list';

	registerSubCommands() {
		this.subCommand(
			'enable',
			{
				aliases: ['e'],
				description: 'Enable a command.',
			},
			async ctx => {
				console.log(ctx.args);
				if (!ctx.args[0]) return argError(ctx, 'Category name argument required.');
				if (!ctx.args[1]) return argError(ctx, 'Command name argument required.');

				const commandText = `${ctx.args[0]}/${ctx.args[1]}`;
				let command = ctx.handler.findCommand(ctx.args[1]);
				if (command) return ctx.reply(`Command \`${commandText}\` already enabled.`);

				command = await ctx.handler.loadCommand(join(ctx.handler.commandsDir, ctx.args[0]), ctx.args[1]);
				if (command) {
					command.registerSubCommands?.();
					return ctx.reply(`Command \`${commandText}\` loaded !`);
				} else ctx.reply(`Command \`${commandText}\` not found or failed to load, see logs.`);
			}
		);

		this.subCommand(
			'disable',
			{
				aliases: ['d'],
				description: 'Disable a command.',
			},
			ctx => {
				if (!ctx.args[0]) return argError(ctx, 'Command name argument required.');

				const command = ctx.handler.findCommand(ctx.args[0]);
				if (!command) return ctx.reply(`Command \`${ctx.args[0]}\` not found.`);
				else ctx.handler.unloadCommand(ctx.args[0]);

				ctx.reply(`Command \`${ctx.args[0]}\` unloaded !`);
			}
		);

		this.subCommand(
			'list',
			{
				aliases: ['l', 'ls'],
				description: 'List the commands enabled.',
			},
			ctx => ctx.sendHelpMessage(this.name)
		);
	}

	run(ctx) {
		if (!ctx.isCallingASubCommand) ctx.sendHelpMessage(this.name);
	}
};
