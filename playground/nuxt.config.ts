export default defineNuxtConfig({
  // agent-question は @nuxt/ui の部品を使う側なので、@nuxt/ui の後ろに並べる（design D10）
  modules: ['@nuxt/ui', '@agent-hand/agent-question'],
  css: ['~/assets/css/main.css'],
  devtools: { enabled: true },
  compatibilityDate: 'latest',
  // playground の stub サーバが W1 を WebSocket で配信するために要る
  nitro: { experimental: { websocket: true } },
  // 本家の ThemeProvider の初期値に合わせてダーク（stroke-board の nuxt.config.ts と同じ）
  colorMode: { preference: 'dark', fallback: 'dark' },
  // playground は Web フォントを取りに行かない（@nuxt/fonts がネットワークへ出る）
  ui: { fonts: false },
});
