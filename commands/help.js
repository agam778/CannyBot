const fs = require('fs')

module.exports = {
  name: 'help',
  description: 'Show a list of commands',
  usage: '/help OR /help <command>',
  example: '/help OR /help aur',
  category: 'Utilities',
  handler: async (ctx) => {
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
  },
}
