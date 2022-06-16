<script>
    import { onMount } from 'svelte'
    import api from './api/fetcher.js'
    import { userConnected } from './stores.js'

    let username
    let password
    let erreur = false

    async function connect() {
        let res = await (api.post('/signin', { username, password }))

        if (res.error) {
            erreur = res.error
        } else {
            erreur = false

            userConnected.set(res)
        }
    }
</script>

<div id="login" class="text-center">
    <form on:submit|preventDefault={connect} class="form-signin">
        <h1 class="h3 mb-3 font-weight-normal">Connexion</h1>
        
        {#if !!erreur}
        <div class="alert alert-danger" role="alert">Nom d'utilisateur ou mot de passe invalide.</div>
        {/if}

        <label for="inputUsername" class="sr-only">Username</label>
        <input type="text" id="inputUsername" class="form-control" placeholder="Nom d'utilisateur" bind:value={username} required/>

        <label for="inputPassword" class="sr-only">Password</label>
        <input type="password" id="inputPassword" class="form-control" placeholder="Mot de passe" bind:value={password} required/>

        <button class="btn btn-primary btn-lg btn-block" type="submit">Se connecter</button>
        <p class="mt-5 mb-3 text-muted">© 2021-2022</p>
    </form>
</div>