import { CMSPage, UserRole } from '../types';

// In a real app, these would be .md files in a folder.
// Here we simulate the parsed result directly to avoid the complexity of the custom YAML parser for deeply nested component props.

export const INITIAL_PAGES: Record<string, CMSPage> = {
  '/': {
    slug: '/',
    rawContent: '',
    markdownBody: '',
    metadata: {
      title: 'Home - Enterprise CMS',
      layout: 'landing',
      components: [
        {
          type: 'hero',
          props: {
            title: 'Build Faster with React CMS',
            subtitle: 'A powerful Markdown-driven system with AI capabilities.',
            ctaText: 'Get Started',
            ctaLink: '/about',
            backgroundImage: 'https://picsum.photos/1920/1080'
          }
        },
        {
          type: 'features',
          props: {
            items: [
              { title: 'Markdown Driven', description: 'Edit content using simple text files.', icon: 'FileText' },
              { title: 'AI Powered', description: 'Generate content instantly with Gemini.', icon: 'Bot' },
              { title: 'Component System', description: 'Dynamic block-based rendering.', icon: 'Blocks' }
            ]
          }
        }
      ]
    }
  },
  '/products': {
    slug: '/products',
    rawContent: '',
    markdownBody: '',
    metadata: {
      title: 'Our Products',
      layout: 'default',
      components: [
        {
          type: 'hero',
          props: {
            title: 'Premium Solutions',
            subtitle: 'Browse our catalog of high-tech widgets.',
            ctaText: 'Contact Sales',
            ctaLink: '/about',
            backgroundImage: 'https://picsum.photos/id/20/1920/600'
          }
        },
        {
          type: 'features',
          props: {
            items: [
              { title: 'Widget A', description: 'The classic widget.', icon: 'Package' },
              { title: 'Widget B', description: 'Faster, stronger.', icon: 'Zap' },
              { title: 'Widget C', description: 'Eco-friendly edition.', icon: 'Leaf' }
            ]
          }
        },
        {
            type: 'text-block',
            props: {
                content: "## Custom Enterprise Solutions\n\nWe offer bulk pricing for enterprise customers. Please contact our sales team for a quote."
            }
        }
      ]
    }
  },
  '/about': {
    slug: '/about',
    rawContent: '',
    markdownBody: `
# About Our Mission

We believe in simplifying content management. This page renders standard Markdown content alongside dynamic components.

## Why Us?

1. Speed
2. Flexibility
3. Security

> "The best code is no code." - Anonymous
    `,
    metadata: {
      title: 'About Us',
      layout: 'default',
      components: [
        {
          type: 'text-block',
          props: { theme: 'light' }
        },
        {
          type: 'contact-form',
          props: {
            id: 'contact-main',
            title: 'Send us a Message',
            fields: [
              { name: 'email', label: 'Email Address', type: 'email', required: true },
              { name: 'message', label: 'Your Message', type: 'textarea', required: true }
            ],
            submitLabel: 'Send Inquiry',
            successMessage: 'Thanks! We will get back to you.'
          }
        }
      ]
    }
  },
  '/admin': {
    slug: '/admin',
    rawContent: '',
    markdownBody: '',
    metadata: {
      title: 'Admin Dashboard',
      layout: 'dashboard',
      requiresAuth: true,
      requiredRole: UserRole.ADMIN,
      components: [
        {
          type: 'admin-panel',
          props: {}
        }
      ]
    }
  }
};