# NGINX Configuration Best Practices for Docker Deployments

## 🚨 Critical Configuration Rules

This guide documents common nginx configuration pitfalls and best practices to prevent deployment failures.

## 📋 Recent Critical Issues & Fixes

### Issue: "resolving names at run time requires upstream in shared memory"

** Wrong Configuration:**
```nginx
upstream pema-api {
    server api:8000 resolve;  #  INVALID: requires shared memory zone
}
```

** Correct Configuration:**
```nginx
upstream pema-api {
    server api:8000;  #  VALID: static resolution in Docker networks
}
```

**Root Cause:** The `resolve` keyword tells nginx to resolve hostnames dynamically at runtime, but this requires the upstream block to be in shared memory with a `zone` directive.

**Prevention:** In Docker environments, container names are statically resolvable. Never use `resolve` without a `zone` directive.

---

### Issue: Incorrect proxy_pass with upstream blocks

** Wrong Configuration:**
```nginx
upstream pema-api {
    server api:8000;
}

location /api/ {
    proxy_pass http://pema-api:8000;  #  INVALID: upstream name + port
}
```

** Correct Configuration:**
```nginx
upstream pema-api {
    server api:8000;
}

location /api/ {
    proxy_pass http://pema-api;  #  VALID: upstream name only
}
```

**Root Cause:** When using upstream blocks, `proxy_pass` should reference only the upstream name. The port is already defined in the upstream block.

---

## 🔧 Complete Working Configuration

### Docker nginx.conf (Container Internal)

```nginx
events {
    worker_connections 1024;
}

http {
    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;

    # Upstream for API
    upstream pema-api {
        server api:8000;  #  No 'resolve' keyword
    }

    server {
        listen 80 default_server;
        server_name _;

        # Client max body size (for file uploads)
        client_max_body_size 50M;

        # API routes
        location /api/ {
            proxy_pass http://pema-api;  #  Upstream name only
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;

            # Rate limiting
            limit_req zone=api burst=20 nodelay;

            # Timeout settings
            proxy_connect_timeout 60s;
            proxy_send_timeout 60s;
            proxy_read_timeout 60s;
        }

        # Health check
        location /health {
            rewrite ^/health$ /api/health break;
            proxy_pass http://pema-api;  #  Upstream name only
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Documentation
        location /docs {
            proxy_pass http://pema-api;  #  Upstream name only
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        location /redoc {
            proxy_pass http://pema-api;  #  Upstream name only
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # OpenAPI schema
        location = /openapi.json {
            proxy_pass http://pema-api;  #  Upstream name only
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Swagger UI
        location /swagger/ {
            proxy_pass http://pema-api/docs/;  #  Upstream name + path
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Static files
        location /static/ {
            alias /app/static/;
            expires 1y;
            add_header Cache-Control "public, immutable";
        }

        # Default location
        location / {
            return 404;
        }
    }
}
```

### System nginx.conf (Host Server)

```nginx
server {
    server_name dev.pemawellness.com;

    client_max_body_size 50M;

    # Swagger UI
    location = /swagger {
        return 301 /swagger/;
    }
    location /swagger/ {
        proxy_pass http://127.0.0.1:8080/swagger/;  #  Match Docker port
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Other API endpoints
    location /api/ {
        proxy_pass http://127.0.0.1:8080;  #  Match Docker port
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Health check
    location /health {
        rewrite ^/health$ /api/health break;
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Frontend (Next.js)
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    listen 443 ssl;
    ssl_certificate /etc/letsencrypt/live/dev.pemawellness.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/dev.pemawellness.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
}
```

## 🔍 Configuration Validation Checklist

### Before Committing nginx.conf Changes

- [ ] **Test nginx syntax**: `nginx -t -c nginx.conf`
- [ ] **Verify upstream blocks**: No `resolve` without `zone`
- [ ] **Check proxy_pass syntax**: Upstream name only (no port)
- [ ] **Validate port consistency**: Docker ports match system nginx
- [ ] **Test container startup**: `docker compose up nginx`
- [ ] **Verify API connectivity**: Test health endpoints

### Docker Deployment Checklist

- [ ] **Check container ports**: `docker compose ps`
- [ ] **Verify network connectivity**: Containers can reach each other
- [ ] **Test upstream resolution**: Container names resolve correctly
- [ ] **Validate proxy headers**: Host, X-Real-IP, X-Forwarded-For, X-Forwarded-Proto

## 🐛 Common Error Patterns & Solutions

### Error: nginx container fails to start
```
nginx: [emerg] resolving names at run time requires upstream "name" in ... to be in shared memory
```
**Solution**: Remove `resolve` keyword from upstream server directive.

### Error: 502 Bad Gateway
**Possible Causes:**
1. Upstream server not reachable
2. Incorrect proxy_pass syntax
3. Port mismatch between containers

**Debug Steps:**
1. Check container status: `docker compose ps`
2. Test internal connectivity: `docker exec -it container curl upstream:port`
3. Verify nginx logs: `docker compose logs nginx`

### Error: Connection refused
**Possible Causes:**
1. Service not running
2. Incorrect container name in upstream
3. Network isolation issues

**Debug Steps:**
1. Verify service health: `docker compose ps`
2. Test DNS resolution: `docker exec -it nginx nslookup api`
3. Check network: `docker network inspect project_default`

## 📚 Additional Resources

- [nginx upstream documentation](https://nginx.org/en/docs/http/ngx_http_upstream_module.html)
- [Docker networking guide](https://docs.docker.com/network/)
- [nginx proxy_pass best practices](https://www.nginx.com/blog/avoiding-top-10-nginx-configuration-mistakes/)

## 🚨 Emergency Recovery

If nginx configuration breaks deployment:

1. **Check logs**: `docker compose logs nginx`
2. **Restore backup**: `git checkout HEAD~1 nginx.conf`
3. **Test syntax**: `nginx -t -c nginx.conf`
4. **Restart containers**: `docker compose restart nginx`

## 📝 Change Management

**Always document nginx changes:**
- Explain why the change is needed
- Include before/after configuration snippets
- Note any port changes or upstream modifications
- Test thoroughly before committing

---

**Last Updated**: October 25, 2025
**Version**: 1.0
**Related Issues**: Deployment failures, nginx configuration errors
