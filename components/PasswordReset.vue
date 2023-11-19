<script setup lang="ts">
import {type APIResponse, type PasswordResetRequest} from "~/types";

const email = ref('');
const loading = ref(false)

async function submit() {
  if (email.value === '') {
    alert('Please fill in all fields');
    return;
  }

  loading.value = true

  const data = {
    email: email.value,
    origin: window.location.origin,
    path: 'reset'
  } as PasswordResetRequest

  const {data: res} = await useFetch('/api/auth/reset', {
    method: 'POST',
    body: data
  })

  const response = res.value as APIResponse

  loading.value = false

  if (response.statusCode === 200) {
    alert(response.body)
    if (email.value.includes('gmail')) {
      window.open('https://mail.google.com/mail/u/0/#inbox')
    } else if (email.value.includes('outlook')) {
      window.open('https://outlook.live.com/mail/0/inbox')
    } else if (email.value.includes('yahoo')) {
      window.open('https://mail.yahoo.com/d/folders/1')
    } else if (email.value.includes('icloud')) {
      window.open('https://www.icloud.com/#mail')
    } else{
      window.open('https://www.google.com/search?q=' + email.value.split('@')[1] + ' email')
    }
    setTimeout(() => {
      window.close()
    }, 1000)
  } else {
    console.log(response)
    alert(response.body)
  }
}
</script>

<template>
  <form>
    <div class="form-input">
      <label for="email">Email</label>
      <input type="email" id="email" placeholder="🤕" v-model="email"/>
    </div>
    <div class="form-buttons">
      <button type="button" @click="submit">
        <span v-if="!loading">Send Password Reset Mail</span>
        <LoadingAnimation :width="30" :height="30" v-else/>
      </button>
    </div>
  </form>
</template>

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