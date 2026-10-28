import { createResolver, defineNuxtModule } from '@nuxt/kit';
import { defu } from 'defu';

/**
 * agent-question が受け取る設定。`nuxt.config.ts` の `agentQuestion` キーで書く。
 * 置く側が1つも書かなくても既定値で動く（`openspec/specs/agent-question`「設定を1つも書かずに使える」）。
 */
export interface ModuleOptions {
  /**
   * 往復の接続先。セッション API の基底 path。
   *
   * W1 `${apiBase}/:id/ws/question`・U7 `POST ${apiBase}/:id/answer`・U13 `GET ${apiBase}/:id/invoke-agent`・
   * U2 `GET ${apiBase}/:id`・U11 `DELETE ${apiBase}/:id` の5本がすべてここから組み立てられる。
   * 一部だけが元の先に残ることは無い（`openspec/specs/agent-question`「往復の接続先は機構が既定で持つ」）。
   */
  apiBase?: string;
}

/**
 * AI の問いを画面に出して回答を返す機構を閉じるモジュール。
 *
 * 公開するのは、問いを出す面（`view/AgentQuestion.vue`）・問いの往復（`exchange/useAgentQuestion`）・
 * 待機（`waiting/useWaitingRetry`・`waiting/WaitingIndicator.vue`）・購読（`channel/useSessionChannel`）・
 * 型（`types`）。外は `#agent-question/<path>` の明示 import で引く。`addComponent` / `addImports` による
 * auto-import の登録は行わない（stroke-board `openspec/specs/app-structure`「モジュールの参照は明示 import で行う」）。
 *
 * 利用側は `nuxt.config.ts` の `modules` にこの package を明示して並べる。`@nuxt/ui` の部品を使う側なので、
 * `@nuxt/ui` の後ろに並べる。
 *
 * **面の見た目の CSS はここでは足さない。** 利用側が `main.css` に
 * `@import "@agent-hand/agent-question";` の1行を書いて取り込む（`package.json` の
 * `exports["."].style` → `runtime/index.css`）。Tailwind の走査（`@source`）もその CSS が持つ。
 * `nuxt.options.css` に push すると、`@import "tailwindcss"` を持つ利用側の `main.css` から
 * 走査されず、この package の `.vue` だけが使うクラスが生成されない。
 */
export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'agent-question',
    configKey: 'agentQuestion',
  },

  defaults: {
    apiBase: '/api/sessions',
  },

  setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url);

    // 外から引く口。`#agent-question` の1本だけを公開する。
    nuxt.options.alias['#agent-question'] = resolve('./runtime');

    // 接続先は runtime が `useRuntimeConfig().public.agentQuestion` で読む（`runtime/api-base.ts`）。
    // `defu` は先に入っている値を残すので、利用側が `runtimeConfig.public.agentQuestion` を直接
    // 書いていればそれが勝ち、無ければ `agentQuestion` キー（または既定値）が入る。
    // `options.apiBase` は `defaults` が必ず埋めるが、型は `ModuleOptions` の optional のままなので
    // string と明示する
    nuxt.options.runtimeConfig.public.agentQuestion = defu(
      nuxt.options.runtimeConfig.public.agentQuestion as Partial<ModuleOptions> | undefined,
      { apiBase: options.apiBase as string },
    );
  },
});
