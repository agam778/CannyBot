const fs = require('fs')

module.exports = {
  name: 'help',
  description: 'Show a list of commands',
  usage: '/help OR /help <command>',
  example: '/help OR /help aur',
  category: 'Utilities',
  handler: async (ctx) => {
    const { message } = ctx
    const { text } = message

    if (!text.includes(' ')) {
      const commandFiles = fs
        .readdirSync(__dirname)
        .filter((file) => file.endsWith('.js'))
      const commands = []
      for (const file of commandFiles) {
        const command = require(`./${file}`)
        commands.push({
          name: command.name,
          description: command.description,
          alias: command.alias,
          category: command.category,
        })
      }

      const categories = []
      for (const command of commands) {
        if (!categories.includes(command.category)) {
          categories.push(command.category)
        }
      }

      let output =
        "Here's the list of commands you can use, categorized by their category:\n\n"
      for (const category of categories) {
        output += `<b>${category}</b>:\n`
        for (const command of commands) {
          if (command.category === category) {
            output += `/${command.name}`
            if (command.alias) {
              output += `, /${command.alias.join(', /')}`
            }
            output += ` - ${command.description}\n`
          }
        }
        output += '\n'
      }

      await ctx.reply(output, { parse_mode: 'HTML' })
    } else if (text.substring(text.indexOf(' ') + 1)) {
      const command = text.substring(text.indexOf(' ') + 1)
      const commandFiles = fs
        .readdirSync(__dirname)
        .filter((file) => file.endsWith('.js'))

      const commands = commandFiles.map((file) => require(`./${file}`))

      const commandDetail = commands.find(
        (cmd) =>
          cmd.name === command || (cmd.alias && cmd.alias.includes(command))
      )

      if (commandDetail) {
        let output = `*Command:* /${commandDetail.name}\n`
        output += `*Description:* ${commandDetail.description}\n`
        output += `*Usage:* \`${commandDetail.usage}\`\n`
        output += `*Example:* \`${commandDetail.example}\`\n`

        await ctx.reply(output, { parse_mode: 'MarkdownV2' })
      } else {
        await ctx.reply(
          `Command <code>${command}</code> not found!\nRun /help to see all the commands.`,
          {
            parse_mode: 'HTML',
          }
        )
      }
    }
  },
}
