'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Send, Loader2, CheckCircle2, ShieldCheck, Crown, Terminal } from 'lucide-react';
import confetti from 'canvas-confetti'; // Optionnel : installez 'canvas-confetti' et '@types/canvas-confetti' si vous voulez des confettis, sinon retirez l'effet.

// --- COMPOSANTS RÉUTILISABLES (Pour garder la cohérence visuelle) ---

const TiltCard = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`relative rounded-2xl border border-amber-500/30 bg-black/60 backdrop-blur-xl shadow-[0_0_80px_rgba(245,158,11,0.2)] overflow-hidden ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent opacity-50 pointer-events-none" />
      {children}
    </motion.div>
  );
};

export default function GoldenTicketPage() {
  const [formData, setFormData] = useState({ nom: '', prenom: '' });
  const [status, setStatus] = useState<'validating' | 'idle' | 'sending' | 'success' | 'error'>('validating');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Effet de souris (identique à la page principale)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    
    // Simulation de validation du "QR Code" au chargement
    setTimeout(() => {
      setStatus('idle');
      // Petit effet confetti doré au succès du chargement
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#fbbf24', '#d97706', '#ffffff']
      });
    }, 2500);

    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    try {
      // ⚠️ REMPLACE CETTE URL PAR TON NOUVEAU WEBHOOK N8N POUR LE GAGNANT
      const response = await fetch('https://ton-n8n-instance.onrender.com/webhook/chasse-tresor-gagnant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          nom: formData.nom,
          prenom: formData.prenom,
          source: 'QR CODE TICKET OR',
          timestamp: new Date().toISOString(),
          deviceInfo: navigator.userAgent
        })
      });

      if (response.ok) {
        setStatus('success');
        confetti({
          particleCount: 300,
          spread: 100,
          origin: { y: 0.6 },
          colors: ['#fbbf24', '#d97706', '#fff']
        });
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error("Erreur webhook:", error);
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-hidden relative selection:bg-amber-500 selection:text-black flex items-center justify-center p-4">
      
      {/* --- BACKGROUND FX --- */}
      <div className="fixed inset-0 opacity-20 mix-blend-overlay z-0 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      
      <motion.div 
        className="fixed top-0 left-0 w-[600px] h-[600px] bg-amber-600/20 rounded-full blur-[120px] pointer-events-none z-0"
        animate={{ x: mousePosition.x - 300, y: mousePosition.y - 300 }}
        transition={{ type: "tween", ease: "backOut", duration: 0.5 }}
      />
      
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] z-0 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]" />

      {/* --- CONTENU PRINCIPAL --- */}
      <div className="relative z-10 w-full max-w-lg">
        
        {/* En-tête NeoCard */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="text-center mb-8"
        >
           <p className="text-xs font-mono text-slate-500 tracking-[0.5em] uppercase mb-2">Protocole Neocard // Fin de mission</p>
           <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-500 to-amber-300 animate-text-shimmer">
             Ticket d'Or
           </h1>
        </motion.div>

        <TiltCard className="p-8 md:p-10 border-amber-500/40 shadow-[0_0_100px_rgba(245,158,11,0.15)]">
          <AnimatePresence mode="wait">
            
            {/* ÉTAT 1 : SIMULATION DE SCAN/VALIDATION */}
            {status === 'validating' && (
              <motion.div 
                key="validating"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col items-center justify-center py-12 text-center"
              >
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-amber-500 rounded-full animate-ping opacity-20"></div>
                  <Loader2 className="w-16 h-16 text-amber-500 animate-spin" />
                </div>
                <h2 className="text-xl font-mono text-amber-500 uppercase tracking-widest animate-pulse">Authentification...</h2>
                <p className="text-slate-500 text-xs mt-2 font-mono">Vérification de la signature cryptographique du ticket.</p>
              </motion.div>
            )}

            {/* ÉTAT 2 : FORMULAIRE GAGNANT */}
            {(status === 'idle' || status === 'sending' || status === 'error') && (
              <motion.div
                key="form"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="text-center mb-8">
                  <motion.div 
                    initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                    className="w-20 h-20 bg-amber-500 rounded-full mx-auto mb-4 flex items-center justify-center shadow-[0_0_40px_rgba(245,158,11,0.6)]"
                  >
                    <Trophy className="w-10 h-10 text-black fill-current" />
                  </motion.div>
                  <h2 className="text-2xl font-bold text-white mb-2 uppercase">Félicitations Agent</h2>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    Vous détenez le Ticket Unique. Le crédit de <span className="text-amber-400 font-bold">1500 CHF</span> est à vous.
                    Identifiez-vous pour que Michaël valide la découverte.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-widest text-slate-500 pl-1">Prénom</label>
                      <input 
                        type="text" 
                        required 
                        value={formData.prenom}
                        onChange={(e) => setFormData({...formData, prenom: e.target.value})}
                        className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-amber-500 focus:outline-none focus:bg-amber-500/5 transition-colors font-mono"
                        placeholder="Michaël"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-widest text-slate-500 pl-1">Nom</label>
                      <input 
                        type="text" 
                        required 
                        value={formData.nom}
                        onChange={(e) => setFormData({...formData, nom: e.target.value})}
                        className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-amber-500 focus:outline-none focus:bg-amber-500/5 transition-colors font-mono"
                        placeholder="Kaeser"
                      />
                    </div>
                  </div>

                  {status === 'error' && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-400 text-xs">
                       <Terminal className="w-4 h-4" /> Erreur de connexion au serveur. Réessayez.
                    </div>
                  )}

                  <button 
                    disabled={status === 'sending'} 
                    type="submit" 
                    className="w-full relative overflow-hidden bg-gradient-to-r from-amber-500 to-yellow-600 text-black font-black py-4 rounded-xl mt-4 transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2 uppercase tracking-widest text-sm"
                  >
                    {status === 'sending' ? <Loader2 className="w-5 h-5 animate-spin" /> : <><ShieldCheck className="w-5 h-5" /> Revendiquer le Trésor</>}
                  </button>
                </form>
              </motion.div>
            )}

            {/* ÉTAT 3 : SUCCÈS CONFIRMÉ */}
            {status === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <div className="w-24 h-24 mx-auto mb-6 relative">
                  <div className="absolute inset-0 bg-green-500 blur-2xl opacity-20"></div>
                  <CheckCircle2 className="w-full h-full text-green-500" />
                </div>
                <h3 className="text-3xl font-black text-white mb-4 uppercase italic">Validé !</h3>
                <p className="text-slate-400 mb-8 text-sm">
                  Votre revendication a été transmise instantanément à la direction Neocard. 
                  <br/><br/>
                  <span className="text-amber-500">Gardez le ticket physique précieusement.</span>
                  <br/>Nous allons prendre contact avec vous dans les prochaines minutes.
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-slate-500">
                  <Crown className="w-3 h-3 text-amber-500" /> Membre d'Honneur Mountain Legion
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </TiltCard>

        {/* Footer simple */}
        <div className="mt-8 text-center opacity-40">
           <img src="/logo-neocard.svg" alt="" className="h-6 mx-auto mb-2 opacity-50 grayscale hover:grayscale-0 transition-all" /> 
           <p className="text-[10px] font-mono tracking-widest">NEOCARD.CH // SECURE CHANNEL</p>
        </div>
      </div>
    </div>
  );
}