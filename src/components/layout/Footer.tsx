import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { Button } from "../ui/button";

const Footer = () => {
  return (
    <footer className="bg-muted/30 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Phone className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">SMART MOBILE</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Your trusted partner for premium mobile phones and accessories. 
              Quality products, competitive prices, exceptional service.
            </p>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-semibold">Quick Links</h3>
            <nav className="flex flex-col space-y-2">
              <Link to="/" className="text-sm text-muted-foreground hover:text-primary">
                Home
              </Link>
              <Link to="/products" className="text-sm text-muted-foreground hover:text-primary">
                Products
              </Link>
              <Link to="/about" className="text-sm text-muted-foreground hover:text-primary">
                About Us
              </Link>
              <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary">
                Contact
              </Link>
            </nav>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-semibold">Contact Info</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                 <a href="tel:+919985007788" className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>+91 9985 007 788</span>
                </a>
              </div>
             <div className="flex items-center space-x-4 text-sm text-muted-foreground">
             <a href="mailto:smartmobile007788@gmail.com" className="flex items-center space-x-2">
                 <Mail className="h-4 w-4" />
                 <span>smartmobile007788@gmail.com</span>
             </a>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <MapPin className="h-10 w-10" />
                <span>Lalitha Complex, 28-1-12A, Eluru Rd, Opposite Raj Towers, Vijayawada, Andhra Pradesh</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-semibold">Business Hours</h3>
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
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; 2025 SMART MOBILE. All rights reserved. | Built with care for our customers.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;