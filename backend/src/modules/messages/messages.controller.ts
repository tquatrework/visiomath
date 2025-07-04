//src/modules/exercise/exercises.controller.ts
import { 
    Controller, Get, Post, Body, Query, Param, UseGuards, ParseIntPipe 
  } from '@nestjs/common';
  import { MessagesService } from './messages.service';
  import { CreateMessageDto } from '../../shared/dto/create-message.dto';
  import { GetMessagesDto } from '../../shared/dto/get-messages.dto';
  import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
  import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiParam } from '@nestjs/swagger';
  
  @ApiTags('Messages')
  @ApiBearerAuth() // Indique que l'authentification JWT est requise
  @UseGuards(JwtAuthGuard) // Protection des routes avec JWT
  @Controller('messages')
  export class MessagesController {
    constructor(private readonly messagesService: MessagesService) {}
  
    /**
     * Retrieve all messages based on optional filters.
     */
    @Get()
    @ApiOperation({ summary: 'Retrieve all messages (filtered if necessary)' })
    @ApiResponse({ status: 200, description: 'Messages retrieved successfully.' })
    async getMessages(@Query() filterDto: GetMessagesDto) {
      return this.messagesService.getMessages(filterDto);
    }
  
    /**
     * Retrieve a specific message by ID.
     */
    @Get(':id')
    @ApiOperation({ summary: 'Retrieve a specific message by ID' })
    @ApiParam({ name: 'id', description: 'Message ID' })
    @ApiResponse({ status: 200, description: 'Message retrieved successfully.' })
    @ApiResponse({ status: 404, description: 'Message not found.' })
    async getMessageById(@Param('id', ParseIntPipe) id: number) {
      return this.messagesService.getMessageById(id);
    }
  
    /**
     * Send a new message.
     */
    @Post()
    @ApiOperation({ summary: 'Send a new message' })
    @ApiResponse({ status: 201, description: 'Message sent successfully.' })
    async createMessage(@Body() createMessageDto: CreateMessageDto) {
      return this.messagesService.createMessage(createMessageDto);
    }
  }
  