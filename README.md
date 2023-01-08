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

### 유틸리티

Tailwind에서 말하는 유틸리는 아주 많은 클래스이름을 가지고 있다는 뜻이다  
그러니까 Tailwind는 용량이 아주 큰 CSS 파일이 있고 그 안에는 무수히 많은  
클래스이름에 정의되어있는 CSS들이 있다는것이다

사용자는 그렇게 정의되어있는 클래스이름을 가져다 쓰면 그 CSS가 적용되는것이다

하지만 클래스들을 조합해서 CSS를 사용한다면 조합의 수가 상당히 많을 것이다.  
물론 Tailwind 3.0이전에는 정말로 거대한 하나의 CSS파일을 이용했었고  
그런 이유로 Modifier를 중첩해서 사용할 수 없었다.

하지만…

### Just-In-Time Compiler

Tailwind 3.0의 가장 큰 변화는 바로 Jus-In-Time 컴파일러(JIT)다.  
3.0버전 이전엔 빌드 과정에서 파일을 청소하는 작업이 있었다

모든 파일의 코드를 스캔해서 Tailwind CSS에 사용된 클래스가 아닌것들을  
모두 지우는 작업이 진행됐었다. 이 과정을 purging이라고 했다

3.0버전 이후엔 JIT이 코드를 실시간으로 감시하면서  
필요한 클래스를 생성하는 기능을 한다

실제로 생성되는 클래스들은 개발자 도구에서 확인이 가능하다  
궁금하다면 개발자 도구를 키고 요소에서 `<head>` 아래 `<style>` 태그를 구경해보자

JIT 덕분에 Tailwind는 무거운 프레임워크가 아닌 가벼운 프레임워크가 된것이다

## 시작하기

```bash
#npm

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

여기서 content에 추가한 경로는 내가 어디서 Tailwind CSS를 사용할 것인지  
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

위에서 설명한것과 같이 className을 정해진 규칙 지정해두기만하면된다  
이렇게 작성한 뒤 터미널에서 dev서버를 열어주자

```bash
# npm

npm run dev

#yarn

yarn run dev
```

잘 열렸다면 localhost:3000으로 들어가 결과물을 확인하자!

## Tailwind CSS IntelliSense

위에서도 설명했든 Tailwind에는 매우 많은 CSS 클래스로 이루어진 유틸리티를 가지고있다  
때문에 이를 모두 기억하는것은 그만큼 어렵기 때문에 IDE에서 지원하는 자동 완성기능의  
보조를 받아야 원활하게 이용할 수 있다

Tailwind에서 만들어둔 자동완성 플러그인이 있다 여기에선 VSCode를 기준으로 설명하며  
VSCode용 Tailwind CSS IntelliSense 익스텐션에 대한 설명을 해보겠다  

### 설치하기

VSCode 마켓플레이스에서 [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)를 설치하면 된다  
위 이름을 눌러도 익스텐션 페이지로 넘어간다

Tailwind를 사용한다면 반드시 설치해야하는 이유가 한가지 더 있다

![스크린샷 2023-01-07 오후 10.28.13.png](https://user-images.githubusercontent.com/72400381/211202776-892d7f89-008b-4d68-b590-176abe700597.png)

정의해놓은 className에 마우스를 올려보면  
이 유틸리티의 CSS가 어떻게 구성되어있는지 볼 수 있는 팝업이 생긴다

![스크린샷 2023-01-07 오후 10.31.28.png](https://user-images.githubusercontent.com/72400381/211202841-02414085-e5d8-4e72-9f53-62c3786db843.png)

추가로, flex 와 grid를 동시에 사용할 경우 서로 상쇄시킨다는 경고문이 뜨기도 하며  
이로 인해 발생하는 실수를 줄일 수 있기도 하다

자동완성 기능을 사용 중 클래스를 지우고 다시 쓰다보면 기능이 작동하지 않는 경우가 발생한다  
그럴땐 당황하지말고 맥 기준으로 ctrl + space를 누르면  
자동완성 기능이 다시 작동한다 (불-편)

## Tailwind의 특징

### 방향

이 색션은 Tailwind에서 margin, padding, border등의 방향에 대해 설명한다  
CSS에서는 padding-top, margin-left와 같이 방향을 적어 사용하거나  
padding 값을 위, 오른쪽, 아래, 왼쪽으로 나누어 적으면 개별적으로 적용됐다

Tailwind에서는 클래스로 적기 때문에 살짝 혼란스러울 수 있다  
padding을 기준으로 예시를 작성하나 방향을 설정하는 방식은 대부분 비슷하다

```css
/* pedding의 네 방향을 모두 설정한다 */

/* Tailwind */

p-3

/* CSS */

padding: 12px;

/* pedding의 좌우 방향을 설정한다 */

/* Tailwind */

px-3

/* CSS */

padding: 0px 12px

/* pedding의 상하 방향을 설정한다 */

/* Tailwind */

py-3

/* CSS */

padding: 12px 0px;

/* pedding의 위 방향을 설정한다 */

/* Tailwind */

pt-3

/* CSS */

padding-top: 12px;

/* pedding의 오른쪽 방향을 설정한다 */

/* Tailwind */

pr-3

/* CSS */

padding-right: 12px;

/* pedding의 아래 방향을 설정한다 */

/* Tailwind */

pb-3

/* CSS */

padding-bottom: 12px;

/* pedding의 왼쪽 방향을 설정한다 */

/* Tailwind */

pl-3

/* CSS */

padding-left: 12px;
```

CSS 속성의 앞글자만 따와 작성된다는 것을 알 수 있다.

### 단위

Tailwind CSS 클래스의 숫자는 단순 픽셀단위가 아니다  
예를들어 `p-1` 이라고하면 `pedding: 0.25rem;`과 같고  
픽셀로 환산하면 `padding: 4px;`이 된다.

쉽게 말하면 1 : 4 비율이라고 생각하면 된다

> 그렇담 p-56은 몇 px일까?
~~정답은 224px이다~~
> 

설명하기 편하게 Tailwind에서 정의해놓은 단위는 앞으로 Tailwind단위라고 설명하겠다

주의해야할 점은 Tailwind단위는 특정 구간부터 1씩 증가하는것이 아닌  
두배씩 증가하는 것을 볼 수 있다

![스크린샷 2023-01-07 오후 11.08.09.png](https://user-images.githubusercontent.com/72400381/211202899-634bdbd8-a468-431a-a44d-f60cfcfa3200.png)

12부터 2씩 증가해서 16부터는 4씩 증가한다

![스크린샷 2023-01-07 오후 11.08.40.png](https://user-images.githubusercontent.com/72400381/211202922-30c52927-2dc2-4e3a-9bf6-37f5dd1b6fe6.png)

64부터 8씩 증가하고 80부터 16씩 증가한다  
다만 이렇게 증가폭이 큰 구간들은 자주 사용할일이 없다  

추가로, 음수의 값을 넣어야 할때에는 `-pt-3`과 같이 클래스 이름 맨 앞에 `-` 기호를 붙이면 된다  

그렇다고 이렇게 정해진 단위로만 사용해야되냐하면 그건 아니다  
단위를 적을 때 아래와 같이 적으면 임의로 적은 수치로 사용할 수 있다  

```tsx
<div className="text-[37px]">Hello</div>
```

색상의 경우 색상코드를 넣어주면 된다

```tsx
<div className="text-[#F4BC1F]">Color code is #F4BC1F</div>
```

### Modifiers

버튼에 마우스를 올렸을때 배경색을 바꾸려면  
CSS에서는 의사 클래스인 hover를 사용해 마우스가 올라갔을 때의 스타일을 정의한다  

Tailwind에서는 Modifiers라는것을 이용해  
CSS의 의사클래스와 같은 기능을 이용할 수 있다

#### How to Use?

마찬가지로 클래스를 입력할 때 입력하면된다.

```tsx
<button className="bg-blue-500 hover:bg-blue-400">
	Checkout
</button>
```

일반적인 유틸리티와 다른점은 앞에 의사 클래스가 붙은 클래스 이라는 것  

만약 hover 시 변경될 것들을 여러개 넣고싶다면 아래와 같이 적으면 된다

```tsx
<button className="bg-blue-500 text-white hover:bg-blue-400 hover:text-black">
	Checkout
</button>
```

hover를 붙인 클래스를 추가하면 된다

추가로, Modifier는 여러개를 중첩해서 사용할 수 있다.

```tsx
<input type="file" className="border file:hover:border-yellow-400" />
```

파일을 추가하는 input의 버튼에 마우스를 올릴 경우 테두리를 노란색으로 바꾸도록 썼다  
이렇듯 file이라는 Modifier와 hover라는 Modifier를 동시에 쓸수도 있다

#### Group Modifier

부모의 요소에 마우스를 올렸을 때 자식의 요소에  
hover 효과를 넣고싶다면 어떻게 해야될까? 예를들면 이런 경우이다

```html
<div>
  <h1>hover</h1>
  <span>Pangho</span>
</div>
```

div 태그에 마우스가 올라갔을 때 Pangho의 글자색을 바꾸고싶은 경우이다

일반적인 CSS 상황에서라면 아래와 같이 스타일하면 될것이다

```css
div:hover span {
  color: yellow;
}
```

이렇게하면 h1태그에 마우스가 올라가도 span의 글자색깔이 달라진다

이런 동작을 Tailwind에서 구현하는 방법이 있다

##### How to Use?

```tsx
<div className="group">
  <h1>hover</h1>
  <span className="group-hover:text-yellow-400">Pangho</span>
</div>
```

우선 부모 요소를 group이라고 클래스 이름으로 선언해준 뒤  
마우스를 올렸을 때 변경이 일어날 요소에서 `group-hover:`를 적은 뒤  
변경될 스타일을 지정하면 된다

Intellisense에 표시되는 스타일을 보면 위 CSS 예제와 굉장히 비슷해보인다

```css
.group:hover .group-hover\:text-yellow-400 {
  --tw-text-opacity: 1;
  color: rgb(250 204 21 / var(--tw-text-opacity));
}
```

`group:hover`가있고 그 뒤에
`group-hover:text-yellow-400`에 해당하는 스타일을 주고있다

hover 외에도 CSS 의사 클래스에 해당하는 것들은 모두 group으로 사용할 수 있다

#### Peer Modifier

로그인 구현을 위해 아이다와 비밀번호를 받고 로그인 버튼이있는 form이 있다고 가정해보자  
여기서 사용자가 입력한 것들을 유효성검사를 했을 때  
사용자에게 유효성 검사를 통과했는지 여부를 알 수 있도록 한다고 생각해보자

```html
<form>
  <input
    type="text"
    required
    placeholder="Username"  
  />
  <span>
    this input is invalid
  </span>
  <input
    type="password"
    required
    placeholder="Password"
  />
  <input type="submit" value="login" />
</form>
```

여기서 this input is invalid를 유효성 검사를 통과했을 때 감추고 싶다면 어떻게 해야될까?

Tailwind에는 Peer Modifier가 존재한다  
Group Modifier와 사용법은 비슷하다

##### How to Use?

```tsx
<form>
  <input
    type="text"
    required
    placeholder="Username"
		className="peer"
  />
  <span className="peer-invalid:text-red-400 peer-valid:hidden">
    this input is invalid
  </span>
  <input
    type="password"
    required
    placeholder="Password"
  />
  <input type="submit" value="login" />
</form>
```

Peer의 주체가될 형제요소에 peer 클래스를 선언한 뒤  
대상의 상태에 의해 스타일이 변경될 요소에서 peer-를 붙인 뒤 의사 클래스를 이용해  
스타일을 작성해주면된다

Group Modifier와 다르게 부모가 아닌 형제를 대상으로 사용할 수 있다  
이 기능은 CSS에서 [sibling selector](https://developer.mozilla.org/ko/docs/Web/CSS/General_sibling_combinator)를 이용해 사용 가능하다

주의해야할 점은 Peer Modifier는 peer 의사클래스보다 먼저선언되어야한다

#### Responsive Modifiers

기본적으로 Tailwind는 모바일에 우선 적용되도록 설계되어있고(Mobile First)  
반응형 디자인을 위한 Modifier들이 따로 존재한다

때문에 모바일용 스타일을 지정하기위해 Modifier을 붙이는 것이 아닌  
데스크탑용 스타일을 지정하기위해 Modifier를 붙여야 하는것이다

아래에는 반응형 디자인을 위한 Modifier 리스트이다

- `sm`
    
    ```css
    @media (min-width: 640px) { ... }
    ```
    
- `md`
    
    ```css
    @media (min-width: 768px) { ... }
    ```
    
- `lg`
    
    ```css
    @media (min-width: 1024px) { ... }
    ```
    
- `xl`
    
    ```css
    @media (min-width: 1280px) { ... }
    ```
    
- `2xl`
    
    ```css
    @media (min-width: 1536px) { ... }
    ```
    

실제로 적용해본 예시는 아래의 코드를 참고하면된다

```tsx
<div className="grid gap-10 lg:grid-cols-2 xl:grid-cols-4 xl:place-content-center">
```

기본적으로 그리드 레이아웃이지만 `lg` 사이즈의 화면에선 요소를 2개씩 배치하고  
`xl` 사이즈의 화면에선 요소를 4개씩 배치한다

추가로, 디바이스에서 적용할 수 있는 반응형 Modifier도 존재한다

- `portrait`
모바일 디바이스의 화면이 세로방향일 경우 적용되는 스타일을 추가한다
- `landscape`
모바일 디바이스의 화면이 가로방향일 경우 적용되는 스타일을 추가한다
- `print`
문서가 인쇄될 때만 적용되는 스타일을 추가한다

#### Dark Modifier

기본적으로 다크모드는 사용자의 컴퓨터 환경 설정에 따라 활성화되게 되어있다.
Tailwind에서는 tailwind.config.js 파일을 통해
사용자가 직접 다크모드를 제어할 수 있도록 설정할 수 있다

설정 방법은 아래와 같이 tailwind.config.js 파일을 수정하면 된다.

```tsx
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,jsx,ts,tsx}', 
    './components/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {},
  },
  darkMode: "class", // 기본값은 media
  plugins: [],
}
```

media일 경우 사용자의 시스템 설정에 따라 다크모드가 활성화 된다  
class일 경우 사용자가 다크모드를 제어할 수 있도록 만들 수 있다 (기능 추가 필요)

##### How to Use?

`darkMode`가 `media`일 경우 다른 Modifier를 사용하는 것과  
동일한 방식으로 사용하면 된다.

```tsx
<div className="bg-slate-400 dark:bg-slate-700">
{ ... }
</div>
```

기본적으로는 slate-400 색상을, 다크모드일 경우 slate-700색상으로 보이게된다

`darkMode`가 `class`일 경우 다크모드를 적용할 요소의 부모요소에
`dark`클래스를 추가하면 된다

```tsx
<body className="dark">
	<div className="dark:text-white dark:bg-slate-700">dark mode</span>
</body>
```

일반적으로 `class`로 다크모드를 사용할 경우 `dark`클래스를  
`<body>` 또는 `<html>` 에 추가한다

그리고 이렇게 넣을 수 있도록 document의 root 컴포넌트에  
dark 클래스네임을 변경하도록 코드를 작성한다

사용하는 방식은 `media`로 설정해두는것이 훨씬 편하다

Dark Modifier를 사용했을 때 볼 수 있는 CSS 는 아래와 같다.

```css
/* darkMode가 media일 경우 */

@media (prefers-color-scheme: dark) {
  .dark\:bg-slate-700 {
    --tw-bg-opacity: 1;
    background-color: rgb(51 65 85 / var(--tw-bg-opacity));
  }
}

/* darkMode가 class일 경우 */

.dark .dark\:bg-slate-700 {
  --tw-bg-opacity: 1;
  background-color: rgb(51 65 85 / var(--tw-bg-opacity));
}
```

설정에 따라 CSS가 달라지는 것을 볼 수 있다

여기까지 Tailwind의 기본 사용법에 대해 알아봤다  
이제 이걸 활용해 멋있는 프로젝트를 만들어보자!