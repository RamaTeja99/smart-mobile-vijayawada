
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Phone, Mail, Share2, MessageSquare, Instagram, Youtube, Star, ExternalLink } from "lucide-react";

const Contact = () => {
  const widgetContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
  const existingScript = document.querySelector('script[src="https://elfsightcdn.com/platform.js"]');

  if (!existingScript) {
    const script = document.createElement("script");
    script.src = "https://elfsightcdn.com/platform.js";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }
}, []);


  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));

    toast({
      title: "Message Sent Successfully!",
      description: "Thank you for your inquiry. We'll get back to you within 24 hours.",
    });

    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: ""
    });
    setIsSubmitting(false);
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Phone",
      details: "+91 9985 007 788",
      subDetails: "+91 8500 547 788"
    },
    {
      icon: Mail,
      title: "Email",
      details: "smartmobile007788@gmail.com",
      subDetails: "We respond within 24 hours"
    },
    {
      icon: MapPin,
      title: "Visit Our Store",
      details: "Lalitha Complex, 28-1-12A, Eluru Rd, Near Besant Road, Opposite Raj Towers, Arundalpet, Governor Peta, Vijayawada, Andhra Pradesh 520002",
      subDetails: ""
    },
    {
      icon: Share2,
      title: "Follow Us",
      details: "Connect with us on social media",
      subDetails: "Stay updated with latest offers & products"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Contact Us</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Have questions about our products or need personalized recommendations? 
          We're here to help you find the perfect mobile solution.
        </p>
      </div>

      {/* Contact Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {contactInfo.map((info, index) => (
          <Card key={index} className="text-center hover:shadow-card transition-shadow">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <info.icon className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-lg">{info.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {index === 3 ? (
                <div className="space-y-3">
                  <p className="font-medium">{info.details}</p>
                  <div className="flex justify-center gap-4">
                    <a 
                      href="https://www.instagram.com/smart_mobile7788?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
                    >
                      <Instagram className="h-5 w-5" />
                      <span className="text-sm">Instagram</span>
                    </a>
                    <a 
                      href="https://youtube.com/@smartmobile-rajesh?si=PvYWWDomECLkb0rQ"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
                    >
                      <Youtube className="h-5 w-5" />
                      <span className="text-sm">YouTube</span>
                    </a>
                  </div>
                  <p className="text-sm text-muted-foreground">{info.subDetails}</p>
                </div>
              ) : (
                <>
                  <p className="font-medium">{info.details}</p>
                  <p className="text-sm text-muted-foreground">{info.subDetails}</p>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-12">
        {/* Contact Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Send us a Message</CardTitle>
              <p className="text-muted-foreground">
                Fill out the form below and we'll get back to you as soon as possible.
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Your full name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+91 xxxx-xxxxxx"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject *</Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="How can we help you?"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Tell us more about your inquiry..."
                    rows={6}
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Contact */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Quick Contact
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href="tel:+919985007788">
                    <Phone className="h-4 w-4 mr-2" />
                    Call Now
                  </a>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href="mailto:smartmobile007788@gmail.com">
                    <Mail className="h-4 w-4 mr-2" />
                    Email Us
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* FAQ */}
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-1">Do you offer trade-ins?</h4>
                  <p className="text-sm text-muted-foreground">
                    Yes! We accept trade-ins for most smartphone models. Contact us for a quote.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">What's your return policy?</h4>
                  <p className="text-sm text-muted-foreground">
                    30-day return policy for all devices in original condition with receipt.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Do you provide warranties?</h4>
                  <p className="text-sm text-muted-foreground">
                    All devices come with manufacturer warranty plus our service guarantee.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Store Hours */}
          <Card>
            <CardHeader>
              <CardTitle>Store Hours</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Monday - Saturday</span>
                  <span>9:00 AM - 9:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span>10:00 AM - 9:00 PM</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Review Us Section */}
      <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Love Our Service?</CardTitle>
        <p className="text-muted-foreground">
          Share your experience and help others discover our exceptional mobile solutions
        </p>
      </CardHeader>

      <div className="my-8">
        {/* Elfsight Google Reviews Widget */}
        <div className="elfsight-app-ea4994cd-7618-4f59-a295-a727d5de11fb" data-elfsight-app-lazy></div>
      </div>
      
      <CardContent className="text-center">
        <Button
          size="lg"
          asChild
          className="bg-gradient-to-r from-primary to-primary-glow hover:opacity-90 transition-opacity"
        >
          <a
            href="https://g.page/r/CaDJduUN74MMEBM/review"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2"
          >
            <Star className="h-4 w-4" />
            Write a Review on Google
            <ExternalLink className="h-4 w-4" />
          </a>
        </Button>
      </CardContent>
    </Card>

      {/* Map Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Find Our Store</CardTitle>
          <p className="text-muted-foreground">
            Visit us in person for hands-on experience with all our products
          </p>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg overflow-hidden h-64 w-full">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3825.240183110837!2d80.62521697460886!3d16.513967727379526!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a35eff36116dd03%3A0xc83ef0de576c9a0!2sSmart%20Mobile!5e0!3m2!1sen!2sin!4v1754404925689!5m2!1sen!2sin"
            className="w-full h-full"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Contact;