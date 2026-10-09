'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { ChatMessage, AIMode } from '@/types';
import { DEMO_AI_SUGGESTIONS } from '@/data/demoData';
import { 
  Bot, 
  Send, 
  Sparkles, 
  User, 
  HelpCircle, 
  AlertCircle,
  Compass, 
  ArrowRight, 
  RotateCcw,
  Copy,
  Check,
  Volume2,
  VolumeX,
  ShieldAlert,
  Utensils,
  Landmark,
  Calendar,
  Layers,
  Cpu
} from 'lucide-react';
import Link from 'next/link';

export default function AIChatInterface() {
  const { places, safetyReports, selectedCity, showToast } = useApp();

  const [activeMode, setActiveMode] = useState<AIMode>('planner');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init',
      sender: 'assistant',
      mode: 'planner',
      text: `### 🤖 Welcome to NoProblem Neural Concierge Pro
I am your advanced urban intelligence agent for **${selectedCity.name}, ${selectedCity.state}**. 

I synthesize real-time data across:
- 🏛️ **${places.length} Curated Cultural & Hospitality Landmarks**
- 🛡️ **${safetyReports.length} Active Citizen Hazard Advisories**
- ♿ **Verified Wheelchair & Step-Free Accessibility Audits**
- 📊 **Live PMC Municipal Infrastructure Metrics**

Select an AI mode above or try one of the prompt actions below to begin!`,
      timestamp: 'Just now',
      isDemoResponse: true,
      metadata: {
        confidence: 99.2,
        processingTimeMs: 140,
        tokensUsed: 128,
      },
    },
  ]);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const promptChipsByMode: Record<AIMode, string[]> = {
    planner: [
      `Suggest a one-day ${selectedCity.name} sightseeing itinerary.`,
      `Design a 2-day budget weekend plan for students under ₹1,500.`,
      `Find places that are 100% wheelchair accessible with step-free paths.`,
    ],
    safety: [
      `What safety caution areas are reported near ${selectedCity.name}?`,
      `Analyze evening safety and lighting conditions for pedestrians.`,
      `Which areas have active road maintenance or sidewalk excavation?`,
    ],
    foodie: [
      `Find affordable food near historical places.`,
      `Top iconic legacy breakfast spots and Irani cafes.`,
      `Best evening street food lanes with high hygiene scores.`,
    ],
    heritage: [
      `Tell me the history and architecture of ${places[0]?.name || 'key landmarks'}.`,
      `Compare ${places[0]?.name || 'Site A'} and ${places[1]?.name || 'Site B'}.`,
      `Recommend cultural heritage walking routes with audio guides.`,
    ],
    general: [
      `How do I report a road issue or broken light?`,
      `Overview of ${selectedCity.name} weather, AQI, and transit.`,
      `Compare top budget places vs luxury stays.`,
    ],
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast('AI response copied to clipboard', 'info');
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleSpeakText = (id: string, text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    if (speakingId === id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[#*`_|[\]]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText.slice(0, 320));
    utterance.rate = 1.0;
    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);
    window.speechSynthesis.speak(utterance);
    setSpeakingId(id);
  };

  const handleSendMessage = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query.trim(),
      timestamp: 'Just now',
      isDemoResponse: false,
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    const startTime = performance.now();

    setTimeout(() => {
      let reply = '';
      const matched = DEMO_AI_SUGGESTIONS.find((s) =>
        s.query.toLowerCase().trim() === query.toLowerCase().trim() ||
        s.query.toLowerCase().includes(query.toLowerCase().slice(0, 20)) ||
        query.toLowerCase().includes(s.query.toLowerCase().slice(0, 20))
      );

      if (matched) {
        reply = matched.response;
      } else {
        const lower = query.toLowerCase();
        if (lower.includes('itinerary') || lower.includes('day') || lower.includes('plan') || lower.includes('weekend')) {
          reply = `### 🗓️ Curated ${selectedCity.name} Sightseeing Masterplan (Pro AI)

| Time Slot | Location & Zone | Focus & Experience | Estimated Cost |
| :--- | :--- | :--- | :--- |
| **08:30 – 10:30 AM** | **${places[0]?.name || 'Historic Fort'}** | Morning architectural tour. Best golden hour lighting. | ~₹50 ($0.60) |
| **11:00 – 12:30 PM** | **${places[1]?.name || 'Cultural Sanctuary'}** | Cultural immersion with step-free museum access. | ~₹25 ($0.30) |
| **01:00 – 02:30 PM** | **Local Heritage Dining** | Iconic regional cuisine & authentic filter tea. | ~₹180 ($2.20) |
| **03:30 – 05:30 PM** | **${places[2]?.name || 'Scenic Gardens & Views'}** | Panoramic valley views or manicured botanical walks. | ~₹40 ($0.50) |
| **06:30 – 09:00 PM** | **Promenade & Food Street** | Street snacking, local shopping, and evening cafe walk. | ~₹250 ($3.00) |

💡 **Pro Travel Tip:** Use the *Safer Route Planner* to bypass peak evening bottleneck corridors like Chandani Chowk and Western Express highways.`;
        } else if (lower.includes('food') || lower.includes('eat') || lower.includes('restaurant') || lower.includes('chai') || lower.includes('cafe')) {
          reply = `### 🍲 Elite Foodie Scout: ${selectedCity.name} Top Picks

1. **Heritage Breakfast Icon:**
   - **Signature Venues:** Legacy Irani cafes serving buttery Bun Maska (~₹60) and freshly brewed Irani Chai.
   - **Vibe:** Vintage wooden booths, fast service, 8.8/10 hygiene audit.

2. **Street Food Hotspots:**
   - **Must-Try:** Crispy cheese dosas, Sabudana Wada with roasted peanut dip, and spicy Misal Pav.
   - **Average Spend:** ₹120 – ₹250 per person.
   - **Peak Timing:** 6:00 PM – 9:30 PM.

3. **Fine Dining & Rooftop Lounges:**
   - **Luxury Highlights:** Rooftop panoramic lounges with skyline views and global dining (~₹1,500 - ₹3,000).`;
        } else if (lower.includes('safe') || lower.includes('hazard') || lower.includes('danger') || lower.includes('caution') || lower.includes('traffic')) {
          reply = `### 🛡️ Safety & Risk Analysis Report for ${selectedCity.name}

- **Active Lighting Alerts:** Citizen reports indicate flickering streetlights on key pedestrian crossings. Pedestrians should use arterial walkways with active CCTV.
- **Road Excavations:** Ongoing utility pipelining has narrowed certain old city footpaths. Wheelchair users should follow designated paved detours.
- **Peak Vehicular Crawl:** Congestion builds between 6:30 PM and 8:30 PM around major bypass intersections.
- **Emergency Infrastructure:** Local police chowkies and municipal ambulance depots are mapped within 800m of all central catalog landmarks.

*Note: Sourced situational guidance. Always maintain personal situational vigilance.*`;
        } else if (lower.includes('compare') || lower.includes('vs') || lower.includes('better')) {
          reply = `### ⚖️ Multi-Criteria Decision Benchmark

| Criterion | Landmark A (${places[0]?.name || 'Monument'}) | Landmark B (${places[1]?.name || 'Palace'}) |
| :--- | :--- | :--- |
| **Cleanliness** | 8.4 / 10 | **9.2 / 10 (Winner)** |
| **Accessibility** | Partial (Stairs on upper tiers) | **100% Step-free Paved (Winner)** |
| **Affordability** | ₹50 per person | **₹25 per person (Winner)** |
| **Heritage Value** | 18th-century Maratha Citadel | 19th-century Italianate Architecture |

💡 **Conclusion:** If traveling with mobility assistance or seeking serene gardens, Landmark B is recommended. For dramatic ramparts, choose Landmark A!`;
        } else {
          reply = `### 💡 Pro AI Intelligence Briefing on "${query}"

Based on ${selectedCity.name}'s verified catalog:
- **Available Catalog Places:** ${places.length} curated destinations with full accessibility audits.
- **Active Citizen Reports:** ${safetyReports.length} community advisories.
- **Municipal AQI & Conditions:** AQI ${selectedCity.metrics.airQualityIndex} (${selectedCity.metrics.airQualityLabel}), Temperature ${selectedCity.metrics.temperatureC}°C.

Would you like me to generate a **custom day itinerary**, analyze **wheelchair accessibility**, or search for **budget street food**?`;
        }
      }

      const elapsed = Math.round(performance.now() - startTime);

      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        mode: activeMode,
        text: reply,
        timestamp: 'Just now',
        isDemoResponse: true,
        metadata: {
          confidence: 98.7,
          processingTimeMs: elapsed,
          tokensUsed: Math.round(reply.length / 3.8),
        },
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 450);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'msg-init-reset',
        sender: 'assistant',
        mode: activeMode,
        text: `Neural context cleared. Ready to assist with **${selectedCity.name}** exploration, itineraries, and risk guidance!`,
        timestamp: 'Just now',
        isDemoResponse: true,
      },
    ]);
  };

  const modes: { id: AIMode; label: string; icon: any }[] = [
    { id: 'planner', label: 'Trip Planner', icon: Calendar },
    { id: 'safety', label: 'Risk Analyzer', icon: ShieldAlert },
    { id: 'foodie', label: 'Foodie Scout', icon: Utensils },
    { id: 'heritage', label: 'Historian', icon: Landmark },
    { id: 'general', label: 'Civic Engine', icon: Cpu },
  ];

  return (
    <div className="flex flex-col h-[700px] bg-slate-900 border border-emerald-950 rounded-3xl overflow-hidden shadow-2xl">
      {/* Pro Assistant Header */}
      <div className="p-4 bg-slate-950 border-b border-emerald-950 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-mint-400 p-0.5 flex items-center justify-center shadow-lg shadow-emerald-950/60">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Bot className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-extrabold text-white">NoProblem Neural Concierge Pro</h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                v4.2 PRO
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Multi-Agent Context Engine • {selectedCity.name} Knowledge Graph
            </p>
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleResetChat}
            className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-emerald-950 transition-colors"
            title="Reset Context"
          >
            <RotateCcw size={14} />
          </button>
          <Link
            href="/explore"
            className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900 text-xs text-emerald-300 font-bold border border-emerald-500/30 transition-all"
          >
            <Compass size={13} />
            <span>Catalog ({places.length})</span>
          </Link>
        </div>
      </div>

      {/* Mode Selector Tabs */}
      <div className="bg-slate-950/80 border-b border-emerald-950/80 px-4 py-2 flex items-center gap-2 overflow-x-auto no-scrollbar">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
          <Layers size={11} className="text-emerald-400" />
          AI Mode:
        </span>
        {modes.map((m) => {
          const Icon = m.icon;
          const isActive = activeMode === m.id;
          return (
            <button
              key={m.id}
              onClick={() => setActiveMode(m.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Icon size={12} />
              <span>{m.label}</span>
            </button>
          );
        })}
      </div>

      {/* Suggested Prompt Chips */}
      <div className="p-3 bg-slate-950/60 border-b border-emerald-950/60 flex items-center gap-2 overflow-x-auto text-xs no-scrollbar">
        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
          <Sparkles size={12} />
          Prompt Suggestions:
        </span>
        {promptChipsByMode[activeMode].map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(chip)}
            className="px-3 py-1 rounded-full bg-slate-900/90 hover:bg-slate-850 text-slate-300 hover:text-emerald-300 border border-emerald-950 text-xs shrink-0 transition-all cursor-pointer"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Messages Stream */}
      <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-xl bg-emerald-950 border border-emerald-500/40 flex items-center justify-center shrink-0 text-emerald-400 mt-1 shadow-md">
                  <Bot size={16} />
                </div>
              )}

              <div
                className={`max-w-[88%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold rounded-tr-none shadow-lg shadow-emerald-500/20'
                    : 'bg-slate-950 border border-emerald-950 text-slate-200 rounded-tl-none space-y-2.5 shadow-xl'
                }`}
              >
                {!isUser && (
                  <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-1.5 mb-1.5 text-[10px] text-slate-400">
                    <div className="flex items-center gap-1.5 text-emerald-400 font-mono font-bold">
                      <Cpu size={12} />
                      <span>NOPROBLEM PRO REASONING</span>
                    </div>
                    {msg.metadata && (
                      <span className="text-slate-500 font-mono">
                        {msg.metadata.processingTimeMs}ms • {msg.metadata.confidence}% conf
                      </span>
                    )}
                  </div>
                )}

                <div className="whitespace-pre-line font-normal prose prose-invert max-w-none text-xs sm:text-sm">
                  {msg.text}
                </div>

                {!isUser && (
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2 text-[11px] text-slate-400">
                    <span className="italic text-[10px]">
                      Grounded on verified {selectedCity.name} urban dataset
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSpeakText(msg.id, msg.text)}
                        className="p-1 text-slate-400 hover:text-emerald-300 transition-colors"
                        title={speakingId === msg.id ? 'Stop Narration' : 'Listen with Audio'}
                      >
                        {speakingId === msg.id ? <VolumeX size={14} className="text-emerald-400" /> : <Volume2 size={14} />}
                      </button>
                      <button
                        onClick={() => handleCopyText(msg.id, msg.text)}
                        className="p-1 text-slate-400 hover:text-emerald-300 transition-colors"
                        title="Copy to clipboard"
                      >
                        {copiedId === msg.id ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {isUser && (
                <div className="w-8 h-8 rounded-xl bg-slate-800 border border-emerald-950 flex items-center justify-center shrink-0 text-slate-300 mt-1">
                  <User size={16} />
                </div>
              )}
            </div>
          );
        })}

        {isTyping && (
          <div className="flex gap-3 items-center text-xs text-slate-400 italic">
            <div className="w-8 h-8 rounded-xl bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Bot size={16} />
            </div>
            <div className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-slate-950 border border-emerald-950">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.4s]" />
              <span className="ml-1 text-slate-300">Synthesizing {selectedCity.name} geospatial graph...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 bg-slate-950 border-t border-emerald-950 flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Ask anything about ${selectedCity.name} itineraries, safe routes, street food, or monuments...`}
          className="flex-1 bg-slate-900 border border-emerald-950 rounded-2xl px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-mint-400 hover:opacity-95 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-1.5 disabled:opacity-40 transition-all shadow-lg shadow-emerald-500/20 cursor-pointer"
        >
          <span>Send</span>
          <Send size={14} />
        </button>
      </form>
    </div>
  );
}
