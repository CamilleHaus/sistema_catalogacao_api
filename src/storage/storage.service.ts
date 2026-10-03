import { randomUUID } from 'node:crypto';
import { extname } from 'node:path';
import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import type { AppConfig } from '../config/app.config';

/** Extensões aceitas por tipo MIME — a extensão do arquivo enviado não é confiável. */
const EXTENSION_BY_MIME: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/avif': 'avif',
  'image/gif': 'gif',
  'image/tiff': 'tif',
  'application/pdf': 'pdf',
  // Documentos, planilhas e apresentações: os anexos da obra e o relatório de
  // restauro aceitam esses formatos, então o upload precisa aceitá-los também.
  'application/msword': 'doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
    'docx',
  'application/vnd.oasis.opendocument.text': 'odt',
  'application/rtf': 'rtf',
  'text/plain': 'txt',
  'application/vnd.ms-excel': 'xls',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
  'application/vnd.oasis.opendocument.spreadsheet': 'ods',
  'text/csv': 'csv',
  'application/vnd.ms-powerpoint': 'ppt',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation':
    'pptx',
  'application/vnd.oasis.opendocument.presentation': 'odp',
  // Áudio e vídeo dos anexos.
  'audio/mpeg': 'mp3',
  'audio/mp4': 'm4a',
  'audio/wav': 'wav',
  'audio/x-wav': 'wav',
  'audio/ogg': 'ogg',
  'video/mp4': 'mp4',
  'video/quicktime': 'mov',
  'video/webm': 'webm',
  'application/zip': 'zip',
};

export const ACCEPTED_MIME_TYPES = Object.keys(EXTENSION_BY_MIME);

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private readonly client: S3Client;
  private readonly bucket: string;
  private readonly publicUrl: string;

  constructor(private readonly config: ConfigService<AppConfig, true>) {
    const storage = this.config.get('storage', { infer: true });
    this.bucket = storage.bucket;
    this.publicUrl = storage.publicUrl;
    this.client = new S3Client({
      endpoint: storage.endpoint,
      region: storage.region,
      // O MinIO não resolve bucket por subdomínio no endereço local.
      forcePathStyle: true,
      credentials: {
        accessKeyId: storage.accessKey,
        secretAccessKey: storage.secretKey,
      },
    });
  }

  /** Sobe o arquivo e devolve a URL pública de leitura. */
  async upload(file: Express.Multer.File, prefix: string) {
    const key = `${prefix}/${randomUUID()}.${this.extensionFor(file)}`;

    try {
      await this.client.send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
          ContentLength: file.size,
        }),
      );
    } catch (caught: unknown) {
      this.logger.error(`Falha ao enviar ${key} para o storage.`, caught);
      throw new ServiceUnavailableException(
        'Não foi possível enviar o arquivo agora.',
      );
    }

    return {
      key,
      url: `${this.publicUrl}/${this.bucket}/${key}`,
      tamanho: file.size,
      tipo: file.mimetype,
      nomeOriginal: file.originalname,
    };
  }

  /**
   * Remove o objeto apontado pela URL. Ignora URLs de outra origem — a base
   * ainda guarda imagens externas cadastradas antes do storage existir.
   */
  async removeByUrl(url: string) {
    const key = this.keyFromUrl(url);
    if (!key) return false;

    try {
      await this.client.send(
        new DeleteObjectCommand({ Bucket: this.bucket, Key: key }),
      );
      return true;
    } catch (caught: unknown) {
      // Apagar o arquivo é secundário: o registro já saiu do banco.
      this.logger.warn(`Falha ao remover ${key} do storage.`, caught);
      return false;
    }
  }

  private keyFromUrl(url: string) {
    const prefix = `${this.publicUrl}/${this.bucket}/`;
    if (!url.startsWith(prefix)) return null;
    const key = decodeURIComponent(url.slice(prefix.length));
    return key || null;
  }

  private extensionFor(file: Express.Multer.File) {
    return (
      EXTENSION_BY_MIME[file.mimetype] ||
      extname(file.originalname).slice(1).toLowerCase() ||
      'bin'
    );
  }
}
