<script setup lang="ts">
import { userIsAdmin } from "~/helpers.client";
if (!(await userIsAdmin())) await navigateTo(`/login`)

const messages = ref([])
const route = useRoute()
const id = route.params.id as string

async function fetchMessages() {
  messages.value = await useFetch('/api/chat/get/' + id + '/').then(res => {
    if (!res) return []
        if (!res.data.value) return []
    console.log()
    if (res.data.value.statusCode === 200) return JSON.parse(res.data.value.body[0].chats|| '[]')

    else return []
  }).catch(err => {
    console.error(err)
    return []
  })
}

fetchMessages()

</script>

<template>
    <div class="my-container">
        <div class="back">
            <NuxtLink to="/flagged">View Student Details</NuxtLink>
        </div>
        <div class="main-column" ref="mainColumn">
            <div class="completion">
                <div v-for="(message, index) in messages" :key="index">
                    <div v-if="message.role === 'user'" class="message user-message">
                        <NuxtMarkdown :markdownText="message.content as string" />
                    </div>
                    <div v-else-if="message.role === 'assistant'" class="message assistant-message">
                        <NuxtMarkdown :markdownText="message.content as string" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="scss">
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