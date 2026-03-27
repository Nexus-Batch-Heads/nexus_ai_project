'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import Navbar from '@/components/layout/Navbar';
import AnimatedAvatar from '@/components/avatar/AnimatedAvatar';
import { HiOutlineChatBubbleLeftRight, HiOutlinePaperAirplane, HiOutlineMicrophone, HiOutlineSpeakerWave, HiOutlineSpeakerXMark, HiOutlineSparkles, HiOutlinePaperClip, HiOutlineXMark, HiOutlineDocumentText, HiOutlinePhoto } from 'react-icons/hi2';

function ChatContent() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState('advise');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [chatId, setChatId] = useState(null);
  const [speaking, setSpeaking] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const [listening, setListening] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);

    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (ev) => setFilePreview({ type: 'image', url: ev.target.result, name: file.name, size: file.size });
      reader.readAsDataURL(file);
    } else {
      setFilePreview({ type: 'file', name: file.name, size: file.size });
    }

    // Reset input to allow re-selecting same file
    e.target.value = '';
  };

  const removeFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  const sendMessage = async () => {
    if ((!input.trim() && !selectedFile) || sending) return;
    const msg = input.trim();
    setInput('');
    setSending(true);

    const userMessage = {
      role: 'user',
      content: msg,
      timestamp: new Date(),
      file: filePreview ? { name: filePreview.name, type: filePreview.type, size: filePreview.size, url: filePreview.url } : null,
    };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);

    // Clear file after sending
    setSelectedFile(null);
    setFilePreview(null);

    const token = localStorage.getItem('nexus_token');
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ message: msg, mode, chatId }),
      });
      const data = await res.json();
      
      const assistantMsg = { role: 'assistant', content: data.response, timestamp: new Date() };
      setMessages(prev => [...prev, assistantMsg]);
      setChatId(data.chatId);

      if (ttsEnabled && data.response) {
        speakText(data.response);
      }
    } catch (err) {
      console.error('Chat error:', err);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, something went wrong. Please try again.', timestamp: new Date() }]);
    }
    setSending(false);
  };

  const speakText = (text) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text.replace(/[*#_]/g, ''));
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const startVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition not supported');
      return;
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SR();
    recognition.lang = 'en-US';
    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onresult = (e) => setInput(e.results[0][0].transcript);
    recognition.start();
  };

  const newChat = () => {
    setMessages([]);
    setChatId(null);
  };

  const formatContent = (content) => {
    return content.split('\n').map((line, i) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return <div key={i} className="font-semibold text-white mt-2 mb-1">{line.replace(/\*\*/g, '')}</div>;
      }
      if (line.startsWith('- ') || line.startsWith('• ')) {
        return <div key={i} className="pl-3 flex gap-2"><span className="text-neon-cyan">•</span><span>{line.slice(2)}</span></div>;
      }
      if (line.match(/^\d+\./)) {
        return <div key={i} className="pl-3">{line}</div>;
      }
      // Handle inline bold
      const parts = line.split(/(\*\*[^*]+\*\*)/g);
      return <div key={i}>{parts.map((part, j) => 
        part.startsWith('**') ? <strong key={j} className="text-white">{part.replace(/\*\*/g, '')}</strong> : part
      )}</div>;
    });
  };

  if (loading || !user) {
    return <div className="min-h-screen bg-dark-900 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-neon-cyan/30 border-t-neon-cyan rounded-full animate-spin" />
    </div>;
  }

  return (
    <div className="min-h-screen bg-dark-900 flex flex-col">
      <div className="fixed inset-0 bg-grid opacity-20 pointer-events-none" />
      <Navbar />
      
      <main className="relative z-10 flex-1 flex flex-col max-w-4xl mx-auto w-full px-4 sm:px-6 pb-4">
        {/* Header */}
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <AnimatedAvatar size={40} speaking={speaking} />
            <div>
              <h1 className="font-display font-semibold text-lg text-white">
                {mode === 'talk-as-me' ? 'Your Digital Twin' : 'AI Life Advisor'}
              </h1>
              <p className="text-xs text-gray-500">
                {mode === 'talk-as-me' ? 'Responding as you would' : 'Personalized advice mode'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Mode selector */}
            <div className="flex rounded-xl overflow-hidden border border-white/10">
              <button
                onClick={() => { setMode('advise'); newChat(); }}
                className={`px-3 py-2 text-xs font-medium transition-all ${
                  mode === 'advise' ? 'bg-neon-purple/20 text-neon-purple' : 'text-gray-500 hover:text-white'
                }`}
              >
                💡 Advise Me
              </button>
              <button
                onClick={() => { setMode('talk-as-me'); newChat(); }}
                className={`px-3 py-2 text-xs font-medium transition-all ${
                  mode === 'talk-as-me' ? 'bg-neon-cyan/20 text-neon-cyan' : 'text-gray-500 hover:text-white'
                }`}
              >
                🧠 Talk as Me
              </button>
            </div>

            {/* TTS toggle */}
            <button
              onClick={() => {
                if (speaking) window.speechSynthesis?.cancel();
                setSpeaking(false);
                setTtsEnabled(!ttsEnabled);
              }}
              className={`p-2 rounded-xl transition-all ${
                ttsEnabled ? 'bg-neon-cyan/10 text-neon-cyan' : 'text-gray-500 hover:text-white'
              }`}
              title={ttsEnabled ? 'Disable voice' : 'Enable voice'}
            >
              {ttsEnabled ? <HiOutlineSpeakerWave className="w-5 h-5" /> : <HiOutlineSpeakerXMark className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto rounded-2xl glass p-4 space-y-4 min-h-0" style={{ maxHeight: 'calc(100vh - 280px)' }}>
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <AnimatedAvatar size={100} className="mb-6" />
              <h2 className="font-display font-semibold text-xl text-white mb-2">
                {mode === 'talk-as-me' ? 'Chat with Your Twin' : 'Get Life Advice'}
              </h2>
              <p className="text-gray-500 text-sm max-w-md mb-6">
                {mode === 'talk-as-me'
                  ? 'Your digital twin will respond exactly as you would, based on your personality profile.'
                  : 'Get personalized advice tailored to your personality, values, and decision style.'}
              </p>
              <div className="flex flex-wrap gap-2 justify-center max-w-lg">
                {(mode === 'advise'
                  ? ['What career path suits me best?', 'How should I approach networking?', 'What skills should I develop?', 'Help me plan my next quarter']
                  : ['How would I respond to a job offer?', 'Write a message as me declining a meeting', 'What would I say about working remotely?', 'Draft an email in my style']
                ).map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => { setInput(suggestion); }}
                    className="text-xs px-3 py-2 rounded-xl bg-white/5 text-gray-400 hover:text-neon-cyan hover:bg-neon-cyan/10 border border-white/5 hover:border-neon-cyan/20 transition-all"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="flex-shrink-0 mt-1">
                  <AnimatedAvatar size={32} speaking={speaking && i === messages.length - 1} />
                </div>
              )}
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-neon-cyan/15 text-white rounded-tr-sm'
                  : 'bg-white/5 text-gray-300 rounded-tl-sm'
              }`}>
                {/* File attachment display */}
                {msg.file && (
                  <div className="mb-2">
                    {msg.file.type === 'image' && msg.file.url ? (
                      <img src={msg.file.url} alt={msg.file.name} className="max-w-full max-h-48 rounded-lg object-cover mb-1" />
                    ) : (
                      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 mb-1">
                        <HiOutlineDocumentText className="w-4 h-4 text-neon-cyan flex-shrink-0" />
                        <span className="text-xs text-gray-400 truncate">{msg.file.name}</span>
                        <span className="text-xs text-gray-600 flex-shrink-0">{formatFileSize(msg.file.size)}</span>
                      </div>
                    )}
                  </div>
                )}
                {msg.role === 'assistant' ? formatContent(msg.content) : msg.content}
                {msg.role === 'assistant' && (
                  <button
                    onClick={() => speakText(msg.content)}
                    className="mt-2 text-xs text-gray-600 hover:text-neon-cyan flex items-center gap-1 transition-colors"
                  >
                    <HiOutlineSpeakerWave className="w-3 h-3" /> Listen
                  </button>
                )}
              </div>
              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neon-purple to-neon-pink flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-1">
                  {user.name?.[0]?.toUpperCase()}
                </div>
              )}
            </motion.div>
          ))}

          {sending && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3 items-start"
            >
              <AnimatedAvatar size={32} speaking={true} />
              <div className="bg-white/5 rounded-2xl rounded-tl-sm px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-neon-cyan animate-typing" />
                  <div className="w-2 h-2 rounded-full bg-neon-cyan animate-typing" style={{ animationDelay: '0.2s' }} />
                  <div className="w-2 h-2 rounded-full bg-neon-cyan animate-typing" style={{ animationDelay: '0.4s' }} />
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* File Preview */}
        <AnimatePresence>
          {filePreview && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
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
                  <p className="text-xs text-gray-500">{formatFileSize(filePreview.size)}</p>
                </div>
                <button
                  onClick={removeFile}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-neon-pink transition-all flex-shrink-0"
                  title="Remove file"
                >
                  <HiOutlineXMark className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input */}
        <div className="flex gap-2 mt-3">
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,.pdf,.txt"
            onChange={handleFileSelect}
            className="hidden"
          />
          
          {/* Upload button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className={`p-3 rounded-xl transition-all flex-shrink-0 ${
              selectedFile ? 'bg-neon-cyan/20 text-neon-cyan' : 'bg-white/5 text-gray-400 hover:text-neon-cyan hover:bg-neon-cyan/10'
            }`}
            title="Upload file"
          >
            <HiOutlinePaperClip className="w-5 h-5" />
          </button>

          <button
            onClick={startVoiceInput}
            className={`p-3 rounded-xl transition-all flex-shrink-0 ${
              listening ? 'bg-neon-pink/20 text-neon-pink animate-pulse' : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
            }`}
            title="Voice input"
          >
            <HiOutlineMicrophone className="w-5 h-5" />
          </button>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
            className="input-dark flex-1"
            placeholder={mode === 'talk-as-me' ? 'Ask your twin something...' : 'Ask for advice...'}
            disabled={sending}
          />
          <button
            onClick={sendMessage}
            disabled={sending || (!input.trim() && !selectedFile)}
            className="btn-primary px-4 py-3 flex-shrink-0 disabled:opacity-50"
          >
            <HiOutlinePaperAirplane className="w-5 h-5" />
          </button>
        </div>
      </main>
    </div>
  );
}

export default function ChatPage() {
  return (
    <AuthProvider>
      <ChatContent />
    </AuthProvider>
  );
}
