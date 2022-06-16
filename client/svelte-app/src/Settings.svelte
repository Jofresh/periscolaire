<script>
    import { userConnected } from './stores.js'

    import { updateUser } from './api/users.js'

    let user = $userConnected


    let errorSubmit = false
    let successSubmit = false

    async function onSubmit( { target } ) {
        const formData = new FormData(target)
        const form = {}
        for (const [key, value] of formData)
            form[key] = value
        form.id = user.id
        form.type = user.type

        const res = await updateUser(form)

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
    }
</script>

<div class="container-fluid">
    <form class="card p-3 bg-light" on:submit|preventDefault={onSubmit}>
        <div class="mb-3">
        <label for="username">Nom d'utilisateur</label>
        <input readonly class="form-control" type="text" name="username" id="username" value={user.username} />
        </div>

        <div class="mb-3">
        <label for="mail">Adresse mail</label>
        <input class="form-control" type="text" name="mail" id="mail" value={user.mail} />
        </div>

        <div class="mb-3">
        <label for="firstName">Prénom</label>
        <input class="form-control" type="text" name="firstName" id="firstName" value={user.firstName} />
        </div>

        <div class="mb-3">
        <label for="name">Nom</label>
        <input class="form-control" type="text" name="name" id="name" value={user.name} />
        </div>

        <div class="mb-3">
        <label for="address">Adresse</label>
        <input class="form-control" type="text" name="address" id="address" value={user.address} />
        </div>

        <div class="mb-3">
        <label for="password">Mot de passe</label>
        <input readonly class="form-control" type="password" name="password" id="password" value={user.password} />
        </div>

        <div class="mb-3">
        <button class="btn btn-primary" type="submit">Confirmer</button>
        </div>
    </form>
</div>

{#if errorSubmit}
    <div class="alert alert-danger" role="alert">Erreur lors de la modification du compte</div>
{:else}
    {#if successSubmit}
        <div class="alert alert-success" role="alert">Compte modifié avec succès</div>
    {/if}
{/if}

<style>
    form {
        margin-top: 1.5rem;
    }
</style>