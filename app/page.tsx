import Link from "next/link";
import { CircusStage } from "@/components/circus-stage";
import { PostList } from "@/components/post-list";
import { getActiveBoards, getCurrentUser, getRecentPosts } from "@/lib/queries";

const acts = [
  { number: "01", symbol: "✳", title: "호기심이 묘기가 되는 곳", english: "A CABINET OF CURIOSITIES", description: "별것 아닌 생각도 일단 무대 위로. 만들고, 부수고, 다시 만들어가는 작은 실험들.", href: "#journal", action: "최근 기록 구경하기", color: "red" },
  { number: "02", symbol: "✎", title: "일상이라는 줄타기", english: "NOTES FROM THE EVERYDAY", description: "잘하는 날도, 조금 휘청이는 날도. 일상에서 주워 모은 생각과 장면을 기록합니다.", href: "#about", action: "이 공간 알아보기", color: "blue" },
  { number: "03", symbol: "✦", title: "당신도 출연 환영", english: "THERE’S ROOM FOR YOU", description: "구경만 해도 좋고, 이야기를 남겨도 좋아요. 재미있는 일은 대개 함께 시작되니까.", href: "/boards", action: "이야기 나누러 가기", color: "gold" },
];

export default async function HomePage() {
  const [boards, posts, user] = await Promise.all([
    getActiveBoards(),
    getRecentPosts(3),
    getCurrentUser(),
  ]);

  return (
    <div className="circus-home">
      <section className="hero container" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow"><span className="live-dot" /> A PERSONAL SPACE, A LITTLE OFFBEAT</p>
          <h1 id="hero-title" className="hero-title">
            WELCOME TO<br />
            THE <span className="hero-big">BIG</span><br />
            <span className="hero-outline">LITTLE</span> SHOW<span className="hero-period">.</span>
          </h1>
          <div className="hero-intro">
            <span className="intro-star" aria-hidden="true">✳</span>
            <div>
              <p className="hero-korean">조금 엉뚱해도, 꽤 근사한 나의 세계.</p>
              <p className="hero-description">생각을 만들고, 일상을 기록하고, 가끔은 딴짓도 합니다.<br className="hidden sm:block" /> 여기는 bibibigbar의 작은 서커스. 편하게 구경하다 가세요.</p>
            </div>
          </div>
          <div className="hero-actions">
            <Link href="#program" className="btn btn-primary">오늘의 공연 보기 <span aria-hidden="true">↗</span></Link>
            <Link href="#about" className="text-link">여긴 어떤 곳인가요? <span aria-hidden="true">→</span></Link>
          </div>
          <p className="hero-footnote">NO PERFECT TRICKS. JUST A WORK IN PROGRESS.</p>
        </div>
        <CircusStage />
      </section>

      <div className="show-ribbon" aria-label="호기심, 작은 실험, 일상의 기록, 뜻밖의 즐거움">
        <div aria-hidden="true">
          <span>STAY CURIOUS</span><b>✦</b><span>MAKE A LITTLE MAGIC</span><b>✦</b><span>ENJOY THE LITTLE THINGS</span><b>✦</b><span>STAY CURIOUS</span><b>✦</b><span>MAKE A LITTLE MAGIC</span><b>✦</b>
        </div>
      </div>

      <section id="program" className="container program-section">
        <div className="section-heading">
          <div><p className="eyebrow">STEP RIGHT UP</p><h2 className="section-title">오늘의 프로그램<span>✦</span></h2></div>
          <p className="section-note">거창하진 않아도, 지루하진 않을 거예요.</p>
        </div>
        <div className="program-grid">
          {acts.map((act) => (
            <Link key={act.number} href={act.href} className={`program-card program-${act.color}`}>
              <div className="program-top"><span>ACT {act.number}</span><span aria-hidden="true">↗</span></div>
              <div className="program-symbol" aria-hidden="true">{act.symbol}</div>
              <p className="program-english">{act.english}</p>
              <h3>{act.title}</h3>
              <p className="program-description">{act.description}</p>
              <span className="program-action">{act.action} <span aria-hidden="true">→</span></span>
            </Link>
          ))}
        </div>
      </section>

      <section id="about" className="container about-section">
        <div className="about-emblem" aria-hidden="true"><span>THE HUMAN<br />BEHIND THE SHOW</span><b>b.</b><span>STILL FIGURING IT OUT</span></div>
        <div className="about-copy">
          <p className="eyebrow">A NOTE FROM THE RINGMASTER</p>
          <h2>인생은 실전이라지만,<br />여기서는 <em>리허설 중.</em></h2>
          <p>안녕하세요, bibibigbar입니다. 이곳은 완성된 정답을 전시하는 포트폴리오보다, 좋아하는 것과 궁금한 것을 하나씩 펼쳐 놓는 저만의 무대예요. 조금 서툴러도 재미있게, 제 속도로 만들어갑니다.</p>
          <span className="about-signature">Enjoy the show, bibibigbar <span aria-hidden="true">↗</span></span>
        </div>
        <span className="about-spark" aria-hidden="true">✧</span>
      </section>

      <section id="journal" className="container journal-section">
        <div className="section-heading">
          <div><p className="eyebrow">FRESH FROM BACKSTAGE</p><h2 className="section-title">무대 뒤의 이야기<span>✎</span></h2></div>
          <Link href="/boards" className="text-link">모든 이야기 <span aria-hidden="true">↗</span></Link>
        </div>
        <PostList posts={posts} showBoard emptyMessage="아직은 조용한 무대 뒤. 첫 번째 이야기를 남겨주세요." />
        <div className="board-directory">
          <span className="eyebrow">EXPLORE THE TENT</span>
          <div>{boards.map((board) => <Link key={board.id} href={`/boards/${board.slug}`}>{board.name} <span aria-hidden="true">↗</span></Link>)}</div>
        </div>
      </section>

      <section className="container invitation-section">
        <div className="invitation">
          <div><p className="eyebrow">ONE MORE THING BEFORE YOU GO</p><h2>좋은 구경엔, 좋은 대화가 따라오죠.</h2><p>당신의 이야기도 이 무대의 일부가 될 수 있어요.</p></div>
          <Link href={user ? "/my" : "/register"} className="btn btn-primary">{user ? "이야기 남기기" : "함께 이야기하기"} <span aria-hidden="true">↗</span></Link>
          <span className="ticket-stub" aria-hidden="true">ADMIT<br /><b>YOU</b><span>NO. 0001</span></span>
        </div>
      </section>
    </div>
  );
}
