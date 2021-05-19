import { Config, createService } from '@foal/core'
import { HelpService, IntPornService } from './app//services/index'
import * as _ from 'lodash'

const FILE_DATA = Config.get('intPorn.file', 'string') || ''
const FILE_RESULT = Config.get('intPorn.resultFile', 'string') || ''

function cacheFile(helperService: HelpService, pathFile, successData, failedData, errorData) {
    let { success, failed, error } = helperService.readFileJSON(FILE_RESULT)
    success = [...success, ...successData]
    failed = [...failed, ...failedData]
    error = [...error, ...errorData]

    const data = { success, failed, error }
    helperService.writeFileJSON(pathFile, JSON.stringify(data))
}

async function main() {
    const delay = 3 * 60 * 1000
    const maxReceiver = 5
    const helper = createService(HelpService)
    const user = helper.loadReceiverFromFile(FILE_DATA)
    let userNeedSend = []
    let userSended = new Array<any>()

    const intPorn = createService(IntPornService)
    const loginPage = await intPorn.login()

    do {
        userNeedSend = _.difference(user, userSended)
        const { success, failed, error } = await intPorn.createConversationSchedule(loginPage, userNeedSend, delay, maxReceiver)
        userSended = [...userSended, ...success, ...failed]

        cacheFile(helper, FILE_RESULT, success, failed, error)
    } while (userSended.length < user.length)
}

main().catch(err => console.error(err))


