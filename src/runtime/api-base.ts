// 往復の接続先（design D6）。W1・U7・U13・U2・U11 の5本はすべてここから組み立てる。
// 一部だけが元の先に残ることが無いように、path の基底を読む口はこの1本だけにする。
import { useRuntimeConfig } from '#imports'

/** `nuxt.config.ts` の `agentQuestion` で変えられる設定。既定値は `module.ts` が持つ */
export interface AgentQuestionPublicConfig {
  /** セッション API の基底。`/api/sessions` なら W1 は `/api/sessions/:id/ws/question` になる */
  apiBase: string
}

/** 1セッション分の基底。`${apiBase}/${sessionId}` */
export function sessionApiBase(sessionId: string): string {
  const { apiBase } = useRuntimeConfig().public.agentQuestion as AgentQuestionPublicConfig
  return `${apiBase}/${sessionId}`
}
