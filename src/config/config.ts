import dotenv from 'dotenv';

dotenv.config();

export const config = {
  expressPort: Number(process.env.EXPRESS_PORT),
  mongoUri: process.env.MONGO_URI,
  mongoBackupEnabled:
    process.env.MONGO_BACKUP_ENABLED?.toLowerCase() === 'true',
  s3BackupEnabled: process.env.S3_BACKUP_ENABLED?.toLowerCase() === 'true',
  mongoBackupPath: process.env.MONGO_BACKUP_PATH,
  mongoBackupFrequency: process.env.MONGO_BACKUP_FREQUENCY,
  ftpEnabled: process.env.ENABLE_FTP_SERVER?.toLowerCase() === 'true',
  ftpHost: process.env.FTP_HOST,
  ftpPort: Number(process.env.FTP_PORT),
  ftpTlsOnly: process.env.FTP_TLS_ONLY?.toLowerCase() === 'true',
  ftpFileSizeLimit: Number(process.env.FTP_FILE_SIZE_LIMIT),
  ftpDir: process.env.FTP_DIR,
  ftpTlsKey: process.env.FTP_TLS_KEY_FILE_PATH,
  ftpTlsCert: process.env.FTP_TLS_CERT_FILE_PATH,
};

export const s3Config = {
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  region: process.env.S3_REGION,
  bucket: process.env.S3_BUCKET,
  key: process.env.S3_KEY,
};
