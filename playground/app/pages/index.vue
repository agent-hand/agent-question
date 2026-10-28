<script setup lang="ts">
/**
 * agent-question の playground。stroke-board の画面1 と同じ形で面を素置きし、
 * 問いが届いて示され、回答が送られ、次が返るまで待機が示されることを確かめる。
 * サーバは `server/` の stub で、台本の3問を順に返す。
 */
import { useAgentQuestion } from '#agent-question/exchange/useAgentQuestion';
import AgentQuestion from '#agent-question/view/AgentQuestion.vue';

const { question, waiting, failed, errored, error, answered, send } = useAgentQuestion('demo');
</script>

<template>
  <div class="mx-auto max-w-2xl px-6 pt-14 pb-40">
    <h1 class="mb-6 text-xl font-semibold">agent-question playground</h1>

    <p v-if="error" class="mb-4 text-sm text-error">{{ error.title }}: {{ error.message }}</p>
    <p v-if="failed" class="mb-4 text-sm text-error">AI から応答が得られませんでした</p>
    <p v-if="errored" class="mb-4 text-sm text-error">終端に達しました</p>

    <AgentQuestion
      v-if="(waiting || question) && !errored"
      :question="question"
      :waiting="waiting"
      waiting-message="AI が次を考えています…"
      :answered="answered"
      submit-label="送信"
      @answer="send"
    />
    <p v-else class="text-sm text-muted">問いは尽きました。ここまで {{ answered }} 問に回答。</p>
  </div>
</template>
