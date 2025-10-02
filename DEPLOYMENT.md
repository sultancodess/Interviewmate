# InterviewMate Deployment Guide

This guide provides comprehensive instructions for deploying InterviewMate to production environments.

## 🚀 Quick Deployment Options

### Option 1: Vercel + Railway (Recommended)
- **Frontend**: Vercel (Free tier available)
- **Backend**: Railway (Free tier available)
- **Database**: MongoDB Atlas (Free tier available)

### Option 2: Netlify + Render
- **Frontend**: Netlify (Free tier available)
- **Backend**: Render (Free tier available)
- **Database**: MongoDB Atlas (Free tier available)

### Option 3: Full Cloud Deployment
- **Frontend**: AWS S3 + CloudFront
- **Backend**: AWS EC2 or ECS
- **Database**: MongoDB Atlas or AWS DocumentDB

## 📋 Pre-Deployment Checklist

### 1. Environment Setup
- [ ] All environment variables configured
- [ ] API keys obtained and tested
- [ ] Database connection string ready
- [ ] Domain names purchased (if needed)
- [ ] SSL certificates configured

### 2. Code Preparation
- [ ] All features tested locally
- [ ] Production build successful
- [ ] No console errors or warnings
- [ ] Security audit passed
- [ ] Performance optimization completed

### 3. External Services
- [ ] MongoDB Atlas cluster created
- [ ] Google Gemini AI API enabled
- [ ] VAPI AI account configured
- [ ] Razorpay account setup
- [ ] Email service configured
- [ ] Google OAuth configured

## 🔧 Environment Configuration

### Production Environment Variables

#### Server (.env)
```bash
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/interviewmate-prod

# JWT
JWT_SECRET=your_production_jwt_secret_minimum_64_characters_long_for_security
JWT_EXPIRE=7d

# Google Gemini AI
GEMINI_API_KEY=your_production_gemini_api_key
GEMINI_MODEL=gemini-1.5-flash
GEMINI_REQUESTS_PER_MINUTE=60
GEMINI_REQUESTS_PER_DAY=1000

# VAPI AI
VAPI_PRIVATE_API_KEY=your_production_vapi_private_key
VAPI_PUBLIC_API_KEY=your_production_vapi_public_key
VAPI_HR_ASSISTANT_ID=your_production_hr_assistant_id
VAPI_TECHNICAL_ASSISTANT_ID=your_production_technical_assistant_id
VAPI_MANAGERIAL_ASSISTANT_ID=your_production_managerial_assistant_id
VAPI_CUSTOM_ASSISTANT_ID=your_production_custom_assistant_id
VAPI_WEBHOOK_URL=https://your-api-domain.com/api/interview/vapi-webhook

# Razorpay
RAZORPAY_KEY_ID=your_production_razorpay_key_id
RAZORPAY_KEY_SECRET=your_production_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=your_production_webhook_secret

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_production_email@gmail.com
EMAIL_PASS=your_production_app_password
EMAIL_FROM=InterviewMate <noreply@interviewmate.com>

# Google OAuth
GOOGLE_CLIENT_ID=your_production_google_client_id
GOOGLE_CLIENT_SECRET=your_production_google_client_secret

# Server Configuration
PORT=5001
CLIENT_URL=https://your-frontend-domain.com
NODE_ENV=production

# Security
CORS_ORIGIN=https://your-frontend-domain.com
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_PATH=uploads/
```

#### Client (.env)
```bash
# API Configuration
VITE_API_URL=https://your-api-domain.com/api

# VAPI AI (Public Keys Only)
VITE_VAPI_PUBLIC_KEY=your_production_vapi_public_key
VITE_VAPI_HR_ASSISTANT_ID=your_production_hr_assistant_id
VITE_VAPI_TECHNICAL_ASSISTANT_ID=your_production_technical_assistant_id
VITE_VAPI_MANAGERIAL_ASSISTANT_ID=your_production_managerial_assistant_id
VITE_VAPI_CUSTOM_ASSISTANT_ID=your_production_custom_assistant_id

# Google OAuth (Public ID Only)
VITE_GOOGLE_CLIENT_ID=your_production_google_client_id

# Razorpay (Public Key Only)
VITE_RAZORPAY_KEY_ID=your_production_razorpay_key_id

# Feature Flags
VITE_ENABLE_WEB_SPEECH_FALLBACK=true
VITE_ENABLE_GOOGLE_OAUTH=true

# Analytics (Optional)
VITE_GOOGLE_ANALYTICS_ID=your_ga_tracking_id
VITE_SENTRY_DSN=your_sentry_dsn

# Environment
VITE_NODE_ENV=production
```

## 🌐 Frontend Deployment

### Vercel Deployment

1. **Connect Repository**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Login to Vercel
   vercel login
   
   # Deploy from project root
   vercel
   ```

2. **Configure Build Settings**
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

3. **Environment Variables**
   Add all `VITE_*` variables in Vercel dashboard

4. **Custom Domain** (Optional)
   - Add your domain in Vercel dashboard
   - Configure DNS records

### Netlify Deployment

1. **Connect Repository**
   - Go to Netlify dashboard
   - Click "New site from Git"
   - Connect your repository

2. **Build Settings**
   - **Base directory**: `client`
   - **Build command**: `npm run build`
   - **Publish directory**: `client/dist`

3. **Environment Variables**
   Add all `VITE_*` variables in Netlify dashboard

4. **Redirects Configuration**
   Create `client/public/_redirects`:
   ```
   /*    /index.html   200
   ```

## 🖥️ Backend Deployment

### Railway Deployment

1. **Connect Repository**
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli
   
   # Login to Railway
   railway login
   
   # Initialize project
   railway init
   
   # Deploy
   railway up
   ```

2. **Configure Service**
   - **Root Directory**: `server`
   - **Start Command**: `npm start`
   - **Port**: `$PORT` (Railway provides this)

3. **Environment Variables**
   Add all server environment variables in Railway dashboard

4. **Custom Domain** (Optional)
   - Add custom domain in Railway dashboard
   - Configure DNS records

### Render Deployment

1. **Connect Repository**
   - Go to Render dashboard
   - Click "New Web Service"
   - Connect your repository

2. **Build Settings**
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

3. **Environment Variables**
   Add all server environment variables in Render dashboard

## 🗄️ Database Setup

### MongoDB Atlas

1. **Create Cluster**
   - Go to MongoDB Atlas
   - Create new cluster (M0 for free tier)
   - Choose region closest to your backend

2. **Configure Security**
   - Create database user
   - Add IP addresses to whitelist (0.0.0.0/0 for all IPs)
   - Enable authentication

3. **Get Connection String**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database password

4. **Create Database**
   ```javascript
   // Database will be created automatically
   // Collections: users, interviews, payments, reports
   ```

## 🔐 Security Configuration

### SSL/TLS Setup
- **Vercel/Netlify**: Automatic HTTPS
- **Custom Domain**: Configure SSL certificate
- **API Endpoints**: Ensure all endpoints use HTTPS

### CORS Configuration
```javascript
// server/server.js
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
```

### Rate Limiting
```javascript
// Adjust for production load
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Increase for production
  message: 'Too many requests from this IP'
})
```

## 📊 Monitoring & Analytics

### Application Monitoring

1. **Health Checks**
   ```bash
   # Add to your monitoring service
   curl -f https://your-api-domain.com/api/health
   ```

2. **Error Tracking**
   ```javascript
   // Add Sentry for error tracking
   import * as Sentry from "@sentry/node"
   
   Sentry.init({
     dsn: process.env.SENTRY_DSN,
     environment: process.env.NODE_ENV
   })
   ```

3. **Performance Monitoring**
   - Use Railway/Render built-in metrics
   - Add custom metrics for business KPIs
   - Monitor API response times

### Business Analytics

1. **Google Analytics**
   ```javascript
   // Add to client/index.html
   <script async src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID"></script>
   ```

2. **Custom Analytics**
   - Track interview completions
   - Monitor user engagement
   - Analyze conversion rates

## 🚀 Deployment Scripts

### Automated Deployment

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Install dependencies
        run: cd client && npm install
      - name: Build
        run: cd client && npm run build
        env:
          VITE_API_URL: ${{ secrets.VITE_API_URL }}
          VITE_VAPI_PUBLIC_KEY: ${{ secrets.VITE_VAPI_PUBLIC_KEY }}
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          working-directory: ./client

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Railway
        uses: railway-app/railway-action@v1
        with:
          api-token: ${{ secrets.RAILWAY_TOKEN }}
          service: your-service-name
```

## 🧪 Production Testing

### Pre-Launch Checklist

1. **Functionality Testing**
   - [ ] User registration and login
   - [ ] Google OAuth flow
   - [ ] Interview creation and setup
   - [ ] Voice interview (both modes)
   - [ ] AI evaluation generation
   - [ ] PDF report download
   - [ ] Payment processing
   - [ ] Email notifications

2. **Performance Testing**
   - [ ] Page load times < 3 seconds
   - [ ] API response times < 500ms
   - [ ] Database query optimization
   - [ ] CDN configuration for static assets

3. **Security Testing**
   - [ ] HTTPS enforcement
   - [ ] Input validation
   - [ ] Authentication flows
   - [ ] Rate limiting
   - [ ] CORS configuration

4. **Mobile Testing**
   - [ ] Responsive design
   - [ ] Touch interactions
   - [ ] Voice recording on mobile
   - [ ] Performance on mobile networks

## 🔄 Post-Deployment

### Monitoring Setup

1. **Uptime Monitoring**
   ```bash
   # Use services like UptimeRobot or Pingdom
   # Monitor these endpoints:
   # - https://your-frontend-domain.com
   # - https://your-api-domain.com/api/health
   ```

2. **Log Monitoring**
   ```javascript
   // Centralized logging
   import winston from 'winston'
   
   const logger = winston.createLogger({
     level: 'info',
     format: winston.format.json(),
     transports: [
       new winston.transports.File({ filename: 'error.log', level: 'error' }),
       new winston.transports.File({ filename: 'combined.log' })
     ]
   })
   ```

3. **Database Monitoring**
   - Monitor connection pool usage
   - Track query performance
   - Set up automated backups

### Backup Strategy

1. **Database Backups**
   ```bash
   # MongoDB Atlas automatic backups
   # Or manual backup script
   mongodump --uri="your_mongodb_uri" --out=backup_$(date +%Y%m%d)
   ```

2. **File Backups**
   ```bash
   # Backup uploaded files
   aws s3 sync uploads/ s3://your-backup-bucket/uploads/
   ```

### Scaling Considerations

1. **Horizontal Scaling**
   - Use load balancers for multiple server instances
   - Implement session storage (Redis)
   - Database read replicas

2. **Vertical Scaling**
   - Monitor resource usage
   - Upgrade server specifications as needed
   - Optimize database queries

3. **CDN Setup**
   - Use CloudFront or similar for static assets
   - Cache API responses where appropriate
   - Optimize image delivery

## 🆘 Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   # Clear cache and reinstall
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```

2. **Environment Variable Issues**
   ```bash
   # Verify all required variables are set
   node -e "console.log(process.env.MONGODB_URI ? 'DB OK' : 'DB Missing')"
   ```

3. **CORS Errors**
   ```javascript
   // Ensure CLIENT_URL matches exactly
   // Include protocol (https://)
   // No trailing slash
   ```

4. **Database Connection Issues**
   ```bash
   # Test connection
   mongosh "your_mongodb_uri"
   ```

### Performance Issues

1. **Slow API Responses**
   - Add database indexes
   - Implement caching
   - Optimize queries
   - Use connection pooling

2. **High Memory Usage**
   - Monitor memory leaks
   - Optimize image processing
   - Implement garbage collection

3. **Slow Frontend Loading**
   - Enable compression
   - Optimize bundle size
   - Use lazy loading
   - Implement service workers

## 📞 Support

### Getting Help
- **Documentation**: Check deployment logs
- **Community**: GitHub Discussions
- **Professional**: Contact support team

### Monitoring Alerts
Set up alerts for:
- Server downtime
- High error rates
- Database connection issues
- Payment processing failures
- High resource usage

---

**Congratulations!** 🎉 Your InterviewMate platform is now deployed and ready to help job seekers practice their interview skills with AI-powered assistance.

Remember to:
- Monitor your application regularly
- Keep dependencies updated
- Backup your data
- Scale as your user base grows
- Continuously improve based on user feedback