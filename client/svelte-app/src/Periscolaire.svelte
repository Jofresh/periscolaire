<script>
    export let settings
    export let logout

    import { Router, Route, Link } from 'svelte-navigator'
    import { getActivites } from './api/activites.js'
    import { userConnected } from './stores.js'

    import Activites from './Activites.svelte'
    import Welcome from './Welcome.svelte'

    let perms = {
        add: true,
        update: true,
        delete: true,
        droppable: true
    }

    let activites = fetchActivites()

    async function fetchActivites() {
        const res = await getActivites()
        return res
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
            <Activites data={data} perms={perms} />
            {/await}
        </Route>
        <Route path={settings.route} primary={false}>
            <svelte:component this={settings.component}/>
        </Route>
    </main>
</Router>