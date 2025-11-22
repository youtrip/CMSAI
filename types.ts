export enum UserRole {
  GUEST = 'GUEST',
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export interface User {
  username: string;
  role: UserRole;
}

// Component Configuration Types
export interface ComponentConfig {
  type: string; // Maps to the component registry key (e.g., 'hero', 'article')
  props: Record<string, any>; // Props passed to the component
  id?: string;
}

// Front Matter Structure
export interface PageMetadata {
  title: string;
  description?: string;
  layout?: 'default' | 'landing' | 'dashboard';
  requiresAuth?: boolean;
  requiredRole?: UserRole;
  components?: ComponentConfig[]; // List of dynamic components to render
}

// The "File" Structure
export interface CMSPage {
  slug: string;
  rawContent: string; // The full file content
  metadata: PageMetadata;
  markdownBody: string; // Content after Front Matter
}

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'textarea' | 'select';
  required?: boolean;
  options?: string[]; // For select
}

export interface FormConfig {
  id: string;
  title: string;
  fields: FormField[];
  submitLabel: string;
  successMessage: string;
}
