import { FtpServerOptions } from 'ftpd';

export interface ExtendedFtpServerOptions extends FtpServerOptions {
  allowedCommands?: string[] | undefined;
}
