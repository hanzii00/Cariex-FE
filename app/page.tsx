import Image from "next/image";
import { Montserrat, Inter } from "next/font/google";
import { 
  ArrowRight,
  Menu
} from "lucide-react";

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
  return (
    <main className={`${montserrat.variable} ${inter.variable} min-h-screen bg-white font-sans text-gray-900 selection:bg-blue-100 flex flex-col`}>
      
      {/* NEW HEADER SECTION */}
      <header className="absolute top-0Left w-full z-50 py-4 border-b border-white/10 bg-blue-900/20 backdrop-blur-md">
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

          {/* Desktop Navigation (Optional placeholders) */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-blue-100">
            <a href="#" className="hover:text-white transition-colors">Features</a>
            <a href="#" className="hover:text-white transition-colors">How It Works</a>
            <a href="#" className="hover:text-white transition-colors">Research</a>
          </nav>

          {/* Login/Signup Buttons */}
          <div className="flex items-center gap-4">
            <button className="hidden md:block text-sm font-semibold text-blue-100 hover:text-white transition-colors px-4 py-2">
              Log In
            </button>
            <button className="bg-blue-600 text-sm font-semibold text-white px-5 py-2.5 rounded-full shadow-md hover:bg-blue-500 transition-all flex items-center gap-2">
              Sign Up <ArrowRight size={16} />
            </button>
            {/* Mobile Menu Icon */}
            <button className="md:hidden text-blue-100">
               <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION (Centered Layout) */}
      <section className="relative w-full bg-gradient-to-b from-blue-800 to-blue-600 text-white overflow-hidden pt-40 pb-24 flex-grow">
        
        {/* Background Decorative Circles */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/10 rounded-full pointer-events-none"></div>
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] border border-white/5 rounded-full pointer-events-none"></div>
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] border border-white/5 rounded-full pointer-events-none"></div>

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
          <h1 className="font-heading text-4xl md:text-6xl font-bold leading-tight max-w-5xl mb-6">
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
            <button className="px-8 py-3 bg-transparent border border-white/40 text-white font-semibold rounded-full hover:bg-white/10 transition-all">
              How It Works
            </button>
          </div>

          {/* Centered Visual: X-Ray Dashboard Mockup */}
          <div className="relative w-full max-w-4xl mx-auto transform hover:scale-[1.01] transition-transform duration-500 ease-out">
            <div className="relative bg-gray-900 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-blue-400/30 overflow-hidden aspect-video group">
              
              {/* Simulated X-Ray Background */}
              <div className="absolute inset-0 bg-[url('/images/panoramic-placeholder.png')] bg-cover bg-center opacity-80 mix-blend-luminosity"></div>
              
              {/* Overlay UI Elements */}
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent"></div>
              
              {/* Simulated Heatmap Overlay (Centered focus) */}
              <div className="absolute top-[40%] left-[45%] w-24 h-24 bg-red-500/30 blur-xl rounded-full animate-pulse"></div>
              <div className="absolute top-[42%] left-[46%] w-16 h-16 border-2 border-red-400/80 rounded-sm"></div>
              
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

      {/* FOOTER */}
      <footer className="bg-white border-t border-gray-200 py-12 mt-auto">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
             <Image
               src="/logo/cariex-logo-blue-ic.svg"
               alt="Cariex icon"
                width={56}
                height={56}
                className="h-14 w-auto"
             />
             <h3
               className="font-heading font-regular text-2xl md:text-3xl text-gray-900"
               style={{ fontFamily: "MonainnRegular, 'Montserrat', sans-serif" }}
             >
               Cariex
             </h3>
          </div>
          <p className="text-gray-500 mb-8">AI support for dental caries assessment.</p>
          
          <div className="max-w-2xl mx-auto">
            <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-2">Academic Disclaimer</p>
            <p className="text-sm text-gray-500 italic">
              "For research and decision-support purposes only. Not a replacement for professional diagnosis."
            </p>
          </div>
          
          <div className="mt-12 text-sm text-gray-400">
            &copy; {new Date().getFullYear()} Cariex Team.
          </div>
        </div>
      </footer>
    </main>
  );
}