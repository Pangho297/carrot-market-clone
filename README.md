# 🥕 당근마켓 클론코딩

이 프로젝트는 노마드코더 당근마켓 클론코딩 강의와 함께 진행된 프로젝트입니다.  
사용된 기술 스택은 다음과 같습니다.

- Next.js
- Tailwind
- Prisma
- PlanetScale
- CloudFlare

## Tailwind

이 문서는 노마드코더의 당근마켓 클론코딩 프로젝트를 진행하면서 작성된 문서입니다.  
예시의 기준은 모두 위 프로젝트를 진행하면서 생긴 예시들이며 Next.js와 함께 사용되었습니다.  

Tailwind CSS는 오픈소스 CSS 프레임워크다 프레임워크임에도  
부트스트랩과 같은 다른 CSS 프레임워크와 달리 버튼이나 테이블과같은 요소에  
미리 정의된 일련의 클래스를 제공하지 않는다

대신 혼합 및 일치를 통해 각 요소의 스타일을 지정할 때 사용할 수 있는  
”유틸리티” CSS 클래스 목록을 만든다

예를들어 다른 기존 시스템에는 노란색 배경색과 굵은 텍스트를 적용하는 `message-warning`  
클래스가 있다면 Tailwind에서는 `bg-yellow-200`, `font-blod` 클래스를 부여하면 된다  

— wikipedia

### 시작하기

```bash
# npm

npm install -D tailwindcss postcss autoprefixer

# yarn

yarn add tailwindcss postcss autoprefixer -D
```

Tailwind는 PostCSS의 플러그인으로 설치되어 사용하는 것이  
webpack, Roolup, Vite와 같은 빌드 도구와 통합하는 가장 원활한 방법이라고  
공식 문서에서 소개되고있다  

— 참고 [Tailwind](https://tailwindcss.com/docs/installation/using-postcss)

설치가 완료되면 설정파일 세팅을 하기위한 명령어를 입력한다  

```bash
npx tailwindcss init
```

명령어를 입력하면 2개의 설정 파일이 생성된다 
(`postcss.config.js`, `tailwind.config.js`)

여기서 손볼 파일은 `tailwind.config.js` 이 파일을 손봐야 하는데  
우선 아래와 같이 파일을 손봐준다

```tsx
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

여기서 `content`에 추가한 경로는 내가 어디서 Tailwind CSS를 사용할 것인지  
Tailwind 프레임워크에게 알려주는 것이다  

예제에선 pages 폴더 내의 모든 폴더, 모든 파일 중 확장자가 js, jsx, ts, tsx인 파일에서  
Tailwind CSS를 사용할 것이라고 알려주는 것이다

마지막으로 globals.css 파일의 내용을 이렇게 수정해준다

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

작성중 @tailwind 부분에서 계속 경고 표시가 발생하지만 무시해도 상관없다  
이 코드는 CSS에 Tailwind의 기본 스타일과 구성요소, 유틸리티들을 주입시켜 두는 것이다  

이렇게 작성해두어야 내가 HTML에 Tailwind CSS를 사용한 뒤 빌드했을 때  
globals.css에 주입해둔 지시문들을 활용해 스타일을 잡는것이다  

— 참고 [What is "@" doing in a CSS file?](https://stackoverflow.com/questions/73059415/what-is-doing-in-a-css-file), [@tailwind](https://tailwindcss.com/docs/functions-and-directives#tailwind)

이렇게 작성해두면 기본적인 세팅이 끝이난다  
이제 잘 작동하는지 확인해보기위한 코드를 작성해보자

```tsx
export default function Home() {
  return (
    <div className="bg-gray-700">
      <h1 className="text-blue-400">it Works!!</h1>
    </div>
  );
}
```

위에서 설명한것과 같이 className을 정해진 규칙에 맞게 선언하면 된다  
이렇게 작성한 뒤 터미널에서 dev서버를 열어주자

```bash
# npm

npm run dev

# yarn

yarn run dev
```

잘 열렸다면 localhost:3000으로 들어가 결과물을 확인하자!