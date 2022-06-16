<script>
    import { userConnected } from './stores.js'

    import Home from './Home.svelte'
    import Login from './Login.svelte'

    import Mairie from './Mairie.svelte'
    import Periscolaire from './Periscolaire.svelte'
    import Parent from './Parent.svelte'

    const types = {
        "1": Mairie,
        "2": Periscolaire,
        "3": Parent
    }
</script>

{#if $userConnected}
    <Home type={types[$userConnected.discriminatorValue]} />
{:else}
    <Login />
{/if}

