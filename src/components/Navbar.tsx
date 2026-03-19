import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HoverLinks from "./HoverLinks";
import Lenis from '@studio-freight/lenis';
import { gsap } from "gsap";
import "./styles/Navbar.css";

// On enregistre uniquement ScrollTrigger car ScrollSmoother est supprimé
gsap.registerPlugin(ScrollTrigger);

// On exporte l'instance Lenis au cas où d'autres composants en auraient besoin
export let lenisInstance: Lenis | null = null;

const Navbar = () => {
  useEffect(() => {
    // 1. Initialisation de Lenis
    lenisInstance = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    // 2. Synchronisation de Lenis avec ScrollTrigger
    lenisInstance.on('scroll', ScrollTrigger.update);

    function raf(time: number) {
      lenisInstance?.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // 3. Gestion des clics sur les liens (Smooth Scroll)
    const links = document.querySelectorAll(".header ul a");
    
    links.forEach((elem) => {
      const element = elem as HTMLAnchorElement;
      
      element.addEventListener("click", (e) => {
        // On récupère l'ID de la section (ex: #about)
        const targetId = element.getAttribute("data-href");
        
        if (targetId && targetId.startsWith("#")) {
          e.preventDefault();
          // Utilisation de la méthode scrollTo de Lenis
          lenisInstance?.scrollTo(targetId, {
            offset: 0,
            duration: 1.5,
            immediate: false,
          });
        }
      });
    });

    // Nettoyage à la destruction du composant
    return () => {
      lenisInstance?.destroy();
      lenisInstance = null;
    };
  }, []);

  return (
    <>
      <div className="header">
        <a href="/#" className="navbar-title" data-cursor="disable">
          Logo
        </a>
        <a
          href="mailto:example@mail.com"
          className="navbar-connect"
          data-cursor="disable"
        >
          max.keller@outlook.fr
        </a>
        <ul>
          <li>
            <a data-href="#about" href="#about">
              <HoverLinks text="ABOUT" />
            </a>
          </li>
          <li>
            <a data-href="#work" href="#work">
              <HoverLinks text="WORK" />
            </a>
          </li>
          <li>
            <a data-href="#contact" href="#contact">
              <HoverLinks text="CONTACT" />
            </a>
          </li>
        </ul>
      </div>

      <div className="landing-circle1"></div>
      <div className="landing-circle2"></div>
      <div className="nav-fade"></div>
    </>
  );
};

export default Navbar;