'use client';

import { useState } from 'react';

export default function SPFChecker() {
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [expandedIncludes, setExpandedIncludes] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!domain.trim()) {
      setError('Please enter a domain name');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);
    setExpandedIncludes({});

    try {
      const response = await fetch('/api/check-spf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ domain: domain.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to check SPF record');
        return;
      }

      setResult(data);
    } catch (err) {
      setError('Network error: Unable to check SPF record');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleInclude = async (includeDomain, index) => {
    const key = `${includeDomain}-${index}`;
    
    if (expandedIncludes[key]) {
      // Collapse
      setExpandedIncludes(prev => ({
        ...prev,
        [key]: null
      }));
      return;
    }

    // Expand - fetch SPF for included domain
    try {
      const response = await fetch('/api/check-spf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ domain: includeDomain }),
      });

      const data = await response.json();

      setExpandedIncludes(prev => ({
        ...prev,
        [key]: data
      }));
    } catch (err) {
      console.error('Failed to fetch included domain:', err);
      setExpandedIncludes(prev => ({
        ...prev,
        [key]: { error: 'Failed to load' }
      }));
    }
  };

  const renderMechanism = (mechanism, recordIndex) => {
    if (mechanism.type === 'include' || mechanism.type === 'redirect') {
      const key = `${mechanism.value}-${recordIndex}`;
      const isExpanded = expandedIncludes[key];

      return (
        <div key={mechanism.full} className="mb-2">
          <button
            onClick={() => toggleInclude(mechanism.value, recordIndex)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            <span className="text-lg">{isExpanded ? '▼' : '▶'}</span>
            <span className="bg-blue-100 px-2 py-1 rounded">
              {mechanism.type}:
            </span>
            <span className="underline">{mechanism.value}</span>
          </button>
          
          {isExpanded && (
            <div className="ml-8 mt-2 p-3 bg-gray-50 rounded-lg border-l-4 border-blue-400">
              {isExpanded.error ? (
                <p className="text-red-600">{isExpanded.error}</p>
              ) : isExpanded.spfRecords?.length > 0 ? (
                <div>
                  <p className="text-sm text-gray-600 mb-2">
                    SPF record for {mechanism.value}:
                  </p>
                  <code className="text-xs bg-white p-2 rounded block break-all">
                    {isExpanded.spfRecords[0].raw}
                  </code>
                </div>
              ) : (
                <p className="text-sm text-gray-600">
                  {isExpanded.message || 'No SPF record found'}
                </p>
              )}
            </div>
          )}
        </div>
      );
    }

    return (
      <div key={mechanism.full} className="mb-1">
        <span className="bg-gray-100 px-2 py-1 rounded text-sm">
          {mechanism.value}
        </span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            SPF Record Checker
          </h1>
          <p className="text-gray-600">
            Check Sender Policy Framework records for any domain
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
          {/* Search Form */}
          <form onSubmit={handleSubmit} className="mb-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="Enter domain (e.g., example.com)"
                className="flex-1 px-4 py-3 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Checking...
                  </span>
                ) : (
                  'Check SPF'
                )}
              </button>
            </div>
          </form>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
              <div className="flex items-start">
                <svg
                  className="w-5 h-5 text-red-500 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="ml-3 text-red-700 font-medium">{error}</p>
              </div>
            </div>
          )}

          {/* Results */}
          {result && (
            <div className="space-y-4">
              <div className="border-t pt-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  Results for: <span className="text-blue-600">{result.domain}</span>
                </h2>
                <p className="text-sm text-gray-600 mb-4">{result.message}</p>

                {result.spfRecords.length > 0 ? (
                  <div className="space-y-6">
                    {result.spfRecords.map((record, index) => (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                      >
                        <h3 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                          <svg
                            className="w-5 h-5 text-green-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          SPF Record {result.spfRecords.length > 1 ? `#${index + 1}` : ''}
                        </h3>
                        
                        <div className="mb-4">
                          <p className="text-xs text-gray-500 mb-1">Raw Record:</p>
                          <code className="block p-3 text-black bg-white rounded border border-gray-300 text-sm break-all">
                            {record.raw}
                          </code>
                        </div>

                        {record.mechanisms.length > 0 && (
                          <div>
                            <p className="text-xs text-gray-500 mb-2">Mechanisms:</p>
                            <div className="space-y-1 text-gray-600">
                              {record.mechanisms.map((mechanism) =>
                                renderMechanism(mechanism, index)
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <svg
                      className="w-16 h-16 text-gray-400 mx-auto mb-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="text-gray-600">No SPF records found for this domain</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Info Box */}
          {!result && !error && !loading && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-2">About SPF Records</h3>
              <p className="text-sm text-blue-800">
                SPF (Sender Policy Framework) is an email authentication method that helps
                prevent email spoofing by specifying which mail servers are authorized to
                send email on behalf of your domain.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>Enter a domain name above to check its SPF records</p>
        </div>
      </div>
    </div>
  );
}