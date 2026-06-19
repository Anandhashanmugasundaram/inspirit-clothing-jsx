import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // Log for diagnostics; swap for real error reporting if desired.
    console.error('INSPIRIT crashed:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0d0a09',
          color: '#f5f1ee',
          textAlign: 'center',
          padding: '24px',
          fontFamily: 'sans-serif',
        }}>
          <p style={{ letterSpacing: '0.2em', fontSize: '0.85rem', opacity: 0.7, marginBottom: '12px' }}>
            SOMETHING WENT WRONG
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '10px 24px',
              border: '1px solid rgba(255,255,255,0.3)',
              background: 'transparent',
              color: 'inherit',
              letterSpacing: '0.1em',
              cursor: 'pointer',
            }}
          >
            RELOAD
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
