<script>
    export let type

    import { userConnected } from './stores.js'
    import Settings from './Settings.svelte'
    import Footer from './Footer.svelte'

    let props = {
        settings: { // export let settings
            route: "settings",
            label: "Paramètres",
            component: Settings,
        },
        logout: handleLogout, // export let logout
    }

    function handleLogout() {
        $userConnected = null
    }
</script>

<svelte:component this={type} {...props} />

<Footer />