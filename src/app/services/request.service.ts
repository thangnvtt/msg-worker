import * as request from 'request'

class IOption {
    method: string
    url: string
    headers: any
    formData: any
}

export class RequestService {
    async request(options: IOption): Promise<any> {
        const promise = new Promise((resolve, reject) => {
            request(options, (err, response) => {
                if (err) return reject(err)
                resolve(response)
            })
        })
        return promise
    }
}
