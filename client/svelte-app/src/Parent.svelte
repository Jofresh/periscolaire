<script>
    export let settings
    export let logout

    import { Router, Route, Link } from 'svelte-navigator'
    import { onMount } from 'svelte'
    import api from './api/fetcher.js'
    import { userConnected } from './stores.js'
    import Activites from './Activites.svelte'
    import Welcome from './Welcome.svelte'
    
    import { desinscrireEnfant, getActivites } from './api/activites.js'
    import { addEnfant, editEnfant, getActivitesEnfant, getEnfantsParent, removeEnfant } from './api/enfants.js';

    let enfants = []
    let toUpdates = {}

    let activites = []

    const inputs = { firstName: "", name: "", dateBirth: "" }

    onMount(async () => {
        enfants = await getEnfantsParent($userConnected.id)
        activites = await getActivites()
    })

    async function ajouterEnfant() {
        const enfant = await addEnfant($userConnected.id, inputs)

        if (enfant.error) {
            //
        } else {
            enfants = [ ...enfants, enfant ]
        }
    }

    async function deleteEnfant(e) {
        const res = await removeEnfant(e.id)

        if (res.error) {
            //
        } else {
            enfants = enfants.filter(({id}) => id !== e.id)
        }
    }

    function updateEnfant(e) {
        toUpdates = {
            ...toUpdates,
            [e.id]: e
        }
    }

    function cancelEdit(e) {
        _removeFromUpdates(e)
    }

    function _removeFromUpdates({id}) {
        const copy = { ...toUpdates }
        delete copy[id]
        toUpdates = { ...copy }
    }

    async function confirmEdit(e) {
        const enfant = toUpdates[e.id]
        const res = await editEnfant(enfant)

        if (res.error) {
            //
        } else {
            _removeFromUpdates(e)
        }
    }

    async function showActivitesEnfant(e) {
        if (e.dropped) {
            delete e.dropped
        } else {
            e.dropped = true
            const res = await getActivitesEnfant(e.id)

            if (res.error) {
                console.log(res.error)
            } else {
                e.activites = res
            }
        }

        enfants = [ ...enfants ]
    }

    async function desinscrire(enfant, activite) {
        const res = await desinscrireEnfant(activite, enfant)

        if (res.error) {
            console.log(error)
        } else {
            enfant.activites = enfant.activites.filter(({id}) => id !== activite.id)
            enfants = [ ...enfants ]
        }
    }
</script>

<div>
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
                            <Link to="enfants" class="nav-link">Mes enfants</Link>
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
                <Activites data={activites} perms={{register: enfants}} />
            </Route>

            <Route path="enfants" primary={false}>
                <table class="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th>Prénom</th>
                            <th>Nom</th>
                            <th>Date de naissance</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each enfants as e}
                        {#if toUpdates[e.id]}
                        <tr>    
                            <td><input type="text" bind:value={toUpdates[e.id].firstName}/></td>
                            <td><input type="text" bind:value={toUpdates[e.id].name}/></td>
                            <td><input type="date" bind:value={toUpdates[e.id].dateBirth}/></td>
                            <td>
                                <button on:click={confirmEdit(e)} type="button" class="btn btn-success btn-sm">
                                    <i class="fa fa-check" aria-hidden="true"></i>
                                </button>
                                <button on:click={cancelEdit(e)} type="button" class="btn btn-dark btn-sm">
                                    <i class="fa fa-times" aria-hidden="true"></i>
                                </button>
                            </td>
                        </tr>
                        {:else}
                        <tr>
                            <td>{e.firstName}</td>
                            <td>{e.name}</td>
                            <td>{(new Date(e.dateBirth)).toLocaleDateString('fr-FR')}</td>
                            <td>
                                <button on:click={deleteEnfant(e)} type="button" class="btn btn-danger btn-sm">
                                    <i class="fa fa-trash" aria-hidden="true"></i>
                                </button>

                                <button on:click={updateEnfant(e)} type="button" class="btn btn-secondary btn-sm">
                                    <i class="fa fa-pencil" aria-hidden="true"></i>
                                </button>

                                <button on:click={showActivitesEnfant(e)} type="button" class="btn btn-info btn-sm">
                                    {#if e.dropped}
                                    <i class="fa fa-caret-up" aria-hidden="true"></i>
                                    {:else}
                                    <i class="fa fa-caret-down" aria-hidden="true"></i>
                                    {/if}
                                </button>
                            </td>
                        </tr>
                        {/if}
                        {#if e.dropped && e.activites.length > 0}
                        <tr>
                            <table class="table table-bordered table-sm">
                                <thead>
                                    <th>Titre</th>
                                    <th>Description</th>
                                    <th>Début</th>
                                    <th>Fin</th>
                                    <th>Action</th>
                                </thead>
                                <tbody>
                                    {#each e.activites as a}
                                    <tr class="table-primary">
                                        <td>{a.titre}</td>
                                        <td>{a.description}</td>
                                        <td>{(new Date(a.dateDebut)).toLocaleDateString('fr-FR')}</td>
                                        <td>{(new Date(a.dateFin)).toLocaleDateString('fr-FR')}</td>
                                        <td>
                                            <button on:click={desinscrire(e, a)} type="button" class="btn btn-danger btn-sm">
                                                <i class="fa fa-times" aria-hidden="true"></i>
                                            </button>
                                        </td>
                                    </tr>
                                    {/each}
                                </tbody>
                            </table>
                        </tr>
                        {/if}

                        {/each}

                        <tr>
                            <td><input type="text" placeholder="Prénom" bind:value={inputs.firstName}/></td>
                            <td><input type="text" placeholder="Nom" bind:value={inputs.name}/></td>
                            <td><input type="date" placeholder="Date de naissance" bind:value={inputs.dateBirth}/></td>
                            <td><button on:click={ajouterEnfant} type="button" class="btn btn-primary">Ajouter</button></td>
                        </tr>
                    </tbody>
                </table>
            </Route>

            <Route path={settings.route} primary={false}><svelte:component this={settings.component}/></Route>
        </main>
    </Router>
</div>
