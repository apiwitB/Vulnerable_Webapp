import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { searchItems } from '../api/search';
import { RawErrorDisplay } from '../components/ErrorBoundary';
import ProductCard from '../components/ProductCard';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function performSearch() {
      if (!query) {
        setResults([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);

      try {
        const data = await searchItems(query);
        setResults(data.results || []);
      } catch (err) {
        // [VULN] Information Leakage: Expose database stack trace directly on SQL syntax errors
        setError(err.message || err);
      } finally {
        setLoading(false);
      }
    }
    performSearch();
  }, [query]);

  // Check if the results returned contain standard product keys
  // If SQLi UNION injected users table, results won't match standard keys, so we'll show them as raw dump rows.
  const isProductData = (row) => {
    return row && 'name' in row && 'price' in row;
  };

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '32px', letterSpacing: '-0.5px' }}>
          Search Results for: <span style={{ color: 'var(--accent-light)' }}>"{query}"</span>
        </h2>
        <p className="products-count" style={{ marginTop: '8px' }}>
          Database returned <strong>{results.length}</strong> matching records.
        </p>
      </div>

      {loading && <div style={{ textAlign: 'center', padding: '40px' }}>Querying index database...</div>}

      {error && (
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ color: 'var(--red)', fontSize: '15px', marginBottom: '8px' }}>⚠️ Query Execution Exception</h3>
          <RawErrorDisplay error={error} />
        </div>
      )}

      {!loading && !error && results.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
          No records match your query signatures.
        </div>
      )}

      {/* Render Results */}
      {!loading && !error && results.length > 0 && (
        <div>
          {isProductData(results[0]) ? (
            // Standard Product Card Grid
            <div className="products-grid">
              {results.map((product) => (
                <Link to={`/products/${product.id}`} key={product.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <ProductCard product={product} />
                </Link>
              ))}
            </div>
          ) : (
            // [VULN] Information Leakage / SQLi Dump View: Renders raw database keys/values dynamically!
            // Perfect for pentesting UNION SELECT attacks.
            <div className="card animate-fade-in" style={{ padding: '24px', overflowX: 'auto' }}>
              <div style={{ color: 'var(--amber)', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                🔓 Raw Database Records Leaked (SQL Injection Output)
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-primary)' }}>
                    {Object.keys(results[0]).map((key) => (
                      <th key={key} style={{ padding: '12px' }}>{key}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {results.map((row, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                      {Object.values(row).map((val, valIdx) => (
                        <td key={valIdx} style={{ padding: '12px', fontFamily: 'monospace' }}>
                          {val === null ? 'NULL' : String(val)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
