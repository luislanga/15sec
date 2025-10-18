import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3Service {
  private readonly bucket: string;
  private readonly s3: S3Client;

  constructor(
    private readonly configService: ConfigService,
  ) {
    this.s3 = new S3Client({
      region: this.configService.getOrThrow('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.getOrThrow('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.getOrThrow('AWS_SECRET_ACCESS_KEY'),
      },
    });
    this.bucket = this.configService.getOrThrow('AWS_S3_BUCKET');
  }

  async getPresignedUploadUrl(postId: string): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: postId,
    });

    return getSignedUrl(this.s3, command, { expiresIn: 3600 });
  }
}
