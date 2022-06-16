<script>
    export let user
</script>

<div class="welcome">
    <img src="kids.jpeg" alt="kids playing">

    <div class="content">
        <h1>Bonjour {user.firstName} {user.name}</h1>
    </div>
</div>

<style>
    img {
        width: 100%;
        overflow: hidden;
        height: 30vh;
        object-fit: cover;
        opacity: 0.6;
    }

    .welcome {
        position: relative;
        text-align: center;
        color: white;
    }

    .content {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
</style>