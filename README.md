# microCMS Vercel AstroによるJamstack構成のブログ環境
## 概要
記事・メディアコンテンツはmicroCMSで管理し、Vercelとデプロイフックで連携することにより、CI/CDを行なっています。
WebフロントエンドフレームワークにはAstroを使用しており、静的コンテンツとして配信することによるパフォーマンス向上を目指しています。

## 使用技術
CMS => microCMS
PaaS => Vercel
F/E FW => Astro

## 課題と今後
- サイトマップや全文検索などブログの一般的な機能の実装。
- Three.jsなどcanvas、svg、スクリーンアニメーションの実装によるUI/UXの研究。
