import { PuppeteerService } from './app/services'
import * as axios from 'axios'
import * as FormData from 'form-data'
async function main() {
    const a = new PuppeteerService()

    const urlLogin = 'https://forum.intporn.com/login'
    const urlChat = 'https://forum.intporn.com/conversations/add'
    const page = await a.createPage(urlLogin)
    await page.type('input[autocomplete=username]', 'thangnv')
    await page.type('input[autocomplete=current-password]', 'thangnv123')
    await page.click('.button--icon--login')

    await page.goto(urlChat)
    const cookies = await page.cookies(urlChat)
    const token = await page.$eval('input[name=_xfToken]', e => e.getAttribute('value'))

    const data = new FormData()
    data.append('tokens_select', 'highplayer')
    data.append('recipients', 'highplayer')
    data.append('title', 'Best Video')
    data.append('message_html', '<p><img src="https://imggen.eporner.com/1658717/1920/1080/8.jpg" class="fr-fic fr-dii"></p><p><strong>Download here: https://yoshare.net/</strong></p>')
    data.append('_xfToken', token)
    data.append('_xfRequestUri', '/conversations/add')
    data.append('_xfWithData', '1')
    data.append('_xfResponseType', 'json')

    let objCookies = ''
    for (const [key, value] of Object.entries(cookies)) {
        objCookies += `${key}=${value};`
    }
    const config = {
        method: 'post',
        url: urlChat,
        headers: {
            'Cookie': '_ga=GA1.1.2011044593.1621149539; xf_csrf=fOn_gD_LwZqnMwjp; xf_user=110665%2C4XzQw2Ucg30366NFg9J7eOItohGub-vWwoAIuJcy; xf_session=ood2vQN0QD9PjNPbTODcmwL0xMTOmEuO; _ga_F8C3JT3E2F=GS1.1.1621249018.5.1.1621250197.0; xf_user=110665%2CLERnhWZCCT7I_HM0AUJzMTxDNduG1VzRFEK6uQem',
            ...data.getHeaders()
        },
        data: data
    }
}

main().catch(err => console.log(err))


