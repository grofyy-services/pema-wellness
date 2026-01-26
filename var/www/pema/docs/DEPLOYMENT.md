# Deployment Guide

This document provides comprehensive instructions for deploying the Pema Wellness website to production environments.

## 🚀 Deployment Overview

The Pema Wellness website is built with Next.js 15 and can be deployed to various platforms. The project includes optimized build configurations and deployment scripts.

## 📋 Prerequisites

### System Requirements
- Node.js 18+ (LTS recommended)
- npm, yarn, or pnpm
- Git
- PM2 (for production server management)
- SSL certificate (for HTTPS)

### Environment Setup
- Production server with sufficient resources
- Domain name configured
- DNS records pointing to server
- SSL certificate installed

## 🔧 Environment Configuration

### Environment Variables

Create a `.env.production` file with the following variables:

```env
# Application
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://pemawellness.com
NEXT_PUBLIC_API_URL=https://api.pemawellness.com

# Database (if applicable)
DATABASE_URL=your_database_connection_string

# API Keys
NEXT_PUBLIC_API_KEY=your_public_api_key
API_SECRET_KEY=your_secret_api_key

# Email Service
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password

# Payment Gateway (if applicable)
STRIPE_PUBLIC_KEY=your_stripe_public_key
STRIPE_SECRET_KEY=your_stripe_secret_key

# Analytics
GOOGLE_ANALYTICS_ID=your_ga_id
GOOGLE_TAG_MANAGER_ID=your_gtm_id

# Social Media
FACEBOOK_APP_ID=your_facebook_app_id
INSTAGRAM_ACCESS_TOKEN=your_instagram_token

# Monitoring
SENTRY_DSN=your_sentry_dsn
```

### Next.js Configuration

Update `next.config.ts` for production:

```typescript
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Enable compression
  compress: true,
  
  // Optimize images
  images: {
    domains: ['pemawellness.com', 'api.pemawellness.com'],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },
  
  // Redirects
  async redirects() {
    return [
      {
        source: '/old-page',
        destination: '/new-page',
        permanent: true,
      },
    ]
  },
  
  // Rewrites for API routes
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://api.pemawellness.com/:path*',
      },
    ]
  },
}

export default nextConfig
```

## 🏗️ Build Process

### Production Build

1. **Install Dependencies**
   ```bash
   npm ci --production
   ```

2. **Build Application**
   ```bash
   npm run build
   ```

3. **Verify Build**
   ```bash
   npm run start
   ```

### Build Optimization

The build process includes:
- TypeScript compilation
- CSS optimization with Tailwind
- Image optimization
- Bundle analysis
- Static generation for static pages

## 🐳 Docker Deployment

### Dockerfile

Create a `Dockerfile` in the project root:

```dockerfile
# Use Node.js LTS
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci --only=production

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the application
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### Docker Compose

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  pema-website:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_APP_URL=https://pemawellness.com
    volumes:
      - ./.env.production:/app/.env.production
    restart: unless-stopped
    
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - pema-website
    restart: unless-stopped
```

## 🌐 Nginx Configuration

### nginx.conf

```nginx
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;
    
    # Logging
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';
    
    access_log /var/log/nginx/access.log main;
    error_log /var/log/nginx/error.log;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript 
               application/javascript application/xml+rss 
               application/json image/svg+xml;
    
    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=login:10m rate=1r/s;
    
    # Upstream
    upstream nextjs_upstream {
        server pema-website:3000;
    }
    
    # HTTP to HTTPS redirect
    server {
        listen 80;
        server_name pemawellness.com www.pemawellness.com;
        return 301 https://$server_name$request_uri;
    }
    
    # HTTPS server
    server {
        listen 443 ssl http2;
        server_name pemawellness.com www.pemawellness.com;
        
        # SSL configuration
        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
        ssl_prefer_server_ciphers off;
        
        # Security headers
        add_header X-Frame-Options DENY;
        add_header X-Content-Type-Options nosniff;
        add_header X-XSS-Protection "1; mode=block";
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
        
        # Static files
        location /_next/static/ {
            alias /app/.next/static/;
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
        
        location /images/ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
        
        # API routes
        location /api/ {
            limit_req zone=api burst=20 nodelay;
            proxy_pass http://nextjs_upstream;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }
        
        # Main application
        location / {
            proxy_pass http://nextjs_upstream;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }
    }
}
```

## 🚀 Deployment Methods

### Method 1: PM2 Deployment

1. **Install PM2**
   ```bash
   npm install -g pm2
   ```

2. **Create PM2 Ecosystem File**
   Create `ecosystem.config.js`:
   ```javascript
   module.exports = {
     apps: [{
       name: 'pema-website',
       script: 'npm',
       args: 'start',
       cwd: '/path/to/pema-wellness/pema',
       instances: 'max',
       exec_mode: 'cluster',
       env: {
         NODE_ENV: 'production',
         PORT: 3000
       },
       error_file: './logs/err.log',
       out_file: './logs/out.log',
       log_file: './logs/combined.log',
       time: true
     }]
   }
   ```

3. **Deploy with PM2**
   ```bash
   pm2 start ecosystem.config.js
   pm2 save
   pm2 startup
   ```

### Method 2: Docker Deployment

1. **Build Docker Image**
   ```bash
   docker build -t pema-website .
   ```

2. **Run Container**
   ```bash
   docker run -d \
     --name pema-website \
     -p 3000:3000 \
     -e NODE_ENV=production \
     pema-website
   ```

3. **Docker Compose**
   ```bash
   docker-compose up -d
   ```

### Method 3: Vercel Deployment

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   vercel --prod
   ```

3. **Configure Environment Variables**
   ```bash
   vercel env add NEXT_PUBLIC_APP_URL
   vercel env add API_SECRET_KEY
   # Add other environment variables
   ```

## 🔄 CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm run test
    
    - name: Build application
      run: npm run build
    
    - name: Deploy to server
      uses: appleboy/ssh-action@v0.1.5
      with:
        host: ${{ secrets.HOST }}
        username: ${{ secrets.USERNAME }}
        key: ${{ secrets.SSH_KEY }}
        script: |
          cd /path/to/pema-wellness/pema
          git pull origin main
          npm ci --production
          npm run build
          pm2 restart pema-website
```

## 📊 Monitoring and Logging

### Application Monitoring

1. **PM2 Monitoring**
   ```bash
   pm2 monit
   pm2 logs pema-website
   ```

2. **Health Check Endpoint**
   Create `app/api/health/route.ts`:
   ```typescript
   export async function GET() {
     return Response.json({ 
       status: 'healthy', 
       timestamp: new Date().toISOString() 
     })
   }
   ```

### Log Management

1. **Log Rotation**
   ```bash
   pm2 install pm2-logrotate
   pm2 set pm2-logrotate:max_size 10M
   pm2 set pm2-logrotate:retain 30
   ```

2. **Centralized Logging**
   - Use ELK Stack (Elasticsearch, Logstash, Kibana)
   - Or cloud solutions like AWS CloudWatch, Datadog

## 🔒 Security Considerations

### SSL/TLS
- Use Let's Encrypt for free SSL certificates
- Implement HSTS headers
- Regular certificate renewal

### Firewall
```bash
# Allow only necessary ports
ufw allow 22    # SSH
ufw allow 80    # HTTP
ufw allow 443   # HTTPS
ufw enable
```

### Security Headers
- Implement CSP (Content Security Policy)
- Set security headers in Nginx
- Regular security updates

## 📈 Performance Optimization

### Caching Strategy
- Browser caching for static assets
- CDN for global content delivery
- Redis for session storage

### Database Optimization
- Connection pooling
- Query optimization
- Regular maintenance

### Monitoring
- Set up uptime monitoring
- Performance metrics tracking
- Error rate monitoring

## 🚨 Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Check for TypeScript errors

2. **Runtime Errors**
   - Check PM2 logs: `pm2 logs pema-website`
   - Verify environment variables
   - Check database connectivity

3. **Performance Issues**
   - Monitor server resources
   - Check Nginx configuration
   - Optimize database queries

### Rollback Procedure

1. **PM2 Rollback**
   ```bash
   pm2 stop pema-website
   git checkout previous-commit
   npm ci --production
   npm run build
   pm2 start pema-website
   ```

2. **Docker Rollback**
   ```bash
   docker stop pema-website
   docker run -d --name pema-website previous-image
   ```

## 📞 Support

For deployment issues or questions:
- Check application logs
- Review server resources
- Contact development team
- Refer to Next.js deployment documentation
