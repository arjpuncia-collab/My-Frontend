import Image from "next/image";

export default function Project() {
  const projects = [
    {
      title: "Calculator",
      image: "/calc.png",
      desc: "A simple calculator application.",
      tech: ["HTML", "CSS", "JavaScript"],
    },
    {
      title: "Distance Converter",
      image: "/converter.png",
      desc: "A simple distance conversion application.",
      tech: ["HTML", "CSS", "JavaScript"],
    },
    {
      title: "Student management system",
      image: "/student.png",
      desc: "A modern student records management platform.",
      tech: ["HTML", "CSS", "JavaScript", "MySQL"],
    },
    {
      title: "Todo List",
      image: "/todo-list.png",
      desc: "A simple todo list application.",
      tech: ["HTML", "CSS", "JavaScript"],
    },
  ];

  return (
    <section className="project-section">
      <h1 className="project-title">Latest Project</h1>

      <div className="project-grid">
        {projects.map((project, index) => (
          <div className="project-card" key={index}>

            <div className="project-image-wrapper">
              <Image
                src={project.image}
                alt={project.title}
                width={400}
                height={250}
                className="project-image"
              />
            </div>

            <div className="project-content">
              <h2>{project.title}</h2>

              <p>{project.desc}</p>

              <div className="tech-tags">
                {project.tech.map((tech) => (
                  <span key={tech}>{tech}</span>
                ))}
              </div>

            </div>

          </div>
        ))}
      </div>
    </section>
  );
}