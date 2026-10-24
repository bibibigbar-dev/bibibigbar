import Link from "next/link";
import { CircusStage } from "@/components/circus-stage";
import { PostList } from "@/components/post-list";
import { getActiveBoards, getCurrentUser, getRecentPosts } from "@/lib/queries";

const acts = [
  { number: "01", symbol: "✳", title: "Where curiosity becomes a trick", english: "A CABINET OF CURIOSITIES", description: "Even a small thought gets a turn on stage. Make it, break it, and make it again.", href: "#journal", action: "See the latest notes", color: "red" },
  { number: "02", symbol: "✎", title: "Everyday life, on a tightrope", english: "NOTES FROM THE EVERYDAY", description: "The steady days and the wobbly ones. Notes and scenes picked up along the way.", href: "#about", action: "About this place", color: "blue" },
  { number: "03", symbol: "✦", title: "You are welcome on stage", english: "THERE’S ROOM FOR YOU", description: "Watching is enough. Leaving a story is welcome too. The good bits usually start together.", href: "/boards", action: "Join the boards", color: "gold" },
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
              <p className="hero-korean">A little offbeat. Still a fine little world.</p>
              <p className="hero-description">I make things, keep notes, and wander off sometimes.<br className="hidden sm:block" /> This is bibibigbar&apos;s small circus. Stay as long as you like.</p>
            </div>
          </div>
          <div className="hero-actions">
            <Link href="#program" className="btn btn-primary">See today&apos;s show <span aria-hidden="true">↗</span></Link>
            <Link href="#about" className="text-link">What is this place? <span aria-hidden="true">→</span></Link>
          </div>
          <p className="hero-footnote">NO PERFECT TRICKS. JUST A WORK IN PROGRESS.</p>
        </div>
        <CircusStage />
      </section>

      <div className="show-ribbon" aria-label="Curiosity, small experiments, everyday notes, and the odd delight">
        <div aria-hidden="true">
          <span>STAY CURIOUS</span><b>✦</b><span>MAKE A LITTLE MAGIC</span><b>✦</b><span>ENJOY THE LITTLE THINGS</span><b>✦</b><span>STAY CURIOUS</span><b>✦</b><span>MAKE A LITTLE MAGIC</span><b>✦</b>
        </div>
      </div>

      <section id="program" className="container program-section">
        <div className="section-heading">
          <div><p className="eyebrow">STEP RIGHT UP</p><h2 className="section-title">Today&apos;s program<span>✦</span></h2></div>
          <p className="section-note">Nothing grand. Nothing dull.</p>
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
          <h2>Life is live, but here<br />we are still <em>in rehearsal.</em></h2>
          <p>Hello, I&apos;m bibibigbar. This is less a finished portfolio and more a stage for the things I like and the things I&apos;m curious about. A little clumsy is fine. I make it at my own pace.</p>
          <span className="about-signature">Enjoy the show, bibibigbar <span aria-hidden="true">↗</span></span>
        </div>
        <span className="about-spark" aria-hidden="true">✧</span>
      </section>

      <section id="journal" className="container journal-section">
        <div className="section-heading">
          <div><p className="eyebrow">FRESH FROM BACKSTAGE</p><h2 className="section-title">Notes from backstage<span>✎</span></h2></div>
          <Link href="/boards" className="text-link">All stories <span aria-hidden="true">↗</span></Link>
        </div>
        <PostList posts={posts} showBoard emptyMessage="The backstage is quiet for now. Leave the first story." />
        <div className="board-directory">
          <span className="eyebrow">EXPLORE THE TENT</span>
          <div>{boards.map((board) => <Link key={board.id} href={`/boards/${board.slug}`}>{board.name} <span aria-hidden="true">↗</span></Link>)}</div>
        </div>
      </section>

      <section className="container invitation-section">
        <div className="invitation">
          <div><p className="eyebrow">ONE MORE THING BEFORE YOU GO</p><h2>A good show is better with a good conversation.</h2><p>Your story can be part of this stage.</p></div>
          <Link href={user ? "/my" : "/login"} className="btn btn-primary">{user ? "Leave a story" : "Come in"} <span aria-hidden="true">↗</span></Link>
          <span className="ticket-stub" aria-hidden="true">ADMIT<br /><b>YOU</b><span>NO. 0001</span></span>
        </div>
      </section>
    </div>
  );
}
