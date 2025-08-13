import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Phone, Award, Users, Clock, Heart, Target } from "lucide-react";
import aboutImage from "@/assets/about-hero-bg.jpg";

const About = () => {
  const values = [
    {
      icon: Award,
      title: "Quality First",
      description: "We only stock genuine, high-quality products from trusted manufacturers"
    },
    {
      icon: Users,
      title: "Customer Focus",
      description: "Every customer is unique, and we provide personalized service to match your needs"
    },
    {
      icon: Heart,
      title: "Trust & Integrity",
      description: "Building lasting relationships through honest, transparent business practices"
    },
    {
      icon: Target,
      title: "Innovation",
      description: "Staying ahead with the latest technology trends and mobile innovations"
    }
  ];

  const milestones = [
    {
      year: "2015",
      title: "Founded",
      description: "Started as a small family business with a passion for mobile technology"
    },
    {
      year: "2017",
      title: "First Expansion",
      description: "Opened our second location and expanded our product range"
    },
    {
      year: "2019",
      title: "Online Presence",
      description: "Launched our e-commerce platform to serve customers nationwide"
    },
    {
      year: "2021",
      title: "Premium Partner",
      description: "Became authorized dealers for all major smartphone brands"
    },
    {
      year: "2024",
      title: "Excellence Award",
      description: "Recognized as 'Best Mobile Retailer' by industry association"
    }
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      {/* <section className="bg-gradient-to-r from-primary to-primary-glow text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About SMART MOBILE</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-white/90">
            Your trusted mobile technology partner since 2001. We're passionate about connecting 
            people with the perfect mobile devices for their lifestyle.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link to="/contact">Get in Touch</Link>
          </Button>
        </div>
      </section> */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${aboutImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary-glow/60" />
        </div>
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About SMART MOBILE</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-white/90">
            Your trusted mobile technology partner since 2001. We're passionate about connecting 
            people with the perfect mobile devices for their lifestyle.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link to="/contact">Get in Touch</Link>
          </Button>
        </div>
      </section>
      {/* Our Story */}
      <section className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl font-bold">Our Story</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            SMART MOBILE began as a dream to bridge the gap between cutting-edge mobile technology 
            and everyday users. Founded by a father with over 20 years of experience in retail, 
            our company was built on the simple belief that everyone deserves access to the best 
            mobile technology, regardless of their technical knowledge or budget.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed">
            What started as a small shop has grown into a trusted name in mobile retail, serving 
            thousands of satisfied customers. We've maintained our family business values while 
            embracing modern technology to provide the best possible shopping experience.
          </p>
        </div>
      </section>

      {/* Our Values */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Core Values</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              These principles guide everything we do and shape how we serve our customers
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center hover:shadow-card transition-shadow">
                <CardContent className="p-6 space-y-4">
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <value.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Journey</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            From humble beginnings to becoming a trusted leader in mobile retail
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {milestone.year}
                  </div>
                </div>
                <Card className="flex-1">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{milestone.title}</h3>
                    <p className="text-muted-foreground">{milestone.description}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-primary text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl font-bold">10,000+</div>
              <div className="text-white/80">Happy Customers</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold">50+</div>
              <div className="text-white/80">Product Models</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold">99%</div>
              <div className="text-white/80">Satisfaction Rate</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold">9</div>
              <div className="text-white/80">Years Experience</div>
            </div>
          </div>
        </div>
      </section>

      {/* Team & Contact Info */}
      <section className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Meet Our Team</h2>
            <p className="text-muted-foreground leading-relaxed">
              Our experienced team combines technical expertise with genuine care for customer 
              satisfaction. Led by our founder, we're committed to helping you find the perfect 
              mobile solution for your needs.
            </p>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-primary" />
                <span>Expert technical guidance</span>
              </div>
              <div className="flex items-center space-x-3">
                <Award className="h-5 w-5 text-primary" />
                <span>Certified product specialists</span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-primary" />
                <span>Ongoing customer support</span>
              </div>
            </div>
          </div>
          
          <Card>
            <CardContent className="p-8 space-y-6">
              <h3 className="text-2xl font-bold">Ready to Find Your Perfect Phone?</h3>
              <p className="text-muted-foreground">
                Whether you're upgrading, switching brands, or buying your first smartphone, 
                we're here to help you make the right choice.
              </p>
              <div className="space-y-3">
                <Button className="w-full" size="lg" asChild>
                  <Link to="/products">Browse Our Products</Link>
                </Button>
                <Button variant="outline" className="w-full" size="lg" asChild>
                  <Link to="/contact">Schedule Consultation</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default About;