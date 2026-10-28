import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vitest/config';

export default defineConfig({
  // runtime は Nuxt の `#imports` から `$fetch` / `useRuntimeConfig` を引く。Nuxt を立てずに
  // 単体テストを回すため、`#imports` を `test/stubs/imports.ts` に向ける。
  // `$fetch` はそこで `ofetch` から再 export しており、テストは `vi.mock('ofetch')` で差し替える
  resolve: {
    alias: {
      '#imports': fileURLToPath(new URL('./test/stubs/imports.ts', import.meta.url)),
    },
  },
  test: {
    // 既定は Node 環境。テストは `test/` にまとめ、ソースの構造をそのまま写した位置に置く
    // （`src/runtime/waiting/useWaitingRetry.ts` ↔ `test/src/runtime/waiting/useWaitingRetry.test.ts`）
    include: ['test/**/*.test.ts'],
    exclude: ['**/node_modules/**'],
  },
});
