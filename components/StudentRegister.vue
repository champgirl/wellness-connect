<template>
  <div class="login register mb-4">
    <img src="/images/login-bg.webp" alt="login image" class="login__img">

    <form @submit.prevent="signup" class="login__form">
      <h1 class="login__title">Student Register</h1>

      <div class="login__content">
        <div class="login__box">
          <i class="ri-user-3-line login__icon"></i>

          <div class="login__box-input">
            <input type="text" required class="login__input" id="name" placeholder=" " v-model="details.name">
            <label for="name" class="login__label">Name</label>
          </div>
        </div>

        <div class="login__box">
          <i class="ri-user-3-line login__icon"></i>

          <div class="login__box-input">
            <input type="email" required class="login__input" id="login-email" placeholder=" " v-model="details.email">
            <label for="login-email" class="login__label">Email</label>
          </div>
        </div>

        <div class="login__box">
          <i class="ri-user-3-line login__icon"></i>

          <div class="login__box-input">
            <input type="text" required class="login__input" id="registration" placeholder=" " v-model="details.reg_no">
            <label for="registration" class="login__label">Registration Number</label>
          </div>
        </div>

        <div class="login__box">
          <i class="ri-user-3-line login__icon"></i>

          <div class="login__box-input">
            <input type="tel" required class="login__input" id="contact" placeholder=" " v-model="details.contact">
            <label for="contact" class="login__label">Contact</label>
          </div>
        </div>


        <div class="login__box">
          <i class="ri-lock-2-line login__icon"></i>

          <div class="login__box-input">
            <input type="password" required class="login__input" id="login-pass1" placeholder=" " v-model="password1">
            <label for="login-pass1" class="login__label">Password</label>
            <i class="ri-eye-off-line login__eye" id="login-eye"></i>
          </div>
        </div>

        <div class="login__box">
          <i class="ri-lock-2-line login__icon"></i>

          <div class="login__box-input">
            <input type="password" required class="login__input" id="login-pass2" placeholder=" " v-model="password2">
            <label for="login-pass2" class="login__label">Confirm Password</label>
            <i class="ri-eye-off-line login__eye" id="login-eye"></i>
          </div>
        </div>
        <div class="terms">
          <input type="checkbox" checked>
          <label class="option has-text-white ml-2">I have read and agreed to the
            <RouterLink to="/privacypolicy" class="mr-2"> Privacy Policy</RouterLink>
          </label>
        </div>
      </div>
      <button type="submit" class="login__button">Sign Up</button>
    </form>
  </div>
</template>
<style scoped lang="scss">
input[type="checkbox"] {
  accent-color: var(--primary-color);
}

</style>
<script setup lang="ts">
import type {StudentRegister} from "@/types";
import {setAuthCookie} from "~/helpers.client";

const password1 = ref('')
const password2 = ref('')

const details = reactive<StudentRegister>({
  name: '',
  email: '',
  password: '',
  contact: '',
  reg_no: ''
})


async function signup() {
  console.log(details)
  if (password1.value !== password2.value) return alert('passwords do not match')

  details.password = password2.value

  const response = await useFetch('/api/auth/register', {
    method: 'POST',
    body: details
  }).then(
      (res) => res.data.value ?? null
  ).catch(
      (err) => {
        alert("An error occurred")
        console.log(err)
        return null;
      }
  )

  if (!response) return alert("Fatal: Fetch Failed")

  if (response.statusCode !== 200) return alert(response.body)

  await setAuthCookie(response.body)

  await navigateTo("/")

  console.log(response)
}

onMounted(() => {
  const showHiddenPass = (loginPass: string, loginEye: string) => {
    const input = document.getElementById(loginPass) as any,
        iconEye = document.getElementById(loginEye)

    iconEye?.addEventListener('click', () => {
      if (!input) return;

      if (input.type === 'password') {
        input.type = 'text'
        iconEye.classList.add('ri-eye-line')
        iconEye.classList.remove('ri-eye-off-line')
      } else {
        input.type = 'password'
        iconEye.classList.remove('ri-eye-line')
        iconEye.classList.add('ri-eye-off-line')
      }
    })
  }

  showHiddenPass('login-pass', 'login-eye')
})
</script>