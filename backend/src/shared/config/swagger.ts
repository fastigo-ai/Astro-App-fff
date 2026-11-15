import swaggerUi from 'swagger-ui-express';
import { Application } from 'express';

export const swaggerSpec: any = {
  openapi: '3.0.0',
  info: {
    title: 'AstroBaby Backend REST API',
    version: '1.0.0',
    description:
      'Official Interactive API Documentation for AstroBaby (Garbh Sanskar & Holistic Parenting). Complete with OTP authentication, profile onboarding, direct Cloudinary streaming, and Redis-cached location APIs.',
    contact: {
      name: 'AstroBaby Development Team',
      email: 'vermasanjeet240@gmail.com',
    },
  },
  servers: [
    {
      url: 'http://localhost:8000',
      description: 'Local Development Server (Port 8000)',
    },
    {
      url: 'http://localhost:5000',
      description: 'Alternative Local Server (Port 5000)',
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter your JWT access token returned from /api/v1/auth/verify-otp',
      },
    },
    schemas: {
      SendOtpRequest: {
        type: 'object',
        required: ['phone'],
        properties: {
          phone: {
            type: 'string',
            example: '9366128220',
            description: 'User mobile phone number (supports test number configured in .env)',
          },
        },
      },
      VerifyOtpRequest: {
        type: 'object',
        required: ['phone', 'otp'],
        properties: {
          phone: {
            type: 'string',
            example: '9366128220',
          },
          otp: {
            type: 'string',
            example: '1234',
            description: '4-digit OTP code',
          },
        },
      },
      ProfileDetailsRequest: {
        type: 'object',
        required: ['name'],
        properties: {
          name: {
            type: 'string',
            example: 'Aaditi Sharma',
          },
          dob: {
            type: 'string',
            example: '05/14/1995',
          },
          state: {
            type: 'string',
            example: 'Maharashtra',
          },
          city: {
            type: 'string',
            example: 'Mumbai',
          },
        },
      },
      JourneyRequest: {
        type: 'object',
        required: ['stage'],
        properties: {
          stage: {
            type: 'string',
            enum: ['pregnant', 'planning'],
            example: 'pregnant',
          },
          lmp_date: {
            type: 'string',
            example: '2026-09-10',
          },
          edd_date: {
            type: 'string',
            example: '2027-06-17',
          },
          confirmed_month: {
            type: 'number',
            example: 3,
          },
          remaining_months: {
            type: 'number',
            example: 7,
          },
          planning_timeline: {
            type: 'string',
            example: '3-6 months',
          },
        },
      },
      LanguageRequest: {
        type: 'object',
        required: ['language'],
        properties: {
          language: {
            type: 'string',
            enum: ['en', 'hi'],
            example: 'hi',
          },
        },
      },
      StateItem: {
        type: 'object',
        properties: {
          name: { type: 'string', example: 'Maharashtra' },
          iso2: { type: 'string', example: 'MH' },
        },
      },
      CityItem: {
        type: 'object',
        properties: {
          name: { type: 'string', example: 'Mumbai' },
          latitude: { type: 'string', example: '19.07609000' },
          longitude: { type: 'string', example: '72.87742600' },
        },
      },
    },
  },
  paths: {
    // ==========================================
    // 1. Locations (States & Cities with Redis Cache)
    // ==========================================
    '/api/locations/states': {
      get: {
        tags: ['Locations (States & Cities)'],
        summary: 'Get all Indian States & Union Territories',
        description: 'Fetches all 36 Indian states and union territories with name and iso2 code. Cached via Redis / memory for 24 hours.',
        parameters: [
          {
            name: 'country',
            in: 'query',
            required: false,
            schema: { type: 'string', default: 'IN' },
            description: 'Country ISO-2 code (defaults to IN)',
          },
        ],
        responses: {
          200: {
            description: 'List of states with name and ISO-2 codes',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/StateItem' },
                },
              },
            },
          },
        },
      },
    },
    '/api/locations/cities/{stateCode}': {
      get: {
        tags: ['Locations (States & Cities)'],
        summary: 'Get all Cities for a specific State',
        description: 'Returns all cities in the given state (e.g. MH for Maharashtra, DL for Delhi) with geographic coordinates. Cached via Redis / memory.',
        parameters: [
          {
            name: 'stateCode',
            in: 'path',
            required: true,
            schema: { type: 'string', example: 'MH' },
            description: 'State ISO-2 code (e.g. MH, DL, UP, KA, GJ)',
          },
          {
            name: 'country',
            in: 'query',
            required: false,
            schema: { type: 'string', default: 'IN' },
            description: 'Country ISO-2 code (defaults to IN)',
          },
        ],
        responses: {
          200: {
            description: 'List of cities with coordinates',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/CityItem' },
                },
              },
            },
          },
          400: {
            description: 'Missing or invalid state code',
          },
        },
      },
    },

    // ==========================================
    // 2. Auth & Onboarding Flow
    // ==========================================
    '/api/v1/auth/send-otp': {
      post: {
        tags: ['Authentication & OTP'],
        summary: 'Send 4-Digit OTP to Phone Number',
        description: 'Dispatches OTP via Twilio (if credentials configured in .env) or Mock SMS provider. Prints OTP to terminal in dev mode.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/SendOtpRequest' },
            },
          },
        },
        responses: {
          200: {
            description: 'OTP dispatched successfully',
          },
          400: {
            description: 'Phone number is required',
          },
        },
      },
    },
    '/api/v1/auth/verify-otp': {
      post: {
        tags: ['Authentication & OTP'],
        summary: 'Verify OTP & Login / Sign-up',
        description:
          'Verifies the 4-digit code. Returns JWT tokens, user profile info, and `isNewUser: true` if the user has not completed the details form.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/VerifyOtpRequest' },
            },
          },
        },
        responses: {
          200: {
            description: 'Verified successfully. Returns accessToken, isNewUser, and user data.',
          },
          401: {
            description: 'Invalid or expired OTP',
          },
        },
      },
    },
    '/api/v1/auth/journey': {
      post: {
        tags: ['Authentication & OTP'],
        summary: 'Save Pregnancy or Conception Journey Details',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/JourneyRequest' },
            },
          },
        },
        responses: {
          200: {
            description: 'Journey saved successfully',
          },
        },
      },
    },
    '/api/v1/auth/refresh-token': {
      post: {
        tags: ['Authentication & OTP'],
        summary: 'Refresh Access Token',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['refreshToken'],
                properties: {
                  refreshToken: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'New accessToken issued',
          },
          401: {
            description: 'Invalid refresh token',
          },
        },
      },
    },

    // ==========================================
    // 3. User Profile & Avatar Cloudinary Streaming
    // ==========================================
    '/api/v1/profile': {
      get: {
        tags: ['User Profile'],
        summary: 'Get Current User Profile & Audit Details',
        security: [{ BearerAuth: [] }],
        responses: {
          200: {
            description: 'Returns profile details, avatar update count, and history',
          },
          401: {
            description: 'Unauthorized',
          },
        },
      },
    },
    '/api/v1/profile/details': {
      post: {
        tags: ['User Profile'],
        summary: 'Save Personal Onboarding Details (Name, DOB, State, City)',
        description: 'New users submit their details here to complete onboarding and mark isNewUser=false.',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ProfileDetailsRequest' },
            },
          },
        },
        responses: {
          200: {
            description: 'Profile details saved successfully',
          },
        },
      },
    },
    '/api/v1/profile/language': {
      post: {
        tags: ['User Profile'],
        summary: 'Update Language Preference (en / hi)',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/LanguageRequest' },
            },
          },
        },
        responses: {
          200: {
            description: 'Language updated successfully',
          },
        },
      },
    },
    '/api/v1/profile/avatar': {
      post: {
        tags: ['User Profile'],
        summary: 'Upload Avatar (Direct Cloudinary Streaming + Legal Update Count)',
        description:
          'Uploads profile picture directly to Cloudinary socket via Multer without buffering in Node.js RAM. Increments avatarUpdateCount and appends to avatarHistory for legal audit compliance.',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  avatar: {
                    type: 'string',
                    format: 'binary',
                    description: 'Image file (JPEG, PNG, WEBP, max 5MB)',
                  },
                },
              },
            },
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  avatar: { type: 'string', example: 'https://res.cloudinary.com/.../photo.jpg' },
                  publicId: { type: 'string', example: 'astrobaby/avatars/sample' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Avatar uploaded and update counter incremented',
          },
        },
      },
      put: {
        tags: ['User Profile'],
        summary: 'Update Avatar URL / Photo',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  avatar: { type: 'string' },
                  publicId: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Avatar updated and counter incremented',
          },
        },
      },
    },

    // ==========================================
    // 4. Courses & Masterclasses
    // ==========================================
    '/api/v1/courses': {
      get: {
        tags: ['Courses & Masterclasses'],
        summary: 'List Available Courses & Modules',
        responses: {
          200: {
            description: 'List of courses with lesson counts',
          },
        },
      },
    },
    '/api/v1/courses/{id}': {
      get: {
        tags: ['Courses & Masterclasses'],
        summary: 'Get Course Details with Lessons (Gated by Subscription)',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string', example: 'garbh_sanskar' },
          },
        ],
        responses: {
          200: {
            description: 'Course details with lessons',
          },
        },
      },
    },

    // ==========================================
    // 5. Live Classes & Recorded Sessions
    // ==========================================
    '/api/v1/classes/live': {
      get: {
        tags: ['Live & Recorded Classes'],
        summary: 'Get Upcoming Live Classes & Masterclasses',
        responses: {
          200: {
            description: 'Upcoming live sessions',
          },
        },
      },
    },
    '/api/v1/classes/recorded': {
      get: {
        tags: ['Live & Recorded Classes'],
        summary: 'Get Recorded Masterclasses Archive',
        responses: {
          200: {
            description: 'Recorded video masterclasses',
          },
        },
      },
    },

    // ==========================================
    // 6. Subscriptions & Razorpay
    // ==========================================
    '/api/v1/subscription/plans': {
      get: {
        tags: ['Subscription & Plans'],
        summary: 'Get Dynamic Subscription Plans (Utkarsh & Aadhar)',
        description: 'Calculates dynamic pricing based on gestational month (Krishna Coming formula).',
        parameters: [
          {
            name: 'month',
            in: 'query',
            schema: { type: 'number', example: 4 },
            description: 'Current pregnancy month (1-9)',
          },
        ],
        responses: {
          200: {
            description: 'Calculated pricing plans',
          },
        },
      },
    },
    '/api/v1/subscription/status': {
      get: {
        tags: ['Subscription & Plans'],
        summary: 'Get Current Subscription Status',
        security: [{ BearerAuth: [] }],
        responses: {
          200: {
            description: 'Subscription status (active, trial, none)',
          },
        },
      },
    },
  },
};

export const setupSwagger = (app: Application) => {
  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      customSiteTitle: 'AstroBaby API Docs',
      customCss: '.swagger-ui .topbar { background-color: #4F46E5; }',
    })
  );

  // Expose swagger.json endpoint
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  console.log('[Swagger] 📚 Interactive Documentation initialized at /api-docs');
};
