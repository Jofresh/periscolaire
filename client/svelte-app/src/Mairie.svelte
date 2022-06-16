<script>
    export let settings
    export let logout

    import { Router, Route, Link } from 'svelte-navigator'
    import { onMount } from 'svelte'
    import api from './api/fetcher.js'

    import Activites from './Activites.svelte'
    import Welcome from './Welcome.svelte'
    import { getActivites } from './api/activites.js';

    import { userConnected } from './stores.js'

    const perms = { droppable: true }

    const types = [
        // { path: "mairie", discriminator: "1", text: "Mairie" }, // not allowed to create `Mairie` account
        { path: "parents", discriminator: "3", text: "Parent" },
        { path: "periscolaire", discriminator: "2", text: "Périscolaire" },
    ]

    let activites = fetchActivites()

    async function fetchActivites() {
        const res = await getActivites()
        return res
    }

    let errorSubmit = false
    let successSubmit = false

    async function onSubmit(e) {
        const formData = new FormData(e.target)
        const form = {}
        for (const [key, value] of formData) {
            form[key] = value
        }

        const newUser = {
            username: form.username,
            password: form.password,
            firstName: form.firstName,
            name: form.name,
            mail: form.mail,
            address: form.address
        }

        if (Object.values(newUser).every(field => field !== "")) {
            const res = await api.post(`/${form.type}`, newUser)
            console.log(res)

            if (res.error) {
                errorSubmit = true

                setTimeout(() => {
                    errorSubmit = false
                }, 4000)
            } else {
                successSubmit = true

                setTimeout(() => {
                    successSubmit = false
                }, 4000)
            }
        } else {
            console.log('Fill all the fields.')
        }
    }
</script>

<Router>

    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container-fluid">
            <span class="navbar-brand">Centre Périscolaire</span>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav me-auto">
                    <li class="nav-item">
                        <Link to="/" class="nav-link">Home</Link>
                    </li>
                    <li class="nav-item">
                        <Link to="activites" class="nav-link">Activités</Link>
                    </li>
                    <li class="nav-item">
                        <Link to="create" class="nav-link">Créer un compte</Link>
                    </li>
                </ul>
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item">
                        <Link to={settings.route} class="nav-link">{settings.label}</Link>
                    </li>
                    <li class="nav-item">
                        <Link to="/" class="nav-link" on:click={logout}>Déconnexion</Link>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

    <main class="container">
    <Route path="/" primary={false}>
        <Welcome user={$userConnected}/>
    </Route>
    
    <Route path="activites" primary={false}>
        {#await activites then data}
        <Activites data={data} perms={perms}/>
        {/await}
    </Route>
    
    <Route path="create" primary={false}>
        <div class="container-fluid">
            <form class="card p-3 bg-light" on:submit|preventDefault={onSubmit}>
                <label for="type">Type d'utilisateur</label>
                <select class="form-control" name="type" id="type">
                    {#each types as { path, text }}
                    <option value={path}>{text}</option>    
                    {/each}
                </select>

                <label for="username">Nom d'utilisateur</label>
                <input class="form-control" type="text" id="username" name="username" />

                <label for="password">Mot de passe</label>
                <input class="form-control" type="password" id="password" name="password" />

                <label for="firstName">Prénom</label>
                <input class="form-control" type="text" id="firstName" name="firstName" />

                <label for="name">Nom</label>
                <input class="form-control" type="text" id="name" name="name" />

                <label for="mail">Mail</label>
                <input class="form-control" type="text" id="mail" name="mail" />

                <label for="address">Adresse</label>
                <input class="form-control" type="text" id="address" name="address" />
                
                <button class="form-control btn btn-primary" type="submit">Créer</button>
            </form>
        </div>

        {#if errorSubmit}
        <div class="alert alert-danger" role="alert">Erreur lors de la création du compte</div>
        {:else}
            {#if successSubmit}
            <div class="alert alert-success" role="alert">Compte créé avec succès</div>
            {/if}
        {/if}
    </Route>

    <Route path={settings.route} primary={false}>
        <svelte:component this={settings.component}/>
    </Route>
</main>
</Router>

<style>
    form {
        margin-top: 1.5rem;
    }
</style>
