import dotenv from 'dotenv';

dotenv.config();

export const config = {
  expressPort: Number(process.env.EXPRESS_PORT),
  mongoUri: process.env.MONGO_URI,
  ftpEnabled: process.env.ENABLE_FTP_SERVER?.toLowerCase() === 'true',
  ftpHost: process.env.FTP_HOST,
  ftpPort: Number(process.env.FTP_PORT),
  ftpTlsOnly: process.env.FTP_TLS_ONLY?.toLowerCase() === 'true',
  ftpFileSizeLimit: Number(process.env.FTP_FILE_SIZE_LIMIT),
  ftpDir: process.env.FTP_DIR,
  ftpTlsKey: process.env.FTP_TLS_KEY_FILE_PATH,
  ftpTlsCert: process.env.FTP_TLS_CERT_FILE_PATH,
};
