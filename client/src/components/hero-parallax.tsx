"use client";
import React from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
} from "motion/react";

export const HeroParallax = ({
  products,
}: {
  products: {
    title: string;
    link: string;
    thumbnail: string;
  }[];
}) => {
  const firstRow = products.slice(0, 5);
  const secondRow = products.slice(5, 10);
  const thirdRow = products.slice(10, 15);
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const springConfig = { stiffness: 300, damping: 30, bounce: 100 };
  const translateX = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 1000]),
    springConfig
  );
  const translateXReverse = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -1000]),
    springConfig
  );
  const rotateX = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [15, 0]),
    springConfig
  );
  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [0.2, 1]),
    springConfig
  );
  const rotateZ = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [20, 0]),
    springConfig
  );
  const translateY = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [-700, 500]),
    springConfig
  );
  return (
    <div
      ref={ref}
      className="h-[300vh] py-40 overflow-hidden antialiased relative flex flex-col self-auto [perspective:1000px] [transform-style:preserve-3d]"
    >
      <Header />
      <motion.div
        style={{
          rotateX,
          rotateZ,
          translateY,
          opacity,
        }}
        className=""
      >
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-20 mb-20">
          {firstRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateX}
              key={product.title}
            />
          ))}
        </motion.div>
        <motion.div className="flex flex-row mb-20 space-x-20">
          {secondRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateXReverse}
              key={product.title}
            />
          ))}
        </motion.div>
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-20">
          {thirdRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateX}
              key={product.title}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export const Header = () => {
  return (
    <div className="max-w-7xl relative mx-auto py-20 md:py-40 px-4 w-full left-0 top-0">
      <h1 className="text-2xl md:text-7xl font-bold dark:text-white">
        The Ultimate <br /> 3D Printing Studio
      </h1>
      <p className="max-w-2xl text-base md:text-xl mt-8 dark:text-neutral-200">
        We create innovative 3D printed solutions with cutting-edge technology and precision.
        From prototypes to production, we bring your ideas to life with exceptional quality and detail.
      </p>
      
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl">
        <div className="text-center">
          <div className="text-3xl md:text-4xl font-bold text-white mb-2">500+</div>
          <div className="text-sm md:text-base text-neutral-300">Projects Completed</div>
        </div>
        <div className="text-center">
          <div className="text-3xl md:text-4xl font-bold text-white mb-2">24h</div>
          <div className="text-sm md:text-base text-neutral-300">Average Turnaround</div>
        </div>
        <div className="text-center">
          <div className="text-3xl md:text-4xl font-bold text-white mb-2">99.8%</div>
          <div className="text-sm md:text-base text-neutral-300">Precision Accuracy</div>
        </div>
      </div>

      <div className="mt-12 flex flex-wrap gap-4">
        <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm text-white border border-white/20">
          SLA Printing
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm text-white border border-white/20">
          FDM Technology
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm text-white border border-white/20">
          Multi-Material
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm text-white border border-white/20">
          Post-Processing
        </div>
      </div>
    </div>
  );
};

export const ProductCard = ({
  product,
  translate,
}: {
  product: {
    title: string;
    link: string;
    thumbnail: string;
  };
  translate: MotionValue<number>;
}) => {
  return (
    <motion.div
      style={{
        x: translate,
      }}
      whileHover={{
        y: -20,
        scale: 1.05,
      }}
      key={product.title}
      className="group/product h-96 w-[30rem] relative shrink-0 rounded-xl overflow-hidden"
    >
      <a
        href={product.link}
        className="block group-hover/product:shadow-2xl"
      >
        <img
          src={product.thumbnail}
          height="600"
          width="600"
          className="object-cover object-center absolute h-full w-full inset-0 transition-transform duration-700 group-hover/product:scale-110"
          alt={product.title}
        />
      </a>
      <div className="absolute inset-0 h-full w-full opacity-0 group-hover/product:opacity-70 bg-gradient-to-t from-black via-black/50 to-transparent pointer-events-none transition-opacity duration-300"></div>
      <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-6 group-hover/product:translate-y-0 transition-transform duration-300">
        <h2 className="text-white text-xl font-semibold mb-2 opacity-0 group-hover/product:opacity-100 transition-opacity duration-300">
          {product.title}
        </h2>
        <p className="text-white/80 text-sm opacity-0 group-hover/product:opacity-100 transition-opacity duration-300 delay-100">
          Premium 3D printing service with precision engineering
        </p>
        <div className="mt-3 opacity-0 group-hover/product:opacity-100 transition-opacity duration-300 delay-200">
          <span className="inline-flex items-center text-white text-sm font-medium">
            View Project
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </span>
        </div>
      </div>
    </motion.div>
  );
};