import * as fs from 'fs';
import * as ftpd from 'ftpd';
import { ftpConfig } from '../config/ftpConfig';
import { authenticateFtpUser } from './AuthService';
import { processDataFeed } from './DataFeedProcessorService';
import type { ExtendedFtpServerOptions } from '../../typings/ftpd';

const ftpServer = new ftpd.FtpServer(ftpConfig.host, {
  getInitialCwd: (connection: ftpd.FtpConnection) => {
    const userDir = `/${connection.username}`;
    const fullUserDirPath = ftpConfig.ftpDir + userDir;
    if (fs.existsSync(fullUserDirPath)) {
      return userDir;
    } else {
      fs.mkdir(fullUserDirPath, (err) => {
        if (err) {
          console.error('Error getting initial cwd during FTP connection', err);
          return
        }
      });
      return userDir;
    }
  },
  getRoot: () => {
    if (fs.existsSync(ftpConfig.ftpDir)) {
      return ftpConfig.ftpDir;
    } else {
      fs.mkdir(ftpConfig.ftpDir, (err) => {
        if (err) {
          console.error('Error getting root dir during FTP connection', err);
          return
        }
      });
      return ftpConfig.ftpDir;
    }
  },
  allowedCommands: ftpConfig.allowedCommands,
  pasvPortRangeStart: 1025,
  pasvPortRangeEnd: 1050,
  tlsOptions: ftpConfig.tlsOptions,
  tlsOnly: ftpConfig.tlsOnly,
  allowUnauthorizedTls: true,
  useWriteFile: false,
  useReadFile: true,
} as ExtendedFtpServerOptions);

ftpServer.on('client:connected', (connection: ftpd.FtpConnection) => {
  let username: string | undefined = undefined;

  console.log(`Client connected: ${connection.socket.remoteAddress}`);
  connection.on(
    'command:user',
    (user: string, success: () => void, failure: () => void) => {
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
    async (
      _pass: string,
      success: (user: string) => void,
      failure: () => void
    ) => {
      if (username) {
        const isAuthenticated = await authenticateFtpUser(username);
        if (isAuthenticated) {
          success(username);
          return;
        }
      }
      failure();
    }
  );
  connection.on(
    'file:stor',
    async (
      event: string,
      data: { user: string; file: string; bytesWritten: number }
    ) => {
      const filePath = ftpConfig.ftpDir + data.file;
      if (data.bytesWritten > ftpConfig.sizeLimit) {
        console.error(
          `Error during file upload: File exceeded max file size of ${ftpConfig.sizeLimit}`
        );
        fs.rmSync(filePath);
        return;
      }
      if (event === 'close') {
        console.log(`${data.file} successfully uploaded, beginning processing`);
        const fileStream = fs.createReadStream(filePath);
        const result = await processDataFeed(fileStream, data.user);
        console.log(result);
        console.log('Beginning file cleanup');
        fs.rmSync(filePath);
        if (fs.existsSync(filePath)) {
          console.error(`File cleanup failed for ${filePath}`);
        } else {
          console.log(`File cleanup performed successfully for ${filePath}`);
        }
      }
    }
  );
});

export const setupFtp = async (): Promise<void> => {
  ftpServer.listen(ftpConfig.port);
  console.log(`FTP Server listening on ${ftpConfig.host}:${ftpConfig.port}`);
};
