<template>
    <div id="main">
        <Composer></Composer>
        <div class="filler"></div>
        <About></About>
    </div>
</template>

<script>
import Composer from './Composer.vue';
import About from './About.vue';
export default {
    components: {
        Composer,
        About,
    }
}
</script>

<style>
@import './main.css';

#content {
    flex-grow: 1;
    padding: 1em;
}
#main {
    width: 100%;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    padding: 0 2em;
}
</style>