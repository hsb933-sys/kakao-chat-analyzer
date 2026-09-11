# 카톡 대화 분석기

카카오톡 "대화 내용 내보내기" txt 파일을 업로드하면 누가 더 수다스러운지, 언제 가장 활발한지,
자주 쓰는 단어·이모지, 재미있는 칭호(수다쟁이·올빼미·이모지 부자 등)까지 분석해주는 완전
클라이언트 사이드 웹앱입니다. 업로드한 대화 내용은 서버로 전송되지 않으며 모든 처리(파싱, 통계
계산, 시각화)는 브라우저 안에서만 이루어집니다.

## 개발

```bash
npm install
npm run dev
```

## 테스트

```bash
npm run test
```

## 빌드

```bash
npm run build
```

`dist/` 폴더에 정적 파일이 생성됩니다. `vite.config.ts`의 `base: './'` 설정 덕분에 어떤 경로에
배포하거나 iframe으로 임베드해도 상대 경로로 정상 동작합니다.

## 블로그에 임베드하기

1. `npm run build` 후 `dist/` 폴더를 정적 호스팅(GitHub Pages, Netlify, Vercel 등)에 업로드합니다.
2. 블로그 글에 아래와 같이 iframe을 삽입합니다.

```html
<iframe
  src="https://your-host.example.com/kakao-chat-analyzer/"
  width="100%"
  height="900"
  style="border:0"
  loading="lazy"
></iframe>
```

## 지원하는 내보내기 형식

- iOS/최신 안드로이드: `2024. 1. 5. 오전 9:12, 이름 : 내용`
- 구버전 안드로이드: `2024년 1월 5일 오전 9:12, 이름 : 내용`
- PC 카카오톡 브라켓 형식: 날짜 구분선(`--------------- 2024년 1월 8일 월요일 ---------------`) 뒤에
  `[이름] [오전 7:30] 내용`
- 입장/퇴장 등 시스템 메시지, 삭제된 메시지, 사진/동영상/이모티콘은 자동으로 구분해서 집계합니다.

`sample/sample_chat.txt`에 테스트용 샘플 대화 파일이 있습니다.

## 기술 스택

- **UI**: React 19 + Tailwind CSS v4
- **차트**: Recharts (날짜별 추이), 커스텀 CSS 그리드(시간대 히트맵·워드클라우드)
- **파싱/통계**: 별도의 순수 함수(`src/lib/parser.ts`, `src/lib/stats.ts`)로 구현해 Vitest로 단위
  테스트가 가능합니다.
