import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, ArrowLeft, Heart, Share2, Shield, Truck, RotateCcw } from "lucide-react";

const ProductDetail = () => {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);

  // Mock product data (in real app, fetch based on id)
  const product = {
    id: 1,
    name: "iPhone 15 Pro Max",
    brand: "Apple",
    price: 1199,
    originalPrice: 1299,
    images: [
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg"
    ],
    rating: 4.9,
    reviews: 1250,
    badge: "Bestseller",
    shortDescription: "The most advanced iPhone ever with titanium design and pro camera system.",
    description: "The iPhone 15 Pro Max represents the pinnacle of smartphone technology. Featuring a stunning titanium design that's both lightweight and incredibly durable, this device delivers unprecedented performance with the A17 Pro chip. The advanced camera system captures professional-quality photos and videos in any lighting condition.",
    specs: {
      "Display": "6.7-inch Super Retina XDR",
      "Chip": "A17 Pro with 6-core GPU",
      "Storage": "256GB",
      "Camera": "48MP Main, 12MP Ultra Wide, 12MP Telephoto",
      "Battery": "Up to 29 hours video playback",
      "Connectivity": "5G, Wi-Fi 6E, Bluetooth 5.3",
      "Operating System": "iOS 17",
      "Material": "Titanium with Ceramic Shield front"
    },
    features: [
      "Pro Camera System with 5x Telephoto zoom",
      "Action Button for quick shortcuts",
      "USB-C connectivity",
      "Crash Detection and Emergency SOS",
      "Face ID for secure authentication",
      "Water resistance (IP68)"
    ],
    warranty: "1-year limited warranty + 90 days technical support",
    inStock: true
  };

  const relatedProducts = [
    {
      id: 2,
      name: "iPhone 15 Pro",
      price: 999,
      image: "/placeholder.svg",
      rating: 4.8
    },
    {
      id: 4,
      name: "iPhone 15",
      price: 799,
      image: "/placeholder.svg",
      rating: 4.6
    },
    {
      id: 7,
      name: "iPhone 15 Plus",
      price: 899,
      image: "/placeholder.svg",
      rating: 4.7
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
        <Link to="/" className="hover:text-primary">Home</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-primary">Products</Link>
        <span>/</span>
        <span>{product.name}</span>
      </div>

      <Button variant="ghost" asChild className="mb-6">
        <Link to="/products">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Link>
      </Button>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative">
            {product.badge && (
              <Badge className="absolute top-4 left-4 z-10">{product.badge}</Badge>
            )}
            <img
              src={product.images[selectedImage]}
              alt={product.name}
              className="w-full h-96 object-cover rounded-lg bg-muted"
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`rounded-lg overflow-hidden border-2 transition-colors ${
                  selectedImage === index ? "border-primary" : "border-border"
                }`}
              >
                <img
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  className="w-full h-20 object-cover bg-muted"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <div className="text-sm text-muted-foreground mb-2">{product.brand}</div>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="ml-1 font-medium">{product.rating}</span>
              </div>
              <span className="text-muted-foreground">
                ({product.reviews} reviews)
              </span>
            </div>
            <p className="text-muted-foreground text-lg">{product.shortDescription}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold text-primary">${product.price}</span>
              {product.originalPrice > product.price && (
                <span className="text-xl text-muted-foreground line-through">
                  ${product.originalPrice}
                </span>
              )}
              {product.originalPrice > product.price && (
                <Badge variant="secondary">
                  Save ${product.originalPrice - product.price}
                </Badge>
              )}
            </div>
            <div className={`text-sm ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
              {product.inStock ? '✓ In Stock' : '✗ Out of Stock'}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <div className="flex gap-3">
              <Button size="lg" className="flex-1" asChild>
                <Link to="/contact">
                  Contact for Purchase
                </Link>
              </Button>
              <Button variant="outline" size="lg">
                <Heart className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
            <Button variant="outline" size="lg" className="w-full" asChild>
              <Link to="/contact">
                Request Quote / More Info
              </Link>
            </Button>
          </div>

          {/* Quick Benefits */}
          <div className="grid grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
            <div className="text-center space-y-2">
              <Shield className="h-6 w-6 mx-auto text-primary" />
              <div className="text-sm">
                <div className="font-medium">Warranty</div>
                <div className="text-muted-foreground">Protected</div>
              </div>
            </div>
            <div className="text-center space-y-2">
              <Truck className="h-6 w-6 mx-auto text-primary" />
              <div className="text-sm">
                <div className="font-medium">Free</div>
                <div className="text-muted-foreground">Delivery</div>
              </div>
            </div>
            <div className="text-center space-y-2">
              <RotateCcw className="h-6 w-6 mx-auto text-primary" />
              <div className="text-sm">
                <div className="font-medium">30-Day</div>
                <div className="text-muted-foreground">Returns</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="mt-16">
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
          </TabsList>
          
          <TabsContent value="description" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Product Description</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
                <div className="mt-6">
                  <h4 className="font-semibold mb-2">Warranty Information</h4>
                  <p className="text-sm text-muted-foreground">{product.warranty}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="specifications" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Technical Specifications</h3>
                <div className="grid gap-4">
                  {Object.entries(product.specs).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b">
                      <span className="font-medium">{key}</span>
                      <span className="text-muted-foreground">{value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="features" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Key Features</h3>
                <ul className="space-y-3">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Related Products */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-8">Related Products</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {relatedProducts.map((relatedProduct) => (
            <Card key={relatedProduct.id} className="hover:shadow-card transition-shadow">
              <CardContent className="p-4">
                <img
                  src={relatedProduct.image}
                  alt={relatedProduct.name}
                  className="w-full h-32 object-cover rounded-lg bg-muted mb-4"
                />
                <h3 className="font-semibold mb-2">{relatedProduct.name}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-primary">${relatedProduct.price}</span>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="ml-1 text-sm">{relatedProduct.rating}</span>
                  </div>
                </div>
                <Button className="w-full mt-4" variant="outline" asChild>
                  <Link to={`/products/${relatedProduct.id}`}>
                    View Details
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;