import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Input } from '@/components/ui/input.jsx'
import { 
  Brain, 
  Users, 
  Target, 
  Lightbulb, 
  BookOpen, 
  Heart,
  BarChart3,
  CheckCircle,
  ArrowRight,
  Star,
  TrendingUp,
  Shield,
  Zap,
  Globe,
  Award,
  MessageSquare,
  Building,
  ChevronRight
} from 'lucide-react'
import './App.css'

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

// Hero Section
function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-20 pb-32 overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="relative max-w-7xl mx-auto px-6">
        <motion.div 
          className="text-center"
          initial="initial"
          animate="animate"
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className="mb-8">
            <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-200">
              🚀 Now Available - Hugo v2.0
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
              Discover Your
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Personality</span>
              <br />
              Build Better
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"> Teams</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Hugo is the most advanced personality assessment platform designed for modern teams. 
              Understand yourself, connect with others, and build high-performing teams with science-backed insights.
            </p>
          </motion.div>

          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg">
              Start Free Assessment
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="px-8 py-4 text-lg">
              Watch Demo
            </Button>
          </motion.div>

          <motion.div variants={fadeInUp} className="flex items-center justify-center space-x-8 text-sm text-gray-500">
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              Free to start
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              GDPR compliant
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              Enterprise ready
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

// Features Section
function FeaturesSection() {
  const features = [
    {
      icon: Brain,
      title: "12 Hugo Personality Types",
      description: "Comprehensive personality framework covering Vision, Innovation, Expertise, and Connection dimensions.",
      color: "bg-blue-500"
    },
    {
      icon: Users,
      title: "Team Composition Analysis",
      description: "AI-powered insights into team dynamics, synergy scores, and optimization recommendations.",
      color: "bg-purple-500"
    },
    {
      icon: MessageSquare,
      title: "Communication Matrix",
      description: "Personalized communication strategies for every personality type combination.",
      color: "bg-green-500"
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Deep insights into team performance, personality distributions, and growth opportunities.",
      color: "bg-orange-500"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "GDPR compliant with enterprise-grade security and privacy protection.",
      color: "bg-red-500"
    },
    {
      icon: Globe,
      title: "Global Culture Support",
      description: "Integrated with Erin Meyer's Culture Map for international team dynamics.",
      color: "bg-indigo-500"
    }
  ]

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div 
          className="text-center mb-16"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Everything you need for team success
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Hugo combines cutting-edge personality science with practical team-building tools 
            to help organizations build more effective, harmonious teams.
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={fadeInUp}>
              <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mb-4`}>
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// Hugo Types Section
function HugoTypesSection() {
  const dimensions = [
    {
      name: "Vision",
      color: "bg-blue-500",
      icon: Target,
      types: [
        { code: "V1", name: "Pathfinder", description: "Shows the way to a better future" },
        { code: "V2", name: "Developer", description: "Helps people and teams grow" },
        { code: "V3", name: "Organizer", description: "Creates structure and efficiency" }
      ]
    },
    {
      name: "Innovation",
      color: "bg-purple-500",
      icon: Lightbulb,
      types: [
        { code: "I1", name: "Pioneer", description: "Explores unknown possibilities" },
        { code: "I2", name: "Architect", description: "Designs systems for the future" },
        { code: "I3", name: "Inspirer", description: "Motivates through creativity" }
      ]
    },
    {
      name: "Expertise",
      color: "bg-green-500",
      icon: BookOpen,
      types: [
        { code: "E1", name: "Researcher", description: "Decodes complex relationships" },
        { code: "E2", name: "Master", description: "Ensures excellence through expertise" },
        { code: "E3", name: "Advisor", description: "Provides wise counsel" }
      ]
    },
    {
      name: "Connection",
      color: "bg-orange-500",
      icon: Heart,
      types: [
        { code: "C1", name: "Harmonizer", description: "Creates stability and safety" },
        { code: "C2", name: "Bridge-Builder", description: "Connects people and builds networks" },
        { code: "C3", name: "Implementer", description: "Transforms ideas into reality" }
      ]
    }
  ]

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div 
          className="text-center mb-16"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            The 12 Hugo Personality Types
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our comprehensive framework covers four key dimensions of personality, 
            each with three distinct types that capture the full spectrum of human potential.
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-12"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          {dimensions.map((dimension, index) => (
            <motion.div key={index} variants={fadeInUp}>
              <Card className="h-full">
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className={`w-10 h-10 ${dimension.color} rounded-lg flex items-center justify-center`}>
                      <dimension.icon className="h-5 w-5 text-white" />
                    </div>
                    <CardTitle className="text-2xl">{dimension.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dimension.types.map((type, typeIndex) => (
                      <div key={typeIndex} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                        <Badge className={`${dimension.color} text-white`}>
                          {type.code}
                        </Badge>
                        <div>
                          <h4 className="font-semibold text-gray-900">{type.name}</h4>
                          <p className="text-sm text-gray-600">{type.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// CTA Section
function CTASection() {
  const [email, setEmail] = useState('')

  return (
    <section className="py-24 bg-gradient-to-r from-blue-600 to-purple-600">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to transform your team?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of organizations using Hugo to build better teams and achieve extraordinary results.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto mb-8">
            <Input 
              type="email" 
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white"
            />
            <Button className="bg-white text-blue-600 hover:bg-gray-100">
              Get Started
            </Button>
          </div>

          <div className="flex items-center justify-center space-x-8 text-blue-100">
            <div className="flex items-center">
              <Award className="h-4 w-4 mr-2" />
              14-day free trial
            </div>
            <div className="flex items-center">
              <Shield className="h-4 w-4 mr-2" />
              No credit card required
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// Header Component
function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">Hugo</span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-600 hover:text-gray-900">Features</a>
            <a href="#types" className="text-gray-600 hover:text-gray-900">Personality Types</a>
            <a href="#pricing" className="text-gray-600 hover:text-gray-900">Pricing</a>
            <a href="#about" className="text-gray-600 hover:text-gray-900">About</a>
          </nav>

          <div className="flex items-center space-x-4">
            <Button variant="ghost">Sign In</Button>
            <Button>Get Started</Button>
          </div>
        </div>
      </div>
    </header>
  )
}

// Footer Component
function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Brain className="h-6 w-6 text-blue-400" />
              <span className="text-lg font-bold">Hugo</span>
            </div>
            <p className="text-gray-400 mb-4">
              The most advanced personality assessment platform for modern teams.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <Building className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">Features</a></li>
              <li><a href="#" className="hover:text-white">Personality Types</a></li>
              <li><a href="#" className="hover:text-white">Team Analytics</a></li>
              <li><a href="#" className="hover:text-white">API</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">About</a></li>
              <li><a href="#" className="hover:text-white">Blog</a></li>
              <li><a href="#" className="hover:text-white">Careers</a></li>
              <li><a href="#" className="hover:text-white">Contact</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">Help Center</a></li>
              <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white">GDPR</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Hugo. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

// Main App Component
function App() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <HugoTypesSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}

export default App
