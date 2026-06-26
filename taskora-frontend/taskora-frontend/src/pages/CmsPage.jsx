import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Seo from '../components/Seo';

const CmsPage = () => {
  const { slug } = useParams();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    axios.get(`http://localhost:8081/api/cms/${slug}`)
      .then((r) => setPage(r.data))
      .catch(() => setError('Page not found.'))
      .finally(() => setLoading(false));
  }, [slug]);

  return (
    <div className="d-flex flex-column min-vh-100">
      <Seo title={page ? `${page.title} - Taskora` : 'Taskora'} description={page?.content?.substring(0, 160)} />
      <Navbar />
      <div className="container py-5 flex-grow-1" style={{ maxWidth: 800 }}>
        {loading ? (
          <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
        ) : error ? (
          <div className="text-center py-5">
            <i className="bi bi-file-earmark-x text-muted d-block mb-3" style={{ fontSize: '3rem' }}></i>
            <h4 className="fw-bold">Page Not Found</h4>
            <p className="text-muted">The page you're looking for doesn't exist.</p>
            <Link to="/" className="btn btn-primary">Go Home</Link>
          </div>
        ) : (
          <article>
            <h1 className="fw-bold mb-4">{page.title}</h1>
            <div className="text-muted" style={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}
              dangerouslySetInnerHTML={{ __html: page.content }} />
          </article>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default CmsPage;
