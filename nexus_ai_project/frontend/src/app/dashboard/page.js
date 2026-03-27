'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import Navbar from '@/components/layout/Navbar';
import AnimatedAvatar from '@/components/avatar/AnimatedAvatar';
import Link from 'next/link';
import { HiOutlineCpuChip, HiOutlineBeaker, HiOutlineChatBubbleLeftRight, HiOutlineChartBar, HiOutlineArrowTrendingUp, HiOutlineSparkles, HiOutlineClock, HiOutlineCheckBadge } from 'react-icons/hi2';

function DashboardContent() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [twin, setTwin] = useState(null);
  const [simulations, setSimulations] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    const token = localStorage.getItem('nexus_token');
    try {
      const [twinRes, simRes] = await Promise.all([
        fetch('/api/twin', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/simulate', { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      const twinData = await twinRes.json();
      const simData = await simRes.json();
      setTwin(twinData.twin);
      setSimulations(simData.simulations || []);
    } catch (err) {
      console.error('Fetch error:', err);
    }
    setLoadingData(false);
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-neon-cyan/30 border-t-neon-cyan rounded-full animate-spin" />
      </div>
    );
  }

  const stats = [
    {
      label: 'Twin Status',
      value: twin ? `${twin.trainingLevel || 0}%` : 'Not Created',
      icon: HiOutlineCpuChip,
      color: 'from-neon-cyan to-blue-500',
      description: twin ? 'Training Level' : 'Start training',
    },
    {
      label: 'Simulations',
      value: simulations.length,
      icon: HiOutlineBeaker,
      color: 'from-neon-purple to-pink-500',
      description: 'Decisions analyzed',
    },
    {
      label: 'Chat Sessions',
      value: twin?.chatTrainingMessages || 0,
      icon: HiOutlineChatBubbleLeftRight,
      color: 'from-neon-pink to-red-400',
      description: 'Messages exchanged',
    },
    {
      label: 'Accuracy',
      value: twin ? `${Math.min(50 + Math.floor((twin.trainingLevel || 0) * 0.5), 99)}%` : '--',
      icon: HiOutlineArrowTrendingUp,
      color: 'from-green-400 to-emerald-500',
      description: 'Personality match',
    },
  ];

  const categoryColors = {
    career: 'text-neon-cyan',
    financial: 'text-green-400',
    lifestyle: 'text-neon-purple',
    relationship: 'text-neon-pink',
    education: 'text-yellow-400',
    general: 'text-gray-400',
  };

  return (
    <div className="min-h-screen bg-dark-900">
      <div className="fixed inset-0 bg-grid opacity-20 pointer-events-none" />
      <Navbar />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Welcome */}
        <motion.div
          className="flex items-center gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <AnimatedAvatar size={64} />
          <div>
            <h1 className="font-display font-bold text-2xl text-white">
              Welcome back, <span className="gradient-text">{user.name}</span>
            </h1>
            <p className="text-gray-500 text-sm">Your digital twin is ready to help you make better decisions.</p>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={i}
                className="card-dark"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xs text-gray-500">{stat.description}</span>
                </div>
                <div className="font-display font-bold text-2xl text-white">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </motion.div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <motion.div
            className="card-dark lg:col-span-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="font-display font-semibold text-lg text-white mb-4 flex items-center gap-2">
              <HiOutlineSparkles className="w-5 h-5 text-neon-cyan" />
              Quick Actions
            </h3>
            <div className="space-y-3">
              <Link href="/twin" className="flex items-center gap-3 p-3 rounded-xl bg-white/3 hover:bg-white/5 border border-white/5 hover:border-neon-cyan/20 transition-all group">
                <div className="w-8 h-8 rounded-lg bg-neon-cyan/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <HiOutlineCpuChip className="w-4 h-4 text-neon-cyan" />
                </div>
                <div>
                  <div className="text-sm font-medium text-white">Train Your Twin</div>
                  <div className="text-xs text-gray-500">Improve personality accuracy</div>
                </div>
              </Link>
              <Link href="/simulator" className="flex items-center gap-3 p-3 rounded-xl bg-white/3 hover:bg-white/5 border border-white/5 hover:border-neon-purple/20 transition-all group">
                <div className="w-8 h-8 rounded-lg bg-neon-purple/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <HiOutlineBeaker className="w-4 h-4 text-neon-purple" />
                </div>
                <div>
                  <div className="text-sm font-medium text-white">New Simulation</div>
                  <div className="text-xs text-gray-500">Simulate a life decision</div>
                </div>
              </Link>
              <Link href="/chat" className="flex items-center gap-3 p-3 rounded-xl bg-white/3 hover:bg-white/5 border border-white/5 hover:border-neon-pink/20 transition-all group">
                <div className="w-8 h-8 rounded-lg bg-neon-pink/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <HiOutlineChatBubbleLeftRight className="w-4 h-4 text-neon-pink" />
                </div>
                <div>
                  <div className="text-sm font-medium text-white">Chat with Twin</div>
                  <div className="text-xs text-gray-500">Talk to your AI clone</div>
                </div>
              </Link>
            </div>
          </motion.div>

          {/* Recent Simulations */}
          <motion.div
            className="card-dark lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold text-lg text-white flex items-center gap-2">
                <HiOutlineClock className="w-5 h-5 text-neon-purple" />
                Recent Simulations
              </h3>
              <Link href="/simulator" className="text-xs text-neon-cyan hover:underline">View all</Link>
            </div>
            
            {simulations.length > 0 ? (
              <div className="space-y-3">
                {simulations.slice(0, 5).map((sim, i) => (
                  <div
                    key={sim._id || i}
                    className="flex items-center gap-4 p-3 rounded-xl bg-white/3 border border-white/5 hover:border-white/10 transition-all"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-purple/20 to-neon-pink/20 flex items-center justify-center flex-shrink-0">
                      <HiOutlineBeaker className="w-5 h-5 text-neon-purple" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-white truncate">{sim.decision}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs ${categoryColors[sim.category] || 'text-gray-400'}`}>
                          {sim.category?.charAt(0).toUpperCase() + sim.category?.slice(1)}
                        </span>
                        <span className="text-xs text-gray-600">•</span>
                        <span className="text-xs text-gray-500">{sim.scenarios?.length || 0} scenarios</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <HiOutlineCheckBadge className="w-4 h-4 text-neon-green" />
                      <span className="text-xs text-gray-400">Done</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <HiOutlineBeaker className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No simulations yet</p>
                <Link href="/simulator" className="text-neon-cyan text-sm hover:underline mt-1 inline-block">
                  Run your first simulation →
                </Link>
              </div>
            )}
          </motion.div>
        </div>

        {/* Twin Personality */}
        {twin && (
          <motion.div
            className="card-dark mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="font-display font-semibold text-lg text-white mb-4 flex items-center gap-2">
              <HiOutlineChartBar className="w-5 h-5 text-neon-cyan" />
              Twin Personality Profile
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {twin.personalityTraits && Object.entries(twin.personalityTraits).map(([trait, value], i) => (
                <div key={trait}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-400 capitalize">{trait}</span>
                    <span className="text-xs text-neon-cyan">{value}%</span>
                  </div>
                  <div className="h-2 bg-dark-500 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-neon-cyan to-neon-purple"
                      initial={{ width: 0 }}
                      animate={{ width: `${value}%` }}
                      transition={{ duration: 1, delay: 0.6 + i * 0.1 }}
                    />
                  </div>
                </div>
              ))}
            </div>
            {twin.values && twin.values.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {twin.values.map((v, i) => (
                  <span key={i} className="px-3 py-1 rounded-full text-xs bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20">
                    {v}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <AuthProvider>
      <DashboardContent />
    </AuthProvider>
  );
}
