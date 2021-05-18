import { writeFileSync, readFileSync } from 'fs'

export class HelpService {
    async delay(milliseconds: number): Promise<void> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve()
            }, milliseconds)
        })
    }

    loadReceiverFromFile(path) {
        const receiver = readFileSync(path, { encoding: 'utf8' })
        return receiver.split('\n')
    }

    writeFileJSON(path, data) {
        writeFileSync(path, data)
    }

    readFileJSON(path) {
        const data = readFileSync(path, { encoding: 'utf8' })
        return JSON.parse(data)
    }
}
