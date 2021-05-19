import * as Puppeteer from 'puppeteer'

export class PuppeteerService {

    async createPage(url: string) {
        const browser = await Puppeteer.launch({ args: ['--no-sandbox'] })
        const page = await browser.newPage()
        await page.goto(url)
        return page
    }


}
