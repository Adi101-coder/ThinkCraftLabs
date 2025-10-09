# ThinkCraft Lab

A modern React application built with Vite, featuring advanced animations and smooth scrolling experiences.

## 🚀 Quick Start

### Development
```bash
npm install
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```

## 📦 Deployment

### Deploy to Vercel

1. **Via GitHub (Recommended)**
   - Push your code to GitHub
   - Connect your repository to Vercel
   - Vercel will automatically detect the configuration

2. **Via Vercel CLI**
   ```bash
   npm install -g vercel
   vercel
   ```

3. **Manual Upload**
   ```bash
   npm run build
   # Upload the dist/public folder to Vercel
   ```

### Configuration

The project includes:
- `vercel.json` - Vercel deployment configuration
- Proper SPA routing setup
- Optimized build settings

## 🛠 Tech Stack

- **Frontend**: React 18, TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Animations**: GSAP, Framer Motion
- **UI Components**: Radix UI
- **Deployment**: Vercel

## 📁 Project Structure

```
ThinkCraftLab/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── ...
│   └── public/
├── server/ (if applicable)
├── vercel.json
└── package.json
```

## 🔧 Environment Variables

No environment variables required for basic deployment.

## 📱 Features

- Responsive design
- Smooth scrolling animations
- Interactive components
- Modern UI/UX
- Performance optimized

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request