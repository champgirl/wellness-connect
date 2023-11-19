<template>
  <Title>Reset Password</Title>
  <form>
    <div class="form-input">
      <label for="password">Password</label>
      <input type="password" id="password1" placeholder="🤐" v-model="password1"/>
    </div>
    <div class="form-input">
      <label for="password">Password Again</label>
      <input type="password" id="password2" placeholder="🙄" v-model="password2"/>
      <small class="help warning">Passwords do not match</small>
    </div>
    <div class="form-buttons">
      <button type="button" @click="submit">Sign Up</button>
    </div>
  </form>
</template>
<script setup lang="ts">
import {type APIResponse, type UserCookie, type UserState, userEnum} from '~/types';

const bearer = useCookie<UserCookie>('bearer')

const password1 = ref('');
const password2 = ref('');
const route = useRoute()

const parameters = route.params.token
const [email, token, who] = parameters.toString().split('&')

async function submit() {
  if (password2.value === '' || password1.value === '') {
    alert('Please fill in all fields');
    return;
  }

  const data = {
    password: password2.value,
    token: token,
    empsu: email,
    who: who as userEnum
  }

  const {data: res} = await useFetch('/api/auth/update', {
    method: 'POST',
    body: data
  })

  const response = res.value as APIResponse

  if (response.statusCode === 200) {
    const userState = response.body as UserState

    if (userState.token) bearer.value = {bearer: userState.token}
    window.location.href = '/'
  } else {
    alert(response.body)
    window.location.reload()
  }
}

watch([password1, password2], () => {
  if (password2.value && password1.value !== password2.value) {
    document.querySelector('.warning')?.classList.add('show')
  } else {
    document.querySelector('.warning')?.classList.remove('show')
  }
})
</script>
<style lang="scss" scoped>
form {
  height: 400px;
  width: 500px;
  max-width: 90%;
  max-height: 90%;
  margin: auto;

  small {
    font-size: 0.8rem;
    color: #666;

    a {
      color: var(--accent);
      text-decoration: underline;

      &:hover {
        color: var(--primary);
      }
    }
  }

  .form-input {
    display: flex;
    flex-direction: column;
    margin: 1rem 0;

    label {
      font-size: 1.1rem;
      margin-bottom: 0.5rem;
    }

    input {
      padding: 0.5rem;
      font-size: 1rem;
      border: 1px solid #ccc;

      &:focus {
        outline: none;
        border: 1px solid var(--accent);
      }
    }

    small {
      align-self: flex-end;
    }

    .warning {
      color: red;
      font-size: 0.8rem;
      opacity: 0;

      &.show {
        opacity: 1;
      }
    }
  }

  .form-buttons {
    display: flex;
    justify-content: space-between;
    margin-top: 1rem;

    button {
      padding: 0.5rem 1rem;
      border: none;
      background-color: var(--accent);
      color: var(--cooler-white);
      font-size: 1.2rem;
      cursor: pointer;

      &:hover {
        background-color: var(--primary);
      }
    }
  }
}
</style>