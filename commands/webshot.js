const { unlinkSync, createReadStream } = require('fs')
const { InputFile } = require('grammy')
const randomstring = require('randomstring')
const puppeteer = require('puppeteer')

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
    '#': '%23',
    '?': '%3F',
    '*': '%2A',
    $: '%24',
    '@': '%40',
    '^': '%5E',
  }

  return text.replace(/[&<>"'#?*$@^]/g, (m) => map[m])
}

module.exports = {
  name: 'webshot',
  description: 'Take a screenshot of a website',
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

    const randomchar = randomstring.generate({
      length: 5,
      charset: 'alphabetic',
    })

    const url = escapeHtml(encodeURI(text.substring(text.indexOf(' ') + 1)))
    const screenshotPath = `${__dirname}/../downloads/${randomchar}.png`

    try {
      const browser = await puppeteer.launch({ headless: true })
      const page = await browser.newPage()
      await page.goto(url)

      await page.setViewport({ width: 1920, height: 1080 })

      await page.screenshot({ path: screenshotPath })
      await browser.close()

      const screenshotStream = createReadStream(screenshotPath)
      const inputScreenshot = new InputFile(screenshotStream)

      await ctx.replyWithPhoto(inputScreenshot)

      unlinkSync(screenshotPath)
    } catch (error) {
      console.error('An error occurred:', error)
      await ctx.reply(
        'Oops, an error occurred!\n\nPossible reasons:\n• Invalid URL\n• Website is not reachable\n• Something else went wrong'
      )
    }
  },
}
