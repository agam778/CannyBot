const youtubedl = require('youtube-dl-exec')
const fs = require('fs')
const { InputFile } = require('grammy')
const path = require('path')

module.exports = {
  name: 'dl',
  description: 'Download media (with yt-dlp)',
  usage: '/dl <url>',
  example: '/dl https://youtube.com/watch?v=dQw4w9WgXcQ',
  category: 'Utilities',
  handler: async (ctx) => {
    const { message } = ctx
    const { text } = message

    if (!text.includes('http')) {
      await ctx.reply(
        'Please provide a valid URL starting with http:// or https://'
      )
      return
    }

    await ctx.api.sendChatAction(ctx.chat.id, 'typing')

    const url = encodeURI(text.substring(text.indexOf(' ') + 1))

    const promise = youtubedl(url, {
      noCheckCertificates: true,
      noWarnings: true,
      paths: `${__dirname}/../downloads/`,
      print: 'after_move:%(filepath)s',
      formatSort: 'filesize:30M',
      addHeader: ['referer:youtube.com', 'user-agent:googlebot'],
    }).then((output) => {
      if (!output || output === '') {
        ctx.reply(
          'Oops! an error occurred!\n\nPossible reasons:\n• Invalid URL\n• Unsupported media type\n• File size too big'
        )
        return
      } else if (fs.existsSync(output)) {
        ctx
          .replyWithVideo(new InputFile(output), {
            caption: `[Source](${url}) - Shared by [${ctx.from.first_name}](tg://user?id=${ctx.from.id})`,
            parse_mode: 'Markdown',
          })
          .on('error', (err) => {
            console.error('Error sending video:', err)
            ctx.reply(
              'Oops! an error occurred while sending the video!\n\nPossible reasons:\n• File size too big\n• Unsupported media type'
            )
          })
          .then(() => {
            fs.unlinkSync(output)
          })
      } else {
        ctx.reply(
          'Oops! an error occurred!\n\nPossible reasons:\n• Invalid URL\n• Unsupported media type\n• File size too big'
        )
        fs.unlinkSync(output)
      }
    })
  },
}
