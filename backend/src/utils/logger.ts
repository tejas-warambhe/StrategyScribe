import winston from 'winston';
import path from 'path';

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define colors for each log level
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

// Tell winston that you want to link the colors 
winston.addColors(colors);

// Define which level to log based on the environment
const level = () => {
  const env = process.env.NODE_ENV || 'development';
  const isDevelopment = env === 'development';
  return isDevelopment ? 'debug' : 'warn';
};

// Define the format of the log message
const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`,
  ),
);

// Define the transports for the logger
const transports = [
  // Console transport
  new winston.transports.Console(),
  
  // File transport for all logs
  new winston.transports.File({
    filename: path.join(__dirname, '../logs/all.log'),
  }),
  
  // File transport for error logs
  new winston.transports.File({
    filename: path.join(__dirname, '../logs/error.log'),
    level: 'error',
  }),
];

// Create the logger
const Logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports,
});

export default Logger;