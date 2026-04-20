import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  life: number;
  maxLife: number;
}

export default function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: Particle[] = [];
    const numParticles = 100;
    const maxDistance = 150;
    
    // Nuances de couleur (Cyberpunk / Organique)
    const particleColors = [
      'rgba(0, 191, 166, 1)',   // Teal classique
      'rgba(0, 255, 204, 1)',   // Neon Teal
      'rgba(88, 166, 255, 1)',  // Bleu clair
      'rgba(0, 150, 136, 1)'    // Teal foncé
    ];

    let mouseX = -1000;
    let mouseY = -1000;
    let isClicking = false;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    // Fonction pour générer un nouveau noeud avec des propriétés aléatoires
    const createParticle = (): Particle => {
      const maxLife = Math.random() * 150 + 100; // Durée de vie aléatoire
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 1.2,
        vy: (Math.random() - 0.5) * 1.2,
        radius: Math.random() * 2.5 + 1, // Tailles aléatoires
        color: particleColors[Math.floor(Math.random() * particleColors.length)], // Nuance aléatoire
        life: maxLife,
        maxLife: maxLife
      };
    };

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < numParticles; i++) {
        const p = createParticle();
        // Désynchroniser les vies pour qu'elles ne disparaissent pas toutes en même temps
        p.life = Math.random() * p.maxLife; 
        particles.push(p);
      }
    };
    initParticles();

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < numParticles; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        // Rebond sur les bords
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        // Interaction avec la souris
        const dxMouse = mouseX - p.x;
        const dyMouse = mouseY - p.y;
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
        
        if (isClicking && distMouse < 250) {
          // Au clic : réaction de répulsion (onde de choc)
          const force = (250 - distMouse) / 250;
          p.x -= dxMouse * force * 0.15;
          p.y -= dyMouse * force * 0.15;
        } else if (distMouse < 180) {
          // Normal : attraction douce (aimant)
          const force = (180 - distMouse) / 180;
          p.x += dxMouse * force * 0.03;
          p.y += dyMouse * force * 0.03;
        }

        // Vie de la particule
        p.life -= 1;
        
        // Si elle meurt, elle est remplacée instantanément (le nombre reste constant)
        if (p.life <= 0) {
          particles[i] = createParticle();
          continue;
        }

        // L'opacité s'estompe au début (fade-in) et à la fin de sa vie (fade-out)
        const fadeIn = Math.min(1, (p.maxLife - p.life) / 20);
        const fadeOut = Math.min(1, p.life / 30);
        const opacity = fadeIn * fadeOut;

        // Dessin du noeud
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color.replace('1)', `${opacity})`);
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Lignes de connexion (neurones)
        for (let j = i + 1; j < numParticles; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const p2FadeIn = Math.min(1, (p2.maxLife - p2.life) / 20);
            const p2FadeOut = Math.min(1, p2.life / 30);
            const p2Opacity = p2FadeIn * p2FadeOut;
            
            // L'opacité du lien dépend de la distance et de la vie des deux noeuds
            const lineOpacity = (1 - dist / maxDistance) * opacity * p2Opacity * 0.5;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0, 191, 166, ${lineOpacity})`;
            ctx.lineWidth = 1;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
        
        // Connexion au curseur
        if (distMouse < maxDistance && !isClicking) {
           const lineOpacity = (1 - distMouse / maxDistance) * opacity * 0.4;
           ctx.beginPath();
           ctx.strokeStyle = `rgba(0, 191, 166, ${lineOpacity})`;
           ctx.lineWidth = 1;
           ctx.moveTo(p.x, p.y);
           ctx.lineTo(mouseX, mouseY);
           ctx.stroke();
        }
      }
      requestAnimationFrame(drawParticles);
    };

    let animationId = requestAnimationFrame(drawParticles);

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    const handleMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
    };
    const handleMouseDown = () => {
      isClicking = true;
    };
    const handleMouseUp = () => {
      isClicking = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 pointer-events-none z-0 mix-blend-screen opacity-80"
      aria-hidden="true"
    />
  );
}
