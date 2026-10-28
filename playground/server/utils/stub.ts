// playground の stub サーバが持つセッションの状態。stroke-board のサーバの代わりに、
// module が頼る5本（W1 / U7 / U13 / U2 / U11）の最小の振る舞いだけを模す。
//
// - 接続時に現在の1問を配信する（W1）
// - 回答を受理する（U7）。起動はしない
// - 起動を要求されたら `running` になり、少し置いて次の問いを配信して `idle` に戻る（U13）
// - 問いが尽きたら、次は配信せず `idle` に戻る（面は閉じる）
import type { Peer } from 'crossws'

interface Question {
  header: string
  detail: string
  question: string
  options: { label: string, description: string, recommended?: boolean }[]
}

type Answer = { kind: 'option' | 'free', value: string }
type Invocation = 'running' | 'idle' | 'failed' | 'error'

interface SessionState {
  index: number
  question: Question | null
  invocation: Invocation
  answers: Answer[]
  peers: Set<Peer>
}

const SCRIPT: Question[] = [
  {
    header: '保存の方式',
    detail: 'ここまでに決まったこと: 設定はファイルに持つ。\n調べて分かった事実: 書き込みは1秒に数回程度で、同時書き込みは起きない。',
    question: '保存方式をどうするか',
    options: [
      { label: '同期で書く', description: '書き終わるまで待つ。実装が単純で、失敗がその場で分かる', recommended: true },
      { label: '非同期で書く', description: '待たずに次へ進む。失敗の通知を別に用意する必要がある' },
    ],
  },
  {
    header: '失敗の扱い',
    detail: '同期で書くと決まった。',
    question: '書き込みに失敗したとき、どう知らせるか',
    options: [
      { label: '画面に出す', description: 'その場で赤い文言を出す', recommended: true },
      { label: 'ログだけ', description: '画面には出さず、ログに残す' },
      { label: '両方', description: '画面にもログにも出す' },
    ],
  },
  {
    header: '確認',
    detail: '保存は同期、失敗は画面に出す。',
    question: 'この内容で進めてよいか',
    options: [
      { label: '進める', description: 'このまま実装に入る', recommended: true },
      { label: '戻る', description: '保存の方式から考え直す' },
    ],
  },
]

/** 次の問いを出すまでの時間（ミリ秒）。待機の点滅が目で確かめられる長さにしてある */
const THINK_MS = 1500

const sessions = new Map<string, SessionState>()

export function sessionOf(id: string): SessionState {
  let state = sessions.get(id)
  if (!state) {
    state = { index: 0, question: SCRIPT[0] ?? null, invocation: 'idle', answers: [], peers: new Set() }
    sessions.set(id, state)
  }
  return state
}

export function deleteSession(id: string): void {
  sessions.delete(id)
}

function broadcast(state: SessionState): void {
  if (!state.question) return
  const payload = JSON.stringify(state.question)
  for (const peer of state.peers) peer.send(payload)
}

/** U13。起動して、少し置いて次の問いを配信する */
export function invoke(id: string): void {
  const state = sessionOf(id)
  if (state.invocation === 'running') return
  state.invocation = 'running'
  setTimeout(() => {
    state.index += 1
    state.question = SCRIPT[state.index] ?? null
    state.invocation = 'idle'
    broadcast(state)
  }, THINK_MS)
}
