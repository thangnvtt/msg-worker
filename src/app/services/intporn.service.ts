import { Config, dependency } from '@foal/core'
import { Page } from 'puppeteer'
import { PuppeteerService } from './puppeteer.service'
import { RequestService } from './request.service'
import { HelpService } from './helper.service'
const LOGIN_URI = Config.get('intPorn.loginUri', 'string') || ''
const CREATE_CHAT_URL = Config.get('intPorn.createChatUri', 'string') || ''
const USERNAME = Config.get('intPorn.user', 'string') || ''
const PASSWORD = Config.get('intPorn.pwd', 'string') || ''

export class IntPornService {
    private urlLogin = LOGIN_URI
    private createChatUri = CREATE_CHAT_URL
    private username = USERNAME
    private password = PASSWORD

    @dependency
    requestService: RequestService

    @dependency
    puppeteerService: PuppeteerService

    @dependency
    helpService: HelpService

    async login(): Promise<Page> {
        const page = await this.puppeteerService.createPage(this.urlLogin)
        await page.type('input[autocomplete=username]', this.username)
        await page.type('input[autocomplete=current-password]', this.password)
        await page.click('.button--icon--login')
        return page
    }

    async createConversationSchedule(page, receiver: string[], delayTime: number, maxReceiver = 5, outputFile): Promise<void> {
        const length = receiver.length
        let success = new Array<string>()
        let failed = new Array<string>()
        let error = new Array<any>()

        try {
            for (let start = 0, end = maxReceiver, next; end <= length;) {
                const subReceiver = receiver.slice(start, end)
                const { body } = await this.createConversation(page, subReceiver)
                const parse = JSON.parse(body)

                if (parse.status === 'error') {
                    const err = parse.errors
                    failed = [...failed, ...subReceiver]
                    error = [...error, ...err]

                    console.info('Not create chat success', subReceiver)
                }

                if (parse.status === 'ok') {
                    success = [...success, ...subReceiver]
                    console.info('Create chat success', subReceiver)
                }

                await this.helpService.delay(delayTime)
                await page.reload()
                next = length - end
                start += maxReceiver
                end += next < maxReceiver && next !== 0 ? next : maxReceiver
            }

            this.helpService.writeFileJSON(outputFile, JSON.stringify({ success, failed, error }))
        }
        catch {
            this.helpService.writeFileJSON(outputFile, JSON.stringify({ success, failed, error }))
        }
    }

    async createConversation(page: Page, receiver: string[]): Promise<any> {
        await page.goto(this.createChatUri)
        const token = await this.getToken(page)
        const cookies = await this.getCookies(page)
        const options = this.getOptionCreateChat(receiver, cookies, token)
        return this.requestService.request(options)
    }

    private async getToken(page: Page): Promise<string> {
        const token = await page.$eval('input[name=_xfToken]', e => e.getAttribute('value'))
        if (!token) return ''
        return token
    }

    private async getCookies(page: Page) {
        const cookies = await page.cookies(this.createChatUri)
        let objCookies = ''
        for (const [, value] of Object.entries(cookies)) {
            objCookies += `${value.name}=${value.value};`
        }
        return objCookies
    }

    private getOptionCreateChat(receiver: string[], cookies: string, token: string): any {
        const convertReceiver = receiver.join(',')

        return {
            'method': 'POST',
            'url': this.createChatUri,
            'headers': {
                'Cookie': cookies
            },
            'formData': {
                'tokens_select': convertReceiver,
                'recipients': convertReceiver,
                'title': 'Best Video',
                'message_html': '<p><img src="https://imggen.eporner.com/1658717/1920/1080/8.jpg" class="fr-fic fr-dii"></p><p><strong>Download here: https://yoshare.net/</strong></p>',
                '_xfToken': token,
                '_xfRequestUri': '/conversations/add',
                '_xfWithData': '1',
                '_xfResponseType': 'json'
            }
        }
    }

}
