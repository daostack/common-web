import winston from 'winston';

const $logger = winston.createLogger({
  level: 'silly',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

$logger.add(
  new winston.transports.Console({
    format: winston.format.simple()
  })
);

export const logger = $logger;