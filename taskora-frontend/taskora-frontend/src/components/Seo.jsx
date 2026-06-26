import React from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * Reusable SEO component. Drop it in any page to set meta tags + Open Graph.
 * Defaults to site-level values from the SRS if not provided.
 */
const Seo = ({
  title = 'Taskora - Freelancer Social Networking Platform',
  description = 'Connect, collaborate and grow. The ultimate platform for freelancers, employers and professionals.',
  keywords = 'freelancer, jobs, projects, bidding, portfolio, social network, hiring, remote work',
  ogImage = '/logo.png',
}) => (
  <Helmet>
    <title>{title}</title>
    <meta name="description" content={description} />
    <meta name="keywords" content={keywords} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={ogImage} />
    <meta property="og:type" content="website" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
  </Helmet>
);

export default Seo;
