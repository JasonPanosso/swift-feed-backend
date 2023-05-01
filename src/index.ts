import { setupFtp } from './services/FtpService';
import { setupDb } from './config/mongodb';
import { setupExpress, expressConfig } from './config/express';

const main = async () => {
  await setupDb();
  await setupFtp();
  const app = await setupExpress();

  app.get('/', (req, res) => {
    res.send('Hello, world!');
  });
  app.listen(expressConfig.expressPort, () => {
    console.log(`Express running on port ${expressConfig.expressPort}`);
  });
};

main();
