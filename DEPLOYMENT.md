# Deployment Guide - Vercel (Frontend) + Render (Backend) + MongoDB Atlas

## Architecture
```
Vercel (Frontend)            Render (Backend)           MongoDB Atlas (Database)
├── React App         ←→     ├── Express Server   ←→    MongoDB
└── Static Files             └── API Routes
```

---

## Step 1: Set up MongoDB Atlas (Free)

1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas) and sign up
2. Create a new **FREE** cluster (M0 Sandbox - 512MB)
3. Choose a cloud provider and region (any works)
4. Wait for cluster to be created (~3 min)

### Get Connection String:
1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy the connection string:
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/thinkcraft?retryWrites=true&w=majority
   ```
4. Replace `<password>` with your actual password

### Allow Network Access:
1. Go to "Network Access" in sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (for Render)
4. Click "Confirm"

---

## Step 2: Deploy Backend to Render

1. Push your code to GitHub
2. Go to [render.com](https://render.com) and sign up
3. Click "New" → "Web Service"
4. Connect your GitHub repository
5. Configure:

| Setting | Value |
|---------|-------|
| Name | thinkcraft-backend |
| Environment | Node |
| Root Directory | (leave empty) |
| Build Command | `npm install` |
| Start Command | `npm start` |
| Plan | Free |

6. Add Environment Variables:

| Key | Value |
|-----|-------|
| `MONGODB_URI` | Your MongoDB Atlas connection string |
| `SESSION_SECRET` | Any random string (e.g., `thinkcraft-secret-2024`) |
| `NODE_ENV` | `production` |

7. Click "Create Web Service"
8. **Copy your Render URL** (e.g., `https://thinkcraft-backend.onrender.com`)

---

## Step 3: Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com) and sign up
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure:

| Setting | Value |
|---------|-------|
| Framework Preset | Vite |
| Root Directory | (leave empty) |
| Build Command | `npm run build` |
| Output Directory | `dist/public` |

5. Add Environment Variable:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | Your Render backend URL (from Step 2) |

**Example:** `VITE_API_URL=https://thinkcraft-backend.onrender.com`

6. Click "Deploy"

---

## Step 4: Update Backend CORS

After deploying to Vercel, you need to update your backend to allow requests from your Vercel domain.

1. Go to your Render dashboard
2. Add a new environment variable:

| Key | Value |
|-----|-------|
| `FRONTEND_URL` | Your Vercel URL (e.g., `https://thinkcraft.vercel.app`) |

3. Update your `server/index.ts` or wherever CORS is configured to use this variable

---

## Environment Variables Summary

### Backend (Render):
| Variable | Required | Description |
|----------|----------|-------------|
| `MONGODB_URI` | ✅ Yes | MongoDB Atlas connection string |
| `SESSION_SECRET` | ✅ Yes | Secret for session encryption |
| `NODE_ENV` | ✅ Yes | Set to `production` |
| `FRONTEND_URL` | ✅ Yes | Your Vercel frontend URL |

### Frontend (Vercel):
| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_URL` | ✅ Yes | Your Render backend URL |

---

## Free Tier Limits

### MongoDB Atlas (M0):
- 512 MB storage
- Shared RAM
- Always free!

### Render:
- 750 hours/month
- Server sleeps after 15 min inactivity
- ~30 sec cold start

### Vercel:
- 100 GB bandwidth/month
- Unlimited deployments
- Always free for personal projects!

---

## Testing

1. Visit your Vercel URL
2. Sign up a new account
3. Login
4. Add items to cart
5. Place an order
6. Check profile for order history
7. Test event registration on Students page

---

## Troubleshooting

### "Failed to execute 'json' on 'Response': Unexpected end of JSON input"
- Backend is not running or URL is wrong
- Check `VITE_API_URL` in Vercel environment variables
- Verify backend is deployed and running on Render

### "MongoDB connection failed"
- Check MONGODB_URI is correct
- Verify Network Access allows 0.0.0.0/0
- Check username/password

### "CORS errors"
- Ensure `FRONTEND_URL` is set in Render
- Check CORS configuration in backend allows your Vercel domain

### "Session not working"
- Ensure SESSION_SECRET is set
- Ensure NODE_ENV=production
- Check cookie settings for cross-origin requests

### Slow first load
- Normal for free tier (cold start on Render)
- Subsequent requests are fast

---

## Local Development

For local development, use:

**client/.env:**
```
VITE_API_URL=http://localhost:5000
```

**Root .env:**
```
MONGODB_URI=your_mongodb_connection_string
SESSION_SECRET=your_secret_key
NODE_ENV=development
```
