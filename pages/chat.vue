<template>
  <Title>JPT | Chat</Title>
  <div class="container">
    <div class="main-column">
      <div class="completion">
        <div v-for="(message, index) in prompt.messages" :key="index">
          <div v-if="message.role === 'system'" class="message system-message">
            <p>{{ message.content }}</p>
          </div>
          <div v-else-if="message.role === 'user'"
               class="message user-message">
            <p>{{ message.content }}</p>
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
          <div>
                        <textarea class="textarea" type="text" placeholder="Type your message here..."
                                  v-model="textInput"></textarea>
            <button class="button is-success" :class="{ 'is-loading': loading, 'is-success': processing }"
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

const completion = ref('')
const textInput = ref('')

const loading = ref(false)
const processing = ref(false)

type message = {
  role: 'user' | 'assistant'
  content: string
}

const prompt = reactive({
  messages: [] as message[]
})

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
  await new Promise(async (resolve, reject) => {
    const response = await $fetch('/api/chat/gpt', {
      method: 'POST',
      body: JSON.stringify({
        text: textInput.value ?? ''
      }),
      responseType: 'stream'
    }).catch(err => {
      console.error(err)
      return ''
    })

    const streamReader = await response.getReader()
    let res: HttpResponse[]

    if (streamReader){
      processing.value = true
      loading.value = false

      prompt.messages.push({
        role: 'user',
        content: textInput.value
      })

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
            alert('Error fetching summaries')
            reject(response.body)
          }
        }
      } catch (error) {
        console.error("Error parsing JSON:", error);
        console.log(text);
      }
    })

    resolve("ok")
  })

  processing.value = false

  prompt.messages.push({
    role: 'assistant',
    content: completion.value
  })
}


onMounted(() => {
  const sendButton = document.getElementById('sendCompletionRequest')
  const textArea = document.querySelector('.textarea')

  // @ts-ignore
  textArea?.addEventListener('keydown', (e: any) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendButton?.click()
    }
  })
})
</script>
<style scoped lang="scss">
.main-column {
  margin: 0 auto;
  height: 85vh;
  height: 85dvh;
  font-size: 0.9em;
  display: flex;
  flex-direction: column;

  @media screen and (max-width: 768px) {
    width: 100vw;
  }

  @media screen and (min-width: 1280px) {
    width: 700px;
  }

  .query {
    position: fixed;
    height: 5ch;
    left: 0;
    width: 100%;
    bottom: 1vh;

    .field {
      width: 100%;

      div {
        display: flex;
        flex-direction: row;
        align-items: center;
        position: relative;

        .textarea {
          min-height: unset;
          min-width: unset;
          max-width: 80vw;
          max-width: 80dvw;
          width: 500px;
          overflow: hidden;
          resize: none;
          height: fit-content;
          margin: auto;
          font-family: 'Roboto Mono', monospace;
          font-size: 0.9em;
          border-radius: 5px;
          padding-left: 0.5em;
          padding-top: 0.5em;
          margin-top: -20px;
        }

        .button {
          border: none;
          position: absolute;
          left: calc(50vw + 250px);
          margin-top: 0.6px;
          background-color: transparent;
          color: hsl(0, 0%, 0%, 0.5);
          transform: translateX(-120%);
          opacity: 0.5;
          margin-top: -20px;

          &:hover {
            cursor: pointer;
            opacity: 1;
            color: hsl(0, 0%, 0%, 0.8);
          }

          &.is-success {
            background-color: #85b690;
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

  .completion {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    width: 500px;
    max-width: 90vw;
    margin: 0.5em auto;

    .message {
      margin-bottom: 0.5em;
      padding: 0.5em;

      &.user-message {
        background-color: #1c1f42;
        color: white;
        border-radius: 5px 5px 5px 0;
      }

      &.assistant-message {
        background-color: #85b4b6;
        color: black;
        border-radius: 5px 5px 0 5px;

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

      &.system-message {
        background-color: var(--accent);
        border-radius: 5px 5px 5px 5px;
      }
    }
  }
}

.code-container {
  position: relative;
  padding: 0.5em 1em;
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
    padding: 0.5rem;
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
</style>