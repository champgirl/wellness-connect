<template>
  <Title>JPT | Chat</Title>
  <component is="style">
    .footer{
    display: none
    }
  </component>
  <div class="my-container">
    <div class="main-column" ref="mainColumn">
      <div class="completion">
        <div v-for="(message, index) in prompt.messages" :key="index">
          <div v-if="message.role === 'user'"
               class="message user-message">
            <NuxtMarkdown :markdownText="message.content as string"/>
          </div>
          <div v-else-if="message.role === 'assistant'"
               class="message assistant-message">
            <NuxtMarkdown :markdownText="message.content as string"/>
          </div>
        </div>
        <div class="message assistant-message" v-if="processing && completion !== ''">
          <NuxtMarkdown :markdownText="completion"/>
        </div>
        <div class="message assistant-message" v-if="loading || (processing && completion === '')">
          <div class="loading-dot-ul-animation-container">
            <ul class="loading-dot-animation">
              <li class="dot"></li>
              <li class="dot"></li>
              <li class="dot"></li>
            </ul>
          </div>
        </div>
      </div>

      <div class="query">
        <div class="field">
          <div class="relative is-flex is-align-items-center">
            <button class="button clear-button is-info mr-2"
                    @click="clearChats">Clear
            </button>
            <textarea class="my-textarea" type="text" placeholder="Type your message here..."
                      v-model="textInput">
            </textarea>

            <button class="button is-success ml-2" :class="{ 'is-loading': loading, 'is-success': processing }"
                    @click="getChatCompletion" id="sendCompletionRequest">Send
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import type {HttpResponse} from "@/types";
import {userEnum} from "@/types";
import {userIsAuthenticated} from "~/helpers.client";

const mainColumn = ref<HTMLElement | null>(null)

const completion = ref('')
const textInput = ref('')

const loading = ref(false)
const processing = ref(false)

const route = useRoute()
const user = useUser()

if (!userIsAuthenticated()) await navigateTo(`/login?redirect=${route.path}&user=${userEnum.STUDENT}`)

type message = {
  role: 'user' | 'assistant'
  content: string
}

const prompt = reactive({
  messages: [] as message[]
})

async function fetchMessages() {
  prompt.messages = await useFetch('/api/chat/get').then(res => {
    if (!res) return []
    if (!res.data.value) return []
    console.log(res.data.value)
    if (res.data.value.statusCode === 200) return JSON.parse(res.data.value.body?.chats || '[]')
    else return []
  }).catch(err => {
    console.error(err)
    return []
  })
}

fetchMessages()

const decoder = new TextDecoder()

async function readStream(reader: ReadableStreamDefaultReader, callback: Function | null = null) {
  const {done, value} = await reader.read()

  if (done) return

  const text = decoder.decode(value)

  if (callback) callback(text)

  await readStream(reader, callback)
}


async function getChatCompletion() {
  loading.value = true;

  prompt.messages.push({
    role: 'user',
    content: textInput.value
  })

  await new Promise(async (resolve, reject) => {
    const response = await $fetch('/api/chat/gpt', {
      method: 'POST',
      body: JSON.stringify({
        messages: prompt.messages
      }),
      responseType: 'stream'
    }).catch(err => {
      console.error(err)
      return ''
    })

    const streamReader = await response.getReader()
    let res: HttpResponse[]

    if (streamReader) {
      processing.value = true
      loading.value = false

      scrollChatBottom()

      textInput.value = ''
      completion.value = ''
    }

    await readStream(streamReader, (text: string) => {
      try {
        const data = text
            .replace(/\n/g, '')
            .replace(/}{/g, '}\n{')
            .split('\n')
            .filter(line => line !== '')
        res = data.map(line => JSON.parse(line))
        for (const response of res) {
          if (response.statusCode === 201) {
            completion.value += response.body
          } else if (response.statusCode === 500) {
            alert('Error from server')
            console.error(response.body)
            reject(response.body)
          }
        }
      } catch (error) {
        console.error("Error parsing JSON:", error);
        console.log(text);
      }

      scrollChatBottom()
    })

    resolve("ok")
  })

  processing.value = false

  const newMessage = {
    role: 'assistant',
    content: completion.value
  } as message

  prompt.messages.push(newMessage)

  await $fetch('/api/chat/store', {
    method: 'POST',
    body: JSON.stringify({
      messages: prompt.messages,
      studentId: useUser().value?.id
    })
  })
}

function scrollChatBottom() {
  if (!mainColumn.value) return
  mainColumn.value.scrollTop = mainColumn.value.scrollHeight
}

async function clearChats() {
  const response = await $fetch('/api/chat/clear').then(
      res => {
        console.log(res)
        return res
      })

  if (response.statusCode === 200) {
    prompt.messages = []
  }
}

onMounted(() => {
  const sendButton = document.getElementById('sendCompletionRequest')
  const textArea = document.querySelector('.my-textarea')

  // @ts-ignore
  textArea?.addEventListener('keydown', (e: any) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendButton?.click()
    }
  })

  scrollChatBottom()

  if (prompt.messages.length === 0) {
    fetchMessages()
  }
})
</script>
<style scoped lang="scss">
.my-container {
  overflow-y: hidden;
  background-image: url("/images/chat.jpg");
  background-repeat: no-repeat;
  background-size: cover;


  .main-column {
    max-height: 85vh;
    overflow-y: scroll;
    margin-bottom: 5rem;

    .completion {
      width: 60%;
      margin: auto;
      margin-top: 1rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;

      .message {
        padding: 1rem;
        color: black;

        &.assistant-message {
          background: rgba(127, 143, 182, 0.7);

          @keyframes loading-dot-animation {
            0% {
              transform: scale(0.5);
            }

            50% {
              transform: scale(1);
            }

            100% {
              transform: scale(0.5);
            }
          }

          .loading-dot-ul-animation-container {
            display: flex;
            flex-direction: row;
            align-items: center;
          }

          .loading-dot-animation {
            display: flex;
            align-items: center;
            margin-left: 0.5em;

            .dot {
              display: inline-block;
              width: 1em;
              height: 1em;
              border-radius: 50%;
              background-color: #1d202c;
              animation: loading-dot-animation 1s infinite ease-in-out;
              margin-right: 0.5em;

              &:nth-child(1) {
                animation-delay: 0s;
              }

              &:nth-child(2) {
                animation-delay: 0.2s;
              }

              &:nth-child(3) {
                animation-delay: 0.4s;
              }
            }
          }
        }

        &.user-message {
          background-color: rgba(119, 119, 119, 0.7);
        }
      }
    }

    .query {
      position: fixed;
      bottom: 0;
      width: 50%;
      transform: translateX(50%);
      right: 50%;

      .field {
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;

        .my-textarea {
          height: 3rem;
          padding: 0.25em;
          resize: none;
          max-width: 80vw;
          max-width: 80dvw;
          width: 500px;
          margin: 0;
          font-family: 'Roboto Mono', monospace;
          font-size: 0.9em;
          border-radius: 5px;
          padding-left: 0.5em;
          padding-top: 0.5em;

          &:focus {
            outline: none;
          }
        }

        .button {
          height: 2.7rem;

          &:hover {
            cursor: pointer;
            opacity: 1;
            color: hsl(0, 0%, 0%, 0.8);
          }

          &.is-success {
            background-color: var(--accent);
            color: white;
          }

          &.is-loading {
            background-color: #1d202c;
            color: white;
            cursor: not-allowed;
            pointer-events: none;
          }
        }
      }
    }
  }
}
</style>