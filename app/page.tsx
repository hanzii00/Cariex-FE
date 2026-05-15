"use client";

import { useState } from "react";
import Image from "next/image";
import { Montserrat, Inter } from "next/font/google";
import { 
  ArrowRight, 
  Menu, 
  X, 
  Github, 
  Linkedin, 
  Mail,
  Brain,
  ScanSearch,
  ShieldCheck,
  UploadCloud,
  Cpu,
  Stethoscope
} from "lucide-react";
import Link from "next/link";

// Font Configuration
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-montserrat",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
});

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Smooth scroll handler
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, targetId: string) => {
    e.preventDefault();
    const target = document.getElementById(targetId);
    if (target) {
      // Offset for the fixed header
      const headerOffset = 80;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
    // Close mobile menu if open
    if (isMenuOpen) setIsMenuOpen(false);
  };

  const teamMembers = [
    {
      name: "Jeastel Mae Maratas",
      role: "Project Manager & Developer",
      bio: "Drives project strategy and development timelines, coordinating between clinical experts and the engineering team to ensure successful feature delivery."
    },
    {
      name: "Yllana Mikhaila Paragoso",
      role: "UI/UX & Frontend Engineer",
      bio: "Designs intuitive clinical interfaces and develops responsive frontend components, while stepping in to handle essential backend API integrations."
    },
    {
      name: "Mechell V. Torres-Paragoso, D.M.D",
      role: "Clinical Advisor",
      bio: "Provides critical clinical oversight, ensuring that the system's diagnostic suggestions meet rigorous, real-world dental standards."
    },
    {
      name: "Hanz Chester Bacus",
      role: "AI & Backend Engineer",
      bio: "Builds the robust, secure infrastructure required to process sensitive healthcare data and deploys the AI models for rapid X-ray analysis."
    },
    {
      name: "Jake Clarin",
      role: "UI/UX & Frontend Developer",
      bio: "Focuses on human-centered design, bridging the gap between complex algorithmic outputs and practical, easy-to-use tools for dental professionals."
    }
  ];

  return (
    <main className={`${montserrat.variable} ${inter.variable} min-h-screen bg-white font-sans text-gray-900 selection:bg-blue-100 flex flex-col`}>
      
      {/* HEADER SECTION */}
      <header className="fixed top-0 left-0 w-full z-[60] py-4 border-b border-white/10 bg-blue-900/20 backdrop-blur-md">
        <div className="container mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Image
              src="/logo/cariex-logo-white-ic.svg"
              alt="Cariex icon"
              width={72}
              height={72}
              priority
              className="h-16 w-auto"
            />
            <span
              className="text-white text-2xl md:text-3xl tracking-wide"
              style={{ fontFamily: "MonainnRegular, 'Montserrat', sans-serif" }}
            >
              Cariex
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-blue-100">
            <a href="#features" onClick={(e) => handleScroll(e, 'features')} className="hover:text-white transition-colors cursor-pointer">Features</a>
            <a href="#how-it-works" onClick={(e) => handleScroll(e, 'how-it-works')} className="hover:text-white transition-colors cursor-pointer">How It Works</a>
            <a href="#team" onClick={(e) => handleScroll(e, 'team')} className="hover:text-white transition-colors cursor-pointer">The Team</a>
          </nav>

          {/* Login/Signup Buttons */}
          <div className="flex items-center gap-4">
            <Link href="/authentication" className="hidden md:block text-sm font-semibold text-blue-100 hover:text-white transition-colors px-4 py-2">
              Log In
            </Link>
            <Link href="/authentication?mode=register" className="bg-blue-600 text-sm font-semibold text-white px-5 py-2.5 rounded-full shadow-md hover:bg-blue-500 transition-all flex items-center gap-2">
              Sign Up <ArrowRight size={16} />
            </Link>
            
            {/* Mobile Menu Toggle */}
            <button 
              onClick={toggleMenu}
              className="md:hidden text-white p-2 z-50"
              aria-label="Toggle Menu"
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`fixed inset-0 bg-blue-950 transition-transform duration-300 ease-in-out z-40 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} md:hidden`}>
          <div className="flex flex-col items-center justify-center h-full gap-8 text-xl text-white font-medium">
            <a href="#features" onClick={(e) => handleScroll(e, 'features')} className="hover:text-blue-300 transition-colors">Features</a>
            <a href="#how-it-works" onClick={(e) => handleScroll(e, 'how-it-works')} className="hover:text-blue-300 transition-colors">How It Works</a>
            <a href="#team" onClick={(e) => handleScroll(e, 'team')} className="hover:text-blue-300 transition-colors">The Team</a>
            <hr className="w-12 border-blue-700" />
            <Link href="/authentication" onClick={toggleMenu} className="text-blue-200">Log In</Link>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative w-full bg-linear-to-b from-blue-800 to-blue-600 text-white overflow-hidden pt-40 pb-24 grow">
        
        {/* Background Decorative Circles */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 border border-white/10 rounded-full pointer-events-none"></div>
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-225 h-225 border border-white/5 rounded-full pointer-events-none"></div>
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-300 h-300 border border-white/5 rounded-full pointer-events-none"></div>

        <div className="container mx-auto px-6 relative z-10 flex flex-col items-center text-center">
          
          {/* Badge / Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 backdrop-blur-sm mb-8">
             <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-200 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
            <span className="text-sm font-medium tracking-wide text-blue-100">Research Prototype v1.0</span>
          </div>

          {/* Centered Headlines */}
          <h1 className="font-heading text-white text-4xl md:text-6xl font-bold leading-tight max-w-5xl mb-6">
            AI-Assisted Early Dental <br className="hidden md:block" /> Caries Detection
          </h1>
          
          <p className="font-sans text-lg md:text-xl text-blue-100 font-light max-w-2xl leading-relaxed mb-10">
            A decision-support system that analyzes dental images, grades caries severity, and visually explains AI predictions for clinical support.
          </p>
          
          {/* Centered Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            <button className="px-8 py-3 bg-white text-blue-700 font-semibold rounded-full shadow-lg hover:shadow-xl hover:bg-gray-50 transition-all transform hover:-translate-y-0.5">
              View Demo
            </button>
            <a href="#how-it-works" onClick={(e) => handleScroll(e, 'how-it-works')} className="px-8 py-3 bg-transparent border border-white/40 text-white font-semibold rounded-full hover:bg-white/10 transition-all">
              How It Works
            </a>
          </div>

          {/* Centered Visual: X-Ray Dashboard Mockup */}
          <div className="relative w-full max-w-4xl mx-auto transform hover:scale-[1.01] transition-transform duration-500 ease-out">
            <div className="relative bg-gray-900 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-blue-400/30 overflow-hidden aspect-video group">
              
              {/* Simulated X-Ray Background */}
              <div className="absolute inset-0 bg-[url('/images/periapical-placeholder.jpg')] bg-cover bg-center opacity-80 mix-blend-luminosity"></div>
              
              {/* Overlay UI Elements */}
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent"></div>
              
              {/* Floating UI Tag */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md border border-white/20 px-6 py-3 rounded-lg flex items-center gap-4">
                <div className="flex items-center gap-2">
                   <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                   <span className="text-sm font-medium text-white">System Active</span>
                </div>
                <div className="w-px h-4 bg-white/20"></div>
                <div className="text-sm text-blue-100">
                   Processing Confidence: <span className="text-white font-bold">98.4%</span>
                </div>
              </div>

            </div>
            
            {/* Glow effect behind the image */}
            <div className="absolute -inset-4 bg-blue-500/20 blur-3xl -z-10 rounded-full"></div>
          </div>

        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="py-24 bg-white scroll-mt-20">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-sm font-bold text-blue-600 tracking-wider uppercase mb-3">Capabilities</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Precision Tools for Dental Professionals</h3>
            <p className="text-gray-600 text-lg">
              Designed to augment clinical expertise, Cariex highlights potential areas of concern instantly, ensuring no detail goes unnoticed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:border-blue-200 transition-colors">
              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                <Brain size={28} />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">AI-Powered Grading</h4>
              <p className="text-gray-600 leading-relaxed">
                Utilizes advanced neural networks trained on thousands of annotated radiographs to accurately identify and grade the severity of carious lesions.
              </p>
            </div>
            
            <div className="p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:border-blue-200 transition-colors">
              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                <ScanSearch size={28} />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Visual Heatmaps</h4>
              <p className="text-gray-600 leading-relaxed">
                Provides instant visual explanations overlaying standard X-rays, drawing the clinician's eye directly to high-probability areas of decay.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:border-blue-200 transition-colors">
              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                <ShieldCheck size={28} />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Clinical Decision Support</h4>
              <p className="text-gray-600 leading-relaxed">
                Acts as an objective second opinion, helping to reduce diagnostic variability and improve early intervention strategies.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-24 bg-gray-50 border-t border-gray-200 scroll-mt-20">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-sm font-bold text-blue-600 tracking-wider uppercase mb-3">Workflow</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How Cariex Works</h3>
            <p className="text-gray-600 text-lg">
              A seamless, three-step process designed to fit perfectly into your existing diagnostic routine without causing delays.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-8 relative max-w-5xl mx-auto">
            <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-gray-200 z-0"></div>

            <div className="flex-1 relative z-10 flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-white rounded-full border-4 border-blue-50 shadow-sm flex items-center justify-center text-blue-600 mb-6">
                <UploadCloud size={32} />
              </div>
              <div className="bg-blue-600 text-white text-sm font-bold px-3 py-1 rounded-full mb-4">Step 1</div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Upload Radiograph</h4>
              <p className="text-gray-600 px-4">Securely upload cropped periapical dental radiographs in compatible formats.</p>
            </div>

            <div className="flex-1 relative z-10 flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-white rounded-full border-4 border-blue-50 shadow-sm flex items-center justify-center text-blue-600 mb-6">
                <Cpu size={32} />
              </div>
              <div className="bg-blue-600 text-white text-sm font-bold px-3 py-1 rounded-full mb-4">Step 2</div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">AI Processing</h4>
              <p className="text-gray-600 px-4">Our model instantly scans the image, detecting anomalies and calculating confidence scores.</p>
            </div>

            <div className="flex-1 relative z-10 flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-white rounded-full border-4 border-blue-50 shadow-sm flex items-center justify-center text-blue-600 mb-6">
                <Stethoscope size={32} />
              </div>
              <div className="bg-blue-600 text-white text-sm font-bold px-3 py-1 rounded-full mb-4">Step 3</div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Clinical Review</h4>
              <p className="text-gray-600 px-4">Review the annotated heatmap overlays and incorporate the insights into your diagnosis.</p>
            </div>
          </div>
        </div>
      </section>

      {/* TEAM SECTION */}
      <section id="team" className="py-24 bg-white border-t border-gray-200 scroll-mt-20">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-sm font-bold text-blue-600 tracking-wider uppercase mb-3">Our Experts</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">The Minds Behind Cariex</h3>
            <p className="text-gray-600 text-lg">
              Combining expertise in artificial intelligence, clinical dentistry, and human-centered design to redefine dental diagnostics.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.33rem)] max-w-sm group bg-gray-50 rounded-2xl p-8 border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="w-20 h-20 bg-blue-100 rounded-2xl mb-6 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                   <span className="font-bold text-2xl">{member.name.charAt(0)}</span>
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-1">{member.name}</h4>
                <p className="text-blue-600 font-semibold text-sm mb-4">{member.role}</p>
                <p className="text-gray-500 text-sm leading-relaxed mb-6">{member.bio}</p>
                <div className="flex gap-4">
                  <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors"><Linkedin size={18} /></a>
                  <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors"><Mail size={18} /></a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white py-16 mt-auto">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
              <Image
                src="/logo/cariex-logo-white-ic.svg"
                alt="Cariex icon"
                width={56}
                height={56}
                className="h-10 w-auto opacity-90"
              />
              <span
                className="text-white text-2xl md:text-3xl tracking-wide"
                style={{ fontFamily: "MonainnRegular, 'Montserrat', sans-serif" }}
              >
                Cariex
              </span>
          </div>
          <p className="text-gray-400 mb-8 font-medium">AI-driven support for dental caries assessment.</p>
          
          <div className="max-w-2xl mx-auto border-t border-white/10 pt-8 mt-8">
            <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-3">Academic Disclaimer</p>
            <p className="text-sm text-gray-400 italic leading-relaxed">
              "This platform is intended for research and decision-support purposes only. It is not a medical device and should not be used as a replacement for professional clinical diagnosis."
            </p>
          </div>
          
          <div className="mt-12 text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Cariex Team. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}