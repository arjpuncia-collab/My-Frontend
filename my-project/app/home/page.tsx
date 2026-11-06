import Image from "next/image";
export default function Home() {
  return (
    <main className="home">
      <section className="hero">

        {/* Left */}
        <div className="left">

          <span className="welcome">
            Welcome
          </span>

          <h1>
            Hello Everyone
            <br />
            <span>Arvin Jay Puncia</span>
          </h1>

          <p>
            I am a web developer focused on building modern,
            responsive and efficient websites using Next.js,
            React, TypeScript and Tailwind CSS.
          </p>

          <div className="stats">

            <div className="card">
              <h2>5+</h2>
              <span>Projects Completed</span>
            </div>

            <div className="card">
              <h2>BSIT</h2>
              <span>2nd Year Student</span>
            </div>

            <div className="card">
              <h2>100%</h2>
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
              alt="Arvin"
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