import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      hasError: true,
      error: error,
      errorInfo: errorInfo
    });
    // Log for debugging
    console.error('[shadowMarket] Caught critical error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div 
          className="container" 
          style={{ 
            padding: '40px', 
            background: 'var(--bg-surface)', 
            border: '1px solid var(--red)',
            borderRadius: 'var(--radius-lg)',
            marginTop: '40px',
            maxWidth: '800px'
          }}
        >
          <h2 style={{ color: 'var(--red)', marginBottom: '16px' }}>💥 Critical Application Error</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
            The application has crashed. Below is the raw traceback/error details captured.
          </p>
          
          {/* [VULN] Information Leakage: Displays the raw error message and stack trace to the user */}
          <div 
            style={{ 
              background: '#121212', 
              color: '#ff6b6b', 
              padding: '20px', 
              borderRadius: 'var(--radius-md)', 
              overflowX: 'auto',
              fontFamily: 'monospace',
              fontSize: '12px',
              border: '1px solid rgba(255,255,255,0.05)',
              textAlign: 'left'
            }}
          >
            <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
              Error: {this.state.error && this.state.error.toString()}
            </div>
            <pre style={{ whiteSpace: 'pre-wrap' }}>
              {this.state.error?.stack}
            </pre>
            <hr style={{ margin: '16px 0', borderColor: 'rgba(255,255,255,0.1)' }} />
            <pre style={{ whiteSpace: 'pre-wrap', color: '#888' }}>
              Component Stack: {this.state.errorInfo?.componentStack}
            </pre>
          </div>
          
          <button 
            className="btn btn-ghost" 
            style={{ marginTop: '20px' }}
            onClick={() => window.location.reload()}
          >
            🔄 Reload Application
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// A utility helper component to display Axios/fetch raw errors directly from backend responses
export function RawErrorDisplay({ error }) {
  if (!error) return null;

  let displayContent = error;
  try {
    const errorStr = error.toString();
    // Check if the error string is a JSON string (FastAPI validations)
    if (typeof errorStr === 'string' && (errorStr.startsWith('{') || errorStr.startsWith('['))) {
      displayContent = JSON.stringify(JSON.parse(errorStr), null, 2);
    } else if (typeof error === 'object') {
      displayContent = JSON.stringify(error, null, 2);
    } else {
      displayContent = errorStr;
    }
  } catch {
    displayContent = error.toString();
  }

  return (
    <div 
      className="raw-error-display" 
      style={{ 
        margin: '16px 0', 
        border: '1px solid var(--red)', 
        background: 'rgba(239, 68, 68, 0.05)', 
        borderRadius: 'var(--radius-md)',
        padding: '16px',
        textAlign: 'left'
      }}
    >
      <div style={{ color: 'var(--red)', fontWeight: 600, fontSize: '14px', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
        ⚠️ Server Error Trace
      </div>
      {/* [VULN] Information Leakage: Renders raw backend error strings directly, revealing stack trace or framework internals */}
      <pre 
        style={{ 
          fontSize: '11px', 
          color: '#ff8a8a', 
          whiteSpace: 'pre-wrap', 
          wordBreak: 'break-all',
          fontFamily: 'monospace',
          maxHeight: '150px',
          overflowY: 'auto',
          background: 'rgba(0,0,0,0.3)',
          padding: '10px',
          borderRadius: 'var(--radius-sm)'
        }}
      >
        {displayContent}
      </pre>
    </div>
  );
}
