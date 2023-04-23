import * as fs from 'fs';
import * as ftpd from 'ftpd';
import { authenticateFtpUser } from './AuthService';

const options = {
  host: process.env.IP || '127.0.0.1',
  port: process.env.FTP_PORT || 2121,
  tls: undefined,
};

const ftpServer = new ftpd.FtpServer(options.host, {
  getInitialCwd: function (connection) {
    const userDir = '/ftp-root/' + connection.username;
    if (fs.existsSync(process.cwd() + userDir)) {
      return userDir;
    } else {
      fs.mkdir(process.cwd() + userDir, (err) => {
        if (err) {
          return console.error(err);
        }
      });
      return userDir;
    }
  },
  getRoot: () => {
    return process.cwd();
  },
  pasvPortRangeStart: 1025,
  pasvPortRangeEnd: 1050,
  tlsOptions: options.tls,
  allowUnauthorizedTls: true,
  useWriteFile: false,
  useReadFile: true,
  uploadMaxSlurpSize: 7000,
});

ftpServer.on('client:connected', function (connection) {
  let username: string | undefined = undefined;
  let password: string | undefined = undefined;

  console.log(`Client connected: ${connection.cwd}`);
  connection.on(
    'command:user',
    function (user: string, success: () => void, failure: () => void) {
      if (user) {
        username = user;
        success();
      } else {
        failure();
      }
    }
  );

  connection.on(
    'command:pass',
    async function (
      pass: string,
      success: (user: string) => void,
      failure: () => void
    ) {
      if (pass && username) {
        password = pass;
        const isAuthenticated = await authenticateFtpUser(username!, password!);
        if (isAuthenticated) {
          success(username);
        } else {
          failure();
        }
      } else {
        failure();
      }
    }
  );
});

export default function ftpInit() {
  ftpServer.listen(options.port as number);
  console.log(`FTP Server listening on ${options.host}:${options.port}`);
}
