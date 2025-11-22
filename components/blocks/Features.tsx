import React from 'react';
import * as Icons from 'lucide-react';

interface FeatureItem {
  title: string;
  description: string;
  icon: string; // Name of Lucide icon
}

interface FeaturesProps {
  items: FeatureItem[];
}

const Features: React.FC<FeaturesProps> = ({ items }) => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((item, idx) => {
            // Dynamic Icon lookup
            // @ts-ignore
            const IconComponent = Icons[item.icon] || Icons.HelpCircle;

            return (
              <div key={idx} className="p-6 bg-slate-50 rounded-xl border border-slate-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white mb-4">
                  <IconComponent size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-600">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
