export function startMockServer() {
  if (!__DEV__) return;
  const { createMockServer } = require('./server');
  createMockServer();
  console.log('[Mock] Server started');
}
