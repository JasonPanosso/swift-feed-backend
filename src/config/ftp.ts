import * as fs from 'fs';
import { TlsOptions } from 'tls';

const tlsOptions: TlsOptions | undefined =
  process.env.FTP_TLS_KEY_FILE_PATH && process.env.FTP_TLS_CERT_FILE_PATH
    ? {
        key: fs.readFileSync(process.env.FTP_TLS_KEY_FILE_PATH),
        cert: fs.readFileSync(process.env.FTP_TLS_CERT_FILE_PATH),
      }
    : undefined;

const allowedCommands = [
  'PASS',
  'USER',
  'QUIT',
  'PASV',
  'STOR',
  'TYPE',
  'LIST',
  'PWD',
  'CWD',
];

export const ftpConfig = {
  host: process.env.FTP_HOST || '127.0.0.1',
  port: Number(process.env.FTP_PORT) || 2121,
  tlsOnly: Boolean(process.env.FTP_TLS_ONLY) || false,
  tlsOptions: tlsOptions,
  sizeLimit: Number(process.env.FTP_FILE_SIZE_LIMIT) || 10 * 1024 * 1024,
  ftpDir: process.env.FTP_DIR || `${process.cwd()}/ftp-root`,
  allowedCommands: allowedCommands,
};
