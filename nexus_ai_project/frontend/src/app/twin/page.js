'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import Navbar from '@/components/layout/Navbar';
import AnimatedAvatar from '@/components/avatar/AnimatedAvatar';
import { HiOutlineSparkles, HiOutlineMicrophone, HiOutlineChatBubbleLeftRight, HiOutlineArrowRight, HiOutlineArrowLeft, HiOutlinePaperClip, HiOutlineXMark, HiOutlineDocumentText } from 'react-icons/hi2';

const quizQuestions = [
  {
    id: 'risk',
    question: 'How comfortable are you with taking risks?',
    type: 'slider',
    min: 0, max: 100,
    labels: ['Very cautious', 'Very bold'],
    key: 'riskTolerance',
  },
  {
    id: 'communication',
    question: 'How would you describe your communication style?',
    type: 'select',
    options: [
      { value: 'formal', label: '👔 Formal & Professional' },
      { value: 'balanced', label: '⚖️ Balanced & Adaptable' },
      { value: 'casual', label: '😊 Casual & Friendly' },
      { value: 'analytical', label: '📊 Data-Driven & Precise' },
    ],
    key: 'communicationStyle',
  },
  {
    id: 'decision',
    question: 'How do you typically make decisions?',
    type: 'select',
    options: [
      { value: 'analytical', label: '🧠 Analytical – Data & research first' },
      { value: 'intuitive', label: '💡 Intuitive – Trust my gut feeling' },
      { value: 'collaborative', label: '🤝 Collaborative – Ask others first' },
      { value: 'impulsive', label: '⚡ Spontaneous – Act fast, adjust later' },
    ],
    key: 'decisionStyle',
  },
  {
    id: 'values',
    question: 'Select your top values (pick 3-5):',
    type: 'multi',
    options: [
      'Innovation', 'Family', 'Financial Freedom', 'Adventure',
      'Stability', 'Growth', 'Creativity', 'Health',
      'Authenticity', 'Impact', 'Learning', 'Leadership',
    ],
    key: 'values',
  },
  {
    id: 'tone',
    question: 'What tone best describes you?',
    type: 'select',
    options: [
      { value: 'friendly-professional', label: '🌟 Friendly Professional' },
      { value: 'serious', label: '🎯 Serious & Direct' },
      { value: 'humorous', label: '😄 Warm & Humorous' },
      { value: 'empathetic', label: '💛 Empathetic & Supportive' },
    ],
    key: 'tone',
  },
  {
    id: 'interests',
    question: 'Select your interests (pick 3-5):',
    type: 'multi',
    options: [
      'Technology', 'Startups', 'Investing', 'Travel',
      'Fitness', 'Art & Design', 'Music', 'Reading',
      'Gaming', 'Cooking', 'Nature', 'Science',
    ],
    key: 'interests',
  },
  {
    id: 'openness',
    question: 'How open are you to new experiences?',
    type: 'slider',
    min: 0, max: 100,
    labels: ['Prefer routine', 'Love novelty'],
    key: 'openness',
  },
  {
    id: 'extraversion',
    question: 'How social are you?',
    type: 'slider',
    min: 0, max: 100,
    labels: ['Introvert', 'Extrovert'],
    key: 'extraversion',
  },
];

function TwinTrainingContent() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(0); // 0 = overview, 1-N = quiz, N+1 = chat training, N+2 = done
  const [answers, setAnswers] = useState({
    riskTolerance: 50,
    communicationStyle: 'balanced',
    decisionStyle: 'analytical',
    values: [],
    tone: 'friendly-professional',
    interests: [],
    openness: 60,
    extraversion: 50,
  });
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [twin, setTwin] = useState(null);
  const [listening, setListening] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  useEffect(() => {
    if (user) fetchTwin();
  }, [user]);

  const fetchTwin = async () => {
    const token = localStorage.getItem('nexus_token');
    const res = await fetch('/api/twin', { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    if (data.twin) {
      setTwin(data.twin);
      if (data.twin.quizCompleted) setStep(quizQuestions.length + 1);
    }
  };

  const totalSteps = quizQuestions.length + 2;
  const quizStep = step - 1;
  const currentQ = quizQuestions[quizStep];

  const handleSliderChange = (key, val) => {
    setAnswers(prev => ({ ...prev, [key]: parseInt(val) }));
  };

  const handleSelect = (key, val) => {
    setAnswers(prev => ({ ...prev, [key]: val }));
  };

  const handleMultiToggle = (key, val) => {
    setAnswers(prev => {
      const arr = prev[key] || [];
      if (arr.includes(val)) return { ...prev, [key]: arr.filter(v => v !== val) };
      if (arr.length >= 5) return prev;
      return { ...prev, [key]: [...arr, val] };
    });
  };

  const nextStep = () => setStep(s => Math.min(s + 1, totalSteps));
  const prevStep = () => setStep(s => Math.max(s - 1, 0));

  const submitQuiz = async () => {
    setSaving(true);
    const token = localStorage.getItem('nexus_token');
    const quizData = {
      personalityTraits: {
        openness: answers.openness,
        conscientiousness: Math.round(50 + answers.riskTolerance * 0.3),
        extraversion: answers.extraversion,
        agreeableness: Math.round(60 + (100 - answers.riskTolerance) * 0.2),
        neuroticism: Math.round(50 - answers.riskTolerance * 0.3),
      },
      riskTolerance: answers.riskTolerance,
      communicationStyle: answers.communicationStyle,
      decisionStyle: answers.decisionStyle,
      values: answers.values.map(v => v.toLowerCase()),
      tone: answers.tone,
      interests: answers.interests.map(v => v.toLowerCase()),
    };

    await fetch('/api/twin/train', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ type: 'quiz', data: quizData }),
    });

    setSaving(false);
    nextStep();
    fetchTwin();
  };

  const sendChatTraining = async () => {
    if (!chatInput.trim()) return;
    const msg = chatInput.trim();
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', content: msg }]);
    
    const token = localStorage.getItem('nexus_token');
    await fetch('/api/twin/train', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ type: 'chat', data: { message: msg } }),
    });

    // Simulated training response
    setTimeout(() => {
      setChatMessages(prev => [...prev, {
        role: 'assistant',
        content: `Thanks for sharing! I'm learning from your communication style. Your message helps me understand your tone and personality better. Keep chatting to improve my accuracy! 🧠`,
      }]);
      fetchTwin();
    }, 800);
  };

  const startVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition not supported in this browser.');
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onresult = (e) => {
      const text = e.results[0][0].transcript;
      setChatInput(text);
    };
    recognition.start();
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  if (loading || !user) {
    return <div className="min-h-screen bg-dark-900 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-neon-cyan/30 border-t-neon-cyan rounded-full animate-spin" />
    </div>;
  }

  return (
    <div className="min-h-screen bg-dark-900">
      <div className="fixed inset-0 bg-grid opacity-20 pointer-events-none" />
      <Navbar />
      <main className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Twin Training Progress</span>
            <span className="text-sm text-neon-cyan">{twin?.trainingLevel || 0}%</span>
          </div>
          <div className="h-2 bg-dark-500 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-neon-cyan to-neon-purple rounded-full"
              animate={{ width: `${twin?.trainingLevel || 0}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* Step 0: Overview */}
          {step === 0 && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              <AnimatedAvatar size={160} className="mx-auto mb-6" />
              <h1 className="font-display font-bold text-3xl text-white mb-3">Train Your Digital Twin</h1>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">
                Complete the personality quiz and chat with us to teach your AI twin how you think and communicate.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="card-dark text-center">
                  <div className="text-2xl mb-2">📝</div>
                  <div className="text-sm font-medium text-white">Personality Quiz</div>
                  <div className="text-xs text-gray-500 mt-1">5 min</div>
                </div>
                <div className="card-dark text-center">
                  <div className="text-2xl mb-2">💬</div>
                  <div className="text-sm font-medium text-white">Chat Training</div>
                  <div className="text-xs text-gray-500 mt-1">Optional</div>
                </div>
                <div className="card-dark text-center">
                  <div className="text-2xl mb-2">🎤</div>
                  <div className="text-sm font-medium text-white">Voice Input</div>
                  <div className="text-xs text-gray-500 mt-1">Optional</div>
                </div>
              </div>
              <button onClick={nextStep} className="btn-primary px-8 py-3 inline-flex items-center gap-2">
                Start Training <HiOutlineArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {/* Quiz questions */}
          {step >= 1 && step <= quizQuestions.length && currentQ && (
            <motion.div
              key={`quiz-${quizStep}`}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="card-dark"
            >
              <div className="flex items-center justify-between mb-6">
                <span className="text-sm text-gray-500">Question {quizStep + 1} of {quizQuestions.length}</span>
                <div className="flex gap-1">
                  {quizQuestions.map((_, i) => (
                    <div key={i} className={`w-2 h-2 rounded-full ${i <= quizStep ? 'bg-neon-cyan' : 'bg-dark-400'}`} />
                  ))}
                </div>
              </div>

              <h2 className="font-display font-semibold text-xl text-white mb-6">{currentQ.question}</h2>

              {currentQ.type === 'slider' && (
                <div className="mb-8">
                  <input
                    type="range"
                    min={currentQ.min}
                    max={currentQ.max}
                    value={answers[currentQ.key]}
                    onChange={(e) => handleSliderChange(currentQ.key, e.target.value)}
                    className="w-full accent-neon-cyan"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>{currentQ.labels[0]}</span>
                    <span className="text-neon-cyan font-bold text-lg">{answers[currentQ.key]}</span>
                    <span>{currentQ.labels[1]}</span>
                  </div>
                </div>
              )}

              {currentQ.type === 'select' && (
                <div className="space-y-3 mb-8">
                  {currentQ.options.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => handleSelect(currentQ.key, opt.value)}
                      className={`w-full text-left p-4 rounded-xl border transition-all ${
                        answers[currentQ.key] === opt.value
                          ? 'border-neon-cyan/40 bg-neon-cyan/10 text-white'
                          : 'border-white/5 bg-white/3 text-gray-400 hover:border-white/10'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}

              {currentQ.type === 'multi' && (
                <div className="flex flex-wrap gap-2 mb-8">
                  {currentQ.options.map((opt) => {
                    const sel = (answers[currentQ.key] || []).includes(opt);
                    return (
                      <button
                        key={opt}
                        onClick={() => handleMultiToggle(currentQ.key, opt)}
                        className={`px-4 py-2 rounded-xl text-sm border transition-all ${
                          sel
                            ? 'border-neon-cyan/40 bg-neon-cyan/10 text-neon-cyan'
                            : 'border-white/5 bg-white/3 text-gray-400 hover:border-white/10'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                  <div className="w-full text-xs text-gray-500 mt-1">
                    Selected: {(answers[currentQ.key] || []).length}/5
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <button onClick={prevStep} className="btn-secondary px-4 py-2 flex items-center gap-1 text-sm">
                  <HiOutlineArrowLeft className="w-4 h-4" /> Back
                </button>
                {quizStep < quizQuestions.length - 1 ? (
                  <button onClick={nextStep} className="btn-primary px-6 py-2 flex items-center gap-1 text-sm">
                    Next <HiOutlineArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button onClick={submitQuiz} disabled={saving} className="btn-primary px-6 py-2 flex items-center gap-1 text-sm disabled:opacity-50">
                    {saving ? 'Saving...' : 'Complete Quiz ✓'}
                  </button>
                )}
              </div>
            </motion.div>
          )}

          {/* Chat Training */}
          {step === quizQuestions.length + 1 && (
            <motion.div
              key="chat"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="text-center mb-6 py-4">
                <p className="text-gray-300 text-lg">Now chat with your twin to fine-tune its personality</p>
              </div>

              <div className="card-dark">
                <div className="h-80 overflow-y-auto mb-4 space-y-3 pr-2">
                  {chatMessages.length === 0 && (
                    <div className="text-center py-8 text-gray-500 text-sm">
                      <p>Start chatting to train your twin's communication style.</p>
                      <p className="mt-1 text-xs">Try: "Tell me about my work style" or share opinions on topics</p>
                    </div>
                  )}
                  {chatMessages.map((msg, i) => (
                    <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                        msg.role === 'user'
                          ? 'bg-neon-cyan/15 text-white rounded-tr-sm'
                          : 'bg-white/5 text-gray-300 rounded-tl-sm'
                      }`}>
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>

                <div className="flex gap-2">
                  {/* Hidden file input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,.pdf,.txt"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setSelectedFile(file);
                      if (file.type.startsWith('image/')) {
                        const reader = new FileReader();
                        reader.onload = (ev) => setFilePreview({ type: 'image', url: ev.target.result, name: file.name, size: file.size });
                        reader.readAsDataURL(file);
                      } else {
                        setFilePreview({ type: 'file', name: file.name, size: file.size });
                      }
                      e.target.value = '';
                    }}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className={`p-3 rounded-xl transition-all ${selectedFile ? 'bg-neon-cyan/20 text-neon-cyan' : 'bg-white/5 text-gray-400 hover:text-neon-cyan hover:bg-neon-cyan/10'}`}
                    title="Upload file"
                  >
                    <HiOutlinePaperClip className="w-5 h-5" />
                  </button>
                  <button
                    onClick={startVoiceInput}
                    className={`p-3 rounded-xl transition-all ${listening ? 'bg-neon-pink/20 text-neon-pink animate-pulse' : 'bg-white/5 text-gray-400 hover:text-white'}`}
                    title="Voice input"
                  >
                    <HiOutlineMicrophone className="w-5 h-5" />
                  </button>
                  <input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendChatTraining()}
                    className="input-dark flex-1"
                    placeholder="Chat to train your twin..."
                  />
                  <button onClick={sendChatTraining} className="btn-primary px-4 py-2">
                    Send
                  </button>
                </div>
                {/* File Preview */}
                {filePreview && (
                  <div className="file-preview mt-3">
                    {filePreview.type === 'image' && filePreview.url ? (
                      <img src={filePreview.url} alt={filePreview.name} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-neon-cyan/10 flex items-center justify-center flex-shrink-0">
                        <HiOutlineDocumentText className="w-6 h-6 text-neon-cyan" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white truncate">{filePreview.name}</p>
                      <p className="text-xs text-gray-500">{filePreview.size < 1024 ? `${filePreview.size} B` : filePreview.size < 1048576 ? `${(filePreview.size / 1024).toFixed(1)} KB` : `${(filePreview.size / 1048576).toFixed(1)} MB`}</p>
                    </div>
                    <button
                      onClick={() => { setSelectedFile(null); setFilePreview(null); }}
                      className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-neon-pink transition-all flex-shrink-0"
                      title="Remove file"
                    >
                      <HiOutlineXMark className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              <div className="mt-4 text-center">
                <button
                  onClick={() => router.push('/dashboard')}
                  className="btn-secondary px-6 py-2 text-sm inline-flex items-center gap-2"
                >
                  <HiOutlineSparkles className="w-4 h-4" />
                  Go to Dashboard
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default function TwinPage() {
  return (
    <AuthProvider>
      <TwinTrainingContent />
    </AuthProvider>
  );
}
