import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy",
  description: "Privacy policy for the English sentence app. Names and saved sentences stay on the device.",
};

export default function EnglishPage() {
  return (
    <div className="container page-hero">
      <p className="page-kicker">Privacy</p>
      <h1>
        Priva<span className="title-mark">c</span>y
      </h1>
      <section id="privacy" className="mt-10 max-w-2xl space-y-4 text-lg leading-relaxed">
        <h2 className="text-2xl font-black tracking-tight">개인정보처리방침</h2>
        <p>이 앱은 계정을 만들지 않습니다. 보호자 이름, 아이 이름, 보관함에 저장한 문장은 그 기기에만 있습니다.</p>
        <p>영어 답장을 만들거나 오늘의 문장을 서버에서 받을 때, 그 요청에 적은 글이 문장을 만들기 위해 전송됩니다. 듣기는 기기의 음성으로 재생됩니다.</p>
        <p>This app does not create an account. A parent&apos;s name, a child&apos;s name, and saved sentences stay on that device.</p>
        <p>Asking for an English reply, or for a daily sentence from the reply service, sends the words in that request so the sentence can be written. Listening uses the device&apos;s own voice.</p>
        <p>
          문의 · Questions: <a className="underline" href="mailto:bibibigbar@gmail.com">bibibigbar@gmail.com</a>
        </p>
      </section>
    </div>
  );
}
