import { setupFtp } from './services/FtpService';
import { setupDb } from './services/DatabaseService';
import { setupExpress } from './services/ExpressService';
import { config } from './config/config';

const main = async () => {
  console.log('Beginning initialization with dotenv config:', config)
  await setupDb();
  await setupExpress();
  if (config.ftpEnabled) {
    await setupFtp();
  }
};

main();
