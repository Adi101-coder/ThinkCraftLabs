import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
    }
  }
};

function AnimatedSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={fadeInUp}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Innovation Through Precision
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed max-w-3xl">
              Think Craft Lab transforms ideas into optimized, tangible solutions through advanced design and additive manufacturing.
            </p>
          </motion.div>
          {/* Hero Image */}
          <motion.div
            className="mt-12 rounded-2xl overflow-hidden shadow-2xl"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <img 
              src="/images2/snapmaker-3d-printer-mGZpFx8B6Qg-unsplash.jpg" 
              alt="3D Printing Innovation Lab"
              className="w-full h-full object-cover aspect-video"
            />
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <main className="pb-16">
        {/* Who We Are */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-100">
          <div className="max-w-5xl mx-auto">
            <AnimatedSection>
              <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-6">
                Who We Are
              </h2>
              <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
                <p>
                  Think Craft Lab is fueled by a passion for innovation and a commitment to excellence in 2D and 3D designing, design consulting, and advanced 3D printing.
                </p>
                <p>
                  Our team of experienced design engineers brings approximately 8 years of designing expertise, 6 years in design consulting, and 3 years of specialization in 3D printing technologies.
                </p>
                <p>
                  We combine digital design with additive manufacturing to enable rapid prototyping, customized production, and optimized engineering solutions.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Vision & Mission */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12">
              <AnimatedSection>
                <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-4">
                  Vision
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed">
                  To deliver optimized, practical solutions across healthcare, home appliances, automotive, engineering, and education through a simple, structured, and transparent workflow with traceable processes and clear pricing that builds long-term trust.
                </p>
              </AnimatedSection>

              <AnimatedSection>
                <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-4">
                  Mission
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Transform ideas into reality by ensuring innovation, precision, reliability, and technical excellence in every solution we deliver.
                </p>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* Technical Expertise */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-100">
          <div className="max-w-5xl mx-auto">
            <AnimatedSection>
              <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-8">
                Technical Expertise
              </h2>
            </AnimatedSection>

            <motion.div 
              className="grid sm:grid-cols-3 gap-6"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
            >
              {[
                {
                  title: "FDM",
                  subtitle: "Fused Deposition Modeling",
                  desc: "Accessible prototyping for functional testing and iterative development"
                },
                {
                  title: "SLA",
                  subtitle: "Stereolithography",
                  desc: "High-precision applications requiring fine detail and smooth finishes"
                },
                {
                  title: "SLS",
                  subtitle: "Selective Laser Sintering",
                  desc: "Industrial-grade solutions for complex geometries and durable parts"
                }
              ].map((tech) => (
                <motion.div
                  key={tech.title}
                  variants={fadeInUp}
                  className="p-6 bg-white border border-gray-200 rounded-lg group"
                  whileHover={{ 
                    y: -4,
                    borderColor: "#ff6a00",
                    transition: { duration: 0.2 }
                  }}
                >
                  <h3 className="text-xl font-semibold text-gray-900 mb-1 group-hover:text-[#ff6a00] transition-colors">
                    {tech.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-3">{tech.subtitle}</p>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {tech.desc}
                  </p>
                </motion.div>
              ))}
            </motion.div>
            
            {/* 3D Printing Process Image */}
            <motion.div
              className="mt-12 rounded-2xl overflow-hidden shadow-xl"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <img 
                src="/images2/snapmaker-3d-printer-bqQ3mFBMAwM-unsplash.jpg" 
                alt="3D Printing Technology"
                className="w-full h-full object-cover aspect-video"
              />
            </motion.div>
          </div>
        </section>

        {/* What We Do */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-5xl mx-auto">
            <AnimatedSection>
              <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-8">
                What We Do
              </h2>
            </AnimatedSection>

            <div className="grid md:grid-cols-2 gap-8">
              <AnimatedSection>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Services</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start">
                        <span className="text-[#ff6a00] mr-2">•</span>
                        <span>Design consulting</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#ff6a00] mr-2">•</span>
                        <span>2D and 3D designing</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#ff6a00] mr-2">•</span>
                        <span>Advanced 3D printing solutions</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </AnimatedSection>

              <AnimatedSection>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Applications</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start">
                        <span className="text-[#ff6a00] mr-2">•</span>
                        <span>Industrial design and testing</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#ff6a00] mr-2">•</span>
                        <span>Retail and customized solutions</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#ff6a00] mr-2">•</span>
                        <span>Product repairs and miniatures</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#ff6a00] mr-2">•</span>
                        <span>End-user products and functional prototypes</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* Impact & Collaboration */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-100">
          <div className="max-w-5xl mx-auto">
            <AnimatedSection>
              <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-6">
                Impact & Collaboration
              </h2>
              <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
                <p>
                  We have collaborated with IIT Kanpur students on innovative projects that have achieved patent approvals, reflecting our commitment to research, innovation, and real-world problem solving.
                </p>
                <p>
                  Our work demonstrates the practical application of advanced design and manufacturing technologies in addressing complex engineering challenges.
                </p>
              </div>
            </AnimatedSection>
            
            {/* Collaboration Image */}
            <motion.div
              className="mt-8 rounded-2xl overflow-hidden shadow-xl"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <img 
                src="/images2/tom-claes-6AuEoJYM4rE-unsplash.jpg" 
                alt="Innovation and Collaboration"
                className="w-full h-full object-cover aspect-video"
              />
            </motion.div>
          </div>
        </section>

        {/* Innovation & Student Support */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-5xl mx-auto">
            <AnimatedSection>
              <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-6">
                Innovation & Student Support
              </h2>
              <div className="space-y-4 text-lg text-gray-700 leading-relaxed mb-6">
                <p>
                  Think Craft Lab actively supports student projects and innovation ideas by providing hands-on exposure to real-world design and manufacturing technologies.
                </p>
                <p>
                  We guide learners toward future careers in engineering and emerging technologies, bridging the gap between academic knowledge and industry practice.
                </p>
              </div>
            </AnimatedSection>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className="grid sm:grid-cols-3 gap-4 mt-8"
            >
              {[
                "Student project support",
                "Hands-on technical exposure",
                "Career guidance in emerging tech"
              ].map((item, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="p-4 bg-white border border-gray-200 rounded-lg text-center"
                  whileHover={{ 
                    y: -2,
                    borderColor: "#ff6a00",
                    transition: { duration: 0.2 }
                  }}
                >
                  <p className="text-gray-700 text-sm">{item}</p>
                </motion.div>
              ))}
            </motion.div>
            
            {/* Student Innovation Image */}
            <motion.div
              className="mt-8 rounded-2xl overflow-hidden shadow-xl"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <img 
                src="/images2/zmorph-all-in-one-3d-printers-p1m4B-lhS9Y-unsplash.jpg" 
                alt="Student Innovation and Learning"
                className="w-full h-full object-cover aspect-video"
              />
            </motion.div>
          </div>
        </section>

        {/* Closing Statement */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-gray-100">
          <div className="max-w-5xl mx-auto text-center">
            <AnimatedSection>
              <p className="text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto">
                We are committed to delivering precision-engineered solutions that drive innovation forward. Whether you're developing a new product, optimizing an existing design, or exploring emerging technologies, Think Craft Lab is ready to collaborate.
              </p>
            </AnimatedSection>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
