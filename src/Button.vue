<template>
    <div class="button skewed" @click="$emit('click')">
        <span>
            {{text}}
        </span>
    </div>
</template>

<script>
export default {
    props: {
        text: '',
    },
}
</script>

<style>
.button {
    cursor: pointer;
    min-width: 100px;
    padding: 10px 20px;
    background-color: var(--color-accent);
    color: var(--color-bg);
    transition: box-shadow 0.3s;
}
.button:hover {
    box-shadow: 0 0 3px 1px var(--color-accent);
}
.button:active {
    background-color: var(--color-accent-lighter);
}
.button > * {
    text-align: center;
}
</style>