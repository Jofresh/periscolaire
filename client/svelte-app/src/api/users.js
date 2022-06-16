import api from "./fetcher.js";

export async function updateUser(user) {
    return await api.put(`/users/${user.id}`, user)
}