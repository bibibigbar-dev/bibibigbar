# bibibigbar 개발 환경과 비용

계정은 bibibigbar@gmail.com 이고, 공개 저장소는 https://github.com/bibibigbar-dev/bibibigbar 입니다.
가격은 2026년 10월 27일 공개 요금표입니다. 카드 청구 원본은 확인하지 않았고, 비밀값은 적지 않았습니다.

## 한눈에

사이트를 띄우는 고정비는 지금 거의 없습니다. GitHub, Vercel Hobby, Google은 월 $0입니다.
도메인 bibibigbar.com 은 2027년 9월 3일까지 등록되어 있고, 그때 GoDaddy .com 정가 갱신은 $22.99 에 ICANN 수수료 $0.20 입니다.
금액이 갈리는 곳은 Cursor 구독과 OpenAI 사용량입니다. 둘 다 이 저장소에서는 청구액이 보이지 않습니다.
Supabase amatdda 프로젝트는 지금 연결된 Supabase 로그인에 없습니다. 그 로그인에는 비활성 프로젝트 SizeGo 만 보입니다.

| 구분 | 금액 |
| --- | --- |
| GitHub, Vercel Hobby, Google 월 고정비 | $0 |
| 도메인 다음 갱신 정가, 2027-09-03 | $23.19 |
| Cursor 플랜, Supabase 플랜, OpenAI 사용량 | 미확인 |

## 개발 환경

로컬은 Next.js 15.5, React 18, TypeScript, Tailwind 3.4, TipTap 입니다.
`npm run dev` 로 띄우고, 비밀값은 git 에 없는 `.env.local` 에 있습니다.
공개 주소는 https://bibibigbar.com, https://blog.bibibigbar.com, https://shop.bibibigbar.com 입니다.

| 구간 | 연결 | 상태 |
| --- | --- | --- |
| 사이트 | Vercel Hobby 가 GitHub main 을 빌드 | 배포됨 |
| 글, 상품, 이미지 | Supabase amatdda, 테이블 `blog_`, 버킷 `blog-images` | 로컬 키 있음 |
| 발행 시각 | GitHub Actions, 한국 시간 5·6·9·12·15·18시 | 시크릿 등록됨 |
| 글 작성 | OpenAI `gpt-4o-mini`, 그림 기본값 `gpt-image-1` 저화질 | 수동 버튼의 자동 공개는 꺼짐 |
| 로그인 | bibibigbar@gmail.com 한 계정, 서버의 `ADMIN_PASSWORD` | Vercel Production 에 넣고 재배포해야 적용 |

발행 주소는 `https://bibibigbar.com/api/blog/auto-publish` 입니다.
5시에는 영어 브리핑 5개의 주제를 만들고 첫 글만 예약합니다.
이후 시각에는 시간이 된 글을 공개하고 다음 글 하나만 씁니다.
`CRON_SECRET` 은 직접 정한 비밀번호이고, GitHub Actions 시크릿과 Vercel Production 에 같은 값이어야 합니다.

로컬에 값이 있는 항목: Supabase URL 과 서비스 롤, AI 키, `CRON_SECRET`, AdSense 클라이언트, `AUTH_SECRET`, `ADMIN_PASSWORD`.
비어 있는 항목: 광고 칸 ID 두 개, Google Search Console 인증값, `NEXT_PUBLIC_SHOP_URL`.
샵 주소가 비어 있어도 운영 환경 코드는 https://shop.bibibigbar.com 을 기본값으로 씁니다.

## 가입한 서비스

| 서비스 | 이 프로젝트에서 하는 일 | 확인된 비용 |
| --- | --- | --- |
| Cursor | 이 저장소를 만드는 편집기 | 플랜 미확인 |
| GitHub | 공개 저장소, Actions 로 발행 호출 | $0 |
| Vercel | Hobby. 사이트 배포. 유료 크론은 보류 | $0 |
| GoDaddy | bibibigbar.com. WHOIS 는 Domains By Proxy | 다음 갱신 정가 |
| Supabase | amatdda, ref `obpgjzrltdwvhyynafkx` | 플랜 미확인 |
| OpenAI | api.openai.com. 글과 삽화 | 쓴 만큼 |
| Google AdSense | 광고 스크립트만 연결. 광고 칸 ID 는 비어 있음 | 가입비 $0, 수익 |
| Search Console | 인증값이 아직 비어 있음 | $0 |
| Amazon | 상품 링크만. 결제는 없음 | 가입비 $0 |

도메인은 2026-09-03 에 등록되어 2027-09-03 까지 유효합니다. 네임서버는 ns45.domaincontrol.com, ns46.domaincontrol.com 입니다.
첫 해에 실제로 낸 금액은 GoDaddy 영수증에만 있습니다.

## 정가

### Cursor

신규 구독은 X Subscription 요금입니다. 예전 Pro 를 이미 쓰고 있으면 그 가격이 유지됩니다.
제3자 모델은 Premium 이상에서 API 정가로 따로 과금됩니다. 세금은 별도입니다.

| 구분 | 플랜 | 월 가격 |
| --- | --- | --- |
| 신규 | Free | $0 |
| 신규 | Plus | $8 |
| 신규 | Premium | $30 |
| 신규 | Super | $100 |
| 신규 | Ultra | $200 |
| 기존 유지 | Pro | $20 |
| 기존 유지 | Pro+ | $60 |
| 기존 유지 | Ultra | $200 |

연간 결제는 Plus $80, Premium $300, Super $1,000, Ultra $2,000 입니다.

### 사이트

| 항목 | 정가 | 비고 |
| --- | --- | --- |
| Vercel Hobby | $0/월 | 지금 사용 중 |
| Vercel Pro | $20/월 | 유료 크론용으로 보류 |
| GitHub 공개 저장소 | $0 | Actions 포함 |
| Supabase Free | $0/월 | 500MB, 1주 미사용 시 일시정지 |
| Supabase Pro | $25/월부터 | amatdda 가 이 플랜인지는 미확인 |
| GoDaddy .com 갱신 | $22.99/년 | ICANN $0.20 별도 |
| gpt-4o-mini 입력 | $0.15 / 100만 토큰 | 캐시 입력 $0.075 |
| gpt-4o-mini 출력 | $0.60 / 100만 토큰 | 글 한 건 비용은 길이에 따라 다름 |

그림 모델 기본값은 `gpt-image-1`, 크기 1024, 저화질입니다. 글 한 건에 표지 1장과 본문 2장을 만듭니다.
현재 OpenAI 단가표에는 `gpt-image-1` 단가가 없고, 후속 이미지 모델은 토큰으로 과금됩니다.
월 그림 비용은 OpenAI 사용량 화면이 기준입니다.

## 참고

Vercel Hobby 는 비상업 개인 프로젝트용입니다. 광고와 아마존 링크가 본업이 되면 Pro $20/월이 필요할 수 있습니다.
하루 6번 발행은 그 유료 크론 대신 GitHub Actions 로 돌려 두었습니다.

출처: bibibigbar 저장소, whois, GitHub API, cursor.com/pricing, cursor.com/docs/models-and-pricing, vercel.com/pricing, supabase.com/pricing, GoDaddy 2026년 5월 .com 정가, developers.openai.com/api/docs/pricing.

## 설정 방법

비밀값은 두 곳에 둡니다. 로컬은 `bibibigbar/.env.local` 이고, 운영은 `bibibigbar.com` 이 연결된 Vercel 프로젝트의 Production 입니다.
`NEXT_PUBLIC_` 로 시작하는 값은 빌드할 때 사이트에 구워지므로, 넣은 뒤 반드시 다시 배포해야 합니다.
서버만 읽는 값(`ADMIN_PASSWORD`, `AUTH_SECRET`, `CRON_SECRET`, `SUPABASE_SERVICE_ROLE_KEY`, `AI_API_KEY`)도 Vercel 은 저장만으로는 돌고 있는 서버에 넣지 않습니다. Deployments 에서 Production 을 Redeploy 합니다.

이미 `.env.local` 에 있는 값은 새로 만들지 말고 그 문자열을 Vercel 에 복사합니다. 아래에서 새로 받는 것은 광고 칸, Search Console 인증값뿐입니다.

| 이름 | 누가 만드나 | 넣는 곳 |
| --- | --- | --- |
| `ADMIN_PASSWORD` | 직접 정한 로그인 비밀번호 | 로컬, Vercel |
| `AUTH_SECRET` | 직접 만든 긴 랜덤 문자열 | 로컬, Vercel |
| `CRON_SECRET` | 직접 만든 긴 랜덤 문자열 | 로컬, Vercel, GitHub Actions |
| `SUPABASE_URL` | Supabase 가 보여 주는 프로젝트 주소 | 로컬, Vercel |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase 가 발급 | 로컬, Vercel |
| `AI_API_KEY` | OpenAI 가 발급 | 로컬, Vercel |
| `AI_BASE_URL` | 고정값 `https://api.openai.com/v1` | 로컬, Vercel |
| `AI_MODEL` | 고정값 `gpt-4o-mini` | 로컬, Vercel |
| `BLOG_AUTHOR_NAME` | `bibibigbar` | 로컬, Vercel |
| `BLOG_AUTO_PUBLISH` | `false` 로 둠. 수동 버튼을 초안으로 남김 | 로컬, Vercel |
| `NEXT_PUBLIC_SITE_URL` | `https://bibibigbar.com` | 로컬, Vercel |
| `NEXT_PUBLIC_BLOG_URL` | `https://blog.bibibigbar.com` | 로컬, Vercel |
| `NEXT_PUBLIC_SHOP_URL` | `https://shop.bibibigbar.com` | 로컬, Vercel |
| `NEXT_PUBLIC_ADSENSE_CLIENT` | AdSense 게시자 ID, `ca-pub-` 로 시작 | 로컬, Vercel |
| `NEXT_PUBLIC_ADSENSE_SLOT_FEED` | 목록 광고 칸 숫자 | 로컬, Vercel |
| `NEXT_PUBLIC_ADSENSE_SLOT_ARTICLE` | 글 광고 칸 숫자 | 로컬, Vercel |
| `NEXT_PUBLIC_ADSENSE_SLOT_MULTIPLEX` | 글 하단 Multiplex 광고 칸 숫자, 기본값 `8631136115` | 로컬, Vercel |
| `GOOGLE_SITE_VERIFICATION` | Search Console 메타 태그의 content 값만 | 로컬, Vercel |

직접 만드는 비밀번호가 아직 없을 때만 터미널에서 만듭니다. 이미 있는 `AUTH_SECRET` 과 `CRON_SECRET` 을 바꾸면 로그인 쿠키와 GitHub 호출이 어긋납니다.

```bash
openssl rand -base64 32
```

### Vercel

이 사이트가 쓰는 토큰은 없습니다. GitHub `main` 이 연결되면 그 푸시로 배포됩니다.
필요한 일은 위 표의 값을 Production 환경 변수로 넣는 것입니다.

1. https://vercel.com 에 `bibibigbar.com` 을 배포한 계정으로 로그인합니다.
2. 그 프로젝트를 열고 Settings → Environment Variables 로 갑니다.
3. 이름을 표와 똑같이 적고, 값은 `.env.local` 에서 복사합니다. Environment 는 Production 만 골라도 됩니다.
4. Deployments → 가장 위 Production → Redeploy 를 누릅니다.
5. 배포가 끝난 뒤 `https://bibibigbar.com/api/blog/auto-publish` 를 그냥 열면 `CRON_SECRET is not set` 이 아니라 인증 오류가 나와야 합니다.

도메인은 같은 프로젝트의 Settings → Domains 에 `bibibigbar.com`, `www.bibibigbar.com`, `blog.bibibigbar.com`, `shop.bibibigbar.com` 이 있어야 합니다. 추가할 때 화면에 TXT 값이 나오면 GoDaddy 에 넣습니다.

### GitHub

저장소 권한용 개인 토큰은 필요 없습니다. Actions 가 사이트를 부를 때 쓰는 비밀번호만 있습니다.
그 값은 이미 저장소 시크릿 `CRON_SECRET` 으로 들어가 있습니다. 값을 바꿨을 때만 다시 넣습니다.

1. https://github.com/bibibigbar-dev/bibibigbar/settings/secrets/actions 를 엽니다.
2. New repository secret 을 누릅니다.
3. Name 은 `CRON_SECRET`, Secret 은 `.env.local` 의 같은 이름 값입니다. Vercel 에 넣은 값과 글자 하나까지 같아야 합니다.
4. Actions 탭의 Blog edition 워크플로가 한국 시간 5, 6, 9, 12, 15, 18시에 실행됩니다. 늦으면 십여 분까지 밀릴 수 있습니다.

### Supabase

프로젝트는 amatdda 이고 주소는 `https://obpgjzrltdwvhyynafkx.supabase.co` 입니다.
글과 이미지를 서버가 직접 쓰므로 anon 공개 키가 아니라 서비스 롤 비밀 키를 씁니다. 이 키는 브라우저나 git 에 넣으면 안 됩니다.

1. https://supabase.com/dashboard/project/obpgjzrltdwvhyynafkx/settings/api-keys 를 엽니다. 메뉴 이름이 API 로만 보이면 그 화면입니다.
2. Project URL 을 `SUPABASE_URL` 에 넣습니다. 이미 로컬에 있습니다.
3. `service_role` 또는 secret 이라고 적힌 키를 Reveal 한 뒤 `SUPABASE_SERVICE_ROLE_KEY` 에 넣습니다. 한 번 보여 주고 다시 숨기는 키이므로, 분실하면 그 화면에서 새 키를 만든 다음 로컬과 Vercel 을 함께 바꿉니다.
4. 테이블 `blog_` 와 버킷 `blog-images` 는 이미 만들어 둔 상태입니다. 다른 Supabase 프로젝트의 키를 넣으면 글이 그쪽으로 갑니다.

### OpenAI

1. https://platform.openai.com/api-keys 에 결제 수단이 등록된 계정으로 로그인합니다. 청구는 https://platform.openai.com/settings/organization/billing 입니다.
2. Create new secret key 를 누릅니다. 키는 이 화면을 닫으면 다시 보이지 않습니다.
3. 복사한 값을 `AI_API_KEY` 에 넣습니다. `sk-` 로 시작합니다.
4. `AI_BASE_URL` 은 `https://api.openai.com/v1`, `AI_MODEL` 은 `gpt-4o-mini` 로 둡니다.
5. 그림 모델을 바꾸려면 `AI_IMAGE_MODEL` 을 추가합니다. 비워 두면 `gpt-image-1` 저화질을 쓰고, 그 모델이 거절되면 `dall-e-3` 으로 한 번 더 시도합니다.

키를 만들 때 권한을 All 로 두면 글과 그림이 함께 됩니다. 제한 키로 만들면 이미지 API 가 막힐 수 있습니다.

### Google AdSense

기본 게시자 ID 는 `ca-pub-2197789902785723`, 광고 단위 `ad1` 의 칸 번호는 `5667554716` 입니다. 환경 변수가 없거나 비어 있어도 이 값으로 목록과 본문에 반응형 디스플레이 광고를 표시합니다. 스크립트는 페이지에서 한 번 로드하고 각 광고 칸은 별도로 초기화합니다. 실제 광고 노출은 AdSense 승인 및 광고 공급 상태에 따라 달라집니다.

글 하단에는 `8631136115` 광고 단위를 `data-ad-format="autorelaxed"` 로 추가 표시합니다. 이 Multiplex 광고는 기존 디스플레이 광고와 별도이며, `NEXT_PUBLIC_ADSENSE_SLOT_MULTIPLEX` 로 칸 번호를 변경할 수 있습니다.

다른 게시자나 광고 단위를 사용하려면 다음 환경 변수를 설정합니다.

1. https://adsense.google.com 에 로그인합니다.
2. 계정 → 계정 정보에서 게시자 ID 를 확인합니다. `ca-pub-` 뒤에 숫자가 붙은 전체 문자열이 `NEXT_PUBLIC_ADSENSE_CLIENT` 입니다.
3. 광고 → 광고 단위에서 디스플레이 광고를 만듭니다. 목록과 본문에 같은 광고 단위를 쓰거나 각각 다른 단위를 쓸 수 있습니다.
4. 광고 코드의 `data-ad-slot="1234567890"` 에서 따옴표 안 숫자만 복사합니다.
5. 목록 칸은 `NEXT_PUBLIC_ADSENSE_SLOT_FEED`, 본문 칸은 `NEXT_PUBLIC_ADSENSE_SLOT_ARTICLE` 입니다.
6. Vercel 에 넣고 다시 배포하면 `https://bibibigbar.com/ads.txt` 에 `google.com, pub-숫자, DIRECT, f08c47fec0942fa0` 이 나옵니다.

### Google Search Console

인증용 토큰은 따로 없고, 메타 태그 안의 한 줄입니다.

1. https://search.google.com/search-console 에서 속성을 추가합니다. 블로그는 `https://blog.bibibigbar.com` 입니다.
2. 확인 방법을 HTML 태그로 고릅니다. 태그는 `<meta name="google-site-verification" content="여기만복사" />` 형태입니다.
3. `content="` 와 `"` 사이의 값만 `GOOGLE_SITE_VERIFICATION` 에 넣습니다. 태그 전체는 넣지 않습니다.
4. Vercel 에 넣고 다시 배포한 뒤, Search Console 에서 확인을 누릅니다.
5. 사이트맵 주소는 `https://blog.bibibigbar.com/sitemap.xml` 입니다.

### GoDaddy

API 키는 필요 없습니다. DNS 레코드만 맞으면 됩니다.
https://dcc.godaddy.com 에서 bibibigbar.com → DNS 를 엽니다.

| 종류 | 이름 | 값 | 다루기 |
| --- | --- | --- | --- |
| A | `@` | `216.198.79.1` | 그대로 둡니다. 지우면 루트 도메인이 깨집니다. |
| CNAME | `blog` | `cname.vercel-dns.com` | 이미 넣었습니다. |
| CNAME | `shop` | `cname.vercel-dns.com` | 이미 넣었습니다. |
| TXT | `_vercel` | Vercel Domains 화면이 보여 주는 값 | 새 도메인을 추가할 때만 그 화면의 값을 넣습니다. |

### Amazon

이 저장소에는 아마존 API 키 자리가 없습니다. 관리자 상품 화면의 아마존 주소 칸에 상품 링크를 붙여 넣습니다.

1. https://affiliate-program.amazon.com 에서 가입하고 트래킹 ID 를 받습니다. 형태는 `이름-20` 입니다.
2. 상품 페이지에서 제휴 링크를 만듭니다. 짧은 주소 `https://amzn.to/...` 도 됩니다.
3. `bibibigbar.com/admin` 의 샵 등록에서 그 주소를 Amazon URL 에 넣습니다. 코드가 아마존 주소인지 확인한 뒤 새 탭으로 보냅니다.

### Cursor

사이트 환경 변수에는 Cursor 키를 넣지 않습니다. 구독과 사용량은 https://cursor.com/dashboard 에서 봅니다.
에디터 안에서 Cursor Settings → Account 가 같은 계정입니다. 제3자 모델 요금이 따로 나오면 그 대시보드의 사용량과 크레딧에서 확인합니다.
