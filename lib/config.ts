/**
 * Application Configuration
 * Centralized configuration management using environment variables
 * All configurable values should be defined here to avoid hardcoding
 */

const getEnvVar = (key: string, defaultValue: string): string => {
  return process.env[key] || defaultValue;
};

const getEnvNumber = (key: string, defaultValue: number): number => {
  const value = process.env[key];
  return value ? parseInt(value, 10) : defaultValue;
};

const getEnvBoolean = (key: string, defaultValue: boolean): boolean => {
  const value = process.env[key];
  return value ? value === 'true' : defaultValue;
};

export const config = {
  app: {
    name: getEnvVar('NEXT_PUBLIC_APP_NAME', 'PDF Merger'),
    version: getEnvVar('NEXT_PUBLIC_APP_VERSION', '1.0.0'),
    environment: getEnvVar('NODE_ENV', 'development'),
    url: getEnvVar('NEXT_PUBLIC_APP_URL', 'http://localhost:3000'),
  },

  pdf: {
    maxFileSize: getEnvNumber('NEXT_PUBLIC_MAX_FILE_SIZE', 10485760), // 10MB default
    maxFiles: getEnvNumber('NEXT_PUBLIC_MAX_FILES', 20),
    allowedFormats: ['application/pdf'],
    allowedExtensions: ['.pdf'],
    defaultFileName: 'merged-document.pdf',
    compressionLevel: getEnvNumber('NEXT_PUBLIC_PDF_COMPRESSION_LEVEL', 0), // 0-9, 0 = no compression
  },

  ui: {
    itemsPerPage: 20,
    thumbnailWidth: 150,
    thumbnailHeight: 200,
    animationDuration: 300,
    maxThumbnailsToRender: 100,
  },

  features: {
    enableAnalytics: getEnvBoolean('NEXT_PUBLIC_ENABLE_ANALYTICS', false),
    enableErrorReporting: getEnvBoolean('NEXT_PUBLIC_ENABLE_ERROR_REPORTING', false),
    enableDebugMode: getEnvBoolean('NEXT_PUBLIC_ENABLE_DEBUG_MODE', false),
  },

  validation: {
    minPages: 1,
    maxPages: getEnvNumber('NEXT_PUBLIC_MAX_PAGES', 1000),
  },

  messages: {
    errors: {
      fileTooLarge: 'File size exceeds the maximum allowed size',
      tooManyFiles: 'Too many files selected',
      invalidFormat: 'Invalid file format. Only PDF files are allowed',
      processingFailed: 'Failed to process PDF file',
      mergeFailed: 'Failed to merge PDF files',
      loadFailed: 'Failed to load PDF file',
    },
    success: {
      fileUploaded: 'File uploaded successfully',
      merged: 'PDFs merged successfully',
    },
  },
} as const;

export type Config = typeof config;
