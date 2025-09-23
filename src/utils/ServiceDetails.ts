import { 
  Users, 
  Clock, 
  Shield, 
  Home as HomeIcon, 
  Heart,
  Activity,
  UserCheck,
  CheckCircle,
  Webhook
} from "lucide-react";

type HomeContent = {
  icon: React.ElementType;
  title: string;
  description: string;
};
export const services: HomeContent[] = [
    {
      icon: Heart,
      title: "Routine Blood Work",
      description: "Complete blood count, basic metabolic panel, and routine screening tests"
    },
    {
      icon: Activity,
      title: "Comprehensive Panels", 
      description: "Lipid panels, liver function, kidney function, and thyroid testing"
    },
    {
      icon: UserCheck,
      title: "Specialized Testing",
      description: "Diabetes monitoring, cardiac markers, and hormone level testing"
    }
  ];

export const benefits: HomeContent[] = [
    {
      icon: Clock,
      title: "Save Time",
      description: "No more waiting rooms or hospital queues. We come to you at your convenience."
    },
    {
      icon: HomeIcon,
      title: "Comfortable Environment", 
      description: "Get tested in the comfort of your own home or office environment."
    },
    {
      icon: Shield,
      title: "Professional & Safe",
      description: "Certified phlebotomists using sterile, single-use equipment every time."
    },
    {
      icon: Users,
      title: "Team Solutions",
      description: "Corporate wellness programs and group testing for organizations."
    }
  ];

export const hospitalAffiliationsBenefits: HomeContent[] = [
    {
      icon: CheckCircle,
      title: "Seamless Integration",
      description: "Direct lab result delivery to your healthcare providers."
    },
    {
      icon: Shield,
      title: "Quality Assurance",
      description: "Hospital-grade standards and protocols"
    },
    {
      icon: Webhook,
      title: "Coordinated Care",
      description: "Integrated with your existing healthcare team"
    }
  ];

  export const hospitalAffiliations: { name: string; logo: string }[] = [
      { name: "City General Hospital", logo: "/api/placeholder/150/80" },
      { name: "Metro Medical Center", logo: "/api/placeholder/150/80" },
      { name: "Regional Health System", logo: "/api/placeholder/150/80" },
      { name: "University Hospital", logo: "/api/placeholder/150/80" },
      { name: "Community Health Network", logo: "/api/placeholder/150/80" },
      { name: "Advanced Care Institute", logo: "/api/placeholder/150/80" }
  ]
