# Deployment Guide - Render + MongoDB Atlas

## Architecture
```
Render (Full Stack)          MongoDB Atlas (Database)
├── Express Server    ←→     MongoDB
├── API Routes
└── React Frontend
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

## Step 2: Deploy to Render

1. Push your code to GitHub
2. Go to [render.com](https://render.com) and sign up
3. Click "New" → "Web Service"
4. Connect your GitHub repository
5. Configure:

| Setting | Value |
|---------|-------|
| Name | thinkcraft-lab |
| Environment | Node |
| Build Command | `npm install && npm run build` |
| Start Command | `npm start` |
| Plan | Free |

6. Add Environment Variables:

| Key | Value |
|-----|-------|
| `MONGODB_URI` | Your MongoDB Atlas connection string |
| `SESSION_SECRET` | Any random string |
| `NODE_ENV` | `production` |

7. Click "Create Web Service"

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGODB_URI` | ✅ Yes | MongoDB Atlas connection string |
| `SESSION_SECRET` | ✅ Yes | Secret for session encryption |
| `NODE_ENV` | ✅ Yes | Set to `production` |

### Example Values:
```
MONGODB_URI=mongodb+srv://adit:mypassword123@cluster0.abc123.mongodb.net/thinkcraft?retryWrites=true&w=majority
SESSION_SECRET=thinkcraft-super-secret-2024
NODE_ENV=production
```

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

---

## Testing

1. Visit your Render URL
2. Sign up a new account
3. Login
4. Add items to cart
5. Place an order
6. Check profile for order history

---

## Troubleshooting

### "MongoDB connection failed"
- Check MONGODB_URI is correct
- Verify Network Access allows 0.0.0.0/0
- Check username/password

### "Session not working"
- Ensure SESSION_SECRET is set
- Ensure NODE_ENV=production

### Slow first load
- Normal for free tier (cold start)
- Subsequent requests are fast
