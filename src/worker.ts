import { Config, createService } from '@foal/core'
import { HelpService, IntPornService } from './app//services/index'

const FILE_DATA = Config.get('intPorn.file', 'string') || ''
const FILE_RESULT = Config.get('intPorn.resultFile', 'string') || ''

async function main() {

    const delay = 3 * 60 * 1000
    const maxReceiver = 5
    const helper = createService(HelpService)
    const intFile = helper.loadReceiverFromFile(FILE_DATA)

    const intPorn = createService(IntPornService)
    const loginPage = await intPorn.login()
    await intPorn.createConversationSchedule(loginPage, intFile, delay, maxReceiver, FILE_RESULT)
}

main().catch(err => console.log(err))


