import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "react-router-dom";
import { Search, Star, Filter } from "lucide-react";

const Products = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("featured");

  const products = [
    {
      id: 1,
      name: "iPhone 15 Pro Max",
      brand: "Apple",
      category: "smartphone",
      price: 1199,
      originalPrice: 1299,
      image: "/placeholder.svg",
      rating: 4.9,
      reviews: 1250,
      badge: "Bestseller",
      specs: ["256GB Storage", "Pro Camera System", "Titanium Design"]
    },
    {
      id: 2,
      name: "Samsung Galaxy S24 Ultra",
      brand: "Samsung",
      category: "smartphone",
      price: 1099,
      originalPrice: 1199,
      image: "/placeholder.svg",
      rating: 4.8,
      reviews: 980,
      badge: "Featured",
      specs: ["512GB Storage", "S Pen Included", "AI Camera"]
    },
    {
      id: 3,
      name: "Google Pixel 8 Pro",
      brand: "Google",
      category: "smartphone",
      price: 899,
      originalPrice: 999,
      image: "/placeholder.svg",
      rating: 4.7,
      reviews: 750,
      badge: "Great Value",
      specs: ["128GB Storage", "AI Photography", "Pure Android"]
    },
    {
      id: 4,
      name: "iPhone 15",
      brand: "Apple",
      category: "smartphone",
      price: 799,
      originalPrice: 899,
      image: "/placeholder.svg",
      rating: 4.6,
      reviews: 890,
      badge: "Popular",
      specs: ["128GB Storage", "Dynamic Island", "USB-C"]
    },
    {
      id: 5,
      name: "Samsung Galaxy A54",
      brand: "Samsung",
      category: "smartphone",
      price: 449,
      originalPrice: 499,
      image: "/placeholder.svg",
      rating: 4.4,
      reviews: 650,
      badge: "Budget Pick",
      specs: ["128GB Storage", "50MP Camera", "5000mAh Battery"]
    },
    {
      id: 6,
      name: "OnePlus 12",
      brand: "OnePlus",
      category: "smartphone",
      price: 699,
      originalPrice: 799,
      image: "/placeholder.svg",
      rating: 4.5,
      reviews: 420,
      badge: "Performance",
      specs: ["256GB Storage", "Fast Charging", "Hasselblad Camera"]
    }
  ];

  const brands = ["Apple", "Samsung", "Google", "OnePlus"];
  const categories = ["smartphone", "accessory"];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBrand = selectedBrand === "all" || product.brand === selectedBrand;
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesBrand && matchesCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      case "name":
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Our Products</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Discover our complete range of premium mobile phones and accessories
        </p>
      </div>

      {/* Filters */}
      <div className="bg-muted/30 p-6 rounded-lg space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Filter & Search</h2>
        </div>
        
        <div className="grid gap-4 md:grid-cols-5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={selectedBrand} onValueChange={setSelectedBrand}>
            <SelectTrigger>
              <SelectValue placeholder="All Brands" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Brands</SelectItem>
              {brands.map(brand => (
                <SelectItem key={brand} value={brand}>{brand}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}s
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="name">Name A-Z</SelectItem>
            </SelectContent>
          </Select>
          
          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery("");
              setSelectedBrand("all");
              setSelectedCategory("all");
              setSortBy("featured");
            }}
          >
            Clear Filters
          </Button>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          Showing {sortedProducts.length} of {products.length} products
        </p>
      </div>

      {/* Products Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sortedProducts.map((product) => (
          <Card key={product.id} className="group hover:shadow-elevated transition-all duration-300">
            <CardHeader className="space-y-4">
              <div className="relative">
                {product.badge && (
                  <Badge className="absolute top-2 left-2 z-10">{product.badge}</Badge>
                )}
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-lg bg-muted"
                />
              </div>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">{product.brand}</div>
                <CardTitle className="group-hover:text-primary transition-colors">
                  {product.name}
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="ml-1 text-sm font-medium">{product.rating}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    ({product.reviews} reviews)
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-primary">${product.price}</span>
                  {product.originalPrice > product.price && (
                    <span className="text-lg text-muted-foreground line-through">
                      ${product.originalPrice}
                    </span>
                  )}
                </div>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {product.specs.map((spec, index) => (
                    <li key={index}>• {spec}</li>
                  ))}
                </ul>
              </div>
              <div className="flex gap-2">
                <Button className="flex-1" asChild>
                  <Link to={`/products/${product.id}`}>
                    View Details
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/contact">
                    Enquire
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {sortedProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">
            No products found matching your criteria.
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => {
              setSearchQuery("");
              setSelectedBrand("all");
              setSelectedCategory("all");
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default Products;