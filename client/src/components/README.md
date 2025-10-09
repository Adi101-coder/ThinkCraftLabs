# ThreePanelShowcase Component

A production-ready React + TypeScript component that displays a responsive grid of media cards with smooth hover effects and scroll animations.

## Features

- ✨ **Smooth hover tilt effects** with requestAnimationFrame animation
- 🎬 **Support for images and videos** with lazy loading
- 📱 **Fully responsive** with mobile-optimized behavior
- ♿ **Accessible** with ARIA labels and keyboard navigation
- 🎨 **Customizable** styling with CSS variables
- 🚀 **Performance optimized** with IntersectionObserver and reduced motion support

## Props

```typescript
type Panel = {
  id: string;
  mediaType: 'image' | 'video';
  src: string;
  poster?: string;       // for video or fallback
  caption?: string;      // bottom-left large caption
  alt?: string;         // accessibility text
}

type ThreePanelShowcaseProps = {
  panels: [Panel, Panel, Panel];     // exactly 3 panels
  sectionHeightVH?: number;          // default 100vh
  cardRadiusPx?: number;             // default 28px
  hoverTiltStrength?: number;        // default 12 (degrees)
  enableCenterSticky?: boolean;      // default false
  className?: string;                // additional CSS classes
}
```

## Basic Usage

```tsx
import { ThreePanelShowcase } from './components/ThreePanelShowcase';

const panels = [
  {
    id: 'panel-1',
    mediaType: 'image' as const,
    src: '/images/image1.jpg',
    caption: 'Precision Engineering',
    alt: '3D printed components'
  },
  {
    id: 'panel-2',
    mediaType: 'video' as const,
    src: '/videos/demo.mp4',
    poster: '/images/poster.jpg',
    caption: 'Advanced Materials'
  },
  {
    id: 'panel-3',
    mediaType: 'image' as const,
    src: '/images/image3.jpg',
    caption: 'Complex Geometries',
    alt: 'Intricate 3D structures'
  }
];

function App() {
  return (
    <ThreePanelShowcase
      panels={panels}
      sectionHeightVH={90}
      hoverTiltStrength={8}
      enableCenterSticky={true}
    />
  );
}
```

## Integration with Existing Project

Add the component after your sticky video section:

```tsx
// In your home.tsx or main component
import ShowcaseGallery from '@/components/showcase-gallery';

export default function Home() {
  return (
    <div>
      <HeroSection />
      <StickyVideoSection src="/video.mp4" />
      
      {/* Add the showcase gallery here */}
      <ShowcaseGallery />
      
      <WorkShowcase />
      {/* ... rest of your components */}
    </div>
  );
}
```

## Recommended Settings

### For Visual Rhythm
- **sectionHeightVH**: 90-120vh for good spacing
- **cardRadiusPx**: 28px (matches your existing design tokens)
- **hoverTiltStrength**: 6-12 degrees for subtle effect

### Performance Considerations
- Images are lazy-loaded by default
- Hover effects respect `prefers-reduced-motion`
- Uses `will-change` and `translateZ(0)` for GPU acceleration
- IntersectionObserver prevents unnecessary animations

## Styling Customization

The component uses CSS variables for easy theming:

```css
:root {
  --showcase-border-radius: 28px;
  --showcase-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  --showcase-transition: cubic-bezier(0.2, 0.9, 0.2, 1);
}
```

## Accessibility Features

- **ARIA labels** for screen readers
- **Keyboard navigation** support
- **Focus indicators** with custom styling
- **Alt text** for images
- **Captions** for videos via `<track>` elements
- **High contrast mode** support

## Browser Support

- Modern browsers with IntersectionObserver support
- Graceful degradation for older browsers
- Mobile Safari optimizations included

## QA Checklist

- [x] Desktop hover effects work smoothly
- [x] Mobile stacking and touch interactions
- [x] Reduced motion preference respected
- [x] Lazy loading prevents layout shift
- [x] Keyboard navigation functional
- [x] Screen reader compatibility
- [x] High contrast mode support
- [x] Performance optimized animations

## File Structure

```
components/
├── ThreePanelShowcase.tsx          # Main component
├── showcase-gallery.tsx            # Two-row implementation
├── threePanelShowcase.module.css   # Styling
└── README.md                       # This file
```

## Performance Tips

1. **Preload critical images** that appear above the fold
2. **Use appropriate image formats** (WebP, AVIF) with fallbacks
3. **Optimize image sizes** for different screen densities
4. **Consider using a CDN** for faster image delivery

## Troubleshooting

**Tilt effects not working?**
- Check if `prefers-reduced-motion` is enabled
- Ensure the component is properly mounted
- Verify browser supports CSS transforms

**Images not loading?**
- Check file paths are correct
- Ensure images are in the public folder
- Verify image formats are supported

**Performance issues?**
- Reduce `hoverTiltStrength` value
- Disable `enableCenterSticky` if not needed
- Optimize image file sizes