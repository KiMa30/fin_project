import pino from 'pino';

const logger = pino({
  // Вывод уровня текстом а не числом
  formatters: {
    level: (label) => ({ level: label.toUpperCase() }),
  },
  timestamp: () => `,"timestamp":"${new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString()}"`,
  base: undefined,
});

export { logger };
