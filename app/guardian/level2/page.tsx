'use client';

import { useEffect, useState } from 'react';
import styles from './level2.module.css';

interface Config {
  securityMode: string;
  inputMaxLength: number;
  injectionThreshold: number;
  suspensionDurationHours: number;
  enableFakeBreaches: boolean;
  sendConsoleHints: boolean;
  rateLimitChatRequests: number;
  rateLimitWindowSeconds: number;
}

interface Suspension {
  id: string;
  sessionId: string;
  reason: string;
  suspendedAt: string;
  expiresAt: string | null;
  isPermanent: boolean;
  session: {
    ipAddress: string;
  };
}

interface IpBlock {
  id: string;
  ipAddress: string;
  reason: string;
  blockedAt: string;
  expiresAt: string | null;
  isPermanent: boolean;
}

export default function Level2Panel() {
  const [authenticated, setAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [adminToken, setAdminToken] = useState('');

  const [config, setConfig] = useState<Config | null>(null);
  const [suspensions, setSuspensions] = useState<Suspension[]>([]);
  const [ipBlocks, setIpBlocks] = useState<IpBlock[]>([]);
  const [activeTab, setActiveTab] = useState('config');

  // Ctrl+Alt+M detection (no hints, secret)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.altKey && e.key === 'M') {
        e.preventDefault();
        if (!authenticated) {
          setShowAuthModal(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [authenticated]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    try {
      const res = await fetch('/api/guardian/level2/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        setAuthError('Invalid password');
        return;
      }

      const data = await res.json();
      setAdminToken(data.token);
      setAuthenticated(true);
      setShowAuthModal(false);
      setPassword('');
      fetchAdminData(data.token);
    } catch (error) {
      setAuthError('Authentication failed');
    }
  };

  const fetchAdminData = async (token: string) => {
    try {
      const headers = { Authorization: `Bearer ${token}` };

      const [configRes, suspensionsRes, blocksRes] = await Promise.all([
        fetch('/api/guardian/level2/config', { headers }),
        fetch('/api/guardian/level2/suspensions', { headers }),
        fetch('/api/guardian/level2/ip-blocks', { headers }),
      ]);

      const configData = await configRes.json();
      const suspensionsData = await suspensionsRes.json();
      const blocksData = await blocksRes.json();

      setConfig(configData);
      setSuspensions(suspensionsData.suspensions || []);
      setIpBlocks(blocksData.blocks || []);
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
    }
  };

  const handleLiftSuspension = async (sessionId: string) => {
    try {
      await fetch('/api/guardian/level2/suspensions', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ sessionId }),
      });

      // Refresh data
      fetchAdminData(adminToken);
    } catch (error) {
      console.error('Failed to lift suspension:', error);
    }
  };

  const handleUnblockIp = async (ipAddress: string) => {
    try {
      await fetch('/api/guardian/level2/ip-blocks', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ ipAddress }),
      });

      // Refresh data
      fetchAdminData(adminToken);
    } catch (error) {
      console.error('Failed to unblock IP:', error);
    }
  };

  if (!authenticated) {
    return (
      <div className={styles.container}>
        <div className={styles.unauthenticated}>
          <h1 className={styles.title}>🔐 Restricted Area</h1>
          <p className={styles.subtitle}>
            This area is restricted to authorized personnel only.
          </p>

          {!showAuthModal && (
            <button
              onClick={() => setShowAuthModal(true)}
              className={styles.btnPrimary}
              style={{ marginTop: '2rem' }}
            >
              🔑 Authenticate
            </button>
          )}

          {showAuthModal && (
            <div className={styles.modal}>
              <div className={styles.modalContent}>
                <h2>Master Access Required</h2>
                <form onSubmit={handleAuth}>
                  <input
                    type="password"
                    placeholder="Enter master passphrase"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={styles.input}
                    autoFocus
                  />
                  {authError && (
                    <div className={styles.error}>{authError}</div>
                  )}
                  <div className={styles.modalButtons}>
                    <button
                      type="button"
                      onClick={() => {
                        setShowAuthModal(false);
                        setPassword('');
                        setAuthError('');
                      }}
                      className={styles.btnSecondary}
                    >
                      Cancel
                    </button>
                    <button type="submit" className={styles.btnPrimary}>
                      Authenticate
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <h1 className={styles.title}>
          <span className={styles.icon}>👑</span>
          AI GUARDIAN - MASTER CONTROL
        </h1>
        <p className={styles.subtitle}>
          Full System Access Granted • All Operations Available
        </p>
      </header>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={activeTab === 'config' ? styles.tabActive : styles.tab}
          onClick={() => setActiveTab('config')}
        >
          Security Rules
        </button>
        <button
          className={
            activeTab === 'suspensions' ? styles.tabActive : styles.tab
          }
          onClick={() => setActiveTab('suspensions')}
        >
          Suspensions ({suspensions.length})
        </button>
        <button
          className={activeTab === 'blocks' ? styles.tabActive : styles.tab}
          onClick={() => setActiveTab('blocks')}
        >
          IP Blocks ({ipBlocks.length})
        </button>
      </div>

      {/* Config Tab */}
      {activeTab === 'config' && config && (
        <div className={styles.content}>
          <h2 className={styles.sectionTitle}>🔧 Security Configuration</h2>
          <div className={styles.configGrid}>
            <div className={styles.configItem}>
              <label>Security Mode</label>
              <div className={styles.configValue}>{config.securityMode}</div>
            </div>
            <div className={styles.configItem}>
              <label>Input Max Length</label>
              <div className={styles.configValue}>
                {config.inputMaxLength} chars
              </div>
            </div>
            <div className={styles.configItem}>
              <label>Injection Threshold</label>
              <div className={styles.configValue}>
                {config.injectionThreshold} attempts
              </div>
            </div>
            <div className={styles.configItem}>
              <label>Suspension Duration</label>
              <div className={styles.configValue}>
                {config.suspensionDurationHours}h
              </div>
            </div>
            <div className={styles.configItem}>
              <label>Fake Breach Responses</label>
              <div className={styles.configValue}>
                {config.enableFakeBreaches ? '✓ Enabled' : '✗ Disabled'}
              </div>
            </div>
            <div className={styles.configItem}>
              <label>Console Hints</label>
              <div className={styles.configValue}>
                {config.sendConsoleHints ? '✓ Enabled' : '✗ Disabled'}
              </div>
            </div>
            <div className={styles.configItem}>
              <label>Rate Limit</label>
              <div className={styles.configValue}>
                {config.rateLimitChatRequests} requests/{config.rateLimitWindowSeconds}s
              </div>
            </div>
          </div>
          <p className={styles.note}>
            💡 To modify these settings, update environment variables and redeploy.
          </p>
        </div>
      )}

      {/* Suspensions Tab */}
      {activeTab === 'suspensions' && (
        <div className={styles.content}>
          <h2 className={styles.sectionTitle}>🚫 Active Suspensions</h2>
          {suspensions.length === 0 ? (
            <div className={styles.empty}>No active suspensions</div>
          ) : (
            <div className={styles.list}>
              {suspensions.map((s) => (
                <div key={s.id} className={styles.listItem}>
                  <div className={styles.itemHeader}>
                    <strong>Session: {s.sessionId.substring(0, 20)}...</strong>
                    <span className={styles.itemBadge}>
                      {s.isPermanent ? 'PERMANENT' : 'TEMPORARY'}
                    </span>
                  </div>
                  <div className={styles.itemDetails}>
                    <p>
                      <strong>IP:</strong> {s.session.ipAddress}
                    </p>
                    <p>
                      <strong>Reason:</strong> {s.reason}
                    </p>
                    <p>
                      <strong>Suspended At:</strong>{' '}
                      {new Date(s.suspendedAt).toLocaleString()}
                    </p>
                    {s.expiresAt && (
                      <p>
                        <strong>Expires At:</strong>{' '}
                        {new Date(s.expiresAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handleLiftSuspension(s.sessionId)}
                    className={styles.btnDanger}
                  >
                    Lift Suspension
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* IP Blocks Tab */}
      {activeTab === 'blocks' && (
        <div className={styles.content}>
          <h2 className={styles.sectionTitle}>🛡️ IP Address Blocks</h2>
          {ipBlocks.length === 0 ? (
            <div className={styles.empty}>No active IP blocks</div>
          ) : (
            <div className={styles.list}>
              {ipBlocks.map((block) => (
                <div key={block.id} className={styles.listItem}>
                  <div className={styles.itemHeader}>
                    <strong>{block.ipAddress}</strong>
                    <span className={styles.itemBadge}>
                      {block.isPermanent ? 'PERMANENT' : 'TEMPORARY'}
                    </span>
                  </div>
                  <div className={styles.itemDetails}>
                    <p>
                      <strong>Reason:</strong> {block.reason}
                    </p>
                    <p>
                      <strong>Blocked At:</strong>{' '}
                      {new Date(block.blockedAt).toLocaleString()}
                    </p>
                    {block.expiresAt && (
                      <p>
                        <strong>Expires At:</strong>{' '}
                        {new Date(block.expiresAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handleUnblockIp(block.ipAddress)}
                    className={styles.btnDanger}
                  >
                    Unblock IP
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
