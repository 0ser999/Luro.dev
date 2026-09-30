import Reveal from "./Reveal.jsx";
import { useLang } from "../i18n.jsx";

export default function Velyro() {
  const { lang } = useLang();
  const fr = lang === "fr";
  return (
    <Reveal className="velyro-project">
      <div className="project-copy">
        <span className="project-kicker">01 / {fr ? "MON LOGICIEL" : "MY SOFTWARE"}</span>
        <div className="project-status"><span className="status-dot" /> {fr ? "Disponible · Toujours en évolution" : "Available · Always evolving"}</div>
        <h3>velyro<span>.lol</span></h3>
        <p className="project-headline">{fr ? "L’optimisation PC. Une nouvelle approche." : "PC optimization. A fresh approach."}</p>
        <p className="project-description">{fr ? "Velyro est un logiciel d’optimisation PC abouti. Je continue de le développer et de l’améliorer, avec la même attention portée aux performances et à l’expérience utilisateur." : "Velyro is a complete PC optimization application. I keep developing and refining it, with the same focus on performance and the user experience."}</p>
        <div className="project-tags"><span>Software</span><span>PC optimization</span><span>Windows</span></div>
        <a className="btn btn-dark" href="https://velyro.lol" target="_blank" rel="noopener noreferrer">{fr ? "Découvrir Velyro" : "Explore Velyro"} <span aria-hidden="true">↗</span></a>
      </div>
      <div className="project-art" aria-hidden="true">
        <div className="orbit orbit-one" /><div className="orbit orbit-two" />
        <div className="velyro-symbol">v<span>.</span></div>
        <div className="art-label"><span className="status-dot" /> {fr ? "UNE NOUVELLE ÉNERGIE POUR TON PC" : "NEW ENERGY FOR YOUR PC"}</div>
        <div className="art-caption"><span>VELYRO / SOFTWARE</span><span>↗</span></div>
      </div>
    </Reveal>
  );
}

