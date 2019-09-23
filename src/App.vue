<template>
    <div id="main">
        <!-- <div id="topbar" class="pure-menu pure-menu-horizontal">
            <router-link to="/" class="pure-menu-heading pure-menu-link">Compose</router-link>
            <ul class="pure-menu-list">
                <li class="pure-menu-item"><router-link to="/about" class="pure-menu-link">About</router-link></li>
            </ul>
        </div> -->
        <keep-alive><router-view id="content"></router-view></keep-alive>
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
h1 {
    text-align: center;
}
.pure-form input[readonly], .pure-form input[type=number], .pure-form input[type=text] {
    border: 1px solid #E0E0E0;
    background-color: inherit;
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
a:visited {
    color: #0084ff;
}
a {
    text-decoration: none;
    color: #339cff;
}
a:hover {
    text-decoration: underline;
}
a:active {
    color: #66b5ff;
}
</style>