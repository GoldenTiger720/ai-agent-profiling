
import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Database, FileText, Youtube, Search } from 'lucide-react';

const Index = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Star properties
    const stars: { x: number; y: number; size: number; speed: number }[] = [];
    const generateStars = () => {
      stars.length = 0;
      const starCount = Math.floor(window.innerWidth * window.innerHeight / 1500);
      
      for (let i = 0; i < starCount; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2,
          speed: 0.1 + Math.random() * 0.3
        });
      }
    };
    
    generateStars();
    
    // Animation
    const animateStars = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw stars
      stars.forEach(star => {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Move star
        star.y += star.speed;
        
        // Reset star position if it moves off screen
        if (star.y > canvas.height) {
          star.y = 0;
          star.x = Math.random() * canvas.width;
        }
      });
      
      requestAnimationFrame(animateStars);
    };
    
    animateStars();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <div className="relative min-h-[calc(100vh-12rem)]">
      {/* Starry background */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 -z-10 pointer-events-none"
      />
      
      <div className="space-y-16 py-10 relative z-10">
        {/* Hero Section */}
        <section className="text-center space-y-8 max-w-4xl mx-auto animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-findmystage-blue via-findmystage-purple to-findmystage-pink bg-clip-text text-transparent">
              AI-Powered Speaker Profiling
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            FindMyStage creates comprehensive profiles for speakers and identifies
            the perfect speaking opportunities based on your expertise and personality.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild size="lg" className="rounded-full px-8 animate-pulse-slow">
              <Link to="/profile">Create Speaker Profile</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full px-8 hover:scale-105 transition-transform">
              <Link to="/database">Explore Database</Link>
            </Button>
          </div>
        </section>
        
        {/* Flow Diagram */}
        <section className="max-w-6xl mx-auto rounded-3xl border bg-card/60 backdrop-blur-sm p-8 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <h2 className="text-2xl font-semibold text-center mb-10">How FindMyStage Works</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Input Section */}
            <div className="input-section space-y-4 transform transition-all hover:scale-105 duration-300">
              <h3 className="text-xl font-medium text-center">User Input</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <FileText size={20} className="text-findmystage-green" />
                  <p>Upload PDF documents</p>
                </div>
                <div className="flex items-center gap-2">
                  <Youtube size={20} className="text-findmystage-green" />
                  <p>Link YouTube channels</p>
                </div>
                <div className="flex items-center gap-2">
                  <Search size={20} className="text-findmystage-green" />
                  <p>Add website URLs</p>
                </div>
                <div className="flex items-center gap-2">
                  <Users size={20} className="text-findmystage-green" />
                  <p>Connect LinkedIn profiles</p>
                </div>
              </div>
            </div>
            
            {/* AI Processing */}
            <div className="space-y-8">
              <div className="agent-section space-y-4 transform transition-all hover:scale-105 duration-300">
                <h3 className="text-xl font-medium text-center">AI Analysis</h3>
                <p className="text-center">Our AI agent processes your content to create comprehensive speaker profiles.</p>
                <div className="flex justify-center mt-4">
                  <ArrowRight size={24} className="text-findmystage-blue animate-pulse-slow" />
                </div>
              </div>
              
              <div className="flex justify-center -my-4">
                <ArrowRight size={24} className="transform rotate-90 text-findmystage-blue animate-pulse-slow" />
              </div>
              
              <div className="agent-section space-y-4 transform transition-all hover:scale-105 duration-300">
                <h3 className="text-xl font-medium text-center">Event Matching</h3>
                <p className="text-center">The AI identifies relevant speaking opportunities and organizers.</p>
                <div className="flex justify-center mt-4">
                  <ArrowRight size={24} className="text-findmystage-blue animate-pulse-slow" />
                </div>
              </div>
            </div>
            
            {/* Output Section */}
            <div className="space-y-8">
              <div className="output-section space-y-4 transform transition-all hover:scale-105 duration-300">
                <h3 className="text-xl font-medium text-center">Speaker Profile</h3>
                <p className="text-center">Detailed speaker summary with topic expertise and personality insights.</p>
              </div>
              
              <div className="database-section space-y-4 transform transition-all hover:scale-105 duration-300">
                <h3 className="text-xl font-medium text-center">Stage Database</h3>
                <div className="flex items-center gap-2 justify-center">
                  <Database size={20} className="text-findmystage-pink" />
                  <p>Curated database of speaking opportunities</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="text-center space-y-6 max-w-3xl mx-auto py-8 animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <h2 className="text-3xl font-bold">Ready to Find Your Stage?</h2>
          <p className="text-lg text-muted-foreground">
            Let our AI agent analyze your content and match you with the perfect speaking opportunities.
          </p>
          <Button asChild size="lg" className="rounded-full px-8 animate-pulse-slow">
            <Link to="/profile">Get Started</Link>
          </Button>
        </section>
      </div>
    </div>
  );
};

export default Index;
