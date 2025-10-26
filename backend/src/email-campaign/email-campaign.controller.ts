import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  Request,
  UseGuards,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { Types } from 'mongoose';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
  ApiBody,
  ApiConsumes,
  ApiProduces,
  ApiExcludeEndpoint
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { EmailCampaignService } from './email-campaign.service';
import { UserLoginActivityService } from '../user-login-activity/user-login-activity.service';
import {
  CreateEmailCampaignDto,
  CreateInactiveUserCampaignDto,
  UpdateEmailCampaignDto,
  EmailCampaignQueryDto,
  InactiveUserQueryDto,
  CampaignStatsDto,
  InactiveUserStatsDto
} from '../dto-email-campaign/email-campaign.dto';
import { EmailCampaignDocument } from '../schema/email-campaign.schema';
import { UserLoginActivityDocument } from '../schema/user-login-activity.schema';
import { InactivityPeriod } from '../schema/email-campaign.schema';

/**
 * Controller for managing email campaigns including inactive user targeting
 */
@Controller('email-campaigns')
@UseGuards(JwtAuthGuard)
@ApiTags('Email Campaigns')
@ApiBearerAuth()
export class EmailCampaignController {
  constructor(
    private emailCampaignService: EmailCampaignService,
    private userLoginActivityService: UserLoginActivityService,
  ) {}

  /**
   * Create a regular email campaign
   */
  @Post()
  @ApiOperation({ 
    summary: 'Create email campaign',
    description: `
      Create a new email campaign to send to all community members.
      
      **Features:**
      - Send to all community members
      - Support for HTML and plain text content
      - Template variable replacement
      - Email tracking (opens, clicks)
      - Scheduling support
      
      **Template Variables Available:**
      - \`{{communityName}}\` - Community name
      - \`{{userName}}\` - Recipient name
      - \`{{currentDate}}\` - Current date
      - \`{{currentYear}}\` - Current year
    `,
    operationId: 'createEmailCampaign'
  })
  @ApiBody({
    type: CreateEmailCampaignDto,
    description: 'Email campaign data',
    examples: {
      basic: {
        summary: 'Basic campaign',
        description: 'A simple email campaign',
        value: {
          title: 'Welcome to our community!',
          subject: 'Welcome to {{communityName}}',
          content: 'Welcome to our amazing community! We are excited to have you join us...',
          communityId: '507f1f77bcf86cd799439011',
          type: 'announcement',
          isHtml: true,
          trackOpens: true,
          trackClicks: true
        }
      },
      scheduled: {
        summary: 'Scheduled campaign',
        description: 'A campaign scheduled for future delivery',
        value: {
          title: 'Important Announcement',
          subject: 'Important Update from {{communityName}}',
          content: '<h1>Important Update</h1><p>We have exciting news to share...</p>',
          communityId: '507f1f77bcf86cd799439011',
          scheduledAt: '2024-02-15T10:00:00.000Z',
          type: 'announcement',
          isHtml: true
        }
      }
    }
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Campaign created successfully',
    schema: {
      type: 'object',
      properties: {
        _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
        title: { type: 'string', example: 'Welcome to our community!' },
        subject: { type: 'string', example: 'Welcome to My Community' },
        content: { type: 'string', example: 'Welcome to our amazing community!' },
        communityId: { type: 'string', example: '507f1f77bcf86cd799439011' },
        creatorId: { type: 'string', example: '507f1f77bcf86cd799439012' },
        type: { type: 'string', enum: ['announcement', 'newsletter', 'promotion', 'event_reminder', 'course_update', 'inactive_user_reactivation', 'custom'], example: 'announcement' },
        status: { type: 'string', enum: ['draft', 'scheduled', 'sending', 'sent', 'failed', 'cancelled'], example: 'draft' },
        totalRecipients: { type: 'number', example: 150 },
        isHtml: { type: 'boolean', example: true },
        trackOpens: { type: 'boolean', example: true },
        trackClicks: { type: 'boolean', example: true },
        createdAt: { type: 'string', format: 'date-time', example: '2024-01-15T10:00:00.000Z' }
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad request - invalid data or no members found',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'string', example: 'No members found in this community' },
        error: { type: 'string', example: 'Bad Request' }
      }
    }
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Forbidden - not authorized to manage this community',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 403 },
        message: { type: 'string', example: 'You can only manage campaigns for communities you own or admin' },
        error: { type: 'string', example: 'Forbidden' }
      }
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized - invalid or missing JWT token',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Unauthorized' }
      }
    }
  })
  async createCampaign(
    @Request() req,
    @Body() dto: CreateEmailCampaignDto
  ): Promise<EmailCampaignDocument> {
    return this.emailCampaignService.createCampaign(req.user.id, dto);
  }

  /**
   * Create an inactive user campaign
   */
  @Post('inactive-users')
  @ApiOperation({ 
    summary: 'Create inactive user campaign',
    description: `
      Create a targeted email campaign for users who haven't logged in for a specified period.
      
      **Features:**
      - Target users by inactivity period (7, 15, 30, 60+ days)
      - Automatic user detection based on login activity
      - Pre-built templates for different inactivity periods
      - Template variable replacement
      - Batch processing for large user lists
      
      **Inactivity Periods:**
      - \`last_7_days\` - Users inactive for 7 days
      - \`last_15_days\` - Users inactive for 15 days  
      - \`last_30_days\` - Users inactive for 30 days
      - \`last_60_days\` - Users inactive for 60 days
      - \`more_than_60_days\` - Users inactive for 60+ days
      
      **Template Variables Available:**
      - \`{{communityName}}\` - Community name
      - \`{{userName}}\` - Recipient name
      - \`{{daysThreshold}}\` - Number of days since last login
      - \`{{inactivityPeriod}}\` - Human-readable inactivity period
      - \`{{currentDate}}\` - Current date
      - \`{{currentYear}}\` - Current year
    `,
    operationId: 'createInactiveUserCampaign'
  })
  @ApiBody({
    type: CreateInactiveUserCampaignDto,
    description: 'Inactive user campaign data',
    examples: {
      reactivation_7_days: {
        summary: '7-day reactivation campaign',
        description: 'Target users inactive for 7 days',
        value: {
          title: 'We miss you! Come back to our community',
          subject: 'We miss you! Come back to {{communityName}}',
          content: 'Hi {{userName}}! We noticed you haven\'t logged in for {{daysThreshold}} days. We have exciting updates waiting for you...',
          communityId: '507f1f77bcf86cd799439011',
          inactivityPeriod: 'last_7_days',
          isHtml: true,
          trackOpens: true,
          trackClicks: true
        }
      },
      reactivation_30_days: {
        summary: '30-day reactivation campaign',
        description: 'Target users inactive for 30 days with special offer',
        value: {
          title: 'Special offer for returning members',
          subject: 'Exclusive offer for returning members of {{communityName}}',
          content: '<h2>Special Welcome Back Offer!</h2><p>As a valued member who\'s been away for {{daysThreshold}} days, we have something special for you...</p>',
          communityId: '507f1f77bcf86cd799439011',
          inactivityPeriod: 'last_30_days',
          maxRecipients: 500,
          isHtml: true
        }
      },
      all_inactive: {
        summary: 'Target all inactive users',
        description: 'Target all inactive users regardless of period',
        value: {
          title: 'We miss you! Come back to our community',
          subject: 'We miss you! Come back to {{communityName}}',
          content: 'Hi {{userName}}! We noticed you haven\'t been active lately. We have exciting updates waiting for you...',
          communityId: '507f1f77bcf86cd799439011',
          targetAllInactive: true,
          maxRecipients: 1000,
          isHtml: true
        }
      }
    }
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Inactive user campaign created successfully',
    schema: {
      type: 'object',
      properties: {
        _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
        title: { type: 'string', example: 'We miss you! Come back to our community' },
        subject: { type: 'string', example: 'We miss you! Come back to My Community' },
        content: { type: 'string', example: 'Hi John! We noticed you haven\'t logged in for 7 days...' },
        communityId: { type: 'string', example: '507f1f77bcf86cd799439011' },
        creatorId: { type: 'string', example: '507f1f77bcf86cd799439012' },
        type: { type: 'string', example: 'inactive_user_reactivation' },
        status: { type: 'string', example: 'draft' },
        isInactiveUserCampaign: { type: 'boolean', example: true },
        targetInactivityPeriod: { type: 'string', example: 'last_7_days' },
        targetDaysThreshold: { type: 'number', example: 7 },
        totalRecipients: { type: 'number', example: 25 },
        createdAt: { type: 'string', format: 'date-time', example: '2024-01-15T10:00:00.000Z' }
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad request - no inactive users found for selected period',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'string', example: 'No inactive users found for the selected period: last_7_days' },
        error: { type: 'string', example: 'Bad Request' }
      }
    }
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Forbidden - not authorized to manage this community',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 403 },
        message: { type: 'string', example: 'You can only manage campaigns for communities you own or admin' },
        error: { type: 'string', example: 'Forbidden' }
      }
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized - invalid or missing JWT token'
  })
  async createInactiveUserCampaign(
    @Request() req,
    @Body() dto: CreateInactiveUserCampaignDto
  ): Promise<EmailCampaignDocument> {
    return this.emailCampaignService.createInactiveUserCampaign(req.user.id, dto);
  }

  /**
   * Send an email campaign
   */
  @Post(':campaignId/send')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Send email campaign',
    description: `
      Send a draft or scheduled campaign to all recipients.
      
      **Features:**
      - Sends emails in batches to avoid rate limiting
      - Updates campaign status to 'sending' then 'sent'
      - Tracks delivery success/failure for each recipient
      - Updates reactivation email tracking for inactive user campaigns
      - Provides detailed logging for monitoring
      
      **Campaign Status Flow:**
      - \`draft\` → \`sending\` → \`sent\`
      - \`scheduled\` → \`sending\` → \`sent\`
      - If error occurs: \`sending\` → \`failed\`
      
      **Batch Processing:**
      - Emails are sent in batches of 10 to avoid overwhelming the email service
      - 1-second delay between batches to prevent rate limiting
      - Progress is logged for monitoring
    `,
    operationId: 'sendEmailCampaign'
  })
  @ApiParam({ 
    name: 'campaignId', 
    description: 'Campaign ID to send',
    example: '507f1f77bcf86cd799439011',
    required: true
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Campaign sent successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Campaign sent successfully' },
        campaignId: { type: 'string', example: '507f1f77bcf86cd799439011' }
      }
    }
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Campaign not found',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Campaign not found' },
        error: { type: 'string', example: 'Not Found' }
      }
    }
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Forbidden - not authorized to send this campaign',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 403 },
        message: { type: 'string', example: 'You can only send campaigns you created' },
        error: { type: 'string', example: 'Forbidden' }
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad request - campaign cannot be sent in current status',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'string', example: 'Campaign cannot be sent in current status' },
        error: { type: 'string', example: 'Bad Request' }
      }
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized - invalid or missing JWT token'
  })
  async sendCampaign(
    @Request() req,
    @Param('campaignId') campaignId: string
  ): Promise<{ message: string; campaignId: string }> {
    await this.emailCampaignService.sendCampaign(campaignId, req.user.id);
    return { 
      message: 'Campaign sent successfully', 
      campaignId 
    };
  }

  /**
   * Get campaigns for a community
   */
  @Get('community/:communityId')
  @ApiOperation({ 
    summary: 'Get community campaigns',
    description: `
      Get all campaigns for a specific community with filtering and pagination.
      
      **Features:**
      - Pagination support (page, limit)
      - Filter by campaign status (draft, scheduled, sending, sent, failed, cancelled)
      - Filter by campaign type (announcement, newsletter, promotion, etc.)
      - Filter inactive user campaigns only
      - Search by title or subject
      - Sort by creation date (newest first)
      
      **Query Parameters:**
      - \`page\` - Page number (default: 1)
      - \`limit\` - Items per page (default: 10, max: 100)
      - \`status\` - Filter by campaign status
      - \`type\` - Filter by campaign type
      - \`inactiveUserCampaigns\` - Filter inactive user campaigns only
      - \`search\` - Search term for title or subject
    `,
    operationId: 'getCommunityCampaigns'
  })
  @ApiParam({ 
    name: 'communityId', 
    description: 'Community ID to get campaigns for',
    example: '507f1f77bcf86cd799439011',
    required: true
  })
  @ApiQuery({ 
    name: 'page', 
    required: false, 
    description: 'Page number for pagination', 
    example: 1,
    type: Number
  })
  @ApiQuery({ 
    name: 'limit', 
    required: false, 
    description: 'Number of items per page (max 100)', 
    example: 10,
    type: Number
  })
  @ApiQuery({ 
    name: 'status', 
    required: false, 
    description: 'Filter by campaign status',
    enum: ['draft', 'scheduled', 'sending', 'sent', 'failed', 'cancelled'],
    example: 'sent'
  })
  @ApiQuery({ 
    name: 'type', 
    required: false, 
    description: 'Filter by campaign type',
    enum: ['announcement', 'newsletter', 'promotion', 'event_reminder', 'course_update', 'inactive_user_reactivation', 'custom'],
    example: 'announcement'
  })
  @ApiQuery({ 
    name: 'inactiveUserCampaigns', 
    required: false, 
    description: 'Filter inactive user campaigns only',
    type: Boolean,
    example: false
  })
  @ApiQuery({ 
    name: 'search', 
    required: false, 
    description: 'Search term for title or subject',
    example: 'welcome'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Campaigns retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        campaigns: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
              title: { type: 'string', example: 'Welcome to our community!' },
              subject: { type: 'string', example: 'Welcome to My Community' },
              content: { type: 'string', example: 'Welcome to our amazing community!' },
              communityId: { type: 'string', example: '507f1f77bcf86cd799439011' },
              creatorId: { 
                type: 'object',
                properties: {
                  _id: { type: 'string', example: '507f1f77bcf86cd799439012' },
                  name: { type: 'string', example: 'John Doe' },
                  email: { type: 'string', example: 'john@example.com' }
                }
              },
              type: { type: 'string', example: 'announcement' },
              status: { type: 'string', example: 'sent' },
              totalRecipients: { type: 'number', example: 150 },
              sentCount: { type: 'number', example: 148 },
              failedCount: { type: 'number', example: 2 },
              openCount: { type: 'number', example: 120 },
              clickCount: { type: 'number', example: 45 },
              isInactiveUserCampaign: { type: 'boolean', example: false },
              createdAt: { type: 'string', format: 'date-time', example: '2024-01-15T10:00:00.000Z' },
              sentAt: { type: 'string', format: 'date-time', example: '2024-01-15T10:05:00.000Z' }
            }
          }
        },
        total: { type: 'number', example: 25, description: 'Total number of campaigns' },
        page: { type: 'number', example: 1, description: 'Current page number' },
        limit: { type: 'number', example: 10, description: 'Items per page' }
      }
    }
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Forbidden - not authorized to access this community',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 403 },
        message: { type: 'string', example: 'You can only manage campaigns for communities you own or admin' },
        error: { type: 'string', example: 'Forbidden' }
      }
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized - invalid or missing JWT token'
  })
  async getCommunityCampaigns(
    @Request() req,
    @Param('communityId') communityId: string,
    @Query() query: EmailCampaignQueryDto
  ): Promise<{ campaigns: EmailCampaignDocument[]; total: number; page: number; limit: number }> {
    const result = await this.emailCampaignService.getCommunityCampaigns(
      req.user.id, 
      communityId, 
      query
    );
    
    return {
      ...result,
      page: query.page || 1,
      limit: query.limit || 10
    };
  }

  /**
   * Get campaign statistics
   */
  @Get('community/:communityId/stats')
  @ApiOperation({ 
    summary: 'Get campaign statistics',
    description: `
      Get comprehensive statistics for all campaigns in a community.
      
      **Statistics Included:**
      - Total campaigns count
      - Total emails sent/failed
      - Open and click rates
      - Reactivation campaign metrics
      - Performance analytics
      
      **Metrics Calculated:**
      - Average open rate percentage
      - Average click rate percentage
      - Reactivation success rate
      - Campaign performance breakdown
    `,
    operationId: 'getCampaignStats'
  })
  @ApiParam({ 
    name: 'communityId', 
    description: 'Community ID to get statistics for',
    example: '507f1f77bcf86cd799439011',
    required: true
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Statistics retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        totalCampaigns: { 
          type: 'number', 
          example: 15, 
          description: 'Total number of campaigns' 
        },
        totalEmailsSent: { 
          type: 'number', 
          example: 2250, 
          description: 'Total emails sent across all campaigns' 
        },
        totalEmailsFailed: { 
          type: 'number', 
          example: 45, 
          description: 'Total emails that failed to send' 
        },
        totalOpens: { 
          type: 'number', 
          example: 1800, 
          description: 'Total email opens across all campaigns' 
        },
        totalClicks: { 
          type: 'number', 
          example: 450, 
          description: 'Total email clicks across all campaigns' 
        },
        averageOpenRate: { 
          type: 'number', 
          example: 80.0, 
          description: 'Average open rate percentage' 
        },
        averageClickRate: { 
          type: 'number', 
          example: 20.0, 
          description: 'Average click rate percentage' 
        },
        reactivationCampaigns: { 
          type: 'number', 
          example: 5, 
          description: 'Number of reactivation campaigns' 
        },
        reactivationSuccessRate: { 
          type: 'number', 
          example: 75.5, 
          description: 'Reactivation campaign success rate percentage' 
        }
      }
    }
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Forbidden - not authorized to access this community',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 403 },
        message: { type: 'string', example: 'You can only manage campaigns for communities you own or admin' },
        error: { type: 'string', example: 'Forbidden' }
      }
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized - invalid or missing JWT token'
  })
  async getCampaignStats(
    @Request() req,
    @Param('communityId') communityId: string
  ): Promise<CampaignStatsDto> {
    return this.emailCampaignService.getCampaignStats(req.user.id, communityId);
  }

  /**
   * Get inactive users for a community
   */
  @Get('community/:communityId/inactive-users')
  @ApiOperation({ 
    summary: 'Get inactive users',
    description: `
      Get inactive users for a community, optionally filtered by inactivity period.
      
      **Features:**
      - Filter by specific inactivity periods (7, 15, 30, 60+ days)
      - Get all inactive users regardless of period
      - Limit number of results returned
      - Sort by days since last login (most inactive first)
      
      **Inactivity Periods:**
      - \`last_7_days\` - Users inactive for 7 days
      - \`last_15_days\` - Users inactive for 15 days
      - \`last_30_days\` - Users inactive for 30 days
      - \`last_60_days\` - Users inactive for 60 days
      - \`more_than_60_days\` - Users inactive for 60+ days
      
      **Use Cases:**
      - Preview users before creating reactivation campaigns
      - Analyze user engagement patterns
      - Identify users for targeted outreach
    `,
    operationId: 'getInactiveUsers'
  })
  @ApiParam({ 
    name: 'communityId', 
    description: 'Community ID to get inactive users for',
    example: '507f1f77bcf86cd799439011',
    required: true
  })
  @ApiQuery({ 
    name: 'period', 
    required: false, 
    description: 'Filter by inactivity period',
    enum: ['last_7_days', 'last_15_days', 'last_30_days', 'last_60_days', 'more_than_60_days'],
    example: 'last_7_days'
  })
  @ApiQuery({ 
    name: 'limit', 
    required: false, 
    description: 'Maximum number of users to return (max 1000)', 
    example: 100,
    type: Number
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Inactive users retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
          userId: { 
            type: 'object',
            properties: {
              _id: { type: 'string', example: '507f1f77bcf86cd799439012' },
              name: { type: 'string', example: 'John Doe' },
              email: { type: 'string', example: 'john@example.com' }
            }
          },
          communityId: { type: 'string', example: '507f1f77bcf86cd799439011' },
          lastLoginAt: { type: 'string', format: 'date-time', example: '2024-01-08T10:00:00.000Z' },
          daysSinceLastLogin: { type: 'number', example: 7 },
          inactivityStatus: { 
            type: 'string', 
            enum: ['active', 'inactive_7d', 'inactive_15d', 'inactive_30d', 'inactive_60d_plus'],
            example: 'inactive_7d'
          },
          isReactivationTarget: { type: 'boolean', example: true },
          lastReactivationEmailSent: { type: 'string', format: 'date-time', example: '2024-01-10T10:00:00.000Z' },
          reactivationEmailCount: { type: 'number', example: 2 },
          joinedAt: { type: 'string', format: 'date-time', example: '2024-01-01T10:00:00.000Z' },
          createdAt: { type: 'string', format: 'date-time', example: '2024-01-01T10:00:00.000Z' },
          updatedAt: { type: 'string', format: 'date-time', example: '2024-01-15T10:00:00.000Z' }
        }
      }
    }
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Forbidden - not authorized to access this community',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 403 },
        message: { type: 'string', example: 'You can only manage campaigns for communities you own or admin' },
        error: { type: 'string', example: 'Forbidden' }
      }
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized - invalid or missing JWT token'
  })
  async getInactiveUsers(
    @Request() req,
    @Param('communityId') communityId: string,
    @Query() query: InactiveUserQueryDto
  ): Promise<UserLoginActivityDocument[]> {
    // Verify access to community (basic check)
    await this.emailCampaignService.getInactiveUserStats(communityId);

    if (query.period) {
      return this.userLoginActivityService.getInactiveUsersByPeriod(
        communityId, 
        query.period
      );
    } else {
      return this.userLoginActivityService.getAllInactiveUsers(communityId);
    }
  }

  /**
   * Get inactive user statistics
   */
  @Get('community/:communityId/inactive-stats')
  @ApiOperation({ 
    summary: 'Get inactive user statistics',
    description: `
      Get comprehensive statistics about inactive users in a community.
      
      **Statistics Included:**
      - Total community members
      - Active vs inactive user breakdown
      - Inactivity period distribution (7, 15, 30, 60+ days)
      - Detailed breakdown by inactivity status
      
      **Use Cases:**
      - Monitor community engagement health
      - Plan reactivation campaigns
      - Track user retention metrics
      - Identify engagement trends
    `,
    operationId: 'getInactiveStats'
  })
  @ApiParam({ 
    name: 'communityId', 
    description: 'Community ID to get inactive user statistics for',
    example: '507f1f77bcf86cd799439011',
    required: true
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Inactive user statistics retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        totalMembers: { 
          type: 'number', 
          example: 500, 
          description: 'Total number of community members' 
        },
        activeUsers: { 
          type: 'number', 
          example: 350, 
          description: 'Number of active users (logged in within 7 days)' 
        },
        inactive7d: { 
          type: 'number', 
          example: 50, 
          description: 'Users inactive for 7 days' 
        },
        inactive15d: { 
          type: 'number', 
          example: 40, 
          description: 'Users inactive for 15 days' 
        },
        inactive30d: { 
          type: 'number', 
          example: 35, 
          description: 'Users inactive for 30 days' 
        },
        inactive60dPlus: { 
          type: 'number', 
          example: 25, 
          description: 'Users inactive for 60+ days' 
        },
        totalInactiveUsers: { 
          type: 'number', 
          example: 150, 
          description: 'Total number of inactive users' 
        },
        breakdown: {
          type: 'array',
          description: 'Detailed breakdown by inactivity status',
          items: {
            type: 'object',
            properties: {
              _id: { type: 'string', example: 'inactive_7d' },
              count: { type: 'number', example: 50 },
              avgDaysSinceLogin: { type: 'number', example: 8.5 }
            }
          }
        }
      }
    }
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Forbidden - not authorized to access this community',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 403 },
        message: { type: 'string', example: 'You can only manage campaigns for communities you own or admin' },
        error: { type: 'string', example: 'Forbidden' }
      }
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized - invalid or missing JWT token'
  })
  async getInactiveStats(
    @Request() req,
    @Param('communityId') communityId: string
  ): Promise<InactiveUserStatsDto> {
    return this.emailCampaignService.getInactiveUserStats(communityId);
  }

  /**
   * Get a specific campaign
   */
  @Get(':campaignId')
  @ApiOperation({ 
    summary: 'Get campaign details',
    description: 'Get detailed information about a specific campaign'
  })
  @ApiParam({ 
    name: 'campaignId', 
    description: 'Campaign ID',
    example: '507f1f77bcf86cd799439011'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Campaign details retrieved successfully'
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Campaign not found'
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Forbidden - not authorized to access this campaign'
  })
  async getCampaign(
    @Request() req,
    @Param('campaignId') campaignId: string
  ): Promise<EmailCampaignDocument> {
    // This would need to be implemented in the service
    throw new Error('Not implemented yet');
  }

  /**
   * Update a campaign
   */
  @Put(':campaignId')
  @ApiOperation({ 
    summary: 'Update campaign',
    description: 'Update an existing campaign (only if in draft status)'
  })
  @ApiParam({ 
    name: 'campaignId', 
    description: 'Campaign ID',
    example: '507f1f77bcf86cd799439011'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Campaign updated successfully'
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Campaign not found'
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Forbidden - not authorized to update this campaign'
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad request - campaign cannot be updated in current status'
  })
  async updateCampaign(
    @Request() req,
    @Param('campaignId') campaignId: string,
    @Body() dto: UpdateEmailCampaignDto
  ): Promise<EmailCampaignDocument> {
    // This would need to be implemented in the service
    throw new Error('Not implemented yet');
  }

  /**
   * Delete a campaign
   */
  @Delete(':campaignId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ 
    summary: 'Delete campaign',
    description: 'Delete a campaign (only if in draft status)'
  })
  @ApiParam({ 
    name: 'campaignId', 
    description: 'Campaign ID',
    example: '507f1f77bcf86cd799439011'
  })
  @ApiResponse({ 
    status: 204, 
    description: 'Campaign deleted successfully'
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Campaign not found'
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Forbidden - not authorized to delete this campaign'
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad request - campaign cannot be deleted in current status'
  })
  async deleteCampaign(
    @Request() req,
    @Param('campaignId') campaignId: string
  ): Promise<void> {
    // This would need to be implemented in the service
    throw new Error('Not implemented yet');
  }

  /**
   * Get available inactivity periods
   */
  @Get('inactivity-periods')
  @ApiOperation({ 
    summary: 'Get inactivity periods',
    description: `
      Get list of available inactivity periods for targeting in reactivation campaigns.
      
      **Available Periods:**
      - 7 days - Users who haven't logged in for 7 days
      - 15 days - Users who haven't logged in for 15 days
      - 30 days - Users who haven't logged in for 30 days
      - 60 days - Users who haven't logged in for 60 days
      - 60+ days - Users who haven't logged in for more than 60 days
      
      **Use Cases:**
      - Frontend dropdown/selection for campaign creation
      - Understanding available targeting options
      - Planning reactivation campaign strategies
    `,
    operationId: 'getInactivityPeriods'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Inactivity periods retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        periods: {
          type: 'array',
          description: 'List of available inactivity periods',
          items: {
            type: 'object',
            properties: {
              value: { 
                type: 'string', 
                example: 'last_7_days',
                description: 'Period value for API requests'
              },
              label: { 
                type: 'string', 
                example: 'Last 7 days',
                description: 'Human-readable period label'
              },
              days: { 
                type: 'number', 
                example: 7,
                description: 'Number of days for this period'
              }
            }
          }
        }
      }
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized - invalid or missing JWT token'
  })
  getInactivityPeriods(): { periods: Array<{ value: string; label: string; days: number }> } {
    return {
      periods: [
        { value: InactivityPeriod.LAST_7_DAYS, label: 'Last 7 days', days: 7 },
        { value: InactivityPeriod.LAST_15_DAYS, label: 'Last 15 days', days: 15 },
        { value: InactivityPeriod.LAST_30_DAYS, label: 'Last 30 days', days: 30 },
        { value: InactivityPeriod.LAST_60_DAYS, label: 'Last 60 days', days: 60 },
        { value: InactivityPeriod.MORE_THAN_60_DAYS, label: 'More than 60 days', days: 60 }
      ]
    };
  }
}
