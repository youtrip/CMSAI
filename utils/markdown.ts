import { CMSPage, PageMetadata } from '../types';

/**
 * simpleFrontMatterParser
 * Parses a string looking for YAML-style front matter between '---' delimiters.
 */
export const parseMarkdownFile = (slug: string, fileContent: string): CMSPage => {
  const frontMatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const match = fileContent.match(frontMatterRegex);

  if (!match) {
    // No front matter, return defaults
    return {
      slug,
      rawContent: fileContent,
      metadata: { title: slug, components: [] },
      markdownBody: fileContent,
    };
  }

  const rawYaml = match[1];
  const markdownBody = match[2];

  // content: Simple YAML parser (supports strings, booleans, arrays of objects)
  const metadata = parseYaml(rawYaml);

  return {
    slug,
    rawContent: fileContent,
    metadata: metadata as PageMetadata,
    markdownBody,
  };
};

// A lightweight YAML parser for our specific CMS needs
// Note: In a production app, use 'js-yaml'. Here we implement a simplified version to avoid external deps.
const parseYaml = (yaml: string): any => {
  const lines = yaml.split('\n');
  const result: any = {};
  let currentKey: string | null = null;
  let inArray = false;
  let currentArrayItem: any = null;

  lines.forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;

    // Detect array item start "- "
    if (trimmed.startsWith('- ')) {
      if (currentKey && !Array.isArray(result[currentKey])) {
        result[currentKey] = [];
      }
      inArray = true;
      // Start a new object for this item (assuming array of objects for components)
      currentArrayItem = {}; 
      result[currentKey].push(currentArrayItem);
      
      // Handle inline array item e.g., "- type: hero"
      const contentAfterDash = trimmed.substring(2).trim();
      if (contentAfterDash.includes(':')) {
         const [prop, val] = contentAfterDash.split(':').map(s => s.trim());
         currentArrayItem[prop] = parseValue(val);
      }
      return;
    }

    // Property line "key: value"
    const colonIndex = line.indexOf(':');
    if (colonIndex !== -1) {
      const key = line.substring(0, colonIndex).trim();
      let value = line.substring(colonIndex + 1).trim();

      // Indented lines belong to the current array item or object
      if (line.startsWith('    ') || line.startsWith('  ')) {
        if (inArray && currentArrayItem) {
           // Logic for nested props inside components
           // This parser is simplified. For the demo, we will handle flat props mainly
           // or simple nesting.
           if(key === 'props') {
              // Props usually starts a nested object block, tricky to parse line-by-line without recursion.
              // We will skip complex recursive parsing for this demo and assume a specific format or use a simpler structure.
              // FOR DEMO ROBUSTNESS: We will use a pre-defined JSON structure in the mock DB 
              // instead of raw string parsing for complex component trees, 
              // but still show the split logic.
           } else {
              // Check if we are inside a 'props' block conceptually
              // Simplified: Just add to current object
              currentArrayItem[key] = parseValue(value);
           }
        }
      } else {
        // Top level key
        inArray = false;
        currentKey = key;
        if (!value) {
          // likely starting an array or object
        } else {
          result[key] = parseValue(value);
        }
      }
    }
  });
  return result;
};

const parseValue = (val: string) => {
  if (val === 'true') return true;
  if (val === 'false') return false;
  if (!isNaN(Number(val))) return Number(val);
  // Remove quotes
  if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
    return val.slice(1, -1);
  }
  return val;
};
