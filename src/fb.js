require('dotenv').config()

const puppeteer = require('puppeteer')
const fs = require('fs-extra')

;(async () => {
  const browser = await puppeteer.launch({
    headless: false,
  })

  const page = await browser.newPage()
  await page.setViewport({width: 1200, height: 1000})

  const cookies = await fs.readJson('cookies_facebook.json')
  await page.setCookie(...cookies)

  await page.goto('https://facebook.com', {waitUntil: 'networkidle2'})

  await page.evaluate(`document.querySelector('#blueBarDOMInspector').remove()`)
  await page.evaluate(`document.querySelector('body').style.background = 'initial'`)
  await page.evaluate(`document.querySelector('#contentCol').style.background = 'initial'`)

  let prevHeight = 0

  //while (prevHeight < await page.evaluate('document.body.scrollHeight')) {
  for (var i = 0; i < 500; i++) {
    console.log('scrolling ' + i)
    prevHeight = await page.evaluate('document.body.scrollHeight')
    await page.evaluate('window.scrollTo(0, document.body.scrollHeight)')
    await page.waitFor(5000)
  }

  const pageHeight = await page.evaluate('document.body.scrollHeight')

  for (var i = 0; i < Math.floor(pageHeight / 1000); i++) {
    await page.evaluate(`window.scrollTo(0, ${i * 1000})`)

    console.log('screenshot ' + i)
    await page.waitFor(5000)

    await page.screenshot({
      fullPage: false,
      path: `output_facebook/${i}.png`,
      type: 'png',
      clip: {
        x: 275,
        y: i * 1000,
        width: 522,
        height: 1000
      },
      omitBackground: true
    })
  }

  await browser.close()
})()
