import express from 'express';
import mongoose from 'mongoose';
import DataFeedConfiguration from './models/DataFeedConfigurationSchema';
import ftpInit from './services/FtpService';

const port = process.env.PORT || 3000;
const MONGODB_URI = 'mongodb://localhost:27017/swift-feed';

const app = express();
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as mongoose.ConnectOptions)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
  });

const _id = 'test-uuid';

DataFeedConfiguration.findById(_id)
  .then((dataFeedConfiguration) => {
    if (dataFeedConfiguration) {
      console.log('Found DataFeedConfiguration:', dataFeedConfiguration);
    } else {
      console.log('DataFeedConfiguration not found');
    }
  })
  .catch((error) => {
    console.error('Error looking up DataFeedConfiguration:', error);
  });

ftpInit();
