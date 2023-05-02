import { setupFtp } from './services/FtpService';
import { setupDb } from './config/mongodb';
import { setupExpress } from './config/express';

const main = async () => {
  await setupDb();
  await setupFtp();
  await setupExpress();
};

main();
