// U13 `GET /api/sessions/:id/invoke-agent` の stub。冪等。走っていればそのまま
// playground の server は auto-import に頼らず明示 import する（`.nuxt/tsconfig.json` 1本で型を見るため）
import { defineEventHandler, getRouterParam, setResponseStatus } from 'h3'

import { invoke } from '../../../utils/stub'

export default defineEventHandler((event) => {
  invoke(getRouterParam(event, 'id') ?? '')
  setResponseStatus(event, 204)
  return null
})
