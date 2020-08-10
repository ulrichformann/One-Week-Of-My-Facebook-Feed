require('dotenv').config()

const puppeteer = require('puppeteer')
const fs = require('fs-extra')

puppeteer.launch({ headless: false, args: ['--disable-notifications'] }).then(async browser => {
  const page = await browser.newPage()
  await page.setViewport({ width: 1200, height: 1000 })

  await page.goto('https://www.facebook.com/login', { waitUntil: 'networkidle2' })

  await page.type('#email', process.env.fb_mail)
  await page.type('#pass', process.env.fb_pw)

  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle2' }),
    page.click('#loginbutton'),
  ])

  await fs.writeJSON('./cookies/facebook.json', await page.cookies())
  await browser.close()
})
