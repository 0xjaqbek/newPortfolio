'use client';

import { useEffect, useState } from 'react';
import styles from './level1.module.css';

interface Stats {
  totalDiscoveries: number;
  firstDiscovery: string | null;
  lastDiscovery: string | null;
  totalInjectionAttempts: number;
  totalBlockedSessions: number;
  activeBlocks: number;
}

interface SecurityLog {
  id: string;
  activityType: string;
  severity: string;
  timestamp: string;
  ipAddress: string;
  details: any;
  session: {
    sessionId: string;
  };
}

export default function Level1Panel() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [logs, setLogs] = useState<SecurityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, logsRes] = await Promise.all([
        fetch('/api/guardian/level1/stats'),
        fetch('/api/guardian/level1/logs'),
      ]);

      const statsData = await statsRes.json();
      const logsData = await logsRes.json();

      setStats(statsData);
      setLogs(logsData.logs || []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return '#ff0080';
      case 'HIGH':
        return '#ff4400';
      case 'MEDIUM':
        return '#ffaa00';
      case 'LOW':
        return '#00ff41';
      default:
        return '#888';
    }
  };

  const getActivityTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      PROMPT_INJECTION_ATTEMPT: 'Prompt Injection',
      RATE_LIMIT_EXCEEDED: 'Rate Limit',
      CONSOLE_ACCESS: 'Console Opened',
      LEVEL1_ACCESS: 'Panel Access',
      ADMIN_AUTH_FAILED: 'Admin Auth Fail',
    };
    return labels[type] || type;
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>INITIALIZING GUARDIAN SYSTEM...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <h1 className={styles.title}>
          <span className={styles.icon}>🛡️</span>
          AI GUARDIAN - DEVELOPER INSIGHTS
        </h1>
        <p className={styles.subtitle}>Security Monitoring Dashboard</p>
      </header>

      {/* Statistics */}
      <section className={styles.stats}>
        <h2 className={styles.sectionTitle}>📊 STATISTICS</h2>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Panel Discoveries</div>
            <div className={styles.statValue}>{stats?.totalDiscoveries || 0}</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Injection Attempts</div>
            <div className={styles.statValue} style={{ color: '#ff4400' }}>
              {stats?.totalInjectionAttempts || 0}
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Blocked Sessions</div>
            <div className={styles.statValue} style={{ color: '#ff0080' }}>
              {stats?.totalBlockedSessions || 0}
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Active Blocks</div>
            <div className={styles.statValue}>{stats?.activeBlocks || 0}</div>
          </div>
        </div>
        {stats?.firstDiscovery && (
          <div className={styles.statsFooter}>
            <p>
              First Discovery: {new Date(stats.firstDiscovery).toLocaleDateString()}
            </p>
            {stats.lastDiscovery && (
              <p>
                Last Discovery: {new Date(stats.lastDiscovery).toLocaleString()}
              </p>
            )}
          </div>
        )}
      </section>

      {/* Recent Security Events */}
      <section className={styles.logs}>
        <h2 className={styles.sectionTitle}>🚨 RECENT SECURITY EVENTS</h2>
        <div className={styles.logsContainer}>
          {logs.length === 0 ? (
            <div className={styles.noLogs}>No security events logged yet.</div>
          ) : (
            logs.map((log) => (
              <div key={log.id} className={styles.logEntry}>
                <div className={styles.logHeader}>
                  <span
                    className={styles.logSeverity}
                    style={{ backgroundColor: getSeverityColor(log.severity) }}
                  >
                    {log.severity}
                  </span>
                  <span className={styles.logType}>
                    {getActivityTypeLabel(log.activityType)}
                  </span>
                  <span className={styles.logTime}>
                    {new Date(log.timestamp).toLocaleString()}
                  </span>
                </div>
                <div className={styles.logDetails}>
                  <div className={styles.logField}>
                    <strong>IP:</strong> {log.ipAddress}
                  </div>
                  <div className={styles.logField}>
                    <strong>Session:</strong>{' '}
                    {log.session.sessionId.substring(0, 16)}...
                  </div>
                  {log.details.patterns && (
                    <div className={styles.logField}>
                      <strong>Patterns:</strong>{' '}
                      {log.details.patterns.join(', ')}
                    </div>
                  )}
                  {log.details.attemptNumber && (
                    <div className={styles.logField}>
                      <strong>Attempt:</strong> #{log.details.attemptNumber}/5
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Footer hint - no longer shown since no hint for Ctrl+Alt+M */}
      <footer className={styles.footer}>
        <p>Read-only access • All security events are monitored</p>
      </footer>
    </div>
  );
}
