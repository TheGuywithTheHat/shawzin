<template>
    <div id="main">
        <div id="topbar" class="pure-menu pure-menu-horizontal">
            <router-link to="/" class="pure-menu-heading pure-menu-link">Compose</router-link>
            <ul class="pure-menu-list">
                <li class="pure-menu-item"><router-link to="/about" class="pure-menu-link">About</router-link></li>
            </ul>
        </div>
        <keep-alive><router-view></router-view></keep-alive>
    </div>
</template>

<script>
import Composer from './Composer.vue';
import About from './About.vue';
import VueRouter from 'vue-router';
import 'purecss/build/pure-min.css';
import 'purecss/build/grids-responsive-min.css';
var router = new VueRouter({
    routes: [
        { path: '/', component: Composer},
        { path: '/about', component: About},
    ],
});
export default { router };
</script>

<style>
html {
    box-sizing: border-box;
    background-color: #202020;
    color: #E0E0E0;
}
*, *::before, *::after {
    box-sizing: inherit;
}
input {
    border: 1px solid #E0E0E0;
    background-color: inherit;
    padding: 0.1em;
}
#content {
    flex-grow: 1;
    padding: 1em;
}
#main {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
}
.pure-form select {
    border: 1px solid #E0E0E0;
    background-color: inherit;
}
option {
    background-color: #202020;
}

</style>