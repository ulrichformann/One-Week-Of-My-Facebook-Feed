const fs = require('fs-extra')

;(async () => {
  try {
    for (var i = 184; i <= 283; i++) {
      console.log(i)
      const file = await fs.readFile(`output_facebook/split/${i}.png`)
      await fs.writeFile(`output_facebook/re/${283 - i}.png`, file)
    }
  } catch (e) {
    console.error(e);
  }
})()
