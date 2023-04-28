import { setupFtp } from './services/FtpService';
import { setupDb } from './config/mongodb';
import { setupExpress, expressConfig } from './config/express';

setupDb();
const app = setupExpress();
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.listen(expressConfig.expressPort, () => {
  console.log(`Express running on port ${expressConfig.expressPort}`);
});

setupFtp();
