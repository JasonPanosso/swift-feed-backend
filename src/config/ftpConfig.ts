import * as fs from 'fs';
import { TlsOptions } from 'tls';
import { config } from './config';

const tlsOptions: TlsOptions | undefined =
  config.ftpTlsKey && config.ftpTlsCert
    ? {
        key: fs.readFileSync(config.ftpTlsKey),
        cert: fs.readFileSync(config.ftpTlsCert),
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
  host: config.ftpHost || '127.0.0.1',
  port: config.ftpPort || 2121,
  tlsOnly: config.ftpTlsOnly || false,
  tlsOptions: tlsOptions,
  sizeLimit: config.ftpFileSizeLimit || 10 * 1024 * 1024,
  ftpDir: config.ftpDir || `${process.cwd()}/ftp-root`,
  allowedCommands: allowedCommands,
};
