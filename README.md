# swift-feed-backend

Primary entry point for business logic:
./src/services/DataFeedProcessorService.ts

Most inventory management systems(that I work with) push inventory data over
ftp. Currently, this app configures & hosts an ftp server locally. FTP Usernames
are associated with data feed configuration feedIds. On an ftp upload event, or
when csv is sent over http post, data is processed via FeedProcessingMediator.

Decided to scrap and remake the backend, hopefully final iter!
