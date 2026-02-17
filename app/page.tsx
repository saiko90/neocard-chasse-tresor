'use client';

import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { sendGAEvent } from '@next/third-parties/google';
import { ArrowLeft, Crosshair, Send, Loader2, Lock, MapPin, Sparkles, Fingerprint, AlertTriangle, CalendarDays, Scale } from 'lucide-react';

const TiltCard = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02, rotateX: 5, rotateY: -5 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`relative rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50 pointer-events-none" />
      {children}
    </motion.div>
  );
};

export default function ExtremeTreasureHunt() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isIdle, setIsIdle] = useState(true); 

  const { scrollYProgress } = useScroll();
  const yBg = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacityHero = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scaleHero = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      setIsIdle(false);
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => setIsIdle(true), 2000); 
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (isIdle) {
      const moveRandomly = () => {
        const randomX = Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000);
        const randomY = Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000);
        setMousePosition({ x: randomX, y: randomY });
      };
      moveRandomly();
      intervalId = setInterval(moveRandomly, 4000);
    }
    return () => clearInterval(intervalId);
  }, [isIdle]);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const response = await fetch('https://n8n-latest-fsq5.onrender.com/webhook/chasse-tresor-inscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: email,
          source: 'Landing Page Chasse 2026',
          timestamp: new Date().toISOString()
        })
      });
      if (response.ok) {
        setStatus('success');
        setEmail('');
        
        // NOUVEAU : On envoie l'événement à Google Analytics !
        sendGAEvent('event', 'generate_lead', {
          method: 'treasure_hunt_form',
        });

      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error("Erreur de connexion n8n:", error);
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-hidden relative selection:bg-amber-500 selection:text-black">
      
      {/* BOUTON RETOUR MISSION */}
      <motion.a
        href="https://www.neocard.ch"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        className="fixed top-6 left-6 z-[100] flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-slate-400 hover:text-amber-500 hover:border-amber-500/50 transition-all group"
      >
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        <span className="text-xs font-mono uppercase tracking-[0.2em]">Quitter la mission</span>
      </motion.a>

      {/* BACKGROUND FX */}
      <div className="fixed inset-0 opacity-20 mix-blend-overlay z-0 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      
      <motion.div 
        className="fixed top-0 left-0 w-[800px] h-[800px] bg-amber-600/20 rounded-full blur-[150px] pointer-events-none z-0"
        animate={{ x: mousePosition.x - 400, y: mousePosition.y - 400 }}
        transition={isIdle ? { type: "tween", ease: "easeInOut", duration: 4 } : { type: "tween", ease: "backOut", duration: 0.5 }}
      />
      
      <motion.div 
        style={{ y: yBg }}
        className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] z-0 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"
      />

      {/* HERO SECTION */}
      <motion.section 
        style={{ opacity: opacityHero, scale: scaleHero }}
        className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 z-10 pt-20"
      >
        <motion.div 
          initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: "easeOut", type: "spring" }}
          className="relative inline-flex items-center gap-4 px-8 py-4 rounded-xl border-2 border-amber-500 bg-amber-500/10 backdrop-blur-xl mb-12 shadow-[0_0_50px_rgba(245,158,11,0.4)] group overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/0 via-amber-500/20 to-amber-500/0 -translate-x-full group-hover:animate-[shimmer_2s_infinite]" />
          <CalendarDays className="w-8 h-8 text-amber-400 animate-pulse" />
          <div className="text-left">
            <p className="text-amber-500 text-[10px] font-mono tracking-[0.3em] uppercase mb-1">Top Départ & Premier Indice</p>
            <p className="text-white text-xl md:text-2xl font-black uppercase tracking-widest">Samedi 28 Février — 05H00</p>
          </div>
        </motion.div>

        <h1 className="text-7xl md:text-[9rem] font-black tracking-tighter leading-none mb-6 relative">
          <span className="absolute inset-0 blur-2xl opacity-50 bg-gradient-to-r from-amber-400 via-yellow-600 to-amber-400 bg-clip-text text-transparent animate-pulse">CHASSE AU TRÉSOR</span>
          <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-300 to-white">CHASSE AU TRÉSOR</span>
        </h1>

        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.3, duration: 0.8 }} className="relative group mb-12">
          <div className="absolute -inset-1 bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-600 rounded-lg blur opacity-40 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
          <h2 className="relative px-8 py-4 bg-black border border-white/10 rounded-lg text-4xl md:text-5xl font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-yellow-500">Édition 2026</h2>
        </motion.div>

        <p className="text-xl md:text-2xl text-slate-300 max-w-2xl font-light mb-12 drop-shadow-md">
          Un Ticket d'Or d'une valeur de <strong className="text-amber-400">1500 CHF</strong> valable sur toute la boutique NeoCard.ch est dissimulé dans les montagnes. 
          Inscrivez-vous avant le lancement pour recevoir les indices.
        </p>

        <a href="#radar" className="group relative px-12 py-5 font-bold text-black rounded-full overflow-hidden bg-amber-500 transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(245,158,11,0.6)]">
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
          <span className="relative flex items-center gap-3 tracking-widest uppercase text-sm">Rejoindre le radar <Crosshair className="w-5 h-5 animate-spin-slow" /></span>
        </a>
      </motion.section>

      {/* SECTION INSCRIPTION */}
      <section id="radar" className="py-32 px-4 relative z-10">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <TiltCard className="p-10 md:p-14">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-50" />
            <AnimatePresence mode="wait">
              {status === 'success' ? (
                <motion.div key="success" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
                  <Fingerprint className="w-20 h-20 text-amber-500 mx-auto mb-6 animate-pulse" />
                  <h3 className="text-3xl font-serif text-white mb-2">Empreinte Validée</h3>
                  <p className="text-slate-400">Soyez prêt le samedi 28 février à 05h00.</p>
                </motion.div>
              ) : (
                <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20"><Sparkles className="w-8 h-8 text-amber-400" /></div>
                    <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-white">Connexion<br/>au Réseau</h3>
                  </div>
                  <p className="text-slate-400 mb-10 text-lg font-light">Entrez votre email pour recevoir l'Indice Alpha dès l'ouverture.</p>
                  <form onSubmit={handleSubscribe} className="space-y-6">
                    <div className="relative group">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-xl blur opacity-20 group-hover:opacity-50 transition duration-500"></div>
                      <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="coordonnees@agent.com" className="relative w-full bg-black/80 backdrop-blur-md border border-white/10 rounded-xl px-6 py-5 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-all font-mono" />
                    </div>
                    {status === 'error' && <p className="text-rose-500 text-sm flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> Erreur de transmission réseau.</p>}
                    <button disabled={status === 'sending'} type="submit" className="w-full relative overflow-hidden bg-white text-black font-black py-5 rounded-xl transition-all hover:bg-slate-200 disabled:opacity-50 flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-sm">
                      {status === 'sending' ? <><Loader2 className="w-5 h-5 animate-spin" /> SYNCHRONISATION...</> : <><Send className="w-5 h-5" /> Activer le Radar</>}
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </TiltCard>

          <div className="space-y-6 perspective-1000">
            <h4 className="text-amber-500 font-mono text-sm tracking-widest uppercase mb-8 flex items-center gap-2">
              <span className="w-2 h-2 bg-amber-500 rounded-full animate-ping" /> Chronologie des Transmissions
            </h4>
            {[
              { id: "01", status: "LOCKED", title: "Indice Alpha", date: "Déverrouillage : Samedi 28.02 - 05:00", delay: 0 },
              { id: "02", status: "LOCKED", title: "Indice Bravo", date: "Déverrouillage : Dimanche 01.03", delay: 0.1 },
              { id: "03", status: "LOCKED", title: "Indice Charlie", date: "Déverrouillage : Mercredi 04.03", delay: 0.2 },
            ].map((clue) => (
              <motion.div key={clue.id} initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: clue.delay, type: "spring" }} className="relative p-6 rounded-xl border backdrop-blur-md flex items-center gap-6 overflow-hidden bg-white/5 border-white/10 opacity-70">
                <div className="font-black text-4xl text-white/10">{clue.id}</div>
                <div className="flex-1">
                  <h5 className="text-xl font-bold mb-1 text-slate-500">{clue.title}</h5>
                  <p className="text-xs font-mono uppercase tracking-widest text-amber-500/80">{clue.date}</p>
                </div>
                <div className="p-4 rounded-full border border-white/10 text-slate-600 bg-black/50"><Lock className="w-6 h-6" /></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* SECTION EXPLICATION DE LA MISSION */}
      <section className="py-24 px-4 relative z-10 bg-gradient-to-b from-transparent to-slate-950/30">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-12">
            <MapPin className="w-6 h-6 text-amber-500" />
            <h3 className="text-2xl font-black uppercase tracking-[0.3em] text-white">Protocole de Recherche</h3>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              { 
                time: "Phase 1: Samedi 05:00", 
                desc: "Révélation de l'Indice Alpha. Le réseau s'active, la traque commence.",
                icon: <Sparkles className="w-5 h-5 text-amber-500" />
              },
              { 
                time: "Phase 2: Dimanche 05:00", 
                desc: "Si le Ticket est toujours furtif, l'Indice Bravo est injecté sur le radar.",
                icon: <Crosshair className="w-5 h-5 text-amber-500" />
              },
              { 
                time: "Phase 3: Mercredi 05:00", 
                desc: "Ultime transmission : l'Indice Charlie, une précision chirurgicale pour clore la mission.",
                icon: <Send className="w-5 h-5 text-amber-500" />
              }
            ].map((phase, i) => (
              <div key={i} className="p-6 rounded-xl border border-white/5 bg-white/5 backdrop-blur-sm">
                <div className="mb-4">{phase.icon}</div>
                <h4 className="text-amber-500 font-mono text-xs uppercase tracking-widest mb-2">{phase.time}</h4>
                <p className="text-slate-400 text-sm leading-relaxed">{phase.desc}</p>
              </div>
            ))}
          </div>

          <TiltCard className="p-8 border-amber-500/20 bg-amber-500/5">
            <div className="flex items-start gap-6">
              <div className="p-3 bg-amber-500/20 rounded-full">
                <AlertTriangle className="w-6 h-6 text-amber-500" />
              </div>
              <div>
                <h4 className="text-white font-bold uppercase tracking-widest mb-3">Directive de Sécurité impérative</h4>
                <p className="text-slate-400 text-sm leading-relaxed">
                  L'agent en quête du Ticket d'Or ne doit en aucun cas se mettre en péril. 
                  La cache est située dans un lieu <span className="text-white font-medium">accessible à tous</span>, sans nécessité d'escalade, de franchissement dangereux ou d'activité extrême. 
                  Bien que le Ticket soit <span className="text-amber-500 font-medium italic">invisible au regard ordinaire</span>, son accès reste sûr et conforme aux sentiers publics. Respectez la montagne, elle est votre terrain de jeu, pas votre adversaire.
                </p>
              </div>
            </div>
          </TiltCard>
        </div>
      </section>

      {/* SECTION RÈGLEMENT OFFICIEL */}
      <section id="reglement" className="py-24 px-4 relative z-10 border-t border-white/5 bg-slate-950/30">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-12">
            <Scale className="w-6 h-6 text-amber-500" />
            <h3 className="text-2xl font-black uppercase tracking-[0.3em] text-white">Règlement Officiel</h3>
          </div>
          
          <TiltCard className="p-8 md:p-12 text-slate-400 text-sm leading-relaxed space-y-8 font-light">
            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-4">
                <h4 className="text-white font-bold uppercase tracking-widest text-xs border-b border-amber-500/30 pb-2">1. Organisation</h4>
                <p>La chasse au trésor est organisée par <strong>NeoCard - M. Kaeser</strong>, domicilié à Route de Derborence 18, 1976 Aven, Valais, Suisse.</p>
                
                <h4 className="text-white font-bold uppercase tracking-widest text-xs border-b border-amber-500/30 pb-2 pt-4">2. Participation</h4>
                <p>La participation est <strong>gratuite</strong> et sans obligation d'achat. Elle est ouverte à toute personne physique majeure résidant en Suisse au moment du lancement.</p>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-white font-bold uppercase tracking-widest text-xs border-b border-amber-500/30 pb-2">3. Le Gain</h4>
                <p>Le lot unique est un "Ticket d'Or" physique d'une valeur faciale de <strong>1500 CHF</strong>, valable comme crédit sur l'ensemble des services digitaux et produits de NeoCard.ch.</p>
                
                <h4 className="text-white font-bold uppercase tracking-widest text-xs border-b border-amber-500/30 pb-2 pt-4">4. Conditions de Victoire</h4>
                <p>Le gagnant est la première personne à découvrir l'emplacement physique du ticket et à scanner le code de validation présent sur celui-ci. Tout recours juridique est exclu.</p>
              </div>
            </div>
            
            <div className="pt-6 border-t border-white/5 text-[10px] uppercase tracking-widest text-center opacity-60">
              Inscription via email requise pour la réception des coordonnées cryptographiques.
            </div>
          </TiltCard>
        </div>
      </section>

      <footer className="py-12 text-center border-t border-white/5 bg-black/80 backdrop-blur-xl relative z-10">
        <div className="flex justify-center gap-8 mb-6">
          <a href="mailto:contact@neocard.ch" className="text-[10px] text-slate-500 hover:text-amber-500 transition-colors uppercase tracking-widest font-mono">Support</a>
        </div>
        <p className="text-slate-600 text-xs font-mono tracking-[0.3em]">
          NEOCARD SYS // PROPRIÉTÉ DE M. KAESER // VALAIS 2026
        </p>
      </footer>
    </div>
  );
}