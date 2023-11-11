<template>
    <nav class="navbar" role="navigation" aria-label="main navigation">
        <div class="navbar-brand ml-4">
            <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
            </a>
        </div>

        <div id="navbarBasicExample" class="navbar-menu">
            <div class="navbar-start">
                <NuxtLink class="navbar-item" to="/">
                    Home
                </NuxtLink>
                <NuxtLink class="navbar-item" to="/">
                    News & Events
                </NuxtLink>
            </div>

            <div class="navbar-end">
                <div class="navbar-item">
                    <div class="buttons">
                        <NuxtLink class="navbar-item" to="/chat">
                            <div class="svg-chat-container">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                    <path
                                        d="M10 3H14C18.4183 3 22 6.58172 22 11C22 15.4183 18.4183 19 14 19V22.5C9 20.5 2 17.5 2 11C2 6.58172 5.58172 3 10 3ZM12 17H14C17.3137 17 20 14.3137 20 11C20 7.68629 17.3137 5 14 5H10C6.68629 5 4 7.68629 4 11C4 14.61 6.46208 16.9656 12 19.4798V17Z">
                                    </path>
                                </svg>
                            </div>
                        </NuxtLink>
                        <div class="navbar-item has-dropdown is-hoverable">
                            <a class="button is-primary">
                                Sign Up
                            </a>

                            <div class="navbar-dropdown">
                                <NuxtLink class="navbar-item" :to="`/register?user=${user.STUDENT}`">Student</NuxtLink>
                                <NuxtLink class="navbar-item" :to="`/register?user=${user.COUNSELOR}`">Counselor</NuxtLink>
                            </div>
                        </div>
                        <NuxtLink class="button is-light" to="login">
                            Log in
                        </NuxtLink>
                    </div>
                </div>
            </div>
        </div>
    </nav>
    <slot />
    <footer>
        <p>&#169; 2023 Mercy Waweru</p>
    </footer>
</template>
<script setup lang="ts">
import { user } from '~/types'
</script>
<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;800&display=swap');

:root {
    --white-color: hsl(0, 0%, 100%);
    --black-color: hsl(0, 0%, 0%);
    --body-font: 'Rubik', sans-serif;
    --h1-font-size: 1.75rem;
    --normal-font-size: 1rem;
    --small-font-size: .9rem;
    --font-medium: 500;
    --accent: hsl(280,57%,64%);
    --primary: hsl(223, 35%, 44%);
}

*,
*::before,
*::after {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
}

ul,
ol {
    list-style: none;
}

a {
    text-decoration: none;

    &:hover {
        color: var(--accent)
    }
}

input,
button {
    border: none;
    outline: none;
}


/* Bulma Color Override */
.is-primary {
    background-color: var(--accent) !important;
}

.nav {
    padding: 1rem 0.5rem;
    display: grid;
    place-items: center;
    background-color: var(--primary);

    box-shadow: 0px 0px 10px -1px rgba(0, 0, 0, 0.5);
    -webkit-box-shadow: 0px 0px 10px -1px rgba(0, 0, 0, 0.5);
    -moz-box-shadow: 0px 0px 10px -1px rgba(0, 0, 0, 0.5);

    .nav-links {
        display: flex;
        gap: 2rem;
        justify-content: space-between;

        .nav-link a {
            color: white;
            font-family: 'Rubik', sans-serif;
        }
    }
}

.svg-chat-container svg {
    width: 30px;
    height: 30px;
    fill: gray;

    &:hover{
        fill: var(--accent);
    }
}
</style>