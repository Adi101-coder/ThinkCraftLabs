import { useState } from 'react';
import { motion } from 'framer-motion';
import Navigation from '@/components/navigation';
import Footer from '@/components/footer';
import STLViewer from '@/components/STLViewer';

interface WorkItem {
  id: number;
  title: string;
  category: string;
  description: string;
  image: string;
  tags: string[];
  stats?: {
    printTime?: string;
    material?: string;
    complexity?: string;
  };
}

export default function Work() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', '3D Printing', 'Prototyping', 'Design', 'Custom Parts'];

  const workItems: WorkItem[] = [
    {
      id: 1,
      title: 'Architectural Scale Model',
      category: '3D Printing',
      description: 'Detailed architectural model with intricate details and precision engineering',
      image: '/Shopping_images/13.jpg',
      tags: ['PLA', 'High Detail', 'Architecture'],
      stats: { printTime: '48 hours', material: 'PLA', complexity: 'High' }
    },
    {
      id: 2,
      title: 'Mechanical Gear Assembly',
      category: 'Prototyping',
      description: 'Functional gear system for industrial testing and validation',
      image: '/Shopping_images/51.jpg',
      tags: ['ABS', 'Functional', 'Engineering'],
      stats: { printTime: '24 hours', material: 'ABS', complexity: 'Medium' }
    },
    {
      id: 3,
      title: 'Custom Product Design',
      category: 'Design',
      description: 'Ergonomic consumer product with optimized design for manufacturing',
      image: '/Shopping_images/17.jpg',
      tags: ['PETG', 'Ergonomic', 'Consumer'],
      stats: { printTime: '18 hours', material: 'PETG', complexity: 'Medium' }
    },
    {
      id: 4,
      title: 'Artistic Sculpture',
      category: '3D Printing',
      description: 'Complex artistic piece with smooth curves and detailed finishing',
      image: '/Shopping_images/18.jpg',
      tags: ['Resin', 'Art', 'High Detail'],
      stats: { printTime: '36 hours', material: 'Resin', complexity: 'High' }
    },
    {
      id: 5,
      title: 'Drone Component',
      category: 'Custom Parts',
      description: 'Lightweight structural component for aerospace applications',
      image: '/Shopping_images/26.jpg',
      tags: ['Carbon Fiber', 'Lightweight', 'Aerospace'],
      stats: { printTime: '12 hours', material: 'Carbon Fiber', complexity: 'High' }
    },
    {
      id: 6,
      title: 'Medical Device Prototype',
      category: 'Prototyping',
      description: 'Precision medical device prototype for testing and validation',
      image: '/Shopping_images/15.jpg',
      tags: ['Medical Grade', 'Precision', 'Testing'],
      stats: { printTime: '30 hours', material: 'Medical PLA', complexity: 'High' }
    },
  ];

  const filteredWork = selectedCategory === 'All' 
    ? workItems 
    : workItems.filter(item => item.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <Navigation />
      
      {/* Hero Section with Animated Background */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#ff6a00]/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#ff6a00]/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-block mb-6"
          >
            <span className="px-4 py-2 bg-[#ff6a00]/10 text-[#ff6a00] rounded-full text-sm font-semibold">
              Portfolio & Projects
            </span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold text-gray-900 mb-6"
          >
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff6a00] to-[#ff7f33]">Work</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
          >
            Transforming ideas into reality through precision 3D printing and innovative design solutions
          </motion.p>
          
          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
          >
            {[
              { number: '500+', label: 'Projects Completed' },
              { number: '50+', label: 'Happy Clients' },
              { number: '10K+', label: 'Print Hours' },
              { number: '99%', label: 'Success Rate' }
            ].map((stat, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-3xl md:text-4xl font-bold text-[#ff6a00] mb-2">{stat.number}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Filter Categories */}
      <section className="pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-3"
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-[#ff6a00] to-[#ff7f33] text-white shadow-lg shadow-[#ff6a00]/30 scale-105'
                    : 'bg-white text-gray-700 hover:bg-gray-50 hover:shadow-md border border-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Work Grid */}
      <section className="pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredWork.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:-translate-y-2"
              >
                {/* Image with Overlay */}
                <div className="relative h-72 bg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-[#ff6a00] text-sm font-semibold rounded-full shadow-lg">
                      {item.category}
                    </span>
                  </div>
                  
                  {/* View Project Button */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button className="px-6 py-3 bg-white text-[#ff6a00] rounded-full font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all">
                      View Details
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-[#ff6a00] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {item.description}
                  </p>
                  
                  {/* Stats */}
                  {item.stats && (
                    <div className="grid grid-cols-3 gap-2 mb-4 pb-4 border-b border-gray-100">
                      <div className="text-center">
                        <div className="text-xs text-gray-500 mb-1">Time</div>
                        <div className="text-sm font-semibold text-gray-900">{item.stats.printTime}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-gray-500 mb-1">Material</div>
                        <div className="text-sm font-semibold text-gray-900">{item.stats.material}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-gray-500 mb-1">Level</div>
                        <div className="text-sm font-semibold text-gray-900">{item.stats.complexity}</div>
                      </div>
                    </div>
                  )}
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full hover:bg-[#ff6a00] hover:text-white transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Empty State */}
          {filteredWork.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-xl text-gray-500">No projects found in this category</p>
              <button 
                onClick={() => setSelectedCategory('All')}
                className="mt-4 px-6 py-2 bg-[#ff6a00] text-white rounded-full hover:bg-[#ff7f33] transition-colors"
              >
                View All Projects
              </button>
            </motion.div>
          )}
        </div>
      </section>

      {/* 3D Printing Process Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              How <span className="text-[#ff6a00]">3D Printing</span> Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover the fascinating journey from digital design to physical reality
            </p>
          </motion.div>

          {/* Interactive 3D Model Viewer - Coming Soon */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-20"
          >
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-gray-200">
              <div className="bg-gradient-to-r from-[#ff6a00] to-[#ff7f33] px-6 py-4">
                <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                  </svg>
                  3D Model Visualization
                </h3>
                <p className="text-white/90 mt-2">
                  Preview and inspect your designs before printing
                </p>
              </div>
              <div className="p-4 sm:p-6 md:p-8">
                <div className="h-[400px] sm:h-[500px] md:h-[600px]">
                  <STLViewer modelUrl="/STL_files/Hogwarts_Castle.stl" showGrid={true} />
                </div>
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-orange-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-[#ff6a00] mb-1">Real-time</div>
                    <div className="text-sm text-gray-600">3D Visualization</div>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-[#ff6a00] mb-1">360°</div>
                    <div className="text-sm text-gray-600">View Rotation</div>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-[#ff6a00] mb-1">Interactive</div>
                    <div className="text-sm text-gray-600">3D Model</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Process Steps */}
          <div className="space-y-16">
            {/* Step 1 */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid md:grid-cols-2 gap-8 items-center"
            >
              <div className="order-2 md:order-1">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-[#ff6a00] text-white rounded-full flex items-center justify-center text-2xl font-bold">
                    1
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900">Design & Modeling</h3>
                </div>
                <p className="text-gray-600 text-lg mb-4">
                  Every 3D printed object starts with a digital 3D model. Our designers use professional CAD software like Fusion 360, SolidWorks, or Blender to create precise digital blueprints.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-[#ff6a00] mt-1">✓</span>
                    <span className="text-gray-600">Custom design based on your requirements</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#ff6a00] mt-1">✓</span>
                    <span className="text-gray-600">Precision measurements and specifications</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#ff6a00] mt-1">✓</span>
                    <span className="text-gray-600">Optimization for 3D printing</span>
                  </li>
                </ul>
              </div>
              <div className="order-1 md:order-2 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl p-8 h-80 flex items-center justify-center">
                <div className="text-center">
                  <svg className="w-32 h-32 mx-auto text-[#ff6a00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-gray-600 mt-4 font-medium">CAD Design Software</p>
                </div>
              </div>
            </motion.div>

            {/* Step 2 */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid md:grid-cols-2 gap-8 items-center"
            >
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl p-8 h-80 flex items-center justify-center">
                <div className="text-center">
                  <svg className="w-32 h-32 mx-auto text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                  </svg>
                  <p className="text-gray-600 mt-4 font-medium">Slicing Software</p>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-[#ff6a00] text-white rounded-full flex items-center justify-center text-2xl font-bold">
                    2
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900">Slicing & Preparation</h3>
                </div>
                <p className="text-gray-600 text-lg mb-4">
                  The 3D model is converted into thin horizontal layers using slicing software. This generates G-code instructions that tell the 3D printer exactly how to build the object layer by layer.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-[#ff6a00] mt-1">✓</span>
                    <span className="text-gray-600">Layer height optimization (0.1mm - 0.3mm)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#ff6a00] mt-1">✓</span>
                    <span className="text-gray-600">Support structure generation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#ff6a00] mt-1">✓</span>
                    <span className="text-gray-600">Print time and material estimation</span>
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* Step 3 */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid md:grid-cols-2 gap-8 items-center"
            >
              <div className="order-2 md:order-1">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-[#ff6a00] text-white rounded-full flex items-center justify-center text-2xl font-bold">
                    3
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900">3D Printing</h3>
                </div>
                <p className="text-gray-600 text-lg mb-4">
                  The printer brings your design to life! Using FDM (Fused Deposition Modeling) or SLA (Stereolithography) technology, material is deposited or cured layer by layer to build the final object.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-[#ff6a00] mt-1">✓</span>
                    <span className="text-gray-600">Multiple material options (PLA, ABS, PETG, Resin)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#ff6a00] mt-1">✓</span>
                    <span className="text-gray-600">Precision printing with 0.1mm accuracy</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#ff6a00] mt-1">✓</span>
                    <span className="text-gray-600">Real-time monitoring and quality control</span>
                  </li>
                </ul>
              </div>
              <div className="order-1 md:order-2 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl p-8 h-80 flex items-center justify-center">
                <div className="text-center">
                  <svg className="w-32 h-32 mx-auto text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                  <p className="text-gray-600 mt-4 font-medium">3D Printer in Action</p>
                </div>
              </div>
            </motion.div>

            {/* Step 4 */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid md:grid-cols-2 gap-8 items-center"
            >
              <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-2xl p-8 h-80 flex items-center justify-center">
                <div className="text-center">
                  <svg className="w-32 h-32 mx-auto text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-gray-600 mt-4 font-medium">Quality Assurance</p>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-[#ff6a00] text-white rounded-full flex items-center justify-center text-2xl font-bold">
                    4
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900">Post-Processing & Finishing</h3>
                </div>
                <p className="text-gray-600 text-lg mb-4">
                  After printing, we carefully remove support structures, sand rough edges, and apply finishing touches to ensure your product meets the highest quality standards.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-[#ff6a00] mt-1">✓</span>
                    <span className="text-gray-600">Support removal and cleaning</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#ff6a00] mt-1">✓</span>
                    <span className="text-gray-600">Sanding and smoothing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#ff6a00] mt-1">✓</span>
                    <span className="text-gray-600">Painting, coating, or assembly (optional)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#ff6a00] mt-1">✓</span>
                    <span className="text-gray-600">Final quality inspection</span>
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>

          {/* Technology Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6 text-center hover:border-[#ff6a00] transition-colors">
              <div className="text-4xl font-bold text-[#ff6a00] mb-2">0.1mm</div>
              <div className="text-gray-600 font-medium">Layer Precision</div>
            </div>
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6 text-center hover:border-[#ff6a00] transition-colors">
              <div className="text-4xl font-bold text-[#ff6a00] mb-2">10+</div>
              <div className="text-gray-600 font-medium">Material Types</div>
            </div>
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6 text-center hover:border-[#ff6a00] transition-colors">
              <div className="text-4xl font-bold text-[#ff6a00] mb-2">24/7</div>
              <div className="text-gray-600 font-medium">Production</div>
            </div>
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6 text-center hover:border-[#ff6a00] transition-colors">
              <div className="text-4xl font-bold text-[#ff6a00] mb-2">100%</div>
              <div className="text-gray-600 font-medium">Quality Check</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-[#ff6a00] to-[#ff7f33]">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
          >
            Ready to Start Your Project?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl text-white/90 mb-8"
          >
            Let's collaborate and bring your vision to life
          </motion.p>
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white text-[#ff6a00] px-8 py-4 rounded-full font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            Get In Touch
          </motion.button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
