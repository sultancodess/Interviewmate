# 🚀 InterviewMate Deployment Guide

## Production Deployment Checklist

### 1. Environment Setup

#### Required Environment Variables
```bash
# Copy and configure production environment
cp server/.env.production server/.env
```

**Critical Variables to Update:**
- `MONGODB_URI` - Production MongoDB connection string
- `JWT_SECRET` - Strong 32+ character secret
- `GEMINI_API_KEY` - Production Google Gemini API key
- `VAPI_PRIVATE_API_KEY` - Production VAPI private key
- `VAPI_PUBLIC_API_KEY` - Production VAPI public key
- `RAZORPAY_KEY_ID` - Live Razorpay key ID
- `RAZORPAY_KEY_SECRET` - Live Razorpay secret
- `EMAIL_USER` - Production email credentials
- `CLIENT_URL` - Your production domain

### 2. Database Setup

#### MongoDB Atlas (Recommended)
1. Create MongoDB Atlas cluster
2. Configure network access (whitelist your server IP)
3. Create database user with read/write permissions
4. Update `MONGODB_URI` in environment variables

#### Self-hosted MongoDB
```bash
# Using Docker
docker run -d --name mongodb \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=your_password \
  -v mongodb_data:/data/db \
  mongo:7.0
```

### 3. SSL Certificate Setup

#### Using Let's Encrypt (Free)
```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Generate certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

#### Using Custom Certificate
```bash
# Place your certificates
mkdir ssl
cp your_certificate.pem ssl/cert.pem
cp your_private_key.key ssl/private.key
```

### 4. Docker Deployment (Recommended)

#### Build and Deploy
```bash
# Clone repository
git clone https://github.com/yourusername/interviewmate.git
cd interviewmate

# Configure environment
cp server/.env.production server/.env
# Edit server/.env with your production values

# Build and start services
docker-compose up -d --build

# Check status
docker-compose ps
docker-compose logs app
```

#### Docker Commands
```bash
# View logs
docker-compose logs -f app

# Restart services
docker-compose restart app

# Update application
git pull
docker-compose build app
docker-compose up -d app

# Backup database
docker-compose exec mongodb mongodump --out /backup

# Scale application (if needed)
docker-compose up -d --scale app=3
```

### 5. Manual Deployment

#### Server Setup (Ubuntu/Debian)
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Install Nginx
sudo apt install nginx

# Clone and setup application
git clone https://github.com/yourusername/interviewmate.git
cd interviewmate
npm run install:all
npm run build
```

#### PM2 Configuration
```bash
# Create PM2 ecosystem file
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'interviewmate',
    script: 'server/server.js',
    cwd: '/path/to/interviewmate',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
}
EOF

# Start application
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

#### Nginx Configuration
```bash
# Copy nginx configuration
sudo cp nginx.conf /etc/nginx/sites-available/interviewmate
sudo ln -s /etc/nginx/sites-available/interviewmate /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default

# Test and reload nginx
sudo nginx -t
sudo systemctl reload nginx
```

### 6. Admin Setup

#### Create Admin User
```bash
# Using Docker
docker-compose exec app npm run setup:admin

# Manual deployment
cd server && npm run setup:admin
```

**Default Admin Credentials:**
- Email: `admin@interviewmate.com`
- Password: `admin123456`

**⚠️ IMPORTANT: Change admin password immediately after first login!**

### 7. Monitoring & Maintenance

#### Health Checks
```bash
# Application health
curl https://yourdomain.com/api/health

# Database connection
curl https://yourdomain.com/api/admin/health
```

#### Log Monitoring
```bash
# Docker logs
docker-compose logs -f app

# PM2 logs
pm2 logs interviewmate

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

#### Database Backup
```bash
# Automated backup script
cat > backup.sh << EOF
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mongodump --uri="$MONGODB_URI" --out="/backups/backup_$DATE"
find /backups -name "backup_*" -mtime +7 -exec rm -rf {} \;
EOF

chmod +x backup.sh

# Add to crontab for daily backups
crontab -e
# Add: 0 2 * * * /path/to/backup.sh
```

### 8. Performance Optimization

#### Enable Gzip Compression
Already configured in nginx.conf

#### Database Indexing
```javascript
// Run in MongoDB shell
db.users.createIndex({ email: 1 })
db.users.createIndex({ createdAt: -1 })
db.interviews.createIndex({ userId: 1, createdAt: -1 })
db.interviews.createIndex({ status: 1 })
```

#### CDN Setup (Optional)
```bash
# Configure CDN for static assets
# Update CLIENT_URL and CDN_URL in environment variables
```

### 9. Security Hardening

#### Firewall Configuration
```bash
# UFW (Ubuntu)
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable

# Fail2ban for SSH protection
sudo apt install fail2ban
```

#### Environment Security
```bash
# Secure environment file
chmod 600 server/.env
chown root:root server/.env

# Regular security updates
sudo apt update && sudo apt upgrade -y
```

### 10. Scaling Considerations

#### Load Balancing
```nginx
# Add to nginx.conf upstream block
upstream interviewmate_backend {
    server app1:5000;
    server app2:5000;
    server app3:5000;
}
```

#### Database Scaling
- MongoDB Atlas auto-scaling
- Read replicas for read-heavy operations
- Sharding for large datasets

#### Caching
- Redis for session storage
- CDN for static assets
- Application-level caching

### 11. Troubleshooting

#### Common Issues

**Application won't start:**
```bash
# Check logs
docker-compose logs app
# or
pm2 logs interviewmate

# Check environment variables
docker-compose exec app env | grep -E "(MONGODB|JWT|GEMINI)"
```

**Database connection issues:**
```bash
# Test MongoDB connection
docker-compose exec app node -e "
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected'))
  .catch(err => console.error('Error:', err));
"
```

**File upload issues:**
```bash
# Check upload directory permissions
ls -la uploads/
chmod 755 uploads/
```

**SSL certificate issues:**
```bash
# Check certificate validity
openssl x509 -in ssl/cert.pem -text -noout

# Test SSL configuration
curl -I https://yourdomain.com
```

### 12. Maintenance Tasks

#### Weekly Tasks
- Review application logs
- Check disk space usage
- Monitor database performance
- Update dependencies (if needed)

#### Monthly Tasks
- Security updates
- Database optimization
- Backup verification
- Performance analysis

#### Quarterly Tasks
- SSL certificate renewal (if not automated)
- Dependency security audit
- Capacity planning review
- Disaster recovery testing

### 13. Support & Documentation

#### Useful Commands
```bash
# Application status
docker-compose ps
pm2 status

# Resource usage
docker stats
htop

# Database status
docker-compose exec mongodb mongo --eval "db.stats()"

# Nginx status
sudo systemctl status nginx
```

#### Log Locations
- Application: `/var/log/interviewmate/` or `docker-compose logs`
- Nginx: `/var/log/nginx/`
- System: `/var/log/syslog`

For additional support, check the GitHub repository issues or contact the development team.

---

## Quick Start Commands

```bash
# Complete deployment in one go
git clone https://github.com/yourusername/interviewmate.git
cd interviewmate
cp server/.env.production server/.env
# Edit server/.env with your values
docker-compose up -d --build
docker-compose exec app npm run setup:admin
```

Your InterviewMate application should now be running at `https://yourdomain.com`! 🎉