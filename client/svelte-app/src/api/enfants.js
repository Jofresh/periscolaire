import api from "./fetcher.js";

export async function getEnfants() {
    return await api.get('/enfants')
}

export async function removeEnfant(id) {
    return await api.delete(`/enfants/${id}`)
}

export async function getActivitesEnfant(id) {
    return await api.get(`/enfants/${id}/activites`)
}

export async function getEnfantsParent(id) {
    return await api.get(`/parents/${id}/enfants`)
}

export async function addEnfant(id, enfant) {
    return await api.post(`/parents/${id}/enfants`, enfant)
}

export async function editEnfant(enfant) {
    return await api.put(`/enfants/${enfant.id}`, enfant)
}
