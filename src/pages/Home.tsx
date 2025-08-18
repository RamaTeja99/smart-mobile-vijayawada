import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Star,
  Smartphone,
  Shield,
  Truck,
  Headphones,
} from "lucide-react";
import heroImage from "@/assets/hero-mobile-store.jpg";
import { useFeaturedProducts } from "./hooks";
import { Product } from "./api";

const Home = () => {
  const { products: featuredProducts, loading: featuredLoading } =
    useFeaturedProducts(3);
  const features = [
    {
      icon: Smartphone,
      title: "Latest Models",
      description: "Access to the newest smartphones from all major brands",
    },
    {
      icon: Shield,
      title: "Warranty Protected",
      description: "All devices come with comprehensive warranty coverage",
    },
    {
      icon: Truck,
      title: "Fast Delivery",
      description: "Quick and secure delivery to your doorstep",
    },
    {
      icon: Headphones,
      title: "Expert Support",
      description: "Professional guidance and after-sales support",
    },
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary-glow/60" />
        </div>
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Premium Mobile Phones <br /> For Everyone
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto text-white/90">
            Discover the latest smartphones and accessories at unbeatable
            prices. Your trusted mobile technology partner.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              asChild
              className="text-lg px-8 py-6"
            >
              <Link to="/products">
                Shop Now <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="secondary"
              asChild
              className="text-lg px-8 py-6"
            >
              <Link to="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Featured Products</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Handpicked selection of the most popular and advanced smartphones
          </p>
        </div>

        {featuredLoading ? (
          <div className="grid md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-4">
                  <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                  <div className="space-y-2">
                    <div className="bg-gray-200 h-4 rounded w-3/4"></div>
                    <div className="bg-gray-200 h-4 rounded w-1/2"></div>
                    <div className="bg-gray-200 h-4 rounded w-1/4"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <Card
                key={product.id}
                className="group hover:shadow-elevated transition-all duration-300 cursor-pointer"
              >
                <CardHeader className="space-y-4">
                  <div className="relative">
                    {product.is_bestseller && (
                      <Badge className="absolute top-2 left-2 z-10">
                        Bestseller
                      </Badge>
                    )}
                    {product.discount_percentage > 0 && (
                      <Badge className="absolute top-2 right-2 z-10 bg-red-500">
                        -{product.discount_percentage}%
                      </Badge>
                    )}
                    <img
                      src={
                        product.featured_image ||
                        product.images[0] ||
                        "/placeholder.svg"
                      }
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-lg bg-muted"
                      onError={(e) =>
                        (e.currentTarget.src = "/placeholder.svg")
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <CardTitle className="group-hover:text-primary transition-colors">
                      {product.name}
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="ml-1 text-sm font-medium">
                          {product.average_rating?.toFixed(1) || "0.0"}
                        </span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        ({product.total_reviews || 0} reviews)
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-primary">
                      ₹ {product.price_display.slice(1)}
                    </span>
                    {product.original_price &&
                      product.original_price > product.price && (
                        <span className="text-lg text-muted-foreground line-through">
                          ₹{product.original_price}
                        </span>
                      )}
                  </div>
                  <Button className="w-full" asChild>
                    <Link to={`/products/${product.id}`}>View Details</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Button variant="outline" size="lg" asChild>
            <Link to="/products">
              View All Products <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose SMARTMOBILE?</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We're committed to providing exceptional service and the best
              mobile technology experience
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center space-y-4">
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-primary to-primary-glow rounded-2xl p-8 md:p-12 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Find Your Perfect Phone?
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Browse our extensive collection or get personalized recommendations
            from our experts
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/products">Browse Products</Link>
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <Link to="/contact">Contact Expert</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
