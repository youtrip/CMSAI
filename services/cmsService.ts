import { CMSPage } from '../types';
import { INITIAL_PAGES } from './mockDb';

const STORAGE_KEY = 'cms_pages_v1';

class CMSService {
  private pages: Record<string, CMSPage>;

  constructor() {
    // Load from local storage or fall back to initial mock DB
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        this.pages = JSON.parse(stored);
        // Merge default pages if they are missing (e.g. after code update)
        this.pages = { ...INITIAL_PAGES, ...this.pages };
    } else {
        this.pages = { ...INITIAL_PAGES };
    }
  }

  private persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.pages));
  }

  async getPage(slug: string): Promise<CMSPage | null> {
    // Simulate network latency
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.pages[slug] || null;
  }

  async getAllPages(): Promise<CMSPage[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return Object.values(this.pages);
  }

  async savePage(slug: string, page: CMSPage): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 400));
    this.pages[slug] = page;
    this.persist();
  }

  async createPage(slug: string, title: string): Promise<CMSPage> {
      if (this.pages[slug]) {
        // If page exists, return it (or handle error)
        return this.pages[slug];
      }

      const newPage: CMSPage = {
          slug,
          rawContent: '',
          markdownBody: '# ' + title + '\n\nStart editing...',
          metadata: {
              title,
              layout: 'default',
              components: [
                 // Default to a text block so markdownBody is visible
                 { type: 'text-block', props: { content: '' } } 
              ]
          }
      };
      this.pages[slug] = newPage;
      this.persist();
      return newPage;
  }
}

export const cmsService = new CMSService();