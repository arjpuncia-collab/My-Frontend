import Image from "next/image";
export default function Home() {
  return (
    <main className="home">
      <section className="hero">

        {/* Left */}
        <div className="left">

          <span className="hero-tag">
  WELCOME TO MY PORTFOLIO
</span>

<h1 className="hero-title">
  Hi, I&apos;m
  <br />
  <span>Arvin Jay Puncia</span>
</h1>

<p className="hero-description">
  BSIT Student and Aspiring Web Developer passionate about
  creating modern, responsive, and user-friendly web applications
  using Next.js, React, TypeScript, and Tailwind CSS.
</p>

          <div className="stats">

            <div className="card">
                <h2>💡</h2>
  <span>Innovation & Creativity</span>
</div>

            <div className="card">
              <h2>BSIT</h2>
  <span>Student Developer</span>
</div>

            <div className="card">
              <h2>💯</h2>
              <span>Dedication, Passion and Creativity</span>
            </div>

          </div>

          <div className="buttons">

          </div>

        </div>

        {/* Right */}
        <div className="right">

          <div className="imgBox">

            <Image
              src="/banal.png"
              alt="Portrait of Arvin Jay Puncia"
              width={400}
              height={500}
              className="profileImg"
              priority
            />

          </div>

        </div>

      </section>

    </main>
  );
}