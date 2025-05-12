import {
    Controller, Get, Post, Body, Patch, Param, Delete,
    UseGuards, ParseIntPipe
} from '@nestjs/common';
import {
    ApiBearerAuth, ApiOperation, ApiResponse, ApiTags
} from '@nestjs/swagger';
import { QrCodesService } from './qr-codes.service';
import {
    CreateQrCodeDto, UpdateQrCodeDto, QrCodeResponseDto,
    ValidateQrCodeDto, ValidateQrCodeResponseDto
} from './dto/qr-code.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('qr-codes')
@Controller('qr-codes')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
export class QrCodesController {
    constructor(private readonly qrCodesService: QrCodesService) { }

    @ApiOperation({ summary: 'Get all QR codes' })
    @ApiResponse({
        status: 200,
        description: 'Returns all QR codes',
        type: [QrCodeResponseDto]
    })
    @Roles(UserRole.ADMIN, UserRole.INSTRUCTOR)
    @Get()
    async findAll() {
        return this.qrCodesService.findAll();
    }

    @ApiOperation({ summary: 'Get a specific QR code by ID' })
    @ApiResponse({
        status: 200,
        description: 'Returns the QR code information',
        type: QrCodeResponseDto
    })
    @ApiResponse({ status: 404, description: 'QR code not found' })
    @Roles(UserRole.ADMIN, UserRole.INSTRUCTOR)
    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
        return this.qrCodesService.findOne(id);
    }

    @ApiOperation({ summary: 'Create a new QR code' })
    @ApiResponse({
        status: 201,
        description: 'The QR code has been created successfully',
        type: QrCodeResponseDto
    })
    @Roles(UserRole.ADMIN, UserRole.INSTRUCTOR)
    @Post()
    async create(@Body() createQrCodeDto: CreateQrCodeDto) {
        return this.qrCodesService.create(createQrCodeDto);
    }

    @ApiOperation({ summary: 'Update a QR code' })
    @ApiResponse({
        status: 200,
        description: 'The QR code has been updated successfully',
        type: QrCodeResponseDto
    })
    @ApiResponse({ status: 404, description: 'QR code not found' })
    @Roles(UserRole.ADMIN, UserRole.INSTRUCTOR)
    @Patch(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateQrCodeDto: UpdateQrCodeDto
    ) {
        return this.qrCodesService.update(id, updateQrCodeDto);
    }

    @ApiOperation({ summary: 'Delete a QR code' })
    @ApiResponse({ status: 204, description: 'The QR code has been deleted successfully' })
    @ApiResponse({ status: 404, description: 'QR code not found' })
    @Roles(UserRole.ADMIN, UserRole.INSTRUCTOR)
    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number) {
        await this.qrCodesService.remove(id);
        return { message: 'QR code deleted successfully' };
    }

    @ApiOperation({ summary: 'Validate a QR code' })
    @ApiResponse({
        status: 200,
        description: 'Returns validation result',
        type: ValidateQrCodeResponseDto
    })
    @Roles(UserRole.ADMIN, UserRole.INSTRUCTOR, UserRole.STUDENT)
    @Post('validate')
    async validate(@Body() validateQrCodeDto: ValidateQrCodeDto) {
        return this.qrCodesService.validateQrCode(validateQrCodeDto.qrContent);
    }
}
