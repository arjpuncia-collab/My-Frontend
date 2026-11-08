export default function Education() {
  return (
    <section className="education-section">

      <h1 className="education-title">
        Educational Background
      </h1>

      <p className="education-subtitle">
        My academic journey and continuous pursuit of knowledge in technology and personal growth.
      </p>

      {/* College */}
      <div className="education-card">

        <div className="education-header">
          <div>
            <h3>🎓 Bachelor of Science in Information Technology</h3>
            <p>Naga College Foundation</p>
          </div>

          <span>2025 - Present</span>
        </div>

        <p className="education-description">
          Currently pursuing a degree in Information Technology, focusing on
          web development, software development, database management, and
          modern technologies.
        </p>

        <h4>🏆 Key Highlights</h4>

        <ul>
          <li>Learning React, Next.js, and TypeScript</li>
          <li>Building Responsive Web Applications</li>
          <li>Database Management using MySQL</li>
          <li>UI/UX Design and Frontend Development</li>
        </ul>

      </div>

      {/* Senior High */}
      <div className="education-card">

        <div className="education-header">
          <div>
            <h3>🎓 Senior High School</h3>
            <p>Lupi National High School</p>
          </div>

          <span>2023 - 2025</span>
        </div>

        <p className="education-description">
          Completed Senior High School while strengthening leadership,
          communication, teamwork, and academic skills.
        </p>

        <h4>🏆 Key Highlights</h4>

        <ul>
          <li>Completed Senior High School Education</li>
          <li>TESDA NC II Passer of Computer System Servicing </li>
          <li>Participated in Academic Activities</li>
          <li>Developed Leadership Skills</li>
          <li>Prepared for College and Technology Studies</li>
          
        </ul>

      </div>

      {/* Junior High */}
      <div className="education-card">

        <div className="education-header">
          <div>
            <h3>🎓 Junior High School</h3>
            <p>Lupi National High School</p>
          </div>

          <span>2019 - 2023</span>
        </div>

        <p className="education-description">
          Built a strong educational foundation while developing discipline,
          responsibility.
        </p>

        <h4>🏆 Key Highlights</h4>

        <ul>
          <li>Completed Junior High School Education</li>
          <li>Participated in School Activities</li>
          <li>Built Strong Academic Foundations</li>
        </ul>

      </div>

    </section>
  );
}