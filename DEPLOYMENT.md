# Deployment Guide - Render + Neon

## Architecture
```
Render (Full Stack)          Neon (Database)
├── Express Server    ←→     PostgreSQL
├── API Routes
└── React Frontend
```

---

## Step 1: Set up Neon Database

1. Go to [neon.tech](https://neon.tech) and sign up (free)
2. Click "Create Project"
3. Choose a project name and region
4. Once created, go to "Connection Details"
5. Copy the connection string:
   ```
   postgresql://username:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require
   ```

---

## Step 2: Push Database Schema

Before deploying, push your schema to Neon:

```bash
# Set your Neon DATABASE_URL
set DATABASE_URL=postgresql://username:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require

# Push schema to database
npx drizzle-kit push
```

You should see tables created: users, orders, order_items, coupons, etc.

---

## Step 3: Deploy to Render

1. Push your code to GitHub
2. Go to [render.com](https://render.com) and sign up (free)
3. Click "New" → "Web Service"
4. Connect your GitHub repository
5. Configure the service:

| Setting | Value |
|---------|-------|
| Name | thinkcraft-lab |
| Environment | Node |
| Build Command | `npm install && npm run build` |
| Start Command | `npm start` |
| Plan | Free |

6. Add Environment Variables (click "Advanced" → "Add Environment Variable"):

| Key | Value |
|-----|-------|
| `DATABASE_URL` | Your Neon connection string |
| `SESSION_SECRET` | Any random string (e.g., `mysupersecretkey123`) |
| `NODE_ENV` | `production` |

7. Click "Create Web Service"
8. Wait for deployment (takes 2-5 minutes)

---

## Step 4: Test Your Deployment

1. Once deployed, Render gives you a URL like: `https://thinkcraft-lab.onrender.com`
2. Visit the URL
3. Try:
   - Sign up a new account
   - Login
   - Add items to cart
   - Place an order
   - Check profile for order history

---

## Environment Variables Summary

| Variable | Where to Get |
|----------|--------------|
| `DATABASE_URL` | Neon Dashboard → Connection Details |
| `SESSION_SECRET` | Generate any random string |
| `NODE_ENV` | Set to `production` |

---

## Free Tier Limitations

### Render Free Tier
- Server sleeps after 15 minutes of inactivity
- First request after sleep takes ~30 seconds
- 750 hours/month (enough for one service)

### Neon Free Tier
- 512 MB storage
- Compute auto-suspends after 5 min inactivity
- 191 compute hours/month

---

## Troubleshooting

### "Database connection failed"
- Check DATABASE_URL is correct
- Make sure `?sslmode=require` is at the end
- Verify Neon project is active

### "Session not persisting"
- Make sure SESSION_SECRET is set
- Check NODE_ENV is set to `production`

### Slow first load
- Normal for free tier - server is waking up
- Subsequent requests will be fast

---

## Updating Your App

1. Make changes locally
2. Push to GitHub
3. Render auto-deploys from your main branch

---

## Custom Domain (Optional)

1. In Render dashboard, go to your service
2. Click "Settings" → "Custom Domains"
3. Add your domain
4. Update DNS records as instructed
