# 🚀 CI/CD DEPLOYMENT SETUP GUIDE
# For Pema Wellness - GitHub Actions to VPS

##  Required GitHub Repository Secrets
# Go to: https://github.com/kundanatTDD/PemaWellness/settings/secrets/actions

### 🔑 ESSENTIAL SECRETS (Required)
SSH_PRIVATE_KEY="-----BEGIN OPENSSH PRIVATE KEY-----"
SSH_HOST="YOUR_VPS_IP_ADDRESS"  # e.g., 82.25.104.195
SSH_USER="YOUR_SSH_USERNAME"   # e.g., root, ubuntu, pema_user
SSH_PORT="22"                   # or your custom SSH port

### ⚙️ OPTIONAL SECRETS (Have Defaults)
REMOTE_PATH="/opt/apps/Pema_BE"
NGINX_HTTP_PORT_PROD_CI="8080"
FORCE_NOCACHE="true"

## 🛠️ VPS PREPARATION STEPS

### 1. Generate SSH Key for GitHub Actions
```bash
# On your local machine
ssh-keygen -t rsa -b 4096 -C 'github-actions@pemawellness.com'
ssh-copy-id -p 22 YOUR_SSH_USER@YOUR_VPS_IP

# Copy the PRIVATE key content to GitHub secret SSH_PRIVATE_KEY
cat ~/.ssh/id_rsa
```

### 2. Verify VPS Setup
```bash
# SSH to your VPS
ssh YOUR_SSH_USER@YOUR_VPS_IP

# Check Docker
docker --version
docker-compose --version
docker run hello-world

# Check directory permissions
sudo mkdir -p /opt/apps
sudo chown $USER:$USER /opt/apps

# Check ports
netstat -tlnp | grep -E ':8080|:8000|:5432'
```

### 3. Environment Variables on VPS
```bash
# Create .env file on VPS at /opt/apps/Pema_BE/.env
DATABASE_URL=postgresql+asyncpg://pema_user:YOUR_DB_PASSWORD@localhost:5432/pema_wellness
SECRET_KEY=YOUR_SECRET_KEY
PAYU_MERCHANT_KEY=YOUR_PAYU_KEY
PAYU_MERCHANT_SALT=YOUR_PAYU_SALT
# ... other required env vars
```

##  VERIFICATION CHECKLIST

- [ ] SSH key generated and added to VPS authorized_keys
- [ ] SSH connection tested: ssh -p PORT USER@HOST
- [ ] Docker and docker-compose installed on VPS
- [ ] /opt/apps directory exists with proper permissions
- [ ] Port 8080 available for health checks
- [ ] Database and Redis running and accessible
- [ ] Environment variables configured on VPS
- [ ] GitHub repository secrets added

## 🎯 DEPLOYMENT TRIGGER

Once secrets are configured, any push to `main` branch will:
1.  Trigger GitHub Actions workflow
2.  SSH to your VPS
3.  Sync code via rsync
4.  Build Docker containers
5.  Run health checks
6.  Deploy successfully

## 🔍 TROUBLESHOOTING

### If deployment fails:
1. Check GitHub Actions logs: https://github.com/kundanatTDD/PemaWellness/actions
2. SSH to VPS and check Docker logs: docker-compose logs
3. Verify secrets are set correctly in GitHub
4. Test SSH connection manually

### Common issues:
- SSH key not added to VPS authorized_keys
- Wrong SSH port or hostname
- Docker not installed on VPS
- Database not running during startup (now fixed with graceful fallback)
- Environment variables missing on VPS

---
**Status**:  Code ready,  Workflow syntax fixed, ⏳ GitHub secrets needed

