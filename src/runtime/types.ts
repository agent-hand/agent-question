// module が公開する型。置く側（stroke-board の `shared/stroke.ts`）は同じ名前で re-export する
// （design D5）。問いの形を変えるときに直すのはここ1箇所。
//
// 写し元: stroke-board `shared/stroke.ts`（`QuestionOption` / `Question` / `Answer` / `Invocation`）。
// `SessionStatus` の残り（`phase` / `path`）は stroke-board の都合なので持たない。

/**
 * 問いの選択肢。決定を代行するためではなく、決定を下すユーザーへ材料を渡すためのもの。
 * 推奨は多くとも1つ。根拠は画面に出さないため持たない。
 */
export interface QuestionOption {
  /** 選択肢の見出し。1〜5語（形式の規定は文言のみ・design.md 決定2） */
  label: string
  /** それを選ぶと何がどうなるか */
  description: string
  recommended?: boolean
}

/**
 * AI が返すストロークの問い。1回の応答に1つ。推奨は多くとも1つ。
 * 画面はこの順（話題タグ → 詳細説明 → 問い本文 → 選択肢）で出す。
 */
export interface Question {
  /** 話題タグ。その問いが何についてのものか */
  header: string
  /** 詳細説明。確定済みの前提と、調べて分かった事実 */
  detail: string
  /** 問い本文 */
  question: string
  options: QuestionOption[]
}

/** ユーザーの回答。選択肢を選ぶか、自由入力で書くか。 */
export type Answer =
  | { kind: 'option'; value: string }
  | { kind: 'free'; value: string }

/**
 * 実行の記録（U2 の `invocation`）。
 *
 * - `running` — 実行中
 * - `idle` — 平常
 * - `failed` — 失敗。巡回が拾って起こし直す
 * - `error` — リトライ上限に達した**終端**。システムは自動では何もせず、ユーザーの
 *   再実行（回数リセット）か削除だけが回復手段になる
 */
export type Invocation = 'running' | 'idle' | 'failed' | 'error'
