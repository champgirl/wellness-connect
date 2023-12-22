<template>
   <div class="login register">
      <img src="/images/login-bg-4.svg" alt="login image" class="login__img">

      <form class="login__form" @submit.prevent="signup">
         <h1 class="login__title">Counselor Register</h1>

         <div class="login__content">
            <div class="login__box">
               <i class="ri-user-3-line login__icon"></i>

               <div class="login__box-input">
                  <input type="text" required class="login__input" id="name" placeholder=" " v-model="details.name">
                  <label for="login-email" class="login__label">Name</label>
               </div>
            </div>

            <div class="login__box">
               <i class="ri-user-3-line login__icon"></i>

               <div class="login__box-input">
                  <input type="email" required class="login__input" id="login-email" placeholder=" "
                     v-model="details.email">
                  <label for="login-email" class="login__label">Email</label>
               </div>
            </div>

            <div class="login__box">
               <i class="ri-user-3-line login__icon"></i>

               <div class="login__box-input">
                  <input type="tel" required class="login__input" id="login-contact" placeholder=" "
                     v-model="details.contact">
                  <label for="login-contact" class="login__label">Contact</label>
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
         </div>

         <button type="submit" class="login__button">Sign Up</button>
      </form>
   </div>
</template>
<script setup lang="ts">
import type { CounselorRegister } from "@/types";

const password1 = ref('')
const password2 = ref('')

const route = useRoute()
const redirectTo = route.query.redirect ?? null

const details = reactive<CounselorRegister>({
   name: '',
   email: '',
   password: '',
   contact: ''
})


async function signup() {
   if (password1.value !== password2.value) return alert('passwords do not match')

   details.password = password2.value

   const response = await useFetch('/api/auth/register', {
     method: 'POST',
     body: details
   })
   .then(
      (res) => res.data.value ?? null
   ).catch(
      (err) => {
         alert("An error occurred")
         console.log(err)
         return null;
      }
   )

   if (!response) return alert("Fatal: Fetch Failed")

  await navigateTo('/login?user=counselor')
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