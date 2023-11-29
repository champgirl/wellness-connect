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
    <div id="open-modal" class="modal-window">
      <div>
        <a href="#" title="Close" class="modal-close"></a>
        <h1>Voilà!</h1>
        <div>
          <p>Welcome, You will use this anonymous pseudonym to log in to your account <b><span
              id="pseudonym"></span></b></p>
          <div class="buttons mt-4">
            <span class="mr-1 hidden" id="copy-success">Copied!</span>
            <button @click="copyName" class="btn">Copy</button>
            <button @click="proceed" class="btn ml-4">Proceed</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
input[type="checkbox"] {
  accent-color: var(--primary-color);
}

.hidden {
  display: none;
}

#pseudonym {
  color: #00e7eb;
  font-size: large;
}

#pseudonym:before {
  content: "`";
}

#pseudonym:after {
  content: "`";
}

.modal-window {
  position: absolute;
  background-color: rgba(255, 255, 255, 0.25);
  top: -200px;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 999;
  visibility: hidden;
  opacity: 0;
  pointer-events: none;
  transition: all 0.3s;

  &:target {
    visibility: visible;
    opacity: 1;
    pointer-events: auto;
  }

  & > div {
    width: 400px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 2em;
    background: var(--primary);
  }

  header {
    font-weight: bold;
  }

  h1 {
    font-size: 150%;
    margin: 0 0 0.2em;
  }
}

.modal-close {
  color: var(--accent);
  line-height: 50px;
  font-size: 80%;
  position: absolute;
  right: 4px;
  text-align: center;
  top: 5px;
  width: 70px;
  text-decoration: none;

  &:hover {
    color: black;
  }
}

.modal-window {
  & > div {
    border-radius: 1rem;
  }
}

.modal-window div:not(:last-of-type) {
  margin-bottom: 15px;
}

.logo {
  max-width: 150px;
  display: block;
}

small {
  color: black;
}

.buttons {
  display: flex;
  justify-content: right;
  align-items: center;
}

.btn {
  background-color: white;
  padding: 0.8em 1em;
  border-radius: 0.2rem;
  text-decoration: none;

  i {
    padding-right: 0.3em;
  }
}
</style>
<script setup lang="ts">
import type {StudentRegister} from "@/types";
import {setAuthCookie} from "~/helpers.client";

const password1 = ref('')
const password2 = ref('')

const route = useRoute()
const redirectTo = route.query.redirect ?? null

const details = reactive<StudentRegister>({
  name: '',
  email: '',
  password: '',
  contact: '',
  reg_no: ''
})

function copyName() {
  const nameHolder = document.getElementById('pseudonym')
  const name = nameHolder!.innerText

  navigator.clipboard.writeText(name)

  const copySuccess = document.getElementById('copy-success')
  copySuccess!.classList.remove('hidden')
  setTimeout(() => {
    copySuccess!.classList.add('hidden')
  }, 1000)
}

async function proceed() {
  if(redirectTo) return navigateTo(decodeURI(redirectTo as string))

  await navigateTo("/")
}


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

  setAuthCookie(response.body)

  const name = response.body.name

  if (process.client) {
    const nameHolder = document.getElementById('pseudonym')
    nameHolder!.innerText = name


    const modal_show = document.createElement('a')
    modal_show.setAttribute('href', '#open-modal')
    modal_show.setAttribute('class', 'modal-trigger')
    modal_show.setAttribute('data-target', 'modal1')
    modal_show.innerHTML = name
    modal_show.click()
    modal_show.remove()
  }
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