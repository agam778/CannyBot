const { MessageAttachment } = require('discord.js')
const { validateMIMEType } = require('validate-image-type')
const fs = require('fs')
const axios = require('axios')
const randomstring = require('randomstring')
module.exports = {
  name: 'magik',
  category: 'ImageGen',
  aliases: [],
  cooldown: '',
  usage: 'magik [@USER]',
  description: "Convert a user's profile pik into magik",
  memberpermissions: [],
  requiredroles: [],
  alloweduserids: [],
  minargs: 0,
  maxargs: 0,
  minplusargs: 0,
  maxplusargs: 0,
  argsmissing_message: '',
  argstoomany_message: '',
  run: async (client, message, args, plusArgs, cmdUser, text, prefix) => {
    const mention = message.mentions.users.first() || message.author
    const randomchar = randomstring.generate({
      length: 5,
      charset: 'alphabetic',
    })
    await message
      .reply(`<a:WindowsLoading:855012778251124776> Please Wait...`)
      .then(async (msg) => {
        await axios
          .get(
            `https://nekobot.xyz/api/imagegen?type=magik&image=${mention.displayAvatarURL(
              {
                format: 'png',
                size: 1024,
              },
            )}`,
          )

          .then(async (res) => {
            const url = res.data.message
            const path = `${__dirname}/../../downloads/${mention.id}-${randomchar}-magik.png`
            const writer = fs.createWriteStream(path)
            const download = await axios({
              url: url,
              method: 'GET',
              responseType: 'stream',
            })
              .then(async (response, err) => {
                if (err)
                  return msg.edit({
                    content: `<a:wrong:946005824327786547> An error occured!\n\`\`\`js\n${err}\`\`\``,
                  })
                response.data.pipe(writer)
                return new Promise((resolve, reject) => {
                  writer.on('finish', resolve)
                  writer.on('error', reject)
                })
              })
              .then(() => {
                const result = validateMIMEType(path, {
                  allowMimeTypes: [
                    'image/jpeg',
                    'image/gif',
                    'image/png',
                    'image/svg+xml',
                  ],
                })
                if (!result.ok) {
                  msg.edit({
                    content: `<a:wrong:946005824327786547> An error occured!`,
                  })
                  fs.unlinkSync(path)
                  return
                }
                const attachment = new MessageAttachment(`${path}`)
                msg.edit({
                  content: `Generated the Image!`,
                  files: [attachment],
                })
                setTimeout(function () {
                  fs.unlinkSync(path)
                }, 5000)
              })
              .catch((err) => {
                msg.edit({
                  content: `<a:wrong:946005824327786547> An error occured!\n\`\`\`js\n${err}\`\`\``,
                })
                fs.unlinkSync(path)
              })
          })
      })
  },
}
