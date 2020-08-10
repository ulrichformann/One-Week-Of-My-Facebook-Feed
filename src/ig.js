require('dotenv').config()

const puppeteer = require('puppeteer')
const fs = require('fs-extra')

const h = 2000

;(async () => {
  const browser = await puppeteer.launch({
    headless: false,
  })

  const page = await browser.newPage()
  await page.setViewport({width: 1200, height: h})

  const cookies = await fs.readJson('cookies_instagram.json')
  await page.setCookie(...cookies)

  await page.goto('https://instagram.com', {waitUntil: 'networkidle2'})

  await page.evaluate(`document.querySelector('main').style.background = 'initial'`)
  await page.evaluate(`document.querySelectorAll('nav')[1].remove()`)

  for (var i = 0; i < 100; i++) {
    console.log('scrolling ' + i)
    await page.evaluate('window.scrollTo(0, document.body.scrollHeight)')
    await page.waitFor(1000)
  }

  const pageHeight = await page.evaluate('document.body.scrollHeight')

  for (var i = 0; i < Math.floor(pageHeight / h); i++) {
    await page.evaluate(`window.scrollTo(0, ${i * h})`)

    console.log('screenshot ' + i)
    await page.waitFor(2000)

    await page.screenshot({
      fullPage: false,
      path: `output_instagram/${i}.png`,
      type: 'png',
      clip: {
        x: 132,
        y: i * h,
        width: 616,
        height: h
      },
      omitBackground: true
    })
  }

  await browser.close()
})()
