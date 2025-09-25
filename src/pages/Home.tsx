import { Link } from "react-router-dom";
import Button from "../components/Button";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import '../App.css';
import { 
  Droplets,  
  Building2,
  CheckCircle
} from "lucide-react";
import { motion } from "framer-motion";
import { services, benefits, hospitalAffiliationsBenefits, hospitalAffiliations } from "../utils/ServiceDetails";
// import "../index.css";


export default function Home() {
  
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-16 pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/src/images/phlebotomy_services.avif')] bg-cover bg-center filter blur-sm scale-105" aria-hidden="true" />
        <img
          src="/src/images/phlebotomy_services-1280.avif"
          srcSet="/src/images/phlebotomy_services.avif 480w, /src/images/phlebotomy_services.avif 768w, /src/images/phlebotomy_services.avif 1280w"
          sizes="(max-width: 768px) 100vw, 1280px"
          className="absolute inset-0 w-full h-full object-cover object-center"
          alt=""
          aria-hidden="true"
          fetchPriority="high"
          loading="eager"
        />
        <div className="absolute inset-0 bg-violet-900/60 pointer-events-none z-0" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[70vh] flex flex-col justify-center relative z-10 text-white">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <Badge variant="outline" className="mb-6 bg-white/10 text-white border-white/30">
              Professional Mobile Phlebotomy Services
            </Badge>
            <h1 className="text-4xl sm:text-3xl md:text-6xl  font-bold text-white mb-6 leading-tight">
              Blood Drawing at
              <span className="bg-gradient-to-r from-violet-900 to-purple-900 bg-clip-text text-transparent"> Your Doorstep</span>
            </h1>
            <p className="lg:text-lg text-base text-white/90 max-w-3xl mx-auto mb-8 leading-relaxed">
              Skip the hospital queues. Our certified professionals bring laboratory-quality 
              phlebotomy services directly to your home or office. Safe, convenient, and reliable.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link to={"/individual-booking"}>
                <Button 
                  label="Book Individual Service" 
                  size="large"
                  leftIcon={<Droplets className="w-5 h-5" />}
                  
                />
              </Link>
              
              <Link to={"/corporate-services"}>
                <Button 
                  variantStyle="secondaryOutlineStyle"
                  label="Book Corporate Service" 
                  size="large" 
                  leftIcon={<Building2 className="w-5 h-5" />}
                />
              </Link>
            </div>
          </motion.div>
        </div>
        
        {/* Floating Elements */}
  <div className="absolute top-20 left-10 w-20 h-20 bg-violet-100 rounded-full opacity-20 animate-pulse z-0" />
  <div className="absolute bottom-20 right-10 w-16 h-16 bg-purple-200 rounded-full opacity-30 animate-pulse z-0" />
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Comprehensive Testing Services
            </h2>
            <p className="sub-heading max-w-3xl mx-auto">
              From routine blood work to specialized testing, we provide a full range of 
              phlebotomy services with professional care and precision.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 border-0 shadow-sm">
                  <CardContent className="p-8 text-center">
                    <div className="icon-div">
                      <service.icon className="icon" />
                    </div>
                    <h3 className="card-title">
                      {service.title}
                    </h3>
                    <p className="card-p">
                      {service.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-violet-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Mobiphleb?
            </h2>
            <p className="sub-heading max-w-3xl mx-auto">
              Experience the convenience of professional phlebotomy services without the hassle 
              of traditional healthcare settings.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="text-center"
              >
                <div className="icon-div-sec">
                  <benefit.icon className="icon" />
                </div>
                <h3 className="card-title">
                  {benefit.title}
                </h3>
                <p className="card-p">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-violet-600 to-purple-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Experience Convenient Blood Testing?
            </h2>
            <p className="text-base lg:text-lg md:text-lg text-gray-50 max-w-3xl mx-auto mb-8 leading-relaxed">
              Join thousands of satisfied patients who have chosen the convenience and 
              professionalism of Mobiphleb services.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link to={"/individual-booking"}>
                <Button 
                  size="large" 
                  label="Schedule Your Test" 
                  rightIcon={<CheckCircle className="w-5 h-5" />}
                  variantStyle="secondaryStyle"
                />
              </Link>
              <Link to={"/contact"}>
                <Button 
                  size="large" 
                  label="Contact Us" 
                  variantStyle="secondaryOutlineStyle"
                />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Partnered Hospitals Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Trusted by Leading Healthcare Institutions
            </h2>
            <p className="sub-heading max-w-3xl mx-auto">
              We partner with renowned hospitals and medical centers to provide seamless, 
              reliable phlebotomy services that meet the highest healthcare standards.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center">
            {hospitalAffiliations.map((hospital, index) => (
              <motion.div
                key={hospital.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="flex flex-col items-center group"
              >
                <div className="bg-gray-50 rounded-lg p-6 w-full h-auto flex items-center justify-center group-hover:bg-purple-50 transition-colors duration-300 border border-gray-100 group-hover:border-purple-200">
                  <div className="w-full h-auto rounded flex-col items-center justify-center">
                    {/* {hospital.logo && (
                      <img
                        src={hospital.logo}
                        alt={hospital.name}
                      />
                    )} */}
                    {/* dummy logo */}
                    <div className="icon-div">
                      <Building2 className="icon" />
                    </div>
                    <p className="text-sm font-semibold text-gray-900 text-center px-2 leading-tight">
                      {hospital.name}
                    </p>

                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="text-center mt-12"
          >
            <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-2xl p-8 max-w-4xl mx-auto">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Healthcare Partnership Benefits
              </h3>
              <div className="grid md:grid-cols-3 gap-6 text-center">
                {
                  hospitalAffiliationsBenefits.map((hosbenefits) => (
                    <div
                      key={hosbenefits.title}
                    >
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <hosbenefits.icon className="icon" />
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2">{hosbenefits.title}</h4>
                      <p className="text-sm text-gray-600">{hosbenefits.description}</p>
                    </div>
                  ))
                }
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}