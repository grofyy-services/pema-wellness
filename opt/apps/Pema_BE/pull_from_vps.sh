#!/bin/bash
# Pull code from VPS to local machine

VPS_HOST="root@82.25.104.195"
VPS_DIR="/root/Pema_BE"
SSH_KEY="~/.ssh/pema_ci"

echo "📥 Pulling code from VPS"
echo "========================"

# Create backup of current local changes
echo "📦 Creating backup of local changes..."
mkdir -p backups/$(date +%Y%m%d_%H%M%S)_pre_pull
cp -r . backups/$(date +%Y%m%d_%H%M%S)_pre_pull/ 2>/dev/null || true

echo "🔄 Syncing code from VPS..."
rsync -avz --checksum --progress \
  -e "ssh -i $SSH_KEY" \
  --exclude='.git' \
  --exclude='__pycache__' \
  --exclude='*.pyc' \
  --exclude='.pytest_cache' \
  --exclude='*.log' \
  --exclude='venv' \
  --exclude='node_modules' \
  --exclude='backups/' \
  --exclude='.env*' \
  $VPS_HOST:$VPS_DIR/ \
  ./

echo ""
echo "✅ Code pulled successfully from VPS!"
echo ""
echo "📋 Files that were changed:"
git status --porcelain

echo ""
echo "💡 To revert changes if needed:"
echo "   git checkout -- <file>"
echo "   Or restore from backup in backups/ directory"
