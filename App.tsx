import React, { useState, useRef, useEffect } from 'react';
import { 
  Menu, X, Phone, Mail, Globe, Cpu, Users, 
  Calendar, Mic, Zap, ArrowRight, MessageSquare, 
  Bot, Layout, CheckCircle, Loader2
} from 'lucide-react';
import { sendMessageToGemini } from './services/geminiService';

// --- Types ---

interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

// --- Components ---

const Logo: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div className={`flex items-baseline font-bold tracking-tight text-2xl ${className}`}>
    <span className="text-meta-orange">META</span>
    <span className="text-meta-green">MORPHOSIS</span>
  </div>
);

const NavLink: React.FC<{ href: string; children: React.ReactNode; mobile?: boolean; onClick?: () => void }> = ({ href, children, mobile, onClick }) => (
  <a 
    href={href} 
    onClick={onClick}
    className={`
      ${mobile ? 'block py-3 px-4 text-lg border-l-4 border-transparent hover:border-meta-orange hover:bg-gray-50' : 'hover:text-meta-orange transition-colors'}
      font-medium text-meta-green
    `}
  >
    {children}
  </a>
);

const ServiceCard: React.FC<{ title: string; description: string; icon: React.ReactNode }> = ({ title, description, icon }) => (
  <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-t-4 border-meta-orange group hover:-translate-y-2">
    <div className="bg-orange-50 w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:bg-meta-orange transition-colors">
      <div className="text-meta-orange group-hover:text-white transition-colors">
        {icon}
      </div>
    </div>
    <h3 className="text-xl font-bold text-meta-green mb-3">{title}</h3>
    <p className="text-gray-600 leading-relaxed">{description}</p>
  </div>
);

const ContactForm: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('submitting');
    
    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const response = await fetch("https://formspree.io/f/mvgerrkk", {
        method: "POST",
        body: data,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        setStatus('success');
        form.reset();
        // Reset status after 5 seconds so user can send another message if needed
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4 animate-fade-in">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-4">
          <CheckCircle size={32} />
        </div>
        <h3 className="text-2xl font-bold text-gray-800">Message Sent!</h3>
        <p className="text-gray-600">Thank you for contacting Metamorphosis. We'll get back to you shortly.</p>
        <button 
          onClick={() => setStatus('idle')}
          className="mt-6 text-meta-orange font-semibold hover:underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div>
        <label className="block text-gray-700 font-medium mb-2" htmlFor="name">Name</label>
        <input 
          id="name"
          name="name"
          type="text" 
          required
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-meta-orange focus:ring-1 focus:ring-meta-orange outline-none transition-all bg-gray-50" 
          placeholder="John Doe" 
        />
      </div>
      <div>
        <label className="block text-gray-700 font-medium mb-2" htmlFor="email">Email Address</label>
        <input 
          id="email"
          name="email"
          type="email" 
          required
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-meta-orange focus:ring-1 focus:ring-meta-orange outline-none transition-all bg-gray-50" 
          placeholder="john@example.com" 
        />
      </div>
      <div>
        <label className="block text-gray-700 font-medium mb-2" htmlFor="service">Service Interested In</label>
        <select 
          id="service"
          name="service"
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-meta-orange focus:ring-1 focus:ring-meta-orange outline-none transition-all bg-gray-50"
        >
          <option value="Website Development">Website Development</option>
          <option value="Web App Design">Web App Design</option>
          <option value="Automation Workflows">Automation Workflows</option>
          <option value="AI Customer Support Agent">AI Customer Support Agent</option>
          <option value="Voice/Booking Agent">Voice/Booking Agent</option>
          <option value="Lead Gen Agent">Lead Gen Agent</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div>
        <label className="block text-gray-700 font-medium mb-2" htmlFor="message">Message</label>
        <textarea 
          id="message"
          name="message"
          rows={4} 
          required
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-meta-orange focus:ring-1 focus:ring-meta-orange outline-none transition-all bg-gray-50" 
          placeholder="Tell us about your project..."
        ></textarea>
      </div>
      
      {status === 'error' && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100">
          Something went wrong. Please try again or email us directly at egabrella321@gmail.com
        </div>
      )}

      <button 
        type="submit"
        disabled={status === 'submitting'}
        className="w-full bg-meta-orange hover:bg-orange-600 text-white font-bold py-4 rounded-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {status === 'submitting' ? (
          <>
            <Loader2 className="animate-spin" size={20} /> Sending...
          </>
        ) : (
          'Send Message'
        )}
      </button>
    </form>
  );
};

const AIChatDemo: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', parts: [{ text: "Hello! I'm Morph, the Metamorphosis AI agent. Ask me how we can transform your business!" }] }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMsg = input;
    setInput('');
    setIsLoading(true);

    const newHistory: ChatMessage[] = [...messages, { role: 'user', parts: [{ text: userMsg }] }];
    setMessages(newHistory);

    const response = await sendMessageToGemini(messages, userMsg);
    
    setMessages([...newHistory, { role: 'model', parts: [{ text: response }] }]);
    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="bg-white rounded-2xl shadow-2xl mb-4 w-[350px] sm:w-[400px] border border-gray-200 overflow-hidden flex flex-col h-[500px]">
          <div className="bg-meta-green p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-2">
              <Bot size={20} />
              <span className="font-bold">Lead Gen Agent Demo</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded">
              <X size={18} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-lg text-sm ${
                  msg.role === 'user' 
                    ? 'bg-meta-orange text-white rounded-br-none' 
                    : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none shadow-sm'
                }`}>
                  {msg.parts[0].text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 bg-white border-t border-gray-100">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask about our services..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-meta-orange focus:ring-1 focus:ring-meta-orange text-sm"
              />
              <button 
                onClick={handleSend}
                disabled={isLoading}
                className="bg-meta-green text-white p-2 rounded-full hover:bg-green-800 disabled:opacity-50 transition-colors"
              >
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
      
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-meta-orange text-white p-4 rounded-full shadow-lg hover:bg-orange-600 transition-all hover:scale-105 flex items-center gap-2 group"
      >
        {!isOpen ? <MessageSquare size={24} /> : <X size={24} />}
        {!isOpen && <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 whitespace-nowrap font-medium">Chat with AI</span>}
      </button>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Navigation */}
      <nav className={`fixed w-full z-40 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-md py-3' : 'bg-transparent py-6'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <Logo />
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <NavLink href="#services">Services</NavLink>
            <NavLink href="#about">About</NavLink>
            <NavLink href="#agents">AI Agents</NavLink>
            <a href="#contact" className="bg-meta-orange text-white px-6 py-2.5 rounded-full font-semibold hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/30">
              Get Started
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-meta-green" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-xl">
            <div className="flex flex-col py-2">
              <NavLink href="#services" mobile onClick={() => setIsMenuOpen(false)}>Services</NavLink>
              <NavLink href="#about" mobile onClick={() => setIsMenuOpen(false)}>About</NavLink>
              <NavLink href="#agents" mobile onClick={() => setIsMenuOpen(false)}>AI Agents</NavLink>
              <NavLink href="#contact" mobile onClick={() => setIsMenuOpen(false)}>Contact Us</NavLink>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-gradient-to-br from-green-50 to-orange-50/50">
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-meta-green font-semibold text-sm mb-6 border border-green-200">
              <Zap size={16} className="text-meta-orange" />
              <span>Future-Proof Your Business</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-8 tracking-tight">
              Digital <span className="text-transparent bg-clip-text bg-gradient-to-r from-meta-orange to-red-500">Metamorphosis</span> for Your Business
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-10 leading-relaxed max-w-2xl mx-auto">
              We transform ordinary operations into automated powerhouses. Custom websites, intelligent AI agents, and seamless automation workflows.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a href="#contact" className="bg-meta-green text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-green-900 transition-colors shadow-xl flex items-center justify-center gap-2">
                Start Transformation <ArrowRight size={20} />
              </a>
              <a href="#services" className="bg-white text-meta-green border-2 border-meta-green px-8 py-4 rounded-full font-bold text-lg hover:bg-green-50 transition-colors">
                Explore Services
              </a>
            </div>
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute top-1/4 left-10 w-64 h-64 bg-meta-orange/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-meta-green/10 rounded-full blur-3xl -z-10"></div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-meta-green mb-4">Our Services</h2>
            <div className="w-24 h-1 bg-meta-orange mx-auto rounded-full"></div>
            <p className="mt-4 text-gray-600 text-lg">Comprehensive digital solutions to scale your enterprise.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <ServiceCard 
              title="Website Creation" 
              description="Stunning, high-performance websites designed to convert visitors into loyal customers. Mobile-first and SEO optimized."
              icon={<Globe size={32} />}
            />
            <ServiceCard 
              title="Web App Design" 
              description="Custom web applications that solve complex business problems with intuitive user interfaces and robust backends."
              icon={<Layout size={32} />}
            />
             <ServiceCard 
              title="Automation Workflows" 
              description="Connect your favorite apps and automate repetitive tasks. Save countless hours and reduce human error."
              icon={<Cpu size={32} />}
            />
          </div>
        </div>
      </section>

      {/* AI Agents Section */}
      <section id="agents" className="py-24 bg-gray-900 text-white relative overflow-hidden">
        {/* Decorative Grid */}
        <div className="absolute inset-0 opacity-10" 
             style={{ backgroundImage: 'radial-gradient(#4ADE80 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="md:w-1/2">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Deploy Your <span className="text-meta-orange">Digital Workforce</span>
              </h2>
              <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                Why hire more when you can automate? Our specialized AI agents work 24/7, never sleep, and handle thousands of interactions simultaneously.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-meta-orange/20 p-3 rounded-lg text-meta-orange">
                    <Users size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Customer Support Agents</h3>
                    <p className="text-gray-400">Instant answers to customer queries, anytime, anywhere.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-meta-orange/20 p-3 rounded-lg text-meta-orange">
                    <Calendar size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Booking Agents</h3>
                    <p className="text-gray-400">Seamless appointment scheduling synced with your calendar.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-meta-orange/20 p-3 rounded-lg text-meta-orange">
                    <Mic size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Voice & Lead Gen Agents</h3>
                    <p className="text-gray-400">Human-like voice interactions to qualify and nurture leads.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="md:w-1/2 bg-gray-800 p-8 rounded-2xl border border-gray-700 shadow-2xl relative">
              <div className="absolute -top-4 -right-4 bg-meta-orange text-white px-4 py-1 rounded-full text-sm font-bold animate-bounce">
                Live Preview
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3 border-b border-gray-700 pb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-xs text-gray-500 ml-2">Metamorphosis Lead Agent v2.0</span>
                </div>
                <div className="space-y-4 font-mono text-sm">
                  <div className="text-meta-orange"> System: Initializing Agent Protocol...</div>
                  <div className="text-green-400">{">"} Agent Active. Listening for leads.</div>
                  <div className="text-gray-400">{">"} Incoming query: "I need a website for my bakery."</div>
                  <div className="text-green-400">{">"} Response: "Excellent! I can help with that. What is your budget range?"</div>
                  <div className="text-gray-400">{">"} User: "$2000 - $5000"</div>
                  <div className="text-green-400">{">"} Lead Qualified: High Potential. Notification sent to sales.</div>
                </div>
                <button className="w-full bg-meta-green hover:bg-green-700 text-white py-3 rounded-lg mt-4 transition-colors font-semibold">
                  Get This Agent
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About / Why Us */}
      <section id="about" className="py-24 bg-green-50">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-meta-green mb-8">Why Metamorphosis?</h2>
            <p className="text-lg text-gray-700 mb-12">
              Just like a caterpillar transforms into a butterfly, we help your business evolve into its most efficient, beautiful, and capable form.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              "Mobile Responsive Design",
              "SEO Optimized Code",
              "24/7 Agent Availability",
              "Seamless Integration"
            ].map((item, i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow-sm flex items-center gap-3">
                <CheckCircle className="text-meta-orange flex-shrink-0" size={24} />
                <span className="font-semibold text-gray-800">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-white relative">
        <div className="container mx-auto px-6">
          <div className="bg-meta-green rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row">
            
            <div className="md:w-1/2 p-12 text-white flex flex-col justify-between">
              <div>
                <h2 className="text-4xl font-bold mb-6">Let's Build Something Amazing</h2>
                <p className="text-green-100 text-lg mb-8">
                  Ready to automate your workflow or launch a stunning new website? Contact our team today.
                </p>
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-white/10 p-3 rounded-lg">
                      <Phone className="text-meta-orange" size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-green-200">Call Us</p>
                      <p className="text-xl font-bold">+264 81 387 9841</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="bg-white/10 p-3 rounded-lg">
                      <Mail className="text-meta-orange" size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-green-200">Email Us</p>
                      <p className="text-xl font-bold">egabrella321@gmail.com</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-12 md:mt-0">
                <Logo className="text-white opacity-50" />
              </div>
            </div>

            <div className="md:w-1/2 bg-white p-12">
              <ContactForm />
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 border-t border-gray-800">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <Logo className="mb-4 md:mb-0" />
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
          <div className="text-center md:text-left text-sm">
            &copy; {new Date().getFullYear()} Metamorphosis. All rights reserved. Transforming the digital landscape.
          </div>
        </div>
      </footer>

      {/* Floating AI Demo */}
      <AIChatDemo />
    </div>
  );
}