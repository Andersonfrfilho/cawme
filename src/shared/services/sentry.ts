import * as Sentry from '@sentry/react-native';
import { logger } from '@/shared/utils/logger';

export interface ErrorContext {
  screen?: string;
  action?: string;
  userId?: string;
  component?: string;
  metadata?: Record<string, unknown>;
}

export async function initSentry() {
  const dsn = process.env.EXPO_PUBLIC_SENTRY_DSN;
  const enabled = process.env.EXPO_PUBLIC_SENTRY_ENABLED === 'true';
  
  if (!dsn || !enabled) {
    logger.warn('sentry', 'init', 'Sentry not configured, skipping initialization');
    return;
  }

  Sentry.init({
    dsn,
    
    // Environment
    environment: __DEV__ ? 'development' : 'production',
    
    // Performance Monitoring
    tracesSampleRate: __DEV__ ? 1.0 : 0.2,
    
    // Session Replay
    replaysSessionSampleRate: __DEV__ ? 0.5 : 0.1,
    replaysOnErrorSampleRate: 1.0,
    
    // Integrations
    integrations: [
      Sentry.mobileReplayIntegration({
        maskAllImages: true,
        maskAllVectors: true,
      }),
    ],
    
    // Breadcrumbs
    beforeBreadcrumb: (breadcrumb) => {
      breadcrumb.data = {
        ...breadcrumb.data,
        timestamp: Date.now(),
      };
      
      if (breadcrumb.category === 'ui.input') {
        breadcrumb.message = '[input masked]';
      }
      
      return breadcrumb;
    },
    
    // Ignore common errors
    ignoreErrors: [
      'Network Error',
      'Network request failed',
      'timeout',
      'cancelled',
    ],
    
    // Before send
    beforeSend: (event, hint) => {
      if (event.request) {
        if (event.request.headers) {
          event.request.headers.Authorization = '[REDACTED]';
        }
      }
      return event;
    },
  });

  logger.initComplete('Sentry', 0);
}

/**
 * Track de erro com contexto rico
 */
export function trackError(
  error: Error | unknown,
  context: ErrorContext = {},
) {
  const errorObj = error instanceof Error ? error : new Error(String(error));
  
  logger.error('error', 'tracker', errorObj.message, errorObj, {
    screen: context.screen,
    action: context.action,
    component: context.component,
  });
  
  Sentry.withScope((scope) => {
    if (context.screen) scope.setTag('screen', context.screen);
    if (context.action) scope.setTag('action', context.action);
    if (context.component) scope.setTag('component', context.component);
    
    if (context.userId) {
      scope.setUser({ id: context.userId });
    }
    
    if (context.metadata) {
      scope.setContext('metadata', context.metadata);
    }
    
    Sentry.captureException(errorObj);
  });
}

/**
 * Track de ação do usuário
 */
export function trackUserAction(
  action: string,
  data?: Record<string, unknown>,
) {
  logger.userAction(action, 'User action tracked', data);
  
  Sentry.addBreadcrumb({
    category: 'user.action',
    message: action,
    data: {
      ...data,
      timestamp: Date.now(),
    },
    level: 'info',
  });
}

/**
 * Track de navegação de tela
 */
export function trackScreenView(
  screen: string,
  params?: Record<string, unknown>,
) {
  logger.screenNavigate('previous', screen, params);
  
  Sentry.addBreadcrumb({
    category: 'navigation',
    message: `Navigated to ${screen}`,
    data: params,
    level: 'info',
  });
  
  Sentry.setContext('current_screen', { name: screen });
}

/**
 * Track de performance de operação
 */
export function trackPerformance(
  operation: string,
  duration: number,
  metadata?: Record<string, unknown>,
) {
  logger.mobileCallEnd(operation, duration, 200, undefined);
  
  Sentry.addBreadcrumb({
    category: 'performance',
    message: `${operation} completed`,
    data: {
      duration,
      ...metadata,
    },
    level: 'info',
  });
}

/**
 * Wrapper para funções async com tracking automático
 */
export async function trackAsync<T>(
  operation: string,
  fn: () => Promise<T>,
  context?: ErrorContext,
): Promise<T> {
  const startTime = Date.now();
  
  const span = Sentry.startInactiveSpan({
    name: operation,
    op: 'function',
    attributes: {
      screen: context?.screen,
      component: context?.component,
    },
  });
  
  try {
    const result = await fn();
    const duration = Date.now() - startTime;
    
    span?.end();
    trackPerformance(operation, duration, context?.metadata);
    
    return result;
  } catch (error) {
    const duration = Date.now() - startTime;
    
    span?.end();
    trackError(error as Error, {
      ...context,
      metadata: {
        ...context?.metadata,
        duration,
      },
    });
    
    throw error;
  }
}

/**
 * Feedback do usuário sobre erro
 */
export function captureUserFeedback({
  eventId,
  name,
  email,
  comments,
}: {
  eventId: string;
  name: string;
  email: string;
  comments: string;
}) {
  Sentry.captureFeedback({
    message: comments,
    email,
    name,
  });
  
  logger.userAction('feedback.submitted', 'User submitted feedback', {
    eventId,
    hasComments: !!comments,
  });
}
