"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var StorageService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageService = exports.ACCEPTED_MIME_TYPES = void 0;
const node_crypto_1 = require("node:crypto");
const node_path_1 = require("node:path");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const client_s3_1 = require("@aws-sdk/client-s3");
const EXTENSION_BY_MIME = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/avif': 'avif',
    'image/gif': 'gif',
    'image/tiff': 'tif',
    'application/pdf': 'pdf',
    'application/msword': 'doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
    'application/vnd.oasis.opendocument.text': 'odt',
    'application/rtf': 'rtf',
    'text/plain': 'txt',
    'application/vnd.ms-excel': 'xls',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
    'application/vnd.oasis.opendocument.spreadsheet': 'ods',
    'text/csv': 'csv',
    'application/vnd.ms-powerpoint': 'ppt',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
    'application/vnd.oasis.opendocument.presentation': 'odp',
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
exports.ACCEPTED_MIME_TYPES = Object.keys(EXTENSION_BY_MIME);
let StorageService = StorageService_1 = class StorageService {
    config;
    logger = new common_1.Logger(StorageService_1.name);
    client;
    bucket;
    publicUrl;
    constructor(config) {
        this.config = config;
        const storage = this.config.get('storage', { infer: true });
        this.bucket = storage.bucket;
        this.publicUrl = storage.publicUrl;
        this.client = new client_s3_1.S3Client({
            endpoint: storage.endpoint,
            region: storage.region,
            forcePathStyle: true,
            credentials: {
                accessKeyId: storage.accessKey,
                secretAccessKey: storage.secretKey,
            },
        });
    }
    async upload(file, prefix) {
        const key = `${prefix}/${(0, node_crypto_1.randomUUID)()}.${this.extensionFor(file)}`;
        try {
            await this.client.send(new client_s3_1.PutObjectCommand({
                Bucket: this.bucket,
                Key: key,
                Body: file.buffer,
                ContentType: file.mimetype,
                ContentLength: file.size,
            }));
        }
        catch (caught) {
            this.logger.error(`Falha ao enviar ${key} para o storage.`, caught);
            throw new common_1.ServiceUnavailableException('Não foi possível enviar o arquivo agora.');
        }
        return {
            key,
            url: `${this.publicUrl}/${this.bucket}/${key}`,
            tamanho: file.size,
            tipo: file.mimetype,
            nomeOriginal: file.originalname,
        };
    }
    async removeByUrl(url) {
        const key = this.keyFromUrl(url);
        if (!key)
            return false;
        try {
            await this.client.send(new client_s3_1.DeleteObjectCommand({ Bucket: this.bucket, Key: key }));
            return true;
        }
        catch (caught) {
            this.logger.warn(`Falha ao remover ${key} do storage.`, caught);
            return false;
        }
    }
    keyFromUrl(url) {
        const prefix = `${this.publicUrl}/${this.bucket}/`;
        if (!url.startsWith(prefix))
            return null;
        const key = decodeURIComponent(url.slice(prefix.length));
        return key || null;
    }
    extensionFor(file) {
        return (EXTENSION_BY_MIME[file.mimetype] ||
            (0, node_path_1.extname)(file.originalname).slice(1).toLowerCase() ||
            'bin');
    }
};
exports.StorageService = StorageService;
exports.StorageService = StorageService = StorageService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], StorageService);
//# sourceMappingURL=storage.service.js.map