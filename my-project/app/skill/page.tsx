import Image from "next/image";

export default function Skills() {
  const skills = [
    {
      name: "HTML",
      image: "/html.jpg",
    },
    {
      name: "CSS",
      image: "/css.jpg",
    },
    {
      name: "JavaScript",
      image: "/java.jpg",
    },
    {
      name: "Mysql",
      image: "/mysql.jpg",
    },
    {
      name: "GitHub",
      image: "/github.jpg",
    },
  ];

  return (
    <section className="skills-section">

      <h1 className="skills-title">
        My Skills
      </h1>

      <div className="skills-grid">
        {skills.map((skill) => (
          <div className="skill-card" key={skill.name}>

            <Image
              src={skill.image}
              alt={skill.name}
              width={70}
              height={70}
              className="skill-icon"
            />

            <h2>{skill.name}</h2>

          </div>
        ))}
      </div>

    </section>
  );
}