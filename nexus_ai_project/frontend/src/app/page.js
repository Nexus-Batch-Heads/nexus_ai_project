'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import AnimatedAvatar from '@/components/avatar/AnimatedAvatar';
import { HiOutlineCpuChip, HiOutlineBeaker, HiOutlineChatBubbleLeftRight, HiOutlineSparkles, HiOutlineChartBarSquare, HiOutlineShieldCheck } from 'react-icons/hi2';

const features = [
  {
    icon: HiOutlineCpuChip,
    title: 'Digital Twin AI',
    description: 'Create an AI that learns your personality, communication style, and decision patterns. It responds exactly like you would.',
    color: 'from-neon-cyan to-blue-500',
    glow: 'neon-glow-cyan',
  },
  {
    icon: HiOutlineBeaker,
    title: 'Life Decision Simulator',
    description: 'Input any life decision and get 3-5 future scenarios with risks, opportunities, and personalized recommendations.',
    color: 'from-neon-purple to-pink-500',
    glow: 'neon-glow-purple',
  },
  {
    icon: HiOutlineChatBubbleLeftRight,
    title: 'Talk to Your Future Self',
    description: 'Chat with your digital twin or get advice from your AI clone. Two modes: "Talk as me" and "Advise me".',
    color: 'from-neon-pink to-red-500',
    glow: 'neon-glow-pink',
  },
  {
    icon: HiOutlineSparkles,
    title: 'Personalized Predictions',
    description: 'Simulations are tailored to your unique personality profile, risk tolerance, and values for accurate outcomes.',
    color: 'from-yellow-400 to-orange-500',
    glow: 'neon-glow-cyan',
  },
  {
    icon: HiOutlineChartBarSquare,
    title: 'Visual Decision Trees',
    description: 'See your choices mapped out as interactive decision trees and timelines with probability scores.',
    color: 'from-green-400 to-emerald-500',
    glow: 'neon-glow-cyan',
  },
  {
    icon: HiOutlineShieldCheck,
    title: 'Best Path Recommendation',
    description: 'AI analyzes all scenarios and recommends the optimal path based on your personality alignment score.',
    color: 'from-neon-cyan to-neon-purple',
    glow: 'neon-glow-purple',
  },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-dark-900 overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 bg-grid opacity-30 pointer-events-none" />
      <div className="fixed top-1/4 -left-32 w-96 h-96 orb bg-neon-cyan/20" />
      <div className="fixed bottom-1/4 -right-32 w-96 h-96 orb bg-neon-purple/20" />
      <div className="fixed top-3/4 left-1/3 w-64 h-64 orb bg-neon-pink/10" />

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-6 sm:px-12 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center shadow-lg shadow-neon-cyan/20">
            <span className="text-dark-900 font-bold text-lg">NX</span>
          </div>
          <span className="font-display font-bold text-xl gradient-text">Nexus AI</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="btn-secondary text-sm">
            Sign In
          </Link>
          <Link href="/signup" className="btn-primary text-sm">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 pt-16 pb-32">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <motion.div
            className="flex-1 text-center lg:text-left"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-neon-cyan mb-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <HiOutlineSparkles className="w-4 h-4" />
              <span>Your AI Clone Helping You Choose Your Future</span>
            </motion.div>

            <h1 className="font-display font-bold text-5xl sm:text-6xl lg:text-7xl leading-tight mb-6">
              <span className="text-white">Meet Your</span>
              <br />
              <span className="gradient-text">Digital Twin</span>
            </h1>

            <p className="text-lg text-gray-400 max-w-xl mb-10 leading-relaxed">
              Create an AI that thinks like you, talks like you, and helps you simulate
              life decisions before you make them. See the future before it happens.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/signup" className="btn-primary text-base px-8 py-4 text-center">
                Create Your Twin →
              </Link>
              <Link href="/login" className="btn-secondary text-base px-8 py-4 text-center">
                Demo Login
              </Link>
            </div>

            <div className="mt-8 flex items-center gap-6 justify-center lg:justify-start text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
                Free to Try
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse" />
                AI-Powered
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-neon-purple animate-pulse" />
                Private & Secure
              </div>
            </div>
          </motion.div>

          <motion.div
            className="flex-1 flex justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative">
              <AnimatedAvatar size={280} speaking={false} />
              
              {/* Floating cards around avatar */}
              <motion.div
                className="absolute -top-4 -right-8 glass rounded-xl px-4 py-2 text-xs"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <span className="text-neon-cyan">🧠 Learning your style...</span>
              </motion.div>
              <motion.div
                className="absolute -bottom-4 -left-8 glass rounded-xl px-4 py-2 text-xs"
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 3.5, repeat: Infinity }}
              >
                <span className="text-neon-purple">🔮 78% personality match</span>
              </motion.div>
              <motion.div
                className="absolute top-1/2 -right-16 glass rounded-xl px-4 py-2 text-xs"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <span className="text-neon-pink">✨ Simulating futures...</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 pb-32">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-white mb-4">
            Your <span className="gradient-text">AI-Powered</span> Life Companion
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Combining digital twin technology with predictive simulation to help you make better life decisions.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={i}
                variants={item}
                className="card-dark group cursor-default"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-display font-semibold text-lg text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* How it works */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 pb-32">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-white mb-4">
            How It <span className="gradient-text">Works</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { step: '01', title: 'Create Your Twin', desc: 'Complete a personality quiz, chat with us, and train your AI to think like you.', icon: '🧬' },
            { step: '02', title: 'Simulate Decisions', desc: 'Enter any life decision and get AI-powered future scenarios customized to you.', icon: '🔮' },
            { step: '03', title: 'Choose Your Path', desc: 'Compare outcomes, see the best recommendation, and make confident decisions.', icon: '🚀' },
          ].map((s, i) => (
            <motion.div
              key={i}
              className="relative text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
            >
              <div className="text-5xl mb-4">{s.icon}</div>
              <div className="text-neon-cyan font-mono text-sm mb-2">{s.step}</div>
              <h3 className="font-display font-semibold text-xl text-white mb-3">{s.title}</h3>
              <p className="text-gray-400 text-sm">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 pb-20">
        <motion.div
          className="gradient-border p-12 text-center relative overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/5 to-neon-purple/5 pointer-events-none" />
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-white mb-4 relative">
            Ready to Meet Your Digital Twin?
          </h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto relative">
            Join thousands already using Nexus AI to make smarter life decisions.
          </p>
          <Link href="/signup" className="btn-primary text-base px-10 py-4 relative inline-block">
            Start Free – Create Your Twin
          </Link>
          <div className="mt-6 text-sm text-gray-500 relative">
            Demo available • No credit card required • demo@nexus.ai / demo123
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-8">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center">
              <span className="text-dark-900 font-bold text-xs">NX</span>
            </div>
            <span className="text-sm text-gray-500">Nexus AI © 2024</span>
          </div>
          <div className="text-sm text-gray-600">
            Your AI clone helping you choose your future.
          </div>
        </div>
      </footer>
    </div>
  );
}
