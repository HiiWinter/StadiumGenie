import React from 'react';
import PropTypes from 'prop-types';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an unhandled component error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div 
          role="alert" 
          aria-live="assertive" 
          style={{
            padding: '32px',
            margin: '24px',
            borderRadius: '16px',
            background: 'var(--bg-card, #121824)',
            border: '1px solid var(--neon-red, #ff4d4d)',
            color: 'var(--text-primary, #ffffff)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
            textAlign: 'center',
            boxShadow: '0 8px 32px rgba(255, 77, 77, 0.15)'
          }}
        >
          <div style={{ fontSize: '36px', color: 'var(--neon-red, #ff4d4d)' }}>
            <i className="fa-solid fa-triangle-exclamation" />
          </div>
          <h2 style={{ margin: 0, fontFamily: 'var(--font-display, sans-serif)', fontSize: '20px' }}>
            System Notice: Component Exception Intercepted
          </h2>
          <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-secondary, #94a3b8)', maxWidth: '500px' }}>
            StadiumGenie operational safety shield active. The active module encountered an unexpected state. You can safely retry or reload.
          </p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={this.handleReset}
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                background: 'var(--neon-cyan, #00f2fe)',
                color: '#000000',
                border: 'none',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'transform 0.2s, opacity 0.2s'
              }}
            >
              Retry Component
            </button>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.08)',
                color: '#ffffff',
                border: '1px solid var(--border-color, rgba(255, 255, 255, 0.2))',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Reload Platform
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node,
  fallback: PropTypes.node
};

export default ErrorBoundary;
