import { useState } from 'react';
import { fetchUrl } from '../api/fetch';

export default function UrlFetcher() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFetch = async (e) => {
    e.preventDefault();
    if (!url) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // [VULN] SSRF: No client-side URL validation before sending it to the backend fetch endpoint
      const res = await fetchUrl(url);
      setResult(res);
    } catch (err) {
      setError(err.message || 'Failed to fetch the URL preview');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="url-fetcher card" style={{ padding: '20px', marginTop: '20px' }}>
      <h3 style={{ fontSize: '16px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        🔗 URL Preview Tool
      </h3>
      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
        Fetch and preview external listings. Enter a valid URL to preview its meta data.
      </p>

      <form onSubmit={handleFetch} style={{ display: 'flex', gap: '10px' }}>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="http://example.com/listing"
          className="search-input"
          style={{ borderRadius: 'var(--radius-md)', paddingLeft: '16px' }}
          id="ssrf-url-input"
        />
        <button
          type="submit"
          disabled={loading || !url}
          className="btn btn-primary"
          style={{ padding: '10px 20px', fontSize: '13px' }}
          id="btn-fetch-url"
        >
          {loading ? 'Fetching...' : 'Fetch'}
        </button>
      </form>

      {error && (
        <div style={{ marginTop: '16px', color: 'var(--red)', fontSize: '13px', background: 'rgba(239,68,68,0.1)', padding: '10px', borderRadius: 'var(--radius-sm)' }}>
          ❌ {error}
        </div>
      )}

      {result && (
        <div style={{ marginTop: '16px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>
            Status Code: <span style={{ color: 'var(--green)', fontWeight: 600 }}>{result.status_code}</span>
          </div>
          <pre 
            style={{ 
              fontSize: '12px', 
              color: 'var(--text-secondary)', 
              whiteSpace: 'pre-wrap', 
              wordBreak: 'break-all',
              fontFamily: 'monospace',
              maxHeight: '120px',
              overflowY: 'auto'
            }}
          >
            {result.preview || '(Empty Response)'}
          </pre>
        </div>
      )}
    </div>
  );
}
