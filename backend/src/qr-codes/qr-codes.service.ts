import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QrCode } from './entities/qr-code.entity';
import { CreateQrCodeDto, UpdateQrCodeDto } from './dto/qr-code.dto';
import * as QRCode from 'qrcode';
import * as CryptoJS from 'crypto-js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class QrCodesService {
    private readonly secretKey: string;

    constructor(
        @InjectRepository(QrCode)
        private qrCodesRepository: Repository<QrCode>,
        private configService: ConfigService,
    ) {
        this.secretKey = this.configService.get('QR_SECRET_KEY', 'qr_attendance_secret_key');
    }

    async findAll(): Promise<QrCode[]> {
        return this.qrCodesRepository.find({
            relations: ['schedule', 'createdBy'],
        });
    }

    async findOne(id: number): Promise<QrCode> {
        const qrCode = await this.qrCodesRepository.findOne({
            where: { qr_id: id },
            relations: ['schedule', 'createdBy'],
        });

        if (!qrCode) {
            throw new NotFoundException(`QR Code with ID ${id} not found`);
        }

        return qrCode;
    }

    async create(createQrCodeDto: CreateQrCodeDto): Promise<QrCode> {
        // Generate a unique token for the QR code
        const qrData = {
            scheduleId: createQrCodeDto.scheduleId,
            timestamp: new Date().getTime(),
            expiresAt: new Date(createQrCodeDto.expiresAt).getTime(),
        };

        // Encrypt the data
        const encryptedData = CryptoJS.AES.encrypt(
            JSON.stringify(qrData),
            this.secretKey
        ).toString();

        // Generate QR code
        const qrImageData = await QRCode.toDataURL(encryptedData);

        // Create QR code record
        const qrCode = this.qrCodesRepository.create({
            scheduleId: createQrCodeDto.scheduleId,
            createdById: createQrCodeDto.createdById,
            qrContent: encryptedData,
            qrImage: qrImageData,
            isActive: true,
            expiresAt: new Date(createQrCodeDto.expiresAt),
        });

        return this.qrCodesRepository.save(qrCode);
    }

    async update(id: number, updateQrCodeDto: UpdateQrCodeDto): Promise<QrCode> {
        const qrCode = await this.findOne(id);

        // Update QR code properties
        if (updateQrCodeDto.isActive !== undefined) {
            qrCode.isActive = updateQrCodeDto.isActive;
        }

        if (updateQrCodeDto.expiresAt) {
            qrCode.expiresAt = new Date(updateQrCodeDto.expiresAt);

            // If expiration is updated, regenerate the QR code
            const qrData = {
                scheduleId: qrCode.scheduleId,
                timestamp: new Date().getTime(),
                expiresAt: new Date(updateQrCodeDto.expiresAt).getTime(),
            };

            // Encrypt the data
            const encryptedData = CryptoJS.AES.encrypt(
                JSON.stringify(qrData),
                this.secretKey
            ).toString();

            // Generate new QR code
            const qrImageData = await QRCode.toDataURL(encryptedData);

            qrCode.qrContent = encryptedData;
            qrCode.qrImage = qrImageData;
        }

        return this.qrCodesRepository.save(qrCode);
    }

    async remove(id: number): Promise<void> {
        const qrCode = await this.findOne(id);
        await this.qrCodesRepository.remove(qrCode);
    }

    async validateQrCode(qrContent: string): Promise<{ isValid: boolean; scheduleId?: number }> {
        try {
            // Decrypt the QR code content
            const bytes = CryptoJS.AES.decrypt(qrContent, this.secretKey);
            const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

            // Check if the QR code is expired
            const now = new Date().getTime();
            if (now > decryptedData.expiresAt) {
                return { isValid: false };
            }

            // Find the QR code in the database
            const qrCode = await this.qrCodesRepository.findOne({
                where: {
                    qrContent,
                    isActive: true,
                },
            });

            if (!qrCode) {
                return { isValid: false };
            }

            return {
                isValid: true,
                scheduleId: decryptedData.scheduleId
            };
        } catch (error) {
            console.error('Error validating QR code:', error);
            return { isValid: false };
        }
    }
}
