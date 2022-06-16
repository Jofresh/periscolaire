<script>
	export let data;
	export let perms; // { add: true, delete: true, update: true, droppable: true, register: true }

    import { getEnfantsActivite, ajouterActivite, removeActivite, editActivite, inscrireEnfant } from './api/activites.js'

    let activiteClicked = false

    async function registerEnfants(activite) {
        if (perms.register) {
            const enfants = perms.register
            const inscrits = await getEnfantsActivite(activite.id)
            const nonInscrits = enfants.filter(({id}) => !inscrits.some((e) => e.id === id))

            if (nonInscrits.length > 0) { activiteClicked = { activite, nonInscrits }; }
        }
    }

    async function confirmInscription() {
        const enfantsToInscrire = activiteClicked.nonInscrits.filter(({checked}) => checked)
        console.log(enfantsToInscrire)

        if (enfantsToInscrire.length > 0) {
            for (let e of enfantsToInscrire) {
                await inscrireEnfant(e, activiteClicked.activite)
            }
        } else {
            //
        }

        activiteClicked = false
    }

    const types = [
        { value: "matin", label: "Accueil du matin" },
        { value: "soir", label: "Accueil du soir" },
    ]

    let inputs = {
        type: types[0].value,
        titre: "",
        description: "",
        prix: "",
        dateDebut: "2022-06-02T10:30",
        dateFin: "2022-06-02T12:30",
        status: true
    }

    let toUpdates = {}

	async function addActivite() {
        const activite = await ajouterActivite(inputs)

        if (activite.error) {
            //
        } else {
            data = [ ...data, activite ]

            _resetAddForm()
        }
    }

    function _resetAddForm() {
        inputs.titre = inputs.description = ""
        inputs.prix = 0
    }

	async function deleteActivite(a) {
        const res = await removeActivite(a.id);

        if (res.error) {
            //
        } else {
            data = data.filter(({id}) => id !== a.id)
        }
    }

	function updateActivite(a) {
        toUpdates = {
            ...toUpdates,
            [a.id]: a
        }
        
        toUpdates[a.id].dateDebut = toUpdates[a.id].dateDebut.substring(0, 16)
        toUpdates[a.id].dateFin = toUpdates[a.id].dateFin.substring(0, 16)
    }

	async function showEnfantsActivite(a) {
        if (a.dropped) {
            delete a.dropped
        } else {
            a.dropped = true
            a.enfants = await getEnfantsActivite(a.id)
        }
        data = [ ...data ]
    }

    async function confirmEdit(a) {
        const activite = await editActivite(a)

        if (activite.error) {
            console.log('Erreur')
        } else {
            _removeFromUpdates(a)
        }
    }

    function cancelEdit(a) {
        _removeFromUpdates(a)
    }

    function _removeFromUpdates({id}) {
        const copy = { ...toUpdates }
        delete copy[id]

        toUpdates = { ...copy }
    }
</script>

<table class="table table-striped table-hover">
    <thead>
        <tr>
            <th>Type</th>
            <th>Titre</th>
            <th>Description</th>
            <th>Prix</th>
            <th>Date début</th>
            <th>Date fin</th>
            {#if perms.add || perms.update || perms.delete || perms.droppable || perms.register}
                <th>Actions</th>
            {/if}
        </tr>
    </thead>
    <tbody>
    {#each data as a}
        {#if toUpdates[a.id]}
        <tr>
            <td>
                <select>
                {#each types as { value, label }}
                    {#if toUpdates[a.id].type === value}
                    <option value={value} selected>{label}</option>    
                    {:else}
                    <option value={value}>{label}</option>
                    {/if}
                {/each}
                </select>
            </td>
            <td><input type="text" bind:value={toUpdates[a.id].titre}/></td>
            <td><input type="text" bind:value={toUpdates[a.id].description}/></td>
            <td><input type="number" bind:value={toUpdates[a.id].prix}/></td>
            <td><input type="datetime-local" bind:value={toUpdates[a.id].dateDebut}/></td>
            <td><input type="datetime-local" bind:value={toUpdates[a.id].dateFin}/></td>
            <td>
                <button type="button" class="btn btn-success btn-sm" on:click={confirmEdit(a)}>
                    <i class="fa fa-check" aria-hidden="true"></i>
                </button>
                <button type="button" class="btn btn-dark btn-sm" on:click={cancelEdit(a)}>
                    <i class="fa fa-times" aria-hidden="true"></i>
                </button>
            </td>
        </tr>
        {:else}
        <tr>
            <td>{types.find(({value}) => a.type === value).label}</td>
            <td>{a.titre}</td>
            <td>{a.description}</td>
            <td>{a.prix === 0 ? 'Gratuit' : a.prix}</td>
            <td>{(new Date(a.dateDebut)).toLocaleDateString('fr-FR')}</td>
            <td>{(new Date(a.dateFin)).toLocaleDateString('fr-FR')}</td>
            <td>
                {#if perms.update}
                <button type="button" class="btn btn-secondary btn-sm" on:click={updateActivite(a)}>
                    <i class="fa fa-pencil" aria-hidden="true"></i>
                </button>
                {/if}
                {#if perms.delete}
                <button type="button" class="btn btn-danger btn-sm" on:click={deleteActivite(a)}>
                    <i class="fa fa-trash" aria-hidden="true"></i>
                </button>
                {/if}
                {#if perms.register}
                <button type="button" data-bs-toggle="modal" data-bs-target="#myModal" class="btn btn-primary btn-sm" on:click={registerEnfants(a)}>
                    Inscrire
                </button>
                {/if}
                {#if perms.droppable}
                <button type="button" class="btn btn-info btn-sm" on:click={showEnfantsActivite(a)}>
                    {#if a.dropped}
                    <i class="fa fa-caret-up" aria-hidden="true"></i>
                    {:else}
                    <i class="fa fa-caret-down" aria-hidden="true"></i>
                    {/if}
                </button>
                {/if}
            </td>
        </tr>
        {/if}
        {#if a.dropped && a.enfants.length > 0}
        <table class="table table-bordered table-sm">
            <thead>
                <th>Prénom</th>
                <th>Nom</th>
            </thead>
            <tbody>
            {#each a.enfants as e}
                <tr class="table-primary">
                    <td>{e.firstName}</td>
                    <td>{e.name}</td>
                </tr>   
            {/each}
            </tbody>
        </table>
        {/if}
    {/each}

    {#if perms.add}
        <tr>
            <td>
                <select name="type" bind:value={inputs.type}>
                    {#each types as { value, label }}
                    <option value={value}>{label}</option>
                    {/each}
                </select>
            </td>
            <td><input type="text" placeholder="Titre" name="title" bind:value={inputs.titre} /></td>
            <td><input type="text" placeholder="Description" name="description" bind:value={inputs.description} /></td>
            <td><input type="number" placeholder="Prix" name="prix" bind:value={inputs.prix} /></td>
            <td><input type="datetime-local" name="dateDebut" bind:value={inputs.dateDebut} /></td>
            <td><input type="datetime-local" name="dateFin" bind:value={inputs.dateFin} /></td>
            <td><button type="button" class="btn btn-primary" on:click={addActivite}>Ajouter</button></td>
        </tr>
    {/if}
    </tbody>
</table>

<div class="modal hide fade in" id="myModal" data-bs-keyboard="false" data-bs-backdrop="static">
  <div class="modal-dialog">
     <div class="modal-content">

        <div class="modal-header">
           <h4 class="modal-title">Inscrivez vos enfants</h4>
        </div>

        <div class="modal-body">
            {#if activiteClicked}
            <table class="table">
                <thead>
                    <th>Nom</th>
                    <th>Prénom</th>
                    <th>Inscrire</th>
                </thead>
                <tbody>
                {#each activiteClicked.nonInscrits as e}
                    <tr>
                        <td>{e.firstName}</td>
                        <td>{e.name}</td>
                        <td>
                            <input type="checkbox" bind:checked={e.checked}/>
                        </td>
                    </tr>
                {/each}
                </tbody>
            </table>
            {:else}
            Tous vos enfants sont déjà inscrits à cette activité.
            {/if}
        </div>

        <div class="modal-footer">
            {#if activiteClicked}
            <button type="button" on:click={confirmInscription} class="btn btn-primary" data-bs-dismiss="modal">Confirmer</button>
            <button type="button" on:click={() => { activiteClicked = false }} class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
            {:else}
            <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Fermer</button>
            {/if}
        </div>
     </div>
  </div>
</div>