/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  Terminal, 
  User, 
  Skull, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle,
  ChevronRight,
  Info
} from 'lucide-react';
import { CREW_MEMBERS, HEIST_STEPS, CrewMember, HeistStep, HeistChoice } from './constants';

type GameState = 'intro' | 'crew_select' | 'planning' | 'outcome';

export default function App() {
  const [state, setState] = useState<GameState>('intro');
  const [selectedCrew, setSelectedCrew] = useState<CrewMember[]>([]);
  const [currentStepId, setCurrentStepId] = useState<string>('entry');
  const [risk, setRisk] = useState<number>(0);
  const [history, setHistory] = useState<{ step: string; choice: string }[]>([]);
  const [outcome, setOutcome] = useState<{ success: boolean; message: string } | null>(null);

  const startGame = () => setState('crew_select');

  const toggleCrewMember = (member: CrewMember) => {
    if (selectedCrew.find(m => m.id === member.id)) {
      setSelectedCrew(selectedCrew.filter(m => m.id !== member.id));
    } else if (selectedCrew.length < 2) {
      setSelectedCrew([...selectedCrew, member]);
    }
  };

  const startPlanning = () => {
    if (selectedCrew.length === 2) {
      setState('planning');
    }
  };

  const makeChoice = (choice: HeistChoice) => {
    const newRisk = risk + choice.riskModifier;
    setRisk(newRisk);
    setHistory([...history, { step: currentStepId, choice: choice.text }]);

    if (choice.isTerminal) {
      // Final calculation
      const successChance = 1 - newRisk;
      const roll = Math.random();
      
      // Apply perks
      let finalSuccessChance = successChance;
      if (selectedCrew.some(m => m.role === 'Driver') && choice.id === 'wheels') {
        finalSuccessChance += 0.15;
      }
      if (selectedCrew.some(m => m.role === 'Infiltrator') && choice.id === 'sewers') {
        finalSuccessChance += 0.1;
      }

      if (roll < finalSuccessChance) {
        setOutcome({
          success: true,
          message: `The Diamond of Midnight is yours. You vanished into the night like shadows. The Syndicate is pleased.`
        });
      } else {
        setOutcome({
          success: false,
          message: `Blue lights fill your rearview mirror. The backup units were faster than expected. You're heading to Blackwood Penitentiary.`
        });
      }
      setState('outcome');
    } else if (choice.nextStepId) {
      setCurrentStepId(choice.nextStepId);
    }
  };

  const resetGame = () => {
    setState('intro');
    setSelectedCrew([]);
    setCurrentStepId('entry');
    setRisk(0);
    setHistory([]);
    setOutcome(null);
  };

  return (
    <div className="min-h-screen bg-black text-slate-200 font-sans selection:bg-red-500 selection:text-white flex flex-col items-center overflow-hidden">
      <AnimatePresence mode="wait">
        {state === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-md w-full"
          >
            <motion.div 
              animate={{ 
                rotate: [0, 5, -5, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{ repeat: Infinity, duration: 4 }}
              className="mb-8 p-6 rounded-full bg-red-950/20 border border-red-900/50"
            >
              <Skull className="w-24 h-24 text-red-600" />
            </motion.div>
            <h1 className="text-4xl font-bold tracking-tighter mb-4 text-white uppercase italic">
              Midnight Syndicate
            </h1>
            <p className="text-slate-400 mb-12 text-lg leading-relaxed">
              The Diamond of Midnight awaits in a high-security vault. Your task is simple: Get in, get it, get out.
            </p>
            <button
              onClick={startGame}
              className="w-full py-4 px-8 bg-red-700 hover:bg-red-600 text-white font-bold rounded-lg transition-all transform active:scale-95 shadow-[0_0_20px_rgba(185,28,28,0.4)] flex items-center justify-center gap-2 text-lg uppercase tracking-widest"
            >
              Begin Infiltration <ChevronRight className="w-6 h-6" />
            </button>
          </motion.div>
        )}

        {state === 'crew_select' && (
          <motion.div
            key="crew_select"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 w-full max-w-md flex flex-col p-6"
          >
            <header className="mb-8">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2 text-red-500">
                  <Terminal className="w-4 h-4" />
                  <span className="text-xs font-mono uppercase tracking-widest">Operation: Obsidian Shadow</span>
                </div>
                <button 
                  onClick={resetGame}
                  className="text-[10px] font-mono text-slate-500 hover:text-red-500 uppercase tracking-widest border border-slate-800 px-2 py-1 rounded transition-colors"
                >
                  Start Over
                </button>
              </div>
              <h2 className="text-3xl font-bold text-white">Assemble Your Crew</h2>
              <p className="text-slate-400 text-sm mt-1">Select 2 specialists for the mission.</p>
            </header>

            <div className="space-y-4 flex-1 overflow-y-auto pb-24 scrollbar-hide">
              {CREW_MEMBERS.map((member) => {
                const isSelected = selectedCrew.find(m => m.id === member.id);
                return (
                  <motion.div
                    key={member.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => toggleCrewMember(member)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer relative overflow-hidden ${
                      isSelected 
                        ? 'bg-red-900/20 border-red-600 shadow-[0_0_15px_rgba(220,38,38,0.1)]' 
                        : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg ${isSelected ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                        <User className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <h3 className="font-bold text-lg text-white leading-none">{member.name}</h3>
                          <span className="text-[10px] font-mono bg-slate-800 px-2 py-1 rounded text-slate-400 uppercase tracking-tighter">
                            {member.role}
                          </span>
                        </div>
                        <p className="text-sm text-slate-400 leading-snug mb-2">{member.description}</p>
                        <div className="flex items-center gap-2">
                          <Info className="w-3 h-3 text-red-500" />
                          <span className="text-xs text-red-500/80 italic">{member.perk}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/80 to-transparent">
              <button
                disabled={selectedCrew.length !== 2}
                onClick={startPlanning}
                className={`w-full py-4 rounded-lg font-bold text-lg uppercase tracking-widest transition-all ${
                  selectedCrew.length === 2
                    ? 'bg-red-700 text-white shadow-[0_0_20px_rgba(185,28,28,0.4)]'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-50'
                }`}
              >
                Proceed to Heist ({selectedCrew.length}/2)
              </button>
            </div>
          </motion.div>
        )}

        {state === 'planning' && (
          <motion.div
            key="planning"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="flex-1 w-full max-w-md flex flex-col p-6 h-screen"
          >
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-red-500" />
                <span className="text-sm font-mono text-red-500">PHASE: ACTION</span>
              </div>
              <div className="flex items-center gap-2 bg-red-950/30 border border-red-900/50 px-3 py-1 rounded-full text-xs">
                <AlertTriangle className="w-3 h-3 text-red-400" />
                <span className="text-red-400 uppercase">Suspicion: {(risk * 100).toFixed(0)}%</span>
              </div>
            </div>

            <div className="flex-1 flex flex-col overflow-y-auto scrollbar-hide">
              <motion.div
                key={currentStepId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                <h2 className="text-sm font-mono text-slate-500 uppercase tracking-[0.2em] mb-2">Location: {HEIST_STEPS[currentStepId].title}</h2>
                <p className="text-2xl font-bold text-white leading-tight mb-4">
                  {HEIST_STEPS[currentStepId].description}
                </p>
                
                <div className="flex gap-2 flex-wrap mb-6">
                  {selectedCrew.map(member => (
                    <div key={member.id} className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1 rounded-full text-[10px] text-slate-400 uppercase">
                      <User className="w-3 h-3" /> {member.name}
                    </div>
                  ))}
                </div>
              </motion.div>

              <div className="space-y-4 mb-24">
                {HEIST_STEPS[currentStepId].choices.map((choice) => (
                  <motion.button
                    key={choice.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => makeChoice(choice)}
                    className="w-full text-left p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-red-900 hover:bg-slate-900 transition-all flex items-center justify-between group"
                  >
                    <div className="flex-1">
                      <p className="text-white font-medium text-lg leading-tight mb-1">{choice.text}</p>
                      <p className="text-xs text-slate-500 italic">{choice.consequence}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-red-500 transition-colors" />
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {state === 'outcome' && (
          <motion.div
            key="outcome"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`flex-1 flex flex-col items-center justify-center p-8 text-center max-w-md w-full ${
              outcome?.success ? 'bg-emerald-950/10' : 'bg-red-950/10'
            }`}
          >
            <div className={`mb-8 p-8 rounded-full border-2 ${
              outcome?.success ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-500' : 'bg-red-500/10 border-red-500/50 text-red-500'
            }`}>
              {outcome?.success ? <CheckCircle2 className="w-20 h-20" /> : <XCircle className="w-20 h-20" />}
            </div>
            
            <h2 className="text-4xl font-bold text-white mb-2 uppercase tracking-tighter">
              {outcome?.success ? 'Mission Success' : 'Busted'}
            </h2>
            <div className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-6">
              Result Log #{Math.floor(Math.random() * 10000)}
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm mb-12">
              <p className="text-lg text-slate-300 leading-relaxed italic">
                "{outcome?.message}"
              </p>
            </div>

            <div className="w-full space-y-4">
              <button
                onClick={resetGame}
                className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest text-lg transition-all ${
                  outcome?.success 
                    ? 'bg-emerald-600 hover:bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]' 
                    : 'bg-red-700 hover:bg-red-600 shadow-[0_0_20px_rgba(185,28,28,0.3)]'
                }`}
              >
                Plan New Heist
              </button>
              
              <div className="flex flex-col gap-2 pt-4 border-t border-slate-800 w-full">
                <p className="text-[10px] text-slate-500 uppercase tracking-tighter">Mission History</p>
                <div className="flex flex-wrap justify-center gap-1">
                  {history.map((h, i) => (
                    <span key={i} className="px-2 py-1 bg-slate-900 border border-slate-800 rounded text-[9px] text-slate-400">
                      {h.choice}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
