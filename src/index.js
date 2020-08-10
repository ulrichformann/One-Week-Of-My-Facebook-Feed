require('dotenv').config()

const puppeteer = require('puppeteer')
const fs = require('fs-extra')

const timeStampSelector = '#contentArea div:not(._5pcm) > div > span:not(.x_p2l_v7v1o) > span > a > abbr > span.timestampContent[id]'

  ; (async () => {
    const { page, browser } = await init()

    /*let endHeight = 0
  
    while (endHeight === 0) {
      await page.evaluate('window.scrollTo(0, document.body.scrollHeight)')
      await page.waitFor(1000)
  
      endHeight = await page.$$eval(timeStampSelector, ts => {
        const index = ts.findIndex(t => t.textContent.indexOf('Std') != -1)
  
        if (index === -1)
          return 0
        else {
          const last = ts[index - 1].closest('.userContentWrapper').getBoundingClientRect()
          return last.top + window.pageYOffset + last.height
        }
      })
  }

  console.log(endHeight)

for (var i = 0; i < Math.ceil(endHeight / 1000); i++) {
  await page.evaluate(`window.scrollTo(0, ${i * 1000})`)

  console.log('screenshot ' + i)

  console.log(endHeight % 1000, endHeight)

  await page.screenshot({
    fullPage: false,
    path: `output/facebook/${pad(i, 4)}.png`,
    type: 'png',
    clip: {
      x: 275,
      y: i * 1000,
      width: 522,
      height: (i === Math.floor(endHeight / 1000)) ? (endHeight % 1000) : 1000
    },
    omitBackground: true
  })
}

await browser.close()*/
  })()

function pad(num, size) {
  var s = num + "";
  while (s.length < size) s = "0" + s;
  return s;
}

async function init() {
  const browser = await puppeteer.launch({ headless: false })

  const page = await browser.newPage()
  await page.setViewport({ width: 1382, height: 1000 })

  const cookies = await fs.readJson('cookies/facebook.json')
  await page.setCookie(...cookies)

  await page.goto('https://www.facebook.com/?sk=h_chr', { waitUntil: 'networkidle2' })

  await page.evaluate(`document.querySelector('#blueBarDOMInspector').remove()`)
  await page.evaluate(`document.querySelector('body').style.background = 'initial'`)
  await page.evaluate(`document.querySelector('#contentCol').style.background = 'initial'`)

  return { page, browser }
}
