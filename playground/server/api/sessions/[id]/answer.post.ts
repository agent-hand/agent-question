// U7 `POST /api/sessions/:id/answer` の stub。受理のみ。AI は起動しない
// playground の server は auto-import に頼らず明示 import する（`.nuxt/tsconfig.json` 1本で型を見るため）
import { defineEventHandler, getRouterParam, readBody, setResponseStatus } from 'h3'

import { sessionOf } from '../../../utils/stub'

export default defineEventHandler(async (event) => {
  const state = sessionOf(getRouterParam(event, 'id') ?? '')
  const body = await readBody<{ kind: 'option' | 'free', value: string }>(event)
  state.answers.push(body)
  setResponseStatus(event, 204)
  return null
})
