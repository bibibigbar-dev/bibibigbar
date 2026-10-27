import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy",
  description: "Privacy policy in English, Korean, Spanish, Chinese, and Vietnamese. Names and saved sentences stay on the device.",
};

const policies = [
  {
    lang: "English",
    lines: [
      "This app does not create an account. Your name, your child's name, and saved sentences stay on this device.",
      "When you ask for an English reply, or a daily sentence from the server, the words in that request are sent so the sentence can be written. Listening uses this device's voice.",
    ],
  },
  {
    lang: "한국어",
    lines: [
      "이 앱은 계정을 만들지 않습니다. 보호자 이름, 아이 이름, 보관함에 저장한 문장은 이 기기에만 있습니다.",
      "영어 답장을 만들거나 서버에서 오늘의 문장을 받을 때, 그 요청에 적은 글이 문장을 만들기 위해 전송됩니다. 듣기는 이 기기의 음성으로 재생됩니다.",
    ],
  },
  {
    lang: "Español",
    lines: [
      "Esta app no crea una cuenta. Tu nombre, el nombre de tu hijo y las frases guardadas se quedan en este dispositivo.",
      "Al pedir una respuesta en inglés, o la frase del día desde el servidor, el texto de esa solicitud se envía para escribir la frase. Escuchar usa la voz de este dispositivo.",
    ],
  },
  {
    lang: "中文",
    lines: [
      "此应用不创建账户。家长姓名、孩子姓名和收藏的句子只保存在这台设备上。",
      "请求英语回复，或从服务器获取今日句子时，请求中的文字会被发送以生成句子。朗读使用这台设备的语音。",
    ],
  },
  {
    lang: "Tiếng Việt",
    lines: [
      "Ứng dụng này không tạo tài khoản. Tên của bạn, tên con và các câu đã lưu chỉ nằm trên thiết bị này.",
      "Khi bạn xin câu trả lời tiếng Anh, hoặc câu trong ngày từ máy chủ, chữ trong yêu cầu đó được gửi đi để viết câu. Nghe dùng giọng của thiết bị này.",
    ],
  },
];

export default function EnglishPage() {
  return (
    <div className="container page-hero">
      <p className="page-kicker">Privacy</p>
      <h1 className="!text-[clamp(2.4rem,5vw,4.2rem)]">
        Priva<span className="title-mark">c</span>y
      </h1>
      <div id="privacy" className="mt-10 grid gap-8 lg:grid-cols-5">
        {policies.map((policy) => (
          <section key={policy.lang} className="space-y-3 text-base leading-relaxed">
            <h2 className="text-sm font-black uppercase tracking-wide">{policy.lang}</h2>
            {policy.lines.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </section>
        ))}
      </div>
      <p className="mt-10 text-base">
        <a className="underline" href="mailto:bibibigbar@gmail.com">
          bibibigbar@gmail.com
        </a>
      </p>
    </div>
  );
}
