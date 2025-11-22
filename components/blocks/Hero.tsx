import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HeroProps {
  title: string;
  subtitle: string;
  ctaText?: string;
  ctaLink?: string;
  backgroundImage?: string;
}

const Hero: React.FC<HeroProps> = ({ title, subtitle, ctaText, ctaLink, backgroundImage }) => {
  return (
    <div className="relative bg-slate-900 text-white overflow-hidden">
      {backgroundImage && (
        <div className="absolute inset-0 z-0 opacity-40">
            <img src={backgroundImage} alt="Hero background" className="w-full h-full object-cover" />
        </div>
      )}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
            {title}
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-10">
            {subtitle}
          </p>
          {ctaText && ctaLink && (
            <Link 
              to={ctaLink}
              className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-md text-slate-900 bg-white hover:bg-slate-100 transition-colors"
            >
              {ctaText}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Hero;
