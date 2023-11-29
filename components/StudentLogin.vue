<template>
  <div class="login">
    <form @submit.prevent="login" class="login__form">
      <h1 class="login__title">Login</h1>

      <div class="login__content">
        <div class="login__box">
          <i class="ri-user-3-line login__icon"></i>

          <div class="login__box-input">
            <input type="text" required class="login__input" id="login-email" placeholder=" "
                   v-model="details.pseudonym">
            <label for="login-email" class="login__label">Pseudonym</label>
          </div>
        </div>

        <div class="login__box">
          <i class="ri-lock-2-line login__icon"></i>

          <div class="login__box-input">
            <input type="password" required class="login__input" id="login-pass" placeholder=" "
                   v-model="details.password">
            <label for="login-pass" class="login__label">Password</label>
            <i class="ri-eye-off-line login__eye" id="login-eye"></i>
          </div>
        </div>
      </div>

      <div class="login__check">
        <div class="login__check-group">
          <input type="checkbox" class="login__check-input" id="login-check">
          <label for="login-check" class="login__check-label">Remember me</label>
        </div>

        <NuxtLink to="/reset/" class="login__forgot">Forgot Password?</NuxtLink>
      </div>

      <button type="submit" class="login__button">Login</button>

      <p class="login__register">
        Don't have an account?
        <NuxtLink :to="`/register?user=${userEnum.STUDENT}`">Register</NuxtLink>
      </p>
    </form>
  </div>
</template>
<script setup lang="ts">
import {userEnum} from "~/types";
import {setAuthCookie} from "~/helpers.client";

const route = useRoute()
const redirectTo = route.query.redirect ?? null

const details = reactive({
  pseudonym: '',
  password: ''
})

async function login() {
  const response = await useFetch('/api/auth/login', {
    method: 'POST',
    body: details
  }).then(
      (res) => res.data.value ?? null
  ).catch((err) => {
    alert("An error occurred")
    console.log(err)
    return null;
  })

  if (response.statusCode === 200) {
    setAuthCookie(response.body)

    if (redirectTo) {
      await navigateTo(decodeURI(redirectTo.toString()))
    } else {
      await navigateTo('/')
    }
  } else alert(response.body)
}
</script>