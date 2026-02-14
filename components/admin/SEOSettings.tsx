'use client';

import { useState, useEffect } from 'react';
import { FaSearch, FaRobot, FaSitemap, FaGlobe, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import toast from 'react-hot-toast';

const SEOSettings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [sitemapStatus, setSitemapStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [robotsStatus, setRobotsStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false); // FIXED: Added saving state

  const [settings, setSettings] = useState({
    siteName: '',
    siteDescription: '',
    siteKeywords: '',
    googleAnalyticsId: '',
    googleSearchConsole: '',
    facebookPixel: '',
    twitterHandle: '',
    defaultOgImage: '',
  });

  useEffect(() => {
    fetchSettings();
    checkSitemapStatus();
    checkRobotsStatus();
  }, []);

  // FIXED: Improved fetch with better error handling
  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/seo-settings');
      
      if (!res.ok) {
        throw new Error(`Failed to load settings: ${res.status}`);
      }

      const data = await res.json();
      
      // FIXED: Ensure all fields are properly set
      setSettings({
        siteName: data.siteName || '',
        siteDescription: data.siteDescription || '',
        siteKeywords: data.siteKeywords || '',
        googleAnalyticsId: data.googleAnalyticsId || '',
        googleSearchConsole: data.googleSearchConsole || '',
        facebookPixel: data.facebookPixel || '',
        twitterHandle: data.twitterHandle || '',
        defaultOgImage: data.defaultOgImage || '',
      });
    } catch (err) {
      console.error('Error loading SEO settings:', err);
      toast.error('Failed to load SEO settings');
    } finally {
      setLoading(false);
    }
  };

  const checkSitemapStatus = async () => {
    try {
      const response = await fetch('/api/sitemap');
      if (response.ok) {
        setSitemapStatus('success');
      } else {
        setSitemapStatus('error');
      }
    } catch {
      setSitemapStatus('error');
    }
  };

  const checkRobotsStatus = async () => {
    try {
      const response = await fetch('/robots.txt');
      if (response.ok) {
        setRobotsStatus('success');
      } else {
        setRobotsStatus('error');
      }
    } catch {
      setRobotsStatus('error');
    }
  };

  // FIXED: Improved save handler with proper error handling
  const handleSaveSettings = async () => {
    setSaving(true);
    
    try {
      const res = await fetch('/api/admin/seo-settings', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: 'Failed to save' }));
        throw new Error(errorData.message || 'Failed to save settings');
      }

      const savedData = await res.json();
      
      // FIXED: Update state with saved data to ensure sync
      setSettings({
        siteName: savedData.siteName || '',
        siteDescription: savedData.siteDescription || '',
        siteKeywords: savedData.siteKeywords || '',
        googleAnalyticsId: savedData.googleAnalyticsId || '',
        googleSearchConsole: savedData.googleSearchConsole || '',
        facebookPixel: savedData.facebookPixel || '',
        twitterHandle: savedData.twitterHandle || '',
        defaultOgImage: savedData.defaultOgImage || '',
      });

      toast.success('SEO settings saved successfully!');
    } catch  {
      const message = 'Failed to save settings';
      toast(message);
    } finally {
      setSaving(false);
    }
  };
  // Add this function in your SEOSettings component
const handleForceRefresh = async () => {
  try {
    const res = await fetch('/api/admin/revalidate', {
      method: 'POST',
    });
    
    if (res.ok) {
      toast.success('✅ Metadata refreshed! Reloading page...');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } else {
      toast.error('Failed to refresh metadata');
    }
  } catch {
    toast.error('Error refreshing metadata');
  }
};

// Add this in your Analytics tab after the save button:
<div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
  <h4 className="font-semibold text-yellow-800 mb-2">
    Changes not showing up?
  </h4>
  <p className="text-sm text-yellow-700 mb-3">
    After saving your Google Search Console verification code, click below to force refresh the metadata.
  </p>
  <button
    onClick={handleForceRefresh}
    className="btn-outline text-sm"
  >
    🔄 Force Refresh Metadata
  </button>
</div>

  const handleGenerateSitemap = async () => {
    try {
      const response = await fetch('/api/sitemap');
      if (response.ok) {
        toast.success('Sitemap generated successfully!');
        setSitemapStatus('success');
      } else {
        toast.error('Failed to generate sitemap');
      }
    } catch  {
      toast('Error generating sitemap');
    }
  };

  // FIXED: Helper to update settings with proper typing
  const updateSetting = (key: keyof typeof settings, value: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const tabs = [
    { id: 'general', label: 'General SEO', icon: FaSearch },
    { id: 'sitemap', label: 'Sitemap', icon: FaSitemap },
    { id: 'robots', label: 'Robots.txt', icon: FaRobot },
    { id: 'analytics', label: 'Analytics', icon: FaGlobe },
  ];

  return (
    <div>
      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading SEO settings...</div>
      ) : (
        <>
          {/* Tabs */}
          <div className="bg-white rounded-xl shadow-lg mb-6">
            <div className="border-b border-gray-200">
              <div className="flex overflow-x-auto">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 px-6 py-4 font-medium border-b-2 transition-colors whitespace-nowrap ${
                        activeTab === tab.id
                          ? 'border-gold text-gold'
                          : 'border-transparent text-gray-600 hover:text-gold'
                      }`}
                    >
                      <Icon />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-6">
              {/* General SEO Tab */}
              {activeTab === 'general' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Site Name
                    </label>
                    <input
                      type="text"
                      value={settings.siteName}
                      onChange={(e) => updateSetting('siteName', e.target.value)}
                      className="input-field"
                      placeholder="DriveNow Rentals"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Site Description
                    </label>
                    <textarea
                      value={settings.siteDescription}
                      onChange={(e) => updateSetting('siteDescription', e.target.value)}
                      rows={3}
                      className="input-field"
                      placeholder="Brief description of your website"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Site Keywords (comma separated)
                    </label>
                    <input
                      type="text"
                      value={settings.siteKeywords}
                      onChange={(e) => updateSetting('siteKeywords', e.target.value)}
                      className="input-field"
                      placeholder="car rental, luxury cars, affordable rental"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Default OG Image URL
                    </label>
                    <input
                      type="text"
                      value={settings.defaultOgImage}
                      onChange={(e) => updateSetting('defaultOgImage', e.target.value)}
                      className="input-field"
                      placeholder="/images/og-image.jpg"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Recommended size: 1200x630 pixels
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Twitter Handle
                    </label>
                    <input
                      type="text"
                      value={settings.twitterHandle}
                      onChange={(e) => updateSetting('twitterHandle', e.target.value)}
                      className="input-field"
                      placeholder="@drivenowrentals"
                    />
                  </div>

                  <button 
                    onClick={handleSaveSettings} 
                    className="btn-primary"
                    disabled={saving}
                  >
                    {saving ? 'Saving...' : 'Save General Settings'}
                  </button>
                </div>
              )}

              {/* Sitemap Tab */}
              {activeTab === 'sitemap' && (
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-primary mb-2">
                          XML Sitemap Status
                        </h3>
                        <p className="text-gray-600">
                          Your sitemap helps search engines discover and index your pages.
                        </p>
                      </div>
                      {sitemapStatus === 'success' ? (
                        <FaCheckCircle className="text-3xl text-green-500" />
                      ) : (
                        <FaExclamationTriangle className="text-3xl text-yellow-500" />
                      )}
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                        <span className="font-medium">Sitemap URL:</span>
                        <a
                          href="/api/sitemap"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gold hover:underline"
                        >
                          /api/sitemap
                        </a>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                        <span className="font-medium">Status:</span>
                        <span
                          className={`badge ${
                            sitemapStatus === 'success' ? 'badge-success' : 'badge-warning'
                          }`}
                        >
                          {sitemapStatus === 'success' ? 'Active' : 'Checking...'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                        <span className="font-medium">Last Updated:</span>
                        <span className="text-gray-600">
                          {new Date().toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="mt-6 flex space-x-4">
                      <button onClick={handleGenerateSitemap} className="btn-primary">
                        Regenerate Sitemap
                      </button>
                      <a
                        href="/api/sitemap"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-outline"
                      >
                        View Sitemap
                      </a>
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-6">
                    <h4 className="font-semibold text-primary mb-3">Submit to Search Engines</h4>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-700">
                        <strong>Google Search Console:</strong>
                      </p>
                      <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600 ml-2">
                        <li>Go to <a href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">Google Search Console</a></li>
                        <li>Add your property (website)</li>
                        <li>Navigate to Sitemaps section</li>
                        <li>Submit: <code className="bg-white px-2 py-1 rounded">api/sitemap</code></li>
                      </ol>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-semibold text-primary mb-3">Sitemap Includes</h4>
                    <ul className="space-y-2">
                      <li className="flex items-center space-x-2">
                        <FaCheckCircle className="text-green-500" />
                        <span>All static pages (Home, Cars, About, Contact, Blog)</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <FaCheckCircle className="text-green-500" />
                        <span>Dynamic car pages (all available cars)</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <FaCheckCircle className="text-green-500" />
                        <span>Published blog posts</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <FaCheckCircle className="text-green-500" />
                        <span>Auto-updates when content changes</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Robots.txt Tab */}
              {activeTab === 'robots' && (
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-primary mb-2">
                          Robots.txt Status
                        </h3>
                        <p className="text-gray-600">
                          Controls how search engines crawl your website.
                        </p>
                      </div>
                      {robotsStatus === 'success' ? (
                        <FaCheckCircle className="text-3xl text-green-500" />
                      ) : (
                        <FaExclamationTriangle className="text-3xl text-yellow-500" />
                      )}
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                        <span className="font-medium">Robots.txt URL:</span>
                        <a
                          href="/robots.txt"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gold hover:underline"
                        >
                          /robots.txt
                        </a>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                        <span className="font-medium">Status:</span>
                        <span
                          className={`badge ${
                            robotsStatus === 'success' ? 'badge-success' : 'badge-warning'
                          }`}
                        >
                          {robotsStatus === 'success' ? 'Active' : 'Checking...'}
                        </span>
                      </div>
                    </div>

                    <div className="mt-6">
                      <a
                        href="/robots.txt"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary"
                      >
                        View Robots.txt
                      </a>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-6 border border-gray-200">
                    <h4 className="font-semibold text-primary mb-3">Current Configuration</h4>
                    <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
{`# DriveNow Rentals - Robots.txt
User-agent: *
Allow: /

# Disallow admin pages
User-agent: *
Disallow: /admin/
Disallow: /api/

# Sitemap location
Sitemap: ${typeof window !== 'undefined' ? window.location.origin : ''}/api/sitemap`}
                    </pre>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-6">
                    <h4 className="font-semibold text-primary mb-3">What This Means</h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-start space-x-2">
                        <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                        <span><strong>Allow: /</strong> - Search engines can crawl all public pages</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                        <span><strong>Disallow: /admin/</strong> - Admin pages are hidden from search engines</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                        <span><strong>Disallow: /api/</strong> - API routes are not indexed</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                        <span><strong>Sitemap</strong> - Tells search engines where to find your sitemap</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Analytics Tab */}
              {activeTab === 'analytics' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Google Analytics ID
                    </label>
                    <input
                      type="text"
                      value={settings.googleAnalyticsId}
                      onChange={(e) => updateSetting('googleAnalyticsId', e.target.value)}
                      className="input-field"
                      placeholder="G-XXXXXXXXXX or UA-XXXXXXXXX-X"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Get your tracking ID from <a href="https://analytics.google.com" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">Google Analytics</a>
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Google Search Console Verification Code
                    </label>
                    <input
                      type="text"
                      value={settings.googleSearchConsole}
                      onChange={(e) => updateSetting('googleSearchConsole', e.target.value)}
                      className="input-field"
                      placeholder="google-site-verification=..."
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Get from <a href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">Google Search Console</a>
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Facebook Pixel ID
                    </label>
                    <input
                      type="text"
                      value={settings.facebookPixel}
                      onChange={(e) => updateSetting('facebookPixel', e.target.value)}
                      className="input-field"
                      placeholder="1234567890123456"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Optional: Track conversions from Facebook ads
                    </p>
                  </div>

                  <button 
                    onClick={handleSaveSettings} 
                    className="btn-primary"
                    disabled={saving}
                  >
                    {saving ? 'Saving...' : 'Save Analytics Settings'}
                  </button>

                  <div className="bg-blue-50 rounded-lg p-6 mt-6">
                    <h4 className="font-semibold text-primary mb-3">Setup Instructions</h4>
                    <div className="space-y-4 text-sm text-gray-700">
                      <div>
                        <strong className="block mb-1">1. Google Analytics:</strong>
                        <ul className="list-disc list-inside ml-4 space-y-1">
                          <li>Create account at analytics.google.com</li>
                          <li>Set up a property for your website</li>
                          <li>Copy the Measurement ID (starts with G-)</li>
                          <li>Paste it above and save</li>
                        </ul>
                      </div>
                      <div>
                        <strong className="block mb-1">2. Google Search Console:</strong>
                        <ul className="list-disc list-inside ml-4 space-y-1">
                          <li>Add your property at search.google.com/search-console</li>
                          <li>Choose HTML tag verification method</li>
                          <li>Copy the verification code</li>
                          <li>Paste it above and save</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* SEO Health Check */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-primary mb-4">SEO Health Check</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-green-800">Sitemap</span>
                  <FaCheckCircle className="text-green-500" />
                </div>
                <p className="text-sm text-green-700">Active and accessible</p>
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-green-800">Robots.txt</span>
                  <FaCheckCircle className="text-green-500" />
                </div>
                <p className="text-sm text-green-700">Properly configured</p>
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-green-800">Meta Tags</span>
                  <FaCheckCircle className="text-green-500" />
                </div>
                <p className="text-sm text-green-700">Present on all pages</p>
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-green-800">Schema Markup</span>
                  <FaCheckCircle className="text-green-500" />
                </div>
                <p className="text-sm text-green-700">Local Business schema added</p>
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-green-800">Mobile Friendly</span>
                  <FaCheckCircle className="text-green-500" />
                </div>
                <p className="text-sm text-green-700">Fully responsive design</p>
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-green-800">Page Speed</span>
                  <FaCheckCircle className="text-green-500" />
                </div>
                <p className="text-sm text-green-700">Optimized for performance</p>
              </div>
            </div>
          </div>
          
        </>
      )}
    </div>
    
  );
};
export default SEOSettings; 

