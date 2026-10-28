// `#imports` の代わり。runtime が Nuxt から引く2つだけを、Nuxt 無しで用意する。
//
// `$fetch` は `ofetch` のものをそのまま出す。Nuxt の `fetch.mjs` も `ofetch` の `$fetch` を
// 土台にしているので、テストが `vi.mock('ofetch')` で差し替えればここを通って効く。
export { $fetch } from 'ofetch'

/** module の既定値と同じ（`src/module.ts` の `defaults`） */
export function useRuntimeConfig() {
  return { public: { agentQuestion: { apiBase: '/api/sessions' } } }
}
