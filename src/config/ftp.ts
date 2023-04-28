export const ftpConfig = {
  host: process.env.IP || '127.0.0.1',
  port: Number(process.env.FTP_PORT) || 2121,
  tls: undefined,
  sizeLimit: Number(process.env.FTP_FILE_SIZE_LIMIT) || 10 * 1024 * 1024,
  ftpDir: process.env.FTP_DIR || `${process.cwd()}/ftp-root`,
  allowedCommands: [
    'PASS',
    'USER',
    'QUIT',
    'PASV',
    'STOR',
    'TYPE',
    'LIST',
    'PWD',
    'CWD',
  ],
};

