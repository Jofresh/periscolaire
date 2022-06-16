const api = {}
const url = 'http://localhost:8080' // address of api server
const error = { error: 'Erreur lors de la requête' }     

async function send(method, path, params) {
    const headers = { "Content-type": "application/json" }
    const body = params ? JSON.stringify(params) : undefined

    const response = await fetch(url + path, { method, body, headers })
        .catch((e) => ({ error: 'Erreur lors de la connexion au serveur' }))

    if (response.status === 200) {
        const data = await response.json()
        return data
    } else {
        return error
    }
}

api.get = (path) => send('GET', path)
api.post = (path, params) => send('POST', path, params)
api.put = (path, params) => send('PUT', path, params)
api.delete = (path, params) => send('DELETE', path, params)

export default api
