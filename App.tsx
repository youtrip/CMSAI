import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout/Layout';
import PageViewer from './pages/PageViewer';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <Layout>
          <Routes>
            {/* 
              The Catch-All Route: 
              Since this is a CMS, almost every route is dynamic based on content.
              We let PageViewer handle the logic of matching URL -> Content.
            */}
            <Route path="*" element={<PageViewer />} />
          </Routes>
        </Layout>
      </HashRouter>
    </AuthProvider>
  );
};

export default App;
