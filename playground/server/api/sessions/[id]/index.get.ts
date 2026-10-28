// U2 `GET /api/sessions/:id` の stub。module が読むのは `invocation` だけ
// playground の server は auto-import に頼らず明示 import する（`.nuxt/tsconfig.json` 1本で型を見るため）
import { defineEventHandler, getRouterParam } from 'h3'

import { sessionOf } from '../../../utils/stub'

export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id') ?? ''
  const state = sessionOf(id)
  return { phase: 'stroking', invocation: state.invocation, path: `/tmp/${id}` }
})
