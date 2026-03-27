'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import Navbar from '@/components/layout/Navbar';
import { HiOutlineBeaker, HiOutlineSparkles, HiOutlineBolt, HiOutlineShieldExclamation, HiOutlineRocketLaunch, HiOutlineCheckBadge, HiOutlineClock, HiOutlineChevronDown, HiOutlineChevronUp, HiOutlineDocumentArrowDown } from 'react-icons/hi2';

const exampleDecisions = [
  'Should I leave my job to start a tech startup?',
  'Should I invest in real estate or index funds?',
  'Should I relocate to a new city for better opportunities?',
  'Should I pursue a master\'s degree or gain work experience?',
  'Should I ask for a promotion or switch companies?',
];

function SimulatorContent() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [decision, setDecision] = useState('');
  const [simulating, setSimulating] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  useEffect(() => {
    if (user) fetchHistory();
  }, [user]);

  const fetchHistory = async () => {
    const token = localStorage.getItem('nexus_token');
    const res = await fetch('/api/simulate', { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    setHistory(data.simulations || []);
  };

  const runSimulation = async () => {
    if (!decision.trim()) return;
    setSimulating(true);
    setResult(null);
    setSelectedScenario(null);

    const token = localStorage.getItem('nexus_token');
    try {
      const res = await fetch('/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ decision }),
      });
      const data = await res.json();
      setResult(data.simulation);
      fetchHistory();
    } catch (err) {
      console.error('Simulation error:', err);
    }
    setSimulating(false);
  };

  const loadSimulation = (sim) => {
    setResult(sim);
    setDecision(sim.decision);
    setSelectedScenario(null);
    setShowHistory(false);
  };

  const getRiskColor = (level) => {
    if (level < 30) return 'text-green-400';
    if (level < 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getRiskBg = (level) => {
    if (level < 30) return 'bg-green-400';
    if (level < 60) return 'bg-yellow-400';
    return 'bg-red-400';
  };

  if (loading || !user) {
    return <div className="min-h-screen bg-dark-900 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-neon-cyan/30 border-t-neon-cyan rounded-full animate-spin" />
    </div>;
  }

  return (
    <div className="min-h-screen bg-dark-900">
      <div className="fixed inset-0 bg-grid opacity-20 pointer-events-none" />
      <Navbar />
      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-display font-bold text-3xl text-white mb-2 flex items-center gap-3">
            <HiOutlineBeaker className="w-8 h-8 text-neon-purple" />
            Life Decision Simulator
          </h1>
          <p className="text-gray-400 mb-8">Input any life decision and get AI-powered future scenarios personalized to your personality.</p>
        </motion.div>

        {/* Input */}
        <motion.div
          className="card-dark mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <label className="block text-sm font-medium text-gray-400 mb-3">What decision do you want to simulate?</label>
          <textarea
            value={decision}
            onChange={(e) => setDecision(e.target.value)}
            className="input-dark min-h-[80px] resize-none mb-4"
            placeholder="e.g., Should I leave my job to start a startup?"
          />
          <div className="flex flex-wrap gap-2 mb-4">
            {exampleDecisions.map((ex, i) => (
              <button
                key={i}
                onClick={() => setDecision(ex)}
                className="text-xs px-3 py-1.5 rounded-lg bg-white/5 text-gray-400 hover:text-neon-cyan hover:bg-neon-cyan/10 border border-white/5 hover:border-neon-cyan/20 transition-all"
              >
                {ex}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={runSimulation}
              disabled={simulating || !decision.trim()}
              className="btn-primary px-8 py-3 flex items-center gap-2 disabled:opacity-50"
            >
              {simulating ? (
                <>
                  <div className="w-4 h-4 border-2 border-dark-900/30 border-t-dark-900 rounded-full animate-spin" />
                  Simulating Future...
                </>
              ) : (
                <>
                  <HiOutlineSparkles className="w-4 h-4" />
                  Simulate Decision
                </>
              )}
            </button>
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="btn-secondary px-4 py-3 flex items-center gap-2 text-sm"
            >
              <HiOutlineClock className="w-4 h-4" />
              History ({history.length})
              {showHistory ? <HiOutlineChevronUp className="w-3 h-3" /> : <HiOutlineChevronDown className="w-3 h-3" />}
            </button>
          </div>
        </motion.div>

        {/* History dropdown */}
        <AnimatePresence>
          {showHistory && history.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8 overflow-hidden"
            >
              <div className="card-dark space-y-2">
                <h3 className="text-sm font-medium text-gray-400 mb-3">Past Simulations</h3>
                {history.map((sim, i) => (
                  <button
                    key={sim._id || i}
                    onClick={() => loadSimulation(sim)}
                    className="w-full text-left p-3 rounded-xl bg-white/3 hover:bg-white/5 border border-white/5 hover:border-neon-purple/20 transition-all flex items-center gap-3"
                  >
                    <HiOutlineBeaker className="w-5 h-5 text-neon-purple flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-white truncate">{sim.decision}</div>
                      <div className="text-xs text-gray-500">{sim.scenarios?.length} scenarios • {sim.category}</div>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Simulating animation */}
        {simulating && (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="relative inline-block">
              <motion.div
                className="w-24 h-24 rounded-full border-2 border-neon-purple/30 mx-auto"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              />
              <motion.div
                className="absolute inset-2 rounded-full border-2 border-neon-cyan/30"
                animate={{ rotate: -360 }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              />
              <motion.div
                className="absolute inset-4 rounded-full border-2 border-neon-pink/30"
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <HiOutlineSparkles className="w-8 h-8 text-neon-cyan animate-pulse" />
              </div>
            </div>
            <p className="text-gray-400 mt-6">Analyzing your decision across multiple timelines...</p>
            <p className="text-gray-600 text-sm mt-1">Tailoring scenarios to your personality profile</p>
          </motion.div>
        )}

        {/* Results */}
        {result && !simulating && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Scenario cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {result.scenarios?.map((scenario, i) => (
                <motion.div
                  key={scenario.id || i}
                  className={`card-dark cursor-pointer relative overflow-hidden ${
                    selectedScenario === i ? 'border-neon-cyan/40 ring-1 ring-neon-cyan/20' : ''
                  } ${result.bestPath === i ? 'ring-1 ring-neon-green/30' : ''}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => setSelectedScenario(selectedScenario === i ? null : i)}
                >
                  {result.bestPath === i && (
                    <div className="absolute top-3 right-3">
                      <span className="flex items-center gap-1 px-2 py-1 rounded-lg bg-neon-green/15 text-neon-green text-xs font-medium">
                        <HiOutlineCheckBadge className="w-3.5 h-3.5" />
                        Best Path
                      </span>
                    </div>
                  )}

                  <h3 className="font-display font-semibold text-lg text-white mb-1 pr-20">{scenario.title}</h3>
                  
                  <div className="flex items-center gap-4 mb-4 text-xs">
                    <span className="text-gray-500">Probability: <span className="text-neon-cyan font-medium">{scenario.probability}%</span></span>
                    <span className="text-gray-500">Alignment: <span className="text-neon-purple font-medium">{scenario.alignment}%</span></span>
                  </div>

                  {/* Risk / Reward bars */}
                  <div className="space-y-2 mb-4">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-500">Risk Level</span>
                        <span className={getRiskColor(scenario.riskLevel)}>{scenario.riskLevel}%</span>
                      </div>
                      <div className="h-1.5 bg-dark-500 rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full rounded-full ${getRiskBg(scenario.riskLevel)}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${scenario.riskLevel}%` }}
                          transition={{ duration: 0.8, delay: i * 0.1 }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-500">Reward Potential</span>
                        <span className="text-neon-cyan">{scenario.reward}%</span>
                      </div>
                      <div className="h-1.5 bg-dark-500 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full bg-neon-cyan"
                          initial={{ width: 0 }}
                          animate={{ width: `${scenario.reward}%` }}
                          transition={{ duration: 0.8, delay: i * 0.1 + 0.1 }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Expanded details */}
                  <AnimatePresence>
                    {selectedScenario === i && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-4 border-t border-white/5 space-y-4">
                          <div>
                            <h4 className="text-xs font-medium text-neon-cyan mb-1 flex items-center gap-1">
                              <HiOutlineBolt className="w-3.5 h-3.5" /> Short-Term Outcome
                            </h4>
                            <p className="text-sm text-gray-400">{scenario.shortTerm}</p>
                          </div>
                          <div>
                            <h4 className="text-xs font-medium text-neon-purple mb-1 flex items-center gap-1">
                              <HiOutlineRocketLaunch className="w-3.5 h-3.5" /> Long-Term Outcome
                            </h4>
                            <p className="text-sm text-gray-400">{scenario.longTerm}</p>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <h4 className="text-xs font-medium text-red-400 mb-2 flex items-center gap-1">
                                <HiOutlineShieldExclamation className="w-3.5 h-3.5" /> Risks
                              </h4>
                              <ul className="space-y-1">
                                {scenario.risks?.map((r, ri) => (
                                  <li key={ri} className="text-xs text-gray-500 flex items-start gap-1">
                                    <span className="text-red-400 mt-0.5">•</span> {r}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h4 className="text-xs font-medium text-green-400 mb-2 flex items-center gap-1">
                                <HiOutlineRocketLaunch className="w-3.5 h-3.5" /> Opportunities
                              </h4>
                              <ul className="space-y-1">
                                {scenario.opportunities?.map((o, oi) => (
                                  <li key={oi} className="text-xs text-gray-500 flex items-start gap-1">
                                    <span className="text-green-400 mt-0.5">•</span> {o}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="text-xs text-gray-600 mt-3">
                    Click to {selectedScenario === i ? 'collapse' : 'expand'} details
                  </div>
                </motion.div>
              ))}
            </div>

            {/* AI Reasoning */}
            {result.reasoning && (
              <motion.div
                className="card-dark border-l-2 border-neon-cyan/40"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <h3 className="font-display font-semibold text-sm text-neon-cyan mb-2 flex items-center gap-2">
                  <HiOutlineSparkles className="w-4 h-4" />
                  AI Analysis – Personalized for You
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">{result.reasoning}</p>
              </motion.div>
            )}

            {/* Decision Tree Visualization */}
            <motion.div
              className="card-dark mt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <h3 className="font-display font-semibold text-sm text-white mb-4">Decision Tree</h3>
              <div className="flex flex-col items-center">
                {/* Root */}
                <div className="px-4 py-2 rounded-xl bg-neon-cyan/10 border border-neon-cyan/30 text-sm text-neon-cyan font-medium max-w-xs text-center truncate">
                  {result.decision}
                </div>
                <div className="w-px h-8 bg-white/10" />
                
                {/* Branches */}
                <div className="relative w-full">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-white/10" />
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-8 relative">
                    {result.scenarios?.map((s, i) => (
                      <div key={i} className="flex flex-col items-center">
                        <div className="w-px h-6 bg-white/10 -mt-8 mb-2" />
                        <div className={`w-full px-3 py-3 rounded-xl text-center text-xs transition-all ${
                          result.bestPath === i
                            ? 'bg-neon-green/10 border border-neon-green/30 text-neon-green'
                            : 'bg-white/3 border border-white/5 text-gray-400'
                        }`}>
                          <div className="font-medium text-white text-xs mb-1 truncate">{s.title}</div>
                          <div className="text-[10px]">{s.probability}% likely</div>
                          {result.bestPath === i && (
                            <div className="mt-1 text-[10px] flex items-center justify-center gap-1">
                              <HiOutlineCheckBadge className="w-3 h-3" /> Best
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </main>
    </div>
  );
}

export default function SimulatorPage() {
  return (
    <AuthProvider>
      <SimulatorContent />
    </AuthProvider>
  );
}
