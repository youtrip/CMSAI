import React, { useState, useEffect } from 'react';
import { cmsService } from '../../services/cmsService';
import { generateArticle } from '../../services/geminiService';
import { CMSPage } from '../../types';
import { Plus, Loader2, Edit3, Sparkles, Save, X, FileText } from 'lucide-react';

const AdminPanel: React.FC = () => {
  const [pages, setPages] = useState<CMSPage[]>([]);
  const [editingPage, setEditingPage] = useState<CMSPage | null>(null);
  
  // Edit State
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  // AI State
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiStyle, setAiStyle] = useState('Professional');
  const [generating, setGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const [targetSlug, setTargetSlug] = useState('');

  useEffect(() => {
    loadPages();
  }, []);

  const loadPages = async () => {
    const data = await cmsService.getAllPages();
    setPages(data);
  };

  const handleEditClick = (page: CMSPage) => {
    setEditingPage(page);
    setEditTitle(page.metadata.title);
    setEditContent(page.markdownBody || '');
  };

  const handleCancelEdit = () => {
    setEditingPage(null);
    setEditTitle('');
    setEditContent('');
  };

  const handleSaveEdit = async () => {
    if (!editingPage) return;
    
    const updatedPage: CMSPage = {
        ...editingPage,
        markdownBody: editContent,
        metadata: {
            ...editingPage.metadata,
            title: editTitle
        }
    };

    await cmsService.savePage(updatedPage.slug, updatedPage);
    await loadPages();
    setEditingPage(null);
    alert('Page updated successfully!');
  };

  const handleCreateAI = async () => {
    if(!aiPrompt || !targetSlug) return;
    setGenerating(true);
    try {
        const content = await generateArticle(aiPrompt, aiStyle);
        setGeneratedContent(content);
        
        // Auto-save to a new page
        // Ensure slug starts with /
        const formattedSlug = targetSlug.startsWith('/') ? targetSlug : `/${targetSlug}`;
        
        const newPage = await cmsService.createPage(formattedSlug, aiPrompt);
        newPage.markdownBody = content;
        await cmsService.savePage(formattedSlug, newPage);
        
        loadPages();
        alert(`Page ${formattedSlug} created with AI content!`);
        // Optionally open in edit mode immediately
        // handleEditClick(newPage);
    } catch (e) {
        alert('Error generating content');
    } finally {
        setGenerating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8 flex justify-between items-center">
        <h2 className="text-3xl font-bold text-slate-800">Content Management</h2>
        <div className="flex gap-2">
            {editingPage && (
                <button onClick={handleCancelEdit} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                    Cancel Editing
                </button>
            )}
            <button onClick={() => loadPages()} className="text-blue-600 hover:text-blue-800 text-sm font-medium px-3 py-2">
                Refresh List
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Page List */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden h-fit">
            <div className="p-4 border-b border-slate-100 bg-slate-50 font-semibold text-slate-700 flex justify-between items-center">
                <span>Pages</span>
                <span className="text-xs bg-slate-200 text-slate-600 px-2 py-1 rounded-full">{pages.length}</span>
            </div>
            <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
                {pages.map(page => (
                    <div 
                        key={page.slug} 
                        className={`p-4 flex justify-between items-center hover:bg-slate-50 cursor-pointer transition-colors ${editingPage?.slug === page.slug ? 'bg-blue-50 border-l-4 border-blue-500' : ''}`}
                        onClick={() => handleEditClick(page)}
                    >
                        <div className="overflow-hidden">
                            <div className="font-medium text-slate-900 truncate">{page.metadata.title}</div>
                            <div className="text-xs text-slate-500 truncate font-mono">{page.slug}</div>
                        </div>
                        <button 
                            onClick={(e) => { e.stopPropagation(); handleEditClick(page); }}
                            className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                        >
                            <Edit3 size={16} />
                        </button>
                    </div>
                ))}
            </div>
        </div>

        {/* Editor or AI Generator Area */}
        <div className="lg:col-span-2">
            {editingPage ? (
                <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                        <div className="flex items-center gap-3">
                            <FileText className="text-blue-600" />
                            <div>
                                <h3 className="text-xl font-bold text-slate-900">Editing: {editingPage.slug}</h3>
                                <p className="text-xs text-slate-500">Last saved: Just now (Simulated)</p>
                            </div>
                        </div>
                        <button 
                            onClick={handleSaveEdit}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-sm transition-all"
                        >
                            <Save size={16} /> Save Changes
                        </button>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Page Title</label>
                            <input 
                                type="text" 
                                className="w-full rounded-lg border-slate-300 border p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                value={editTitle}
                                onChange={e => setEditTitle(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Markdown Content
                                <span className="ml-2 text-xs font-normal text-slate-500">(This feeds into the Text Block component)</span>
                            </label>
                            <textarea 
                                className="w-full rounded-lg border-slate-300 border p-4 font-mono text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all h-96"
                                value={editContent}
                                onChange={e => setEditContent(e.target.value)}
                            />
                        </div>
                        
                        <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-lg text-sm text-yellow-800">
                            <strong>Note:</strong> You are editing the Markdown body. Complex components (like Hero or Features) are currently managed via the code configuration in this demo.
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl shadow-sm border border-indigo-100 p-8 h-fit">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600">
                            <Sparkles size={20} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-indigo-900">AI Content Generator</h3>
                            <p className="text-indigo-700/80 text-sm">Instantly create new pages with Gemini AI.</p>
                        </div>
                    </div>
                    
                    <div className="space-y-5 bg-white/50 p-6 rounded-xl border border-indigo-100/50">
                        <div>
                            <label className="block text-sm font-medium text-indigo-900 mb-1">New Page Slug</label>
                            <div className="relative">
                                <span className="absolute left-3 top-2.5 text-indigo-300">/</span>
                                <input 
                                    type="text" 
                                    className="w-full rounded-lg border-indigo-200 pl-6 p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                                    placeholder="blog/future-tech"
                                    value={targetSlug}
                                    onChange={e => setTargetSlug(e.target.value)}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-indigo-900 mb-1">Topic / Prompt</label>
                            <input 
                                type="text" 
                                className="w-full rounded-lg border-indigo-200 p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                                placeholder="e.g., The Future of Web Development"
                                value={aiPrompt}
                                onChange={e => setAiPrompt(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-indigo-900 mb-1">Writing Style</label>
                            <select 
                                className="w-full rounded-lg border-indigo-200 p-2.5 text-sm bg-white"
                                value={aiStyle}
                                onChange={e => setAiStyle(e.target.value)}
                            >
                                <option>Professional</option>
                                <option>Casual</option>
                                <option>Humorous</option>
                                <option>Technical</option>
                            </select>
                        </div>
                        
                        <button 
                            onClick={handleCreateAI}
                            disabled={generating || !targetSlug || !aiPrompt}
                            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                        >
                            {generating ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating Content...
                                </>
                            ) : (
                                <>
                                    <Plus className="w-4 h-4 mr-2" /> Generate & Create Page
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;