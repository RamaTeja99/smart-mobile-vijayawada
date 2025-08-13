import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "react-router-dom";
import { Search, Star, Filter, Loader2 } from "lucide-react";
import { useProductSearch, useSearchFilters } from "./hooks";
import { Product, SearchParams } from "./api";

const Products = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number | undefined>();
  const [sortBy, setSortBy] = useState<string>("relevance");
  const [inStock, setInStock] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);

  const { filters, loading: filtersLoading } = useSearchFilters();

  // Build API search parameters
  const searchParams: SearchParams = {
    ...(searchQuery && { query: searchQuery }),
    ...(selectedBrand !== "all" && { brand: selectedBrand }),
    ...(selectedCategory !== "all" && { category: selectedCategory }),
    ...(minPrice > 0 && { min_price: minPrice }),
    ...(maxPrice && { max_price: maxPrice }),
    ...(inStock && { in_stock: inStock }),
    sort_by: sortBy as any,
    sort_order: sortBy === "price" ? "asc" : "desc",
    limit: 12,
    offset: (currentPage - 1) * 12,
  };

  const { results: products, loading, error, metadata } = useProductSearch(searchParams);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedBrand, selectedCategory, minPrice, maxPrice, sortBy, inStock]);

  const ProductCard = ({ product }: { product: Product }) => (
    <Card className="group hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        <div className="relative mb-4">
          <img
            src={product.featured_image || product.images[0] || "/placeholder.svg"}
            alt={product.name}
            className="w-full h-48 object-cover rounded-lg"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/placeholder.svg";
            }}
          />

          {/* Badges */}
          <div className="absolute top-2 right-2 flex flex-col gap-1">
            {product.is_bestseller && (
              <Badge className="bg-orange-500 text-white">Bestseller</Badge>
            )}
            {product.is_featured && (
              <Badge className="bg-blue-500 text-white">Featured</Badge>
            )}
            {product.discount_percentage > 0 && (
              <Badge className="bg-red-500 text-white">
                -{product.discount_percentage}%
              </Badge>
            )}
          </div>

          {/* Stock */}
          <div className="absolute bottom-2 left-2">
            <Badge variant={product.in_stock ? "default" : "destructive"}>
              {product.stock_status}
            </Badge>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">{product.brand?.name}</span>
            <span className="text-sm text-gray-500">{product.category?.name}</span>
          </div>
          <h3 className="font-semibold text-lg line-clamp-2">{product.name}</h3>

          {product.short_description && (
            <p className="text-sm text-gray-600 line-clamp-2">
              {product.short_description}
            </p>
          )}

          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm text-gray-600">
              {product.average_rating.toFixed(1)} ({product.total_reviews} reviews)
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-green-600">
                {product.price_display}
              </span>
              {product.original_price &&
                product.original_price > product.price && (
                  <span className="text-sm text-gray-500 line-through">
                    ${product.original_price.toFixed(2)}
                  </span>
                )}
            </div>

            {product.specifications &&
              Object.keys(product.specifications).length > 0 && (
                <div className="text-xs text-gray-500">
                  {Object.values(product.specifications)[0]}
                </div>
              )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const handlePriceRangeChange = (range: string) => {
    if (range === "all") {
      setMinPrice(0);
      setMaxPrice(undefined);
    } else {
      const priceRange = filters?.priceRanges.find((p) => p.label === range);
      if (priceRange) {
        setMinPrice(priceRange.min);
        setMaxPrice(priceRange.max || undefined);
      }
    }
  };

  if (filtersLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading filters...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Discover our complete range of premium mobile phones and accessories
          </h1>
          <p className="text-gray-600">
            Find the perfect device for your needs with advanced search and filtering
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              </div>
            {/* Brand */}
            <div>
              <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                <SelectTrigger>
                  <SelectValue placeholder="All Brands" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Brands</SelectItem>
                  {filters?.brands.map((brand) => (
                    <SelectItem key={brand.id} value={brand.slug}>
                      {brand.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Category */}
            <div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {filters?.categories.map((category) => (
                    <SelectItem key={category.id} value={category.slug}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Price */}
            <div>
              <Select
                value={`${minPrice}-${maxPrice || "max"}`}
                onValueChange={handlePriceRangeChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  {filters?.priceRanges.map((range) => (
                    <SelectItem key={range.label} value={range.label}>
                      {range.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sort */}
            <div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="price">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="name">Name A-Z</SelectItem>
                  <SelectItem value="date">Newest First</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Extra filters */}
          <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={inStock}
                onChange={(e) => setInStock(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">In Stock Only</span>
            </label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setSelectedBrand("all");
                setSelectedCategory("all");
                setMinPrice(0);
                setMaxPrice(undefined);
                setSortBy("relevance");
                setInStock(false);
                setCurrentPage(1);
              }}
            >
              Clear All Filters
            </Button>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            {loading
              ? "Searching..."
              : metadata
              ? `Showing ${products.length} of ${metadata.total} products`
              : "No search performed"}
          </p>
          {metadata && metadata.duration && (
            <p className="text-sm text-gray-500">
              Search completed in {metadata.duration}ms
            </p>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-12">
            <div className="flex items-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Searching products...</span>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        )}

        {/* Products */}
        {!loading && !error && (
          <>
            {products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <Link key={product.id} to={`/products/${product.id}`}>
                    <ProductCard product={product} />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Filter className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No products found
                </h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search criteria or filters
                </p>
                <Button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedBrand("all");
                    setSelectedCategory("all");
                    setMinPrice(0);
                    setMaxPrice(undefined);
                    setInStock(false);
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </>
        )}

        {/* Pagination */}
        {metadata && metadata.total > 12 && (
          <div className="flex justify-center items-center gap-2 mt-12">
            <Button
              variant="outline"
              disabled={!metadata.hasPrev}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              Previous
            </Button>
            <span className="px-4 py-2 text-sm text-gray-600">
              Page {currentPage} of {Math.ceil(metadata.total / 12)}
            </span>
            <Button
              variant="outline"
              disabled={!metadata.hasNext}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
