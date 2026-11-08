import Image from "next/image";

export default function AboutPage() {
  return (
    <section className="about-section">

      {/* LEFT */}
      <div className="about-left">
        <Image
          src="/banal.png"
          alt="Arvin"
          className="about-image"
          width={400}
          height={500}
        />
      </div>

      {/* RIGHT */}
      <div className="about-right">

        <div className="about-card">
          <h1>About Me</h1>

          <p>
            Hi! I&apos;m Arvin Jay Puncia, a BSIT student and aspiring web developer passionate about creating modern, responsive, and user-friendly web applications. I enjoy learning new technologies, building creative projects, and continuously improving my skills in web development. Outside of coding, I enjoy gaming, football, badminton, anime, and music.
          </p>
        </div>

        <div className="skills-card">

          <h2>💻 Skills &amp; Technologies</h2>

          <div className="skills-tags">
            <span>HTML</span>
            <span>CSS</span>
            <span>JavaScript</span>
            <span>TypeScript</span>
            <span>React</span>
            <span>Next.js</span>
            <span>Tailwind CSS</span>
            <span>MySQL</span>
            <span>Git</span>
            <span>GitHub</span>
            <span>Responsive Design</span>
            <span>UI/UX Design</span>
          </div>

        </div>

      </div>

    </section>
  );
}