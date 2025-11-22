import React, { lazy, Suspense } from 'react';
import { ComponentConfig } from '../types';

// Lazy load components for performance
const Hero = lazy(() => import('./blocks/Hero'));
const Features = lazy(() => import('./blocks/Features'));
const ContactForm = lazy(() => import('./blocks/ContactForm'));
const AdminPanel = lazy(() => import('./blocks/AdminPanel'));
const TextBlock = lazy(() => import('./blocks/TextBlock'));

// The Registry Map
const COMPONENT_MAP: Record<string, React.LazyExoticComponent<any>> = {
  'hero': Hero,
  'features': Features,
  'contact-form': ContactForm,
  'admin-panel': AdminPanel,
  'text-block': TextBlock,
};

interface DynamicRendererProps {
  config: ComponentConfig;
}

export const DynamicRenderer: React.FC<DynamicRendererProps> = ({ config }) => {
  const Component = COMPONENT_MAP[config.type];

  if (!Component) {
    return (
      <div className="p-4 border-2 border-dashed border-red-300 rounded bg-red-50 text-red-600">
        ⚠️ Component <strong>{config.type}</strong> not found in registry.
      </div>
    );
  }

  // Cast to any to avoid TypeScript errors about 'id' not existing on specific component types
  // (e.g., Hero component does not define 'id' in its props, causing IntrinsicAttributes error).
  const SafeComponent = Component as any;

  return (
    <Suspense fallback={<div className="p-4 animate-pulse bg-gray-100 h-32 rounded"></div>}>
      <SafeComponent {...config.props} id={config.id} />
    </Suspense>
  );
};