<template>
   <Title>Login</Title>
   <div>
      <component :is="who === user.COUNSELOR ? counselorRegister : studentRegister"></component>
   </div>
</template>
<script setup lang="ts">
import { user } from '@/types';
const counselorRegister = resolveComponent('CounselorRegister')
const studentRegister = resolveComponent('StudentRegister')

const route = useRoute();
const who = ref(route.query.user);

onBeforeRouteUpdate(
   (newRoute) => {
      who.value = newRoute.query.user
   })
</script>

<style lang="scss">
.login {
   position: relative;
   height: 100vh;
   display: grid;
   align-items: center;
   margin-top: -50px;

   &__img {
      position: absolute;
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: 30vw -15vh;
   }

   &__form {
      position: relative;
      background-color: hsla(223, 35%, 44%, 0.5);
      border: 2px solid var(--white-color);
      margin-inline: 1.5rem;
      padding: 2.5rem 1.5rem;
      border-radius: 1rem;
      backdrop-filter: blur(8px);
   }

   &__title {
      text-align: center;
      font-size: var(--h1-font-size);
      font-weight: var(--font-medium);
      margin-bottom: 2rem;
      color: var(--white-color);
   }

   &__content,
   &__box {
      display: grid;
   }

   &__content {
      row-gap: 1.75rem;
      margin-bottom: 1.5rem;
   }

   &__box {
      grid-template-columns: max-content 1fr;
      align-items: center;
      column-gap: .75rem;
      border-bottom: 2px solid var(--white-color);
   }

   &__icon,
   &__eye {
      font-size: 1.25rem;
      color: white;
      background-color: white;
   }

   &__input {
      width: 100%;
      padding-block: .8rem;
      background: none;
      color: var(--white-color);
      position: relative;
      z-index: 1;
   }

   &__box-input {
      position: relative;
   }

   &__label {
      position: absolute;
      left: 0;
      top: 13px;
      font-weight: var(--font-medium);
      transition: top .3s, font-size .3s;
      color: var(--white-color);
      font-size: medium;
      font-family: 'Rubik', sans-serif;
   }

   &__eye {
      position: absolute;
      right: 0;
      top: 18px;
      z-index: 10;
      cursor: pointer;
   }

   &__box:nth-child(2) input {
      padding-right: 1.8rem;
   }

   &__check,
   &__check-group {
      display: flex;
      align-items: center;
      justify-content: space-between;
   }

   &__check {
      margin-bottom: 1.5rem;
   }

   &__check-label,
   &__forgot,
   &__register {
      font-size: var(--small-font-size);
      font-family: 'Rubik', sans-serif;
      color: var(--white-color);
   }

   &__check-group {
      column-gap: .5rem;
   }

   &__check-input {
      width: 16px;
      height: 16px;
   }

   &__forgot {
      color: var(--accent);

      &:hover {
         text-decoration: underline;
      }
   }

   &__button {
      width: 100%;
      padding: 1rem;
      border-radius: .5rem;
      background-color: var(--white-color);
      font-weight: var(--font-medium);
      cursor: pointer;
      margin-bottom: 2rem;
      color: var(--primary);

      &:hover {
         background-color: hsl(223, 35%, 60%);
         color: var(--white-color);
      }
   }

   &__register {
      text-align: center;

      & a {
         color: var(--accent);
         font-weight: var(--font-medium);

         &:hover {
            text-decoration: underline;
         }
      }
   }
}

/* Input focus move up label */
.login__input:focus+.login__label {
   top: -12px;
   font-size: var(--small-font-size);
}

/* Input focus sticky top label */
.login__input:not(:placeholder-shown).login__input:not(:focus)+.login__label {
   top: -12px;
   font-size: var(--small-font-size);
}

@media screen and (min-width: 576px) {
   .login {
      justify-content: center;

      &__form {
         width: 432px;
         padding: 4rem 3rem 3.5rem;
         border-radius: 1.5rem;
      }

      &__title {
         font-size: 2rem;
         font-family: 'Rubik', sans-serif;
      }
   }
}
</style>