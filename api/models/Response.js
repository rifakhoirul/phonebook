class Response {
    constructor(data, status){
        this.status = status === undefined ? true : status
        this.data = data || {}
    }
}

module.exports = Response