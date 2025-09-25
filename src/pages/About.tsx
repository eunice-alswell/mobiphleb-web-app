import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { 
  Shield, 
  Users, 
  Award, 
  Heart,
  Clock,
  CheckCircle,
  Droplets,
  MapPin
} from "lucide-react";
import { motion } from "framer-motion";

export default function About() {
  const values = [
    {
      icon: Shield,
      title: "Safety First",
      description: "We follow strict safety protocols and use only sterile, single-use equipment for every patient interaction."
    },
    {
      icon: Heart,
      title: "Patient Care",
      description: "Your comfort and well-being are our top priorities. We provide compassionate, professional service."
    },
    {
      icon: Clock,
      title: "Convenience",
      description: "We respect your time and provide flexible scheduling that works around your busy lifestyle."
    },
    {
      icon: Award,
      title: "Excellence",
      description: "Our certified phlebotomists maintain the highest standards of professional practice and continuous education."
    }
  ];

  const stats = [
    { number: "5000+", label: "Patients Served" },
    { number: "99.8%", label: "Success Rate" },
    { number: "24/7", label: "Support Available" },
    { number: "50+", label: "Service Areas" }
  ];

  const certifications = [
    "Certified Phlebotomy Technicians",
    "OSHA Safety Training",
    "HIPAA Compliance Certified",
    "CPR & First Aid Certified",
    "Laboratory Quality Standards"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-white">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-violet-600 to-purple-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Droplets className="w-16 h-16 mx-auto mb-6 text-red-500" />
            <h1 className="text-2xl lg:text-3xl md:text-5xl font-bold mb-6">
              About Mobiphleb
            </h1>
            <p className="text-base lg:text-lg md:text-lg text-grey-50 mb-8 max-w-3xl mx-auto leading-relaxed">
              Revolutionizing healthcare access through professional mobile phlebotomy services 
              that bring laboratory testing directly to your doorstep.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision Statement */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Mission & Vision
            </h2>
            <p className="sub-heading">
              Driven by purpose and guided by vision, we're committed to transforming healthcare accessibility
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Mission Statement */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Card className="shadow-lg border-0 bg-white h-full">
                <CardContent className="p-10">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Heart className="w-8 h-8 text-purple-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">Our Mission</h3>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed text-center mb-6">
                    To transform healthcare accessibility by providing professional, convenient, and 
                    reliable mobile phlebotomy services that reduce hospital queues and enhance patient 
                    convenience, especially for those needing frequent laboratory investigations.
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    <Badge variant="outline" className="px-3 py-1 text-purple-600 border-purple-200">
                      Patient-Centered Care
                    </Badge>
                    <Badge variant="outline" className="px-3 py-1 text-purple-600 border-purple-200">
                      Professional Excellence
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Vision Statement */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-100 to-violet-100 h-full">
                <CardContent className="p-10">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Award className="w-8 h-8 text-red-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">Our Vision</h3>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed text-center mb-6">
                    To become the leading mobile phlebotomy service provider, making quality healthcare 
                    testing accessible to everyone, everywhere. We envision a future where patients no longer 
                    need to compromise their comfort and time for essential medical testing.
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    <Badge variant="outline" className="px-3 py-1 text-red-600 border-red-200">
                      Healthcare Innovation
                    </Badge>
                    <Badge variant="outline" className="px-3 py-1 text-red-600 border-red-200">
                      Universal Access
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-violet-600 to-purple-700">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-4">Trusted by Thousands</h2>
            <p className="text-lg text-white">
              Our commitment to excellence is reflected in our growing community of satisfied patients
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-300">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="sub-heading">
              These fundamental principles guide everything we do and ensure the highest quality 
              of care for every patient we serve.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
              >
                <Card className="h-full text-center hover:shadow-lg transition-all duration-300 border-0 shadow-sm">
                  <CardContent className="p-8">
                    <div className="icon-div">
                      <value.icon className="w-8 h-8 text-primaryColor" />
                    </div>
                    <h3 className="card-title">
                      {value.title}
                    </h3>
                    <p className="card-p">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <Card className="shadow-lg border-0 bg-white">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <Users className="w-12 h-12 text-primaryColor mx-auto mb-4" />
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Professional Credentials
                  </h2>
                  <p className="sub-heading">
                    Our team maintains the highest professional standards and certifications
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {certifications.map((cert, index) => (
                    <motion.div
                      key={cert}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.1 * index }}
                      className="flex items-center space-x-3"
                    >
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700 font-medium">{cert}</span>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Service Areas */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <MapPin className="w-12 h-12 text-primaryColor mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Service Coverage</h2>
            <p className="sub-heading">
              We proudly serve the Greater Metro Area with plans for continued expansion. 
              Our mobile units can reach you whether you're at home, in the office, or at a care facility.
            </p>
            <Badge variant="outline" className="px-2 lg:p-6 py-3 text-xs lg:text-base text-primaryColor border-[#ddd6fe]">
              Expanding Service Areas - Contact us for availability
            </Badge>
          </motion.div>
        </div>
      </section>
    </div>
  );
}