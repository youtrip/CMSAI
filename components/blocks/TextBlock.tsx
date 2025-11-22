import React from 'react';
import ReactMarkdown from 'react-markdown';

// Uses a context/prop hack: In a real app, we might pass the body via context
// For now, we won't pass props because this component reads the markdown body passed by the parent Page renderer
// But wait, the block renderer doesn't implicitly know the page content.
// Let's make this block accept "content" as a prop, or we assume it's a spacer.
// Actually, let's use it to render the Markdown Body specifically.

interface TextBlockProps {
   content?: string; // Optional override
}

// To access the Page Context, we'd need a Provider. For simplicity, we will rely on 
// the parent passing children or explicit props. 
// We will modify the PageRenderer to inject the markdown body into the component config if type is 'text-block'

const TextBlock: React.FC<TextBlockProps> = ({ content }) => {
  if (!content) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 prose prose-lg prose-slate">
       <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
};

export default TextBlock;
