// U11 `DELETE /api/sessions/:id` の stub
// playground の server は auto-import に頼らず明示 import する（`.nuxt/tsconfig.json` 1本で型を見るため）
import { defineEventHandler, getRouterParam, setResponseStatus } from 'h3'

import { deleteSession } from '../../../utils/stub'

export default defineEventHandler((event) => {
  deleteSession(getRouterParam(event, 'id') ?? '')
  setResponseStatus(event, 204)
  return null
})
