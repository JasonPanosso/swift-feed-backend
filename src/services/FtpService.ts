import * as fs from 'fs';
import * as ftpd from 'ftpd';
import { ftpConfig } from '../config/ftp';
import { authenticateFtpUser } from './AuthService';
import { FeedProcessingMediator } from './FeedProcessingMediator';

const ftpServer = new ftpd.FtpServer(ftpConfig.host, {
  getInitialCwd: (connection: ftpd.FtpConnection) => {
    const userDir = `/${connection.username}`;
    const fullUserDirPath = ftpConfig.ftpDir + userDir;
    if (fs.existsSync(fullUserDirPath)) {
      return userDir;
    } else {
      fs.mkdir(fullUserDirPath, (err) => {
        if (err) {
          return console.error(err);
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
          return console.error(err);
        }
      });
      return ftpConfig.ftpDir;
    }
  },
  allowedCommands: ftpConfig.allowedCommands,
  pasvPortRangeStart: 1025,
  pasvPortRangeEnd: 1050,
  tlsOptions: ftpConfig.tls,
  allowUnauthorizedTls: true,
  useWriteFile: false,
  useReadFile: true,
  uploadMaxSlurpSize: 7000,
});

ftpServer.on('client:connected', (connection: ftpd.FtpConnection) => {
  let username: string | undefined = undefined;
  let password: string | undefined = undefined;

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
      pass: string,
      success: (user: string) => void,
      failure: () => void
    ) => {
      if (pass && username) {
        password = pass;
        const isAuthenticated = await authenticateFtpUser(username, password);
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
  connection.on(
    'file:stor',
    async (
      event: string,
      data: { user: string; file: string; bytesWritten: number }
    ) => {
      const filePath = ftpConfig.ftpDir + data.file
      if (data.bytesWritten > ftpConfig.sizeLimit) {
        console.error(
          `Error during file upload: File exceeded max file size of ${ftpConfig.sizeLimit}`
        );
        fs.rmSync(filePath);
        return;
      }
      if (event === 'close') {
        const fileStream = fs.createReadStream(filePath);
        const feedProcessingMediator = new FeedProcessingMediator();
        await feedProcessingMediator.processDataFeed(fileStream, data.user);
        console.log('Beginning file cleanup');
        fs.rmSync(filePath);
        if (fs.existsSync(filePath)) {
          console.error(`File cleanup failed for ${filePath}`)
          return
        } else {
          console.log(`File cleanup performed successfully for ${filePath}`)
          return
        }
      }
    }
  );
});

export const setupFtp = () => {
  ftpServer.listen(ftpConfig.port);
  console.log(`FTP Server listening on ${ftpConfig.host}:${ftpConfig.port}`);
};
