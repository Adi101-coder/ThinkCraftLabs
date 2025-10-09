import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * SmoothBackgroundTransition Component
 * Creates perfect color transition between ShowcaseGallery and ChallengesSection
 * Works seamlessly with GSAP ScrollSmoother
 */
export default function SmoothBackgroundTransition() {
    useEffect(() => {
        console.log('🎨 SmoothBackgroundTransition: Component mounted');

        // Initialize transition with ScrollSmoother compatibility
        const initTransition = () => {
            const galleryElement = document.querySelector('.showcase-gallery') as HTMLElement;

            if (!galleryElement) {
                console.warn('⚠️ Gallery element not found, retrying...');
                return null;
            }

            console.log('✅ Gallery element found:', galleryElement);

            // Create instant seamless color transition for perfect blending
            const scrollTrigger = ScrollTrigger.create({
                trigger: '.showcase-gallery',
                start: 'bottom bottom',    // Start exactly when gallery bottom hits viewport bottom
                end: 'bottom top',         // End when gallery completely exits viewport
                scrub: 0.1,               // Ultra-fast scrubbing for instant transition
                invalidateOnRefresh: true, // Recalculate on refresh
                onUpdate: (self) => {
                    const progress = self.progress;

                    // Only log significant progress changes to reduce console spam
                    if (progress === 0 || progress === 1 || Math.abs(progress - 0.5) < 0.01) {
                        console.log(`🔄 Transition Progress: ${(progress * 100).toFixed(1)}%`);
                    }

                    // Clamp progress for smooth transition
                    const clampedProgress = Math.max(0, Math.min(1, progress));

                    // Perfect color interpolation matching challenges section exactly
                    const backgroundColor = gsap.utils.interpolate(
                        'rgb(249, 250, 251)', // Light gray from showcase gallery
                        'hsl(21, 100%, 51%)', // Exact orange from challenges section
                        clampedProgress
                    );

                    const textColor = gsap.utils.interpolate(
                        'rgb(0, 0, 0)',       // Black start
                        'rgb(255, 255, 255)', // White end
                        clampedProgress
                    );

                    // Apply colors with GPU acceleration to body and main container
                    gsap.set(document.body, {
                        backgroundColor: backgroundColor,
                        color: textColor,
                        force3D: true
                    });

                    // Also apply to the main content wrapper
                    const mainContent = document.querySelector('.main-content-enter');
                    if (mainContent) {
                        gsap.set(mainContent, {
                            backgroundColor: backgroundColor,
                            force3D: true
                        });
                    }

                    // Update CSS variables for theme synchronization
                    document.documentElement.style.setProperty('--theme-progress', clampedProgress.toString());
                    document.documentElement.style.setProperty('--bg-color', backgroundColor);
                    document.documentElement.style.setProperty('--text-color', textColor);
                },
                onEnter: () => console.log('🚀 Transition started'),
                onLeave: () => console.log('✨ Transition completed - Orange theme active'),
                onEnterBack: () => console.log('🔄 Reversing transition'),
                onLeaveBack: () => console.log('🔙 Back to white theme')
            });

            console.log('✅ ScrollTrigger created successfully');
            return scrollTrigger;
        };

        // Initialize with retry mechanism
        let retryCount = 0;
        const maxRetries = 5;

        const tryInit = () => {
            const trigger = initTransition();

            if (!trigger && retryCount < maxRetries) {
                retryCount++;
                console.log(`🔄 Retry ${retryCount}/${maxRetries} in 500ms...`);
                setTimeout(tryInit, 500);
            } else if (trigger) {
                console.log('🎉 Transition initialized successfully!');
                // Store for cleanup
                (window as any).__smoothTransitionTrigger = trigger;
            } else {
                console.error('❌ Failed to initialize transition after all retries');
            }
        };

        // Start initialization after ScrollSmoother is ready
        const timer = setTimeout(tryInit, 300);

        // Cleanup function
        return () => {
            clearTimeout(timer);
            console.log('🧹 Cleaning up SmoothBackgroundTransition');

            // Clean up specific trigger
            if ((window as any).__smoothTransitionTrigger) {
                (window as any).__smoothTransitionTrigger.kill();
                delete (window as any).__smoothTransitionTrigger;
            }

            // Reset all styles
            document.body.style.backgroundColor = '';
            document.body.style.color = '';
            
            // Reset main content wrapper
            const mainContent = document.querySelector('.main-content-enter');
            if (mainContent) {
                (mainContent as HTMLElement).style.backgroundColor = '';
            }
            
            document.documentElement.style.removeProperty('--theme-progress');
            document.documentElement.style.removeProperty('--bg-color');
            document.documentElement.style.removeProperty('--text-color');

            console.log('✅ Cleanup completed');
        };
    }, []);

    return null; // This component only handles scroll effects
}