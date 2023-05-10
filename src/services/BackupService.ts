import { exec } from 'child_process';
import { config } from '../config/config';
import { createReadStream } from 'fs';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { verifyObjectKeysAreDefined } from '../utils/verifyObjectKeysUtil';

export interface BackupOptions {
  path: string;
  s3?: {
    accessKeyId?: string;
    secretAccessKey?: string;
    region?: string;
    bucket?: string;
    key?: string;
  };
}

export async function createBackup(options: BackupOptions): Promise<void> {
  const backupPath = `${options.path}/${Date.now()}`;
  await new Promise<void>((resolve, reject) => {
    exec(
      `mongodump --uri ${config.mongoUri} --out ${backupPath} && tar -zcvf ${backupPath}.tar.gz ${backupPath}`,
      (err, stdout, stderr) => {
        if (err) {
          console.error(`Backup failed, stderr: ${stderr}`, err);
          reject(err);
        }
        console.log(`${Date.now()} Backup successful, stdout: ${stdout}`);
        resolve();
      }
    );
  }).catch((err) => console.error(err));
  // Upload the backup to S3 if specified in the options
  if (options.s3 && verifyObjectKeysAreDefined(options.s3)) {
    try {
      const s3 = new S3Client({
        region: options.s3.region,
        credentials: {
          accessKeyId: options.s3.accessKeyId!,
          secretAccessKey: options.s3.secretAccessKey!,
        },
      });

      const fileStream = createReadStream(`${backupPath}.tar.gz`);
      const s3Params = {
        Bucket: options.s3.bucket,
        Key: options.s3.key + '.tar.gz',
        Body: fileStream,
      };

      const command = new PutObjectCommand(s3Params);
      const result = await s3.send(command);

      console.log(`Database backup uploaded to S3: ${result.ETag}`);
    } catch (error) {
      console.error('Error during S3 backup to database', error);
    }
  }
}
