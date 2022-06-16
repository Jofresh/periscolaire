import api from "./fetcher.js";

export async function getActivites() {
    return await api.get('/activites')
}

export async function removeActivite(id) {
    return await api.delete(`/activites/${id}`)
}

export async function getEnfantsActivite(id) {
    return await api.get(`/activites/${id}/enfants`)
}

export async function inscrireEnfant(enfant, activite) {
    return await api.post(`/activites/${activite.id}/enfants/${enfant.id}`)
}

export async function desinscrireEnfant(activite, enfant) {
    return await api.delete(`/activites/${activite.id}/enfants/${enfant.id}`)
}

export async function ajouterActivite(activite) {
    return await api.post('/activites', activite)
}

export async function editActivite(activite) {
    return await api.put(`/activites/${activite.id}`, activite)
}
