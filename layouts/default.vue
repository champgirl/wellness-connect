<template>
  <div id="wrapper">
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
          <NuxtLink class="navbar-item" to="/appointments">
            Appointments
          </NuxtLink>
        </div>

        <div class="navbar-end">
          <div class="navbar-item">
            <div class="buttons">
              <NuxtLink class="navbar-item" to="/chat" v-if="!isAdmin()">
                <div class="svg-chat-container">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                        d="M10 3H14C18.4183 3 22 6.58172 22 11C22 15.4183 18.4183 19 14 19V22.5C9 20.5 2 17.5 2 11C2 6.58172 5.58172 3 10 3ZM12 17H14C17.3137 17 20 14.3137 20 11C20 7.68629 17.3137 5 14 5H10C6.68629 5 4 7.68629 4 11C4 14.61 6.46208 16.9656 12 19.4798V17Z">
                    </path>
                  </svg>
                </div>
              </NuxtLink>
              <div v-if="useUser().value">
              <span class="button is-dark" @click="logout">
                Log Out
              </span>
              </div>
              <div class="is-flex" v-else>
                <div class="navbar-item has-dropdown is-hoverable">
                  <a class="button is-primary">
                    Sign Up
                  </a>

                  <div class="navbar-dropdown">
                    <NuxtLink class="navbar-item" :to="`/register?user=${userEnum.STUDENT}&redirect=${encodeURI($route.path)}`">Student</NuxtLink>
                    <NuxtLink class="navbar-item" :to="`/register?user=${userEnum.COUNSELOR}&redirect=${encodeURI($route.path)}`">Counselor</NuxtLink>
                  </div>
                </div>
                <div class="navbar-item has-dropdown is-hoverable">
                  <a class="button is-light">
                    Log In
                  </a>

                  <div class="navbar-dropdown">
                    <NuxtLink class="navbar-item" :to="`/login?user=${userEnum.STUDENT}&redirect=${encodeURI($route.path)}`">Student</NuxtLink>
                    <NuxtLink class="navbar-item" :to="`/login?user=${userEnum.COUNSELOR}&redirect=${encodeURI($route.path)}`">Counselor</NuxtLink>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
    <slot/>
    <footer class="footer">
      <div class="footcontent">
        <p>&#169; 2023 Wellness Connect Ltd. All Rights Reserved</p>
        <router-link to="/privacypolicy">Privacy Policy</router-link>
      </div>
    </footer>
  </div>
</template>
<script setup lang="ts">
import {userEnum} from '~/types'
import {useUser} from "~/composables/state";
import {removeAuthCookie} from "~/helpers.client";

function isAdmin(){
  const user = useUser().value
  if(user?.email.includes('@')) return true
  return false
}


async function logout() {
  const response = await useFetch('/api/auth/logout', {
    method: 'GET',
    headers: {
      'bearer': useUser().value?.token ?? ''
    }
  }).then(
      (res) => {
        return res.data.value ?? null
      }
  ).catch(e => {
    alert(e.message)
    console.error(e)
  })

  if (response && response.statusCode === 200) {
    removeAuthCookie()
    await navigateTo('/login')
  } else {
    alert("An error occurred | Try clearing you cookies")
    console.log(response)
  }
}
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
  --accent: hsl(280, 57%, 64%);
  --primary: hsl(223, 35%, 44%);
}

*,
*::before,
*::after {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

#wrapper{
  min-height: 100vh;
  min-height: 100dvh;
  color: white;
  display: grid;
  grid-template-rows: auto 1fr auto;
  font-family: "Open Sans", sans-serif;
}

ul,
ol {
  list-style: none;
}

a {
  text-decoration: none;
  color: #00e7eb;

  &:hover {
    color: var(--accent)
  }
}


input,
button {
  border: none;
  outline: none;
}


button{
  padding: 0.2em 0.7em;
  position: relative;
}

.code-container {
  position: relative;
  border: 1px solid #ccc;
  border-radius: 0.25em;
  margin-bottom: 1rem;
  margin-top: 1rem;
  background-color: #f5f5f5;
  overflow-x: scroll;
  transition: all 0.2s ease-in-out;

  &:hover {
    border-color: #aaa;
  }

  .copy-code-button {
    position: absolute;
    top: 0;
    right: 0;
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 0.25rem;
    cursor: pointer;
    transition: all 0.2s ease-in-out;

    &:hover {
      background-color: #ccc;
    }
  }
}

code {
  font-family: 'Roboto Mono', monospace;
  font-size: 0.85em;
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

  &:hover {
    fill: var(--accent);
  }
}

.footer {
  background-color: #808080;
  color: #fff;
  padding: 15px;
  text-align: center;

  .footcontent {
    font-size: large;
    font-family: 'Rubik', sans-serif;
  }
}
</style>