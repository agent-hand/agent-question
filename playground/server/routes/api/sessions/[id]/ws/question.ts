// W1 `/api/sessions/:id/ws/question` の stub。接続時に現在の1問を流し、以後は `invoke` が配信する。
// crossws の peer はルートパラメータを持たないので、セッション id は URL から読む
// playground の server は auto-import に頼らず明示 import する（`.nuxt/tsconfig.json` 1本で型を見るため）
import { defineWebSocketHandler } from 'h3'

import { sessionOf } from '../../../../../utils/stub'

export default defineWebSocketHandler({
  open(peer) {
    const id = sessionIdOf(peer.request.url)
    if (!id) {
      peer.close()
      return
    }
    const state = sessionOf(id)
    state.peers.add(peer)
    if (state.question) peer.send(JSON.stringify(state.question))
  },
  close(peer) {
    const id = sessionIdOf(peer.request.url)
    if (id) sessionOf(id).peers.delete(peer)
  },
})

function sessionIdOf(url: string): string | null {
  const match = /\/api\/sessions\/([^/]+)\/ws\/question/.exec(new URL(url).pathname)
  return match?.[1] ?? null
}
