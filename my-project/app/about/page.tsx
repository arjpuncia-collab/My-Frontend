import Image from "next/image";

export default function About() {
  return (
    <section className="about-section">

      {/* Left Side */}
      <div className="about-image">
        <Image
          src="/banal.png"
          alt="Arvin"
          width={400}
          height={550}
          className="about-img"
        />

      </div>

      {/* Right Side */}
      <div className="about-content">

        <h1>About Me</h1>

        <p>
          Hi! I&apos;m Arvin Jay Puncia, a Bachelor of Science in Information Technology (BSIT) student who is passionate about web development and creating modern digital experiences. I enjoy building responsive, user-friendly, and visually appealing websites using technologies such as HTML, CSS, JavaScript, React, and Next.js. As an aspiring developer, I am continuously learning new technologies and improving my skills to create innovative solutions that solve real-world problems. My goal is to grow as a professional developer and contribute to meaningful projects that make a positive impact.
        </p>

        <div className="info-card">
          <span>📍</span>
          <div>
            <h3>My Location</h3>
            <p>Lupi Sanfernando, Camarines Sur</p>
          </div>
        </div>

        <div className="info-card highlight-card">
          <span>📞</span>
          <div>
            <h3>My Phone Number</h3>
            <p>+63 9511458948</p>
          </div>
        </div>

      </div>

    </section>
  );
}