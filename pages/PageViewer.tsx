import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cmsService } from '../services/cmsService';
import { CMSPage } from '../types';
import { DynamicRenderer } from '../components/registry';
import { useAuth } from '../contexts/AuthContext';
import { Loader2 } from 'lucide-react';

const PageViewer: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [page, setPage] = useState<CMSPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPage = async () => {
      setLoading(true);
      setError(null);
      
      const slug = location.pathname;
      const data = await cmsService.getPage(slug);

      if (!data) {
        setError('Page not found (404)');
        setLoading(false);
        return;
      }

      // Auth Check
      if (data.metadata.requiresAuth && !isAuthenticated) {
        setError('Unauthorized. Please login.');
        setLoading(false);
        return;
      }

      if (data.metadata.requiredRole && user?.role !== data.metadata.requiredRole) {
        setError('Forbidden. Insufficient permissions.');
        setLoading(false);
        return;
      }

      setPage(data);
      setLoading(false);
    };

    fetchPage();
  }, [location.pathname, isAuthenticated, user]);

  if (loading) {
    return (
        <div className="h-[calc(100vh-200px)] flex flex-col items-center justify-center text-slate-400">
            <Loader2 className="w-10 h-10 animate-spin mb-4" />
            <p>Loading content...</p>
        </div>
    );
  }

  if (error || !page) {
    return (
      <div className="max-w-md mx-auto mt-20 text-center p-8 bg-white rounded-xl shadow-lg border border-slate-100">
        <h1 className="text-4xl font-bold text-slate-300 mb-4">Ooops!</h1>
        <p className="text-lg text-slate-600 mb-6">{error}</p>
        <button onClick={() => navigate('/')} className="text-blue-600 font-medium hover:underline">
            Go back home
        </button>
      </div>
    );
  }

  // Inject markdown body into 'text-block' components if they exist, 
  // or render markdown at the bottom if no components defined.
  const hasComponents = page.metadata.components && page.metadata.components.length > 0;

  return (
    <div className={`page-wrapper layout-${page.metadata.layout}`}>
        {hasComponents ? (
            page.metadata.components?.map((comp, index) => {
                // Special injection: If it's a text-block and has no specific content prop, inject the page body
                let props = { ...comp.props };
                if (comp.type === 'text-block' && !props.content) {
                    props.content = page.markdownBody;
                }
                return <DynamicRenderer key={index} config={{ ...comp, props }} />;
            })
        ) : (
           <div className="max-w-4xl mx-auto px-4 py-12 prose prose-slate bg-white p-8 rounded-lg shadow mt-8">
             <h1>{page.metadata.title}</h1>
             <DynamicRenderer config={{ type: 'text-block', props: { content: page.markdownBody } }} />
           </div>
        )}
    </div>
  );
};

export default PageViewer;
