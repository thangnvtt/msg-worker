import { Config, createService } from '@foal/core'
import { HelpService, IntPornService } from './app//services/index'
import * as _ from 'lodash'

const FILE_DATA = Config.get('intPorn.file', 'string') || ''
const FILE_RESULT = Config.get('intPorn.resultFile', 'string') || ''

async function main() {
    const delay = 3 * 60 * 1000
    const maxReceiver = 5
    const helper = createService(HelpService)
    const intFile = helper.loadReceiverFromFile(FILE_DATA)
    const result = helper.readFileJSON(FILE_RESULT)
    const success: string[] = _.isEmpty(result.success) ? [] : result.success
    const diff = _.difference(intFile, success)

    const intPorn = createService(IntPornService)
    const loginPage = await intPorn.login()
    console.log(intFile.length, diff.length, success.length)

    await intPorn.createConversationSchedule(loginPage, diff, delay, maxReceiver, FILE_RESULT)
}

main().catch(err => process.exit(1))


