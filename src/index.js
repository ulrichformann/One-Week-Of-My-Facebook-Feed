require('dotenv').config()

const puppeteer = require('puppeteer')
const fs = require('fs-extra')

init().then(async ({ page, browser }) => {
  let endHeight = 0

  while (endHeight === 0) {
    await page.evaluate('window.scrollTo(0, document.body.scrollHeight)')
    await page.waitFor(1000)

    endHeight = await page.$$eval('[role="article"]', els => {
      const index = els.findIndex(e => {
        const s = e.textContent.split('·')

        if (s.length <= 1)
          return false

        console.log(s[1].replace(/-/g, '').trim())

        return s[1].replace(/-/g, '').trim().indexOf('12 Std.') != -1
      })

      console.log(index)

      if (index === -1)
        return 0
      else {
        const last = els[index - 1].getBoundingClientRect()
        return last.top + window.pageYOffset + last.height + 4
      }
    })
  }

  console.log(endHeight)

  await fs.emptyDir('output/facebook')

  for (var i = 0; i < Math.ceil(endHeight / 1000); i++) {
    await page.evaluate(`window.scrollTo(0, ${i * 1000})`)

    console.log('screenshot ' + i)

    console.log(endHeight % 1000, endHeight)

    await page.screenshot({
      fullPage: false,
      path: `output/facebook/${pad(i, 4)}.png`,
      type: 'png',
      clip: {
        x: 310,
        y: i * 1000,
        width: 600,
        height: (i === Math.floor(endHeight / 1000)) ? (endHeight % 1000) : 1000
      },
      omitBackground: true
    })
  }

  await browser.close()
})

function pad(num, size) {
  var s = num + "";
  while (s.length < size) s = "0" + s;
  return s;
}

async function init() {
  const browser = await puppeteer.launch({ headless: false })

  const page = await browser.newPage()
  await page.setViewport({ width: 1220, height: 1000 })

  const cookies = await fs.readJson('cookies/facebook.json')
  await page.setCookie(...cookies)

  await page.goto('https://www.facebook.com/?sk=h_chr', { waitUntil: 'networkidle2' })

  await page.evaluate(`document.querySelector('body').style.background = 'initial'`)
  await page.evaluate(`document.querySelector('[data-pagelet="page"]').parentElement.style.top = 'initial'`)
  await page.evaluate(`document.querySelector('[role="banner"]').remove()`)
  await page.evaluate(`document.querySelector('[aria-label="Alle Stories ansehen"]').remove()`)
  // await page.evaluate(`document.querySelector('[data-pagelet="Stories"]').parentElement.remove()`)
  // await page.evaluate(`document.querySelector('[role="main"]').firstChild.firstChild.style['margin-top'] = 'initial'`)
  // await page.evaluate(`document.querySelector('[role="main"]').firstChild.firstChild.children[1].remove()`)

  return { page, browser }
}
