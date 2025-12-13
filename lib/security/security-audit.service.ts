/**
 * Security Audit Service
 * Handles logging, session tracking, suspensions, and IP blocking
 */

import prisma from '@/lib/db/prisma';

interface SecurityEvent {
  sessionId: string;
  ipAddress: string;
  userAgent?: string;
  activityType: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  details: Record<string, any>;
}

interface SessionInfo {
  sessionId: string;
  ipAddress: string;
  userAgent?: string;
}

export class SecurityAuditService {
  private static instance: SecurityAuditService;

  private constructor() {}

  static getInstance(): SecurityAuditService {
    if (!SecurityAuditService.instance) {
      SecurityAuditService.instance = new SecurityAuditService();
    }
    return SecurityAuditService.instance;
  }

  /**
   * Log a security event
   */
  async logEvent(event: SecurityEvent): Promise<void> {
    try {
      // Ensure session exists
      await this.ensureSession({
        sessionId: event.sessionId,
        ipAddress: event.ipAddress,
        userAgent: event.userAgent,
      });

      // Create audit log
      await prisma.securityAuditLog.create({
        data: {
          sessionId: event.sessionId,
          ipAddress: event.ipAddress,
          userAgent: event.userAgent,
          activityType: event.activityType,
          severity: event.severity,
          details: event.details,
        },
      });

      // If it's a prompt injection attempt, check threshold
      if (event.activityType === 'PROMPT_INJECTION_ATTEMPT') {
        await this.checkSuspensionThreshold(event.sessionId);
      }
    } catch (error) {
      console.error('Failed to log security event:', error);
    }
  }

  /**
   * Ensure session exists in database
   */
  private async ensureSession(info: SessionInfo): Promise<void> {
    try {
      await prisma.chatSession.upsert({
        where: { sessionId: info.sessionId },
        update: {
          lastSeen: new Date(),
          ipAddress: info.ipAddress,
          userAgent: info.userAgent,
        },
        create: {
          sessionId: info.sessionId,
          ipAddress: info.ipAddress,
          userAgent: info.userAgent,
        },
      });
    } catch (error) {
      console.error('Failed to ensure session:', error);
    }
  }

  /**
   * Check if session should be suspended after threshold reached
   */
  private async checkSuspensionThreshold(sessionId: string): Promise<void> {
    const threshold = parseInt(process.env.INJECTION_THRESHOLD || '5');

    // Count injection attempts for this session
    const attemptCount = await prisma.securityAuditLog.count({
      where: {
        sessionId,
        activityType: 'PROMPT_INJECTION_ATTEMPT',
      },
    });

    // Suspend after threshold
    if (attemptCount >= threshold) {
      await this.suspendSession(sessionId, `Automatic suspension: ${attemptCount} prompt injection attempts`);
    }
  }

  /**
   * Suspend a session
   */
  async suspendSession(
    sessionId: string,
    reason: string,
    durationHours?: number,
    permanent: boolean = false
  ): Promise<void> {
    const duration = durationHours || parseInt(process.env.SUSPENSION_DURATION_HOURS || '48');

    const expiresAt = permanent ? null : new Date(Date.now() + duration * 60 * 60 * 1000);

    await prisma.sessionSuspension.upsert({
      where: { sessionId },
      update: {
        reason,
        expiresAt,
        isPermanent: permanent,
        isActive: true,
        suspendedBy: 'SYSTEM',
      },
      create: {
        sessionId,
        reason,
        expiresAt,
        isPermanent: permanent,
        suspendedBy: 'SYSTEM',
      },
    });

    // Update statistics
    await this.updateStatistics('totalBlockedSessions', 1);
  }

  /**
   * Check if session is currently suspended
   */
  async isSessionSuspended(sessionId: string): Promise<{ suspended: boolean; reason?: string; expiresAt?: Date }> {
    const suspension = await prisma.sessionSuspension.findUnique({
      where: { sessionId },
    });

    if (!suspension || !suspension.isActive) {
      return { suspended: false };
    }

    // Check if temporary suspension expired
    if (!suspension.isPermanent && suspension.expiresAt && suspension.expiresAt < new Date()) {
      // Lift expired suspension
      await prisma.sessionSuspension.update({
        where: { sessionId },
        data: { isActive: false },
      });
      return { suspended: false };
    }

    return {
      suspended: true,
      reason: suspension.reason,
      expiresAt: suspension.expiresAt || undefined,
    };
  }

  /**
   * Check if IP is blocked
   */
  async isIpBlocked(ipAddress: string): Promise<{ blocked: boolean; reason?: string }> {
    const block = await prisma.ipBlock.findUnique({
      where: { ipAddress },
    });

    if (!block || !block.isActive) {
      return { blocked: false };
    }

    // Check if temporary block expired
    if (!block.isPermanent && block.expiresAt && block.expiresAt < new Date()) {
      // Remove expired block
      await prisma.ipBlock.update({
        where: { ipAddress },
        data: { isActive: false },
      });
      return { blocked: false };
    }

    return { blocked: true, reason: block.reason };
  }

  /**
   * Get attempt count for session
   */
  async getAttemptCount(sessionId: string): Promise<number> {
    return await prisma.securityAuditLog.count({
      where: {
        sessionId,
        activityType: 'PROMPT_INJECTION_ATTEMPT',
      },
    });
  }

  /**
   * Log console access (Level 1 easter egg)
   */
  async logConsoleAccess(sessionId: string, ipAddress: string, userAgent?: string): Promise<void> {
    await this.logEvent({
      sessionId,
      ipAddress,
      userAgent,
      activityType: 'CONSOLE_ACCESS',
      severity: 'LOW',
      details: { type: 'easter_egg_discovery' },
    });

    // Update easter egg progress
    await this.ensureSession({ sessionId, ipAddress, userAgent });

    await prisma.easterEggProgress.upsert({
      where: { sessionId },
      update: {
        consoleOpened: true,
        consoleAt: new Date(),
      },
      create: {
        sessionId,
        consoleOpened: true,
        consoleAt: new Date(),
      },
    });

    // Update statistics
    await this.updateStatistics('totalDiscoveries', 1);
  }

  /**
   * Log Level 1 panel access
   */
  async logLevel1Access(sessionId: string, ipAddress: string, userAgent?: string): Promise<void> {
    // Ensure session exists first
    await this.ensureSession({ sessionId, ipAddress, userAgent });

    await this.logEvent({
      sessionId,
      ipAddress,
      userAgent,
      activityType: 'LEVEL1_ACCESS',
      severity: 'LOW',
      details: { level: 1 },
    });

    await prisma.easterEggProgress.upsert({
      where: { sessionId },
      update: {
        level1Unlocked: true,
        level1At: new Date(),
      },
      create: {
        sessionId,
        level1Unlocked: true,
        level1At: new Date(),
      },
    });
  }

  /**
   * Log Level 2 panel access
   */
  async logLevel2Access(sessionId: string, ipAddress: string, userAgent?: string): Promise<void> {
    // Ensure session exists first
    await this.ensureSession({ sessionId, ipAddress, userAgent });

    await this.logEvent({
      sessionId,
      ipAddress,
      userAgent,
      activityType: 'LEVEL2_ACCESS',
      severity: 'MEDIUM',
      details: { level: 2, admin: true },
    });

    await prisma.easterEggProgress.upsert({
      where: { sessionId },
      update: {
        level2Unlocked: true,
        level2At: new Date(),
      },
      create: {
        sessionId,
        level2Unlocked: true,
        level2At: new Date(),
      },
    });
  }

  /**
   * Update panel statistics
   */
  private async updateStatistics(field: string, increment: number): Promise<void> {
    try {
      const stats = await prisma.panelStatistics.findFirst();

      if (!stats) {
        // Create initial stats
        await prisma.panelStatistics.create({
          data: {
            totalDiscoveries: field === 'totalDiscoveries' ? increment : 0,
            totalInjectionAttempts: field === 'totalInjectionAttempts' ? increment : 0,
            totalBlockedSessions: field === 'totalBlockedSessions' ? increment : 0,
            activeBlocks: field === 'activeBlocks' ? increment : 0,
            firstDiscovery: field === 'totalDiscoveries' ? new Date() : undefined,
            lastDiscovery: field === 'totalDiscoveries' ? new Date() : undefined,
          },
        });
      } else {
        // Update existing stats
        const updateData: any = { updatedAt: new Date() };

        if (field === 'totalDiscoveries') {
          updateData.totalDiscoveries = { increment };
          updateData.lastDiscovery = new Date();
          if (!stats.firstDiscovery) {
            updateData.firstDiscovery = new Date();
          }
        } else if (field === 'totalInjectionAttempts') {
          updateData.totalInjectionAttempts = { increment };
        } else if (field === 'totalBlockedSessions') {
          updateData.totalBlockedSessions = { increment };
        } else if (field === 'activeBlocks') {
          updateData.activeBlocks = { increment };
        }

        await prisma.panelStatistics.update({
          where: { id: stats.id },
          data: updateData,
        });
      }
    } catch (error) {
      console.error('Failed to update statistics:', error);
    }
  }

  /**
   * Get all security logs (for Level 1 panel)
   */
  async getRecentLogs(limit: number = 50): Promise<any[]> {
    return await prisma.securityAuditLog.findMany({
      take: limit,
      orderBy: { timestamp: 'desc' },
      include: {
        session: true,
      },
    });
  }

  /**
   * Get panel statistics (for Level 1 panel)
   */
  async getStatistics(): Promise<any> {
    const stats = await prisma.panelStatistics.findFirst();

    if (!stats) {
      return {
        totalDiscoveries: 0,
        firstDiscovery: null,
        lastDiscovery: null,
        totalInjectionAttempts: 0,
        totalBlockedSessions: 0,
        activeBlocks: 0,
      };
    }

    return stats;
  }

  /**
   * Cleanup expired suspensions and blocks (cron job)
   */
  async cleanupExpired(): Promise<void> {
    const now = new Date();

    // Deactivate expired suspensions
    await prisma.sessionSuspension.updateMany({
      where: {
        isActive: true,
        isPermanent: false,
        expiresAt: {
          lt: now,
        },
      },
      data: {
        isActive: false,
      },
    });

    // Deactivate expired IP blocks
    await prisma.ipBlock.updateMany({
      where: {
        isActive: true,
        isPermanent: false,
        expiresAt: {
          lt: now,
        },
      },
      data: {
        isActive: false,
      },
    });
  }
}

export const securityAudit = SecurityAuditService.getInstance();
