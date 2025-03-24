
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { fadeIn, staggerContainer } from "../utils/animations";

const About = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-20 bg-primary/5">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">About Amrit Naturals</h1>
            <p className="text-xl text-muted-foreground">
              Delivering premium quality fruits & vegetables since 2005
            </p>
          </motion.div>
        </div>
      </section>
      
      {/* Our Story */}
      <motion.section
        variants={staggerContainer()}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        className="py-16"
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div 
              variants={fadeIn("right")}
              className="rounded-xl overflow-hidden"
            >
              <img 
                src="https://images.unsplash.com/photo-1600431521340-491eca880813?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
                alt="Founder with mangoes" 
                className="w-full h-auto"
              />
            </motion.div>
            
            <motion.div variants={fadeIn("left")}>
              <h2 className="text-3xl font-display font-bold mb-6">Our Story</h2>
              <p className="text-muted-foreground mb-6">
                Amrit Naturals began with a simple vision: to bring the most delicious and fresh produce from farms directly to consumers' tables. Our journey started in 2005 when our founder, Amit Patel, decided to share his family's orchard mangoes with a wider audience.
              </p>
              <p className="text-muted-foreground mb-6">
                What started as a small venture selling Alphonso mangoes has now grown into a trusted brand delivering premium fruits and vegetables throughout India. Our focus on quality, freshness, and customer satisfaction has remained unchanged from day one.
              </p>
              <p className="text-muted-foreground">
                Today, we work with over 100 farmers across Maharashtra, Gujarat, and Karnataka to source the finest produce while ensuring fair compensation for our growers. We take pride in supporting sustainable farming practices and building long-term relationships with our partner farmers.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>
      
      {/* Our Values */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-3xl font-display font-bold mb-4">Our Values</h2>
            <p className="text-muted-foreground">
              At Amrit Naturals, our core values guide everything we do, from how we source our products to how we serve our customers.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white p-8 rounded-xl shadow-sm text-center"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-display font-bold mb-4">Quality First</h3>
              <p className="text-muted-foreground">
                We never compromise on quality. Each piece of fruit and vegetable is carefully selected to ensure only the best reaches your home.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white p-8 rounded-xl shadow-sm text-center"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </div>
              <h3 className="text-xl font-display font-bold mb-4">Sustainability</h3>
              <p className="text-muted-foreground">
                We support sustainable farming practices and work with farmers who share our commitment to environmental stewardship.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white p-8 rounded-xl shadow-sm text-center"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-display font-bold mb-4">Fair Trade</h3>
              <p className="text-muted-foreground">
                We believe in fair compensation for farmers and work directly with them to ensure they receive proper value for their produce.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>
      
      {/* Our Team */}
      <motion.section
        variants={staggerContainer()}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        className="py-16"
      >
        <div className="container mx-auto px-4">
          <motion.div
            variants={fadeIn("up")}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-3xl font-display font-bold mb-4">Meet Our Team</h2>
            <p className="text-muted-foreground">
              The passionate individuals behind Amrit Naturals who work tirelessly to bring the freshest produce to your table.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div variants={fadeIn("up", 0.1)} className="text-center">
              <div className="mb-4 rounded-full overflow-hidden w-40 h-40 mx-auto">
                <img 
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80" 
                  alt="Amit Patel - Founder & CEO" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold mb-1">Amit Patel</h3>
              <p className="text-primary font-medium mb-3">Founder & CEO</p>
              <p className="text-muted-foreground">
                With over 20 years of experience in agriculture, Amit leads our company's vision and strategy.
              </p>
            </motion.div>
            
            <motion.div variants={fadeIn("up", 0.2)} className="text-center">
              <div className="mb-4 rounded-full overflow-hidden w-40 h-40 mx-auto">
                <img 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80" 
                  alt="Priya Sharma - Operations Manager" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold mb-1">Priya Sharma</h3>
              <p className="text-primary font-medium mb-3">Operations Manager</p>
              <p className="text-muted-foreground">
                Priya ensures our operations run smoothly, from sourcing to delivery.
              </p>
            </motion.div>
            
            <motion.div variants={fadeIn("up", 0.3)} className="text-center">
              <div className="mb-4 rounded-full overflow-hidden w-40 h-40 mx-auto">
                <img 
                  src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80" 
                  alt="Rajesh Kumar - Quality Control" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold mb-1">Rajesh Kumar</h3>
              <p className="text-primary font-medium mb-3">Quality Control</p>
              <p className="text-muted-foreground">
                Rajesh leads our quality control team, ensuring every product meets our standards.
              </p>
            </motion.div>
            
            <motion.div variants={fadeIn("up", 0.4)} className="text-center">
              <div className="mb-4 rounded-full overflow-hidden w-40 h-40 mx-auto">
                <img 
                  src="https://images.unsplash.com/photo-1558203728-00f45181dd84?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80" 
                  alt="Anita Singh - Customer Relations" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold mb-1">Anita Singh</h3>
              <p className="text-primary font-medium mb-3">Customer Relations</p>
              <p className="text-muted-foreground">
                Anita manages our customer support team, ensuring your satisfaction with every order.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>
      
      {/* CTA Section */}
      <section className="py-16 bg-primary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-display font-bold mb-6">Ready to Taste the Difference?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Experience the freshest fruits and vegetables delivered directly to your doorstep.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3 }}
              >
                <a href="/shop" className="btn-primary px-8">Shop Now</a>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.15 }}
              >
                <a href="/contact" className="btn-secondary px-8">Contact Us</a>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default About;
