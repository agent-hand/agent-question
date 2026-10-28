# agent-question

AI の問いを画面に出して回答を返す機構（問いを出す面と問いの往復）を提供する Nuxt module。
package 名は `@agent-hand/agent-question`、module 名は `agent-question`、`configKey` は `agentQuestion`。

## 設置

`nuxt.config.ts` の `modules` には `@agent-hand/agent-question` を `@nuxt/ui` の後ろに並べる。設定は書かなくてよい（既定の接続先は `/api/sessions`）。

```ts
export default defineNuxtConfig({
  modules: ['@nuxt/ui', '@agent-hand/agent-question'],
});
```

`main.css` には `@import "@nuxt/ui";` の後に1行足す。

```css
@import "tailwindcss";
@import "@nuxt/ui";
@import "@agent-hand/agent-question";
```

接続先を変えるときは `agentQuestion.apiBase` を書く。問いの受信・回答の送信・待機中の確認のすべてがその先へ向く。

```ts
export default defineNuxtConfig({
  agentQuestion: { apiBase: '/api/sessions' },
});
```

## 公開するもの

`#agent-question/<path>` の明示 import で引く。auto-import には載せない。

| path | 何か |
| --- | --- |
| `#agent-question/view/AgentQuestion.vue` | 問いを出す面。props: `question` / `waiting` / `waitingMessage` / `answered` / `submitLabel`、emit: `answer` |
| `#agent-question/exchange/useAgentQuestion` | 問いの往復。`useAgentQuestion(sessionId)` |
| `#agent-question/waiting/useWaitingRetry` | 起動要求・待機・終端からの再実行と削除 |
| `#agent-question/waiting/WaitingIndicator.vue` | 待機の表示（点滅） |
| `#agent-question/channel/useSessionChannel` | セッションの WS チャンネルの購読 |
| `#agent-question/types` | `Question` / `QuestionOption` / `Answer` / `Invocation` |

型は Nuxt の外（Nitro・vitest・tsx など）からも package 名で引ける。

```ts
import type { Question, Answer } from '@agent-hand/agent-question/types';
```

振る舞いの規定は `openspec/specs/agent-question/spec.md`。

## 開発

```sh
yarn install
yarn dev:prepare # clone 直後に1回。型と playground の .nuxt を作る
yarn dev        # playground を起動する（stub サーバ付き）
yarn build      # dist/ を作る
yarn test
```

## 由来

このリポジトリの履歴は切り出し時点から始まる。移す前の経緯は stroke-board（change `create-module-agent-question`）の次の commit にある。hash は stroke-board の `develop` で `git show` できる。

| 写し元（stroke-board） | 写し先 | 由来 commit |
| --- | --- | --- |
| `app/components/AgentQuestion.vue` | `src/runtime/view/AgentQuestion.vue` | `c79d4db5` 2026-09-02 style: ストロークの様式に定義を与える / `63cd6504` 2026-08-25 自前実装をライブラリへ置き換え、markdown を1方式に統一する（この commit で `stroke/QuestionCard.vue` と `AgentQuestionModal.vue` を 1 本に畳んだ） |
| `app/composables/useAgentQuestion.ts` | `src/runtime/exchange/useAgentQuestion.ts` | `0a4ae731` 2026-09-09 / `3876bf03` 2026-08-30 / `63cd6504` 2026-08-25 / `ccfb65bd` 2026-08-25 / `d5aaf7a5` 2026-08-24 問いの往復を agent-question として切り出し、関連する change を archive する |
| `app/composables/useWaitingRetry.ts` | `src/runtime/waiting/useWaitingRetry.ts` | `4d5b23cd` 2026-09-10 / `cdafb3b0` 2026-09-09 / `07dc1d60` 2026-09-10 / `0a4ae731` 2026-09-09 / `3876bf03` 2026-08-30 / `f1abe8a6` 2026-08-30 / `63cd6504` 2026-08-25 / `ccfb65bd` 2026-08-25 / `a7a29f6f` 2026-08-22 / `658c558e` 2026-08-19 |
| `app/composables/useSessionChannel.ts` | `src/runtime/channel/useSessionChannel.ts` | `0a4ae731` 2026-09-09 / `63cd6504` 2026-08-25 |
| `app/components/WaitingIndicator.vue` | `src/runtime/waiting/WaitingIndicator.vue` | `cb094e48` 2026-09-04 / `31131e4d` 2026-08-19 初期コミット |
| `shared/stroke.ts`（型 `Question` / `QuestionOption` / `Answer` / `Invocation`） | `src/runtime/types.ts` | 上の5ファイルと同じ change で移した |
| `app/assets/css/main.css`（`.sb-stroke-card` / `.sb-stroke-blink`） | `src/runtime/assets/agent-question.css`（`.agent-question-card` / `.agent-question-blink`） | `c79d4db5` 2026-09-02 style: ストロークの様式に定義を与える（`.sb-stroke-card` を定義） / `cb094e48` 2026-09-04 style: stroke.css を main.css のストロークの区画へ畳む（`.sb-stroke-blink` を `main.css` へ） |

切り出し元の commit: stroke-board ブランチ `create-module-agent-question` の `fb5b0e07`（2026-10-28）。
