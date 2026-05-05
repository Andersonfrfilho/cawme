const LOG_LEVELS = ['none', 'error', 'warn', 'info', 'debug'] as const;
type LogLevel = typeof LOG_LEVELS[number];

function getLogLevel(): LogLevel {
  const envLevel = process.env.EXPO_PUBLIC_LOG_LEVEL;
  if (!envLevel) return __DEV__ ? 'debug' : 'none';
  
  const level = envLevel.toLowerCase() as LogLevel;
  return LOG_LEVELS.includes(level) ? level : 'none';
}

function shouldLog(level: LogLevel): boolean {
  const currentLevel = getLogLevel();
  const currentIndex = LOG_LEVELS.indexOf(currentLevel);
  const targetIndex = LOG_LEVELS.indexOf(level);
  return targetIndex <= currentIndex && currentLevel !== 'none';
}

const TAG = '[CAWME]';

const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  
  // Event types
  userAction: '\x1b[36m',    // Cyan - Ações do usuário
  mobileCall: '\x1b[34m',    // Blue - Chamadas mobile/API
  init: '\x1b[35m',          // Magenta - Inicializações
  screen: '\x1b[33m',        // Yellow - Navegação/Telas
  
  // Severity
  info: '\x1b[32m',          // Green - Info
  warn: '\x1b[33m',          // Yellow - Warn
  error: '\x1b[31m',         // Red - Error
  debug: '\x1b[36m',         // Cyan - Debug
  
  // Helpers
  timestamp: '\x1b[90m',     // Gray - Timestamp
  requestId: '\x1b[94m',     // Light Blue - Request ID
};

type EventType = 'userAction' | 'mobileCall' | 'init' | 'screen';
type Severity = 'info' | 'warn' | 'error' | 'debug';

interface LogContext {
  action?: string;
  screen?: string;
  component?: string;
  duration?: number;
  status?: number;
  callStack?: string[];
  method?: string;
  url?: string;
  headers?: Record<string, string>;
  payload?: unknown;
  params?: Record<string, unknown>;
  [key: string]: unknown;
}

function timestamp(): string {
  const now = new Date();
  return now.toISOString().replace('T', ' ').slice(0, 19);
}

function generateRequestId(): string {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}

function formatContext(ctx?: LogContext): string {
  if (!ctx) return '';
  const entries = Object.entries(ctx);
  if (entries.length === 0) return '';
  return entries.map(([k, v]) => `${k}=${JSON.stringify(v)}`).join(' ');
}

function getColor(eventType: EventType, severity: Severity): string {
  return colors[eventType] || colors[severity];
}

function getEventIcon(eventType: EventType): string {
  const icons = {
    userAction: '👆',
    mobileCall: '📡',
    init: '🚀',
    screen: '📱',
  };
  return icons[eventType];
}

function getSeverityIcon(severity: Severity): string {
  const icons = {
    info: '✓',
    warn: '⚠',
    error: '✗',
    debug: '•',
  };
  return icons[severity];
}

function getCallStack(skipFrames = 3): string[] {
  const error = new Error();
  const stack = error.stack?.split('\n') || [];
  
  // Remove first frames (internal logger calls)
  const relevantStack = stack.slice(skipFrames);
  
  // Patterns to extract meaningful names
  const patterns = [
    // React Native / Metro bundler
    /at\s+(.+?)\s+\(/,
    /at\s+(.+?)\s+$/,
    // Async/await generators (ignore these)
    /asyncGeneratorStep/,
    /_next/,
    /\?anon/,
  ];
  
  // Parse and format stack frames
  const callers: string[] = [];
  
  for (const line of relevantStack) {
    // Skip internal/generator frames
    if (patterns.some(p => p.test(line))) {
      const match = line.match(patterns[0]) || line.match(patterns[1]);
      if (match && !patterns.slice(2).some(p => p.test(line))) {
        const fullName = match[1];
        
        // Extract just the function name
        const cleanName = fullName
          .replace(/async\s+/g, '')
          .replace(/Generator\s+/g, '')
          .replace(/Object\./g, '')
          .replace(/Prototype\./g, '')
          .replace(/bound\s+/g, '')
          .split('.').pop() || fullName;
        
        // Skip if it's noise
        if (cleanName && 
            cleanName !== 'anonymous' && 
            cleanName !== 'global' &&
            cleanName !== 'value' &&
            cleanName !== 'tryCatch' &&
            cleanName.length > 1) {
          callers.push(cleanName);
        }
      }
    }
  }
  
  // Remove duplicates and limit to 3 callers
  const uniqueCallers = callers.filter((name, index, self) => 
    name && self.indexOf(name) === index
  );
  
  return uniqueCallers.slice(0, 3);
}

function formatCallStack(stack: string[]): string {
  if (stack.length === 0) return '';
  return `[${stack.join('][')}]`;
}

function generateCurlCommand(ctx: LogContext): string {
  if (!ctx.url) return '';
  
  const method = ctx.method?.toUpperCase() || 'GET';
  const url = ctx.url;
  const headers = ctx.headers || {};
  const payload = ctx.payload;
  const params = ctx.params;
  
  // Build URL with query params
  let fullUrl = url;
  if (params && Object.keys(params).length > 0) {
    const queryString = Object.entries(params)
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
      .join('&');
    fullUrl = `${url}${url.includes('?') ? '&' : '?'}${queryString}`;
  }
  
  // Build curl command
  let curl = `curl -X ${method} '${fullUrl}'`;
  
  // Add headers
  Object.entries(headers).forEach(([key, value]) => {
    // Skip authorization header for security (show only partial token)
    if (key.toLowerCase() === 'authorization') {
      const masked = value.slice(0, 20) + '...' + value.slice(-5);
      curl += ` \\n  -H '${key}: ${masked}'`;
    } else {
      curl += ` \\n  -H '${key}: ${value}'`;
    }
  });
  
  // Add body for POST/PUT/PATCH
  if (['POST', 'PUT', 'PATCH'].includes(method) && payload) {
    const body = JSON.stringify(payload);
    curl += ` \\n  -d '${body}'`;
  }
  
  return curl;
}

function log(
  eventType: EventType,
  severity: Severity,
  source: string,
  action: string,
  message: string,
  payload?: unknown,
  requestId?: string,
): void {
  if (!shouldLog(severity)) return;
  if (!__DEV__) return;
  
  const id = requestId || generateRequestId();
  const color = getColor(eventType, severity);
  const eventIcon = getEventIcon(eventType);
  const severityIcon = getSeverityIcon(severity);
  const callStack = getCallStack();
  const stackStr = formatCallStack(callStack);
  const ctx = formatContext(payload as LogContext);
  const ctxStr = ctx ? ` | ${ctx}` : '';
  
  // Generate curl command if URL is present
  const ctxObj = payload as LogContext | undefined;
  const curlCommand = ctxObj?.url ? generateCurlCommand(ctxObj) : null;
  
  console.log(
    `${colors.timestamp}[${timestamp()}]${colors.reset} ` +
    `${colors.requestId}[${id}]${colors.reset} ` +
    `${stackStr ? `${colors.dim}${stackStr}${colors.reset} ` : ''}` +
    `${color}${eventIcon}${severityIcon}${colors.reset} ` +
    `${colors.bold}${source}${colors.reset} ` +
    `${color}→${colors.reset} ` +
    `${action}: ${message}${ctxStr}`
  );
  
  // Log curl command for mobileCall events
  if (curlCommand && eventType === 'mobileCall' && severity === 'debug') {
    console.log(`${colors.dim}  ↪ ${curlCommand}${colors.reset}`);
  }
}

export function userAction(
  action: string,
  message: string,
  payload?: LogContext,
  requestId?: string,
): void {
  log('userAction', 'info', 'USER', action, message, payload, requestId);
}

export function mobileCall(
  action: string,
  message: string,
  payload?: LogContext,
  requestId?: string,
): void {
  log('mobileCall', 'info', 'API', action, message, payload, requestId);
}

export function mobileCallStart(
  action: string,
  payload?: LogContext,
): string {
  const requestId = generateRequestId();
  const ctx: LogContext = { ...payload, requestId };
  log('mobileCall', 'debug', 'API', `${action}.start`, 'Request initiated', ctx, requestId);
  
  // Log curl command if URL is available
  if (ctx.url) {
    const curlCmd = generateCurlCommand(ctx);
    if (curlCmd) {
      console.log(`${colors.dim}  ↪ CURL:${colors.reset}`);
      console.log(`${colors.dim}  ${curlCmd}${colors.reset}`);
    }
  }
  
  return requestId;
}

export function mobileCallEnd(
  action: string,
  duration: number,
  status?: number,
  requestId?: string,
): void {
  log('mobileCall', 'info', 'API', `${action}.end`, 'Request completed', { duration, status }, requestId);
}

export function mobileCallError(
  action: string,
  error: unknown,
  duration?: number,
  requestId?: string,
): void {
  const payload: LogContext = { 
    error: error instanceof Error ? error.message : String(error),
  };
  if (duration) payload.duration = duration;
  log('mobileCall', 'error', 'API', `${action}.error`, 'Request failed', payload, requestId);
}

export function initModule(
  module: string,
  message: string,
  payload?: LogContext,
): void {
  log('init', 'info', 'INIT', module, message, payload);
}

export function initComplete(
  module: string,
  duration: number,
): void {
  log('init', 'info', 'INIT', `${module}.ready`, 'Module initialized', { duration });
}

export function screenNavigate(
  from: string,
  to: string,
  params?: Record<string, unknown>,
): void {
  log('screen', 'info', 'NAV', 'navigate', `${from} → ${to}`, params);
}

export function screenRender(
  screen: string,
  duration?: number,
): void {
  log('screen', 'debug', 'RENDER', screen, 'Screen rendered', duration ? { duration } : undefined);
}

export function screenEvent(
  screen: string,
  event: string,
  payload?: LogContext,
): void {
  log('screen', 'info', 'SCREEN', `${screen}.${event}`, 'Screen event', payload);
}

export function warn(
  source: string,
  action: string,
  message: string,
  payload?: LogContext,
): void {
  log('userAction', 'warn', source, action, message, payload);
}

export function error(
  source: string,
  action: string,
  message: string,
  errorObj: unknown,
  payload?: LogContext,
): void {
  const fullPayload: LogContext = { 
    error: errorObj instanceof Error ? errorObj.message : String(errorObj),
    ...payload,
  };
  log('userAction', 'error', source, action, message, fullPayload);
}

export async function trackAsync<T>(
  source: string,
  action: string,
  fn: () => Promise<T>,
  context?: LogContext,
): Promise<T> {
  const callStack = getCallStack(4);
  const requestId = mobileCallStart(action, { ...context, callStack });
  const startTime = Date.now();
  
  try {
    const result = await fn();
    const duration = Date.now() - startTime;
    mobileCallEnd(action, duration, 200, requestId);
    return result;
  } catch (err) {
    const duration = Date.now() - startTime;
    mobileCallError(action, err, duration, requestId);
    throw err;
  }
}

export function group(
  label: string,
  fn: () => void,
): void {
  if (!__DEV__) {
    fn();
    return;
  }
  
  console.group(`${colors.bold}${label}${colors.reset}`);
  fn();
  console.groupEnd();
}

export function table(
  data: unknown[],
  columns?: string[],
): void {
  if (!__DEV__) return;
  console.table(data, columns);
}

// Export as logger object for convenience
export const logger = {
  userAction,
  mobileCall,
  mobileCallStart,
  mobileCallEnd,
  mobileCallError,
  initModule,
  initComplete,
  screenNavigate,
  screenRender,
  screenEvent,
  warn,
  error,
  trackAsync,
  group,
  table,
};
