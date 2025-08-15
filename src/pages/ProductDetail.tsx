import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, ArrowLeft, Heart, Share2, Shield, Truck, RotateCcw, Loader2 } from "lucide-react";
import { useProduct, useProducts } from "./hooks";
import { Product } from "./api";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedImage, setSelectedImage] = useState(0);

  const { product, loading, error } = useProduct(id!);

  // Get related products from same category
  const { products: relatedProducts } = useProducts({
    category_id: product?.category?.id,
    limit: 4,
  });

  // Filter out current product from related products
  const filteredRelatedProducts = relatedProducts.filter(p => p.id !== product?.id).slice(0, 3);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="text-lg">Loading product details...</span>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-6">{error || "The product you're looking for doesn't exist."}</p>
          <Link to="/products">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const ProductImageGallery = () => (
    <div className="space-y-4">
      <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
        <img
          src={product.images[selectedImage] || "/placeholder.svg"}
          alt={product.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/placeholder.svg";
          }}
        />
      </div>
      {product.images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {product.images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors $${
                selectedImage === index 
                  ? 'border-blue-500' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <img
                src={image || "/placeholder.svg"}
                alt={`${product.name} ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/placeholder.svg";
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );

  const ShareButton = () => {
    const handleShare = async () => {
      if (navigator.share) {
        try {
          await navigator.share({
            title: product.name,
            text: product.short_description || product.description,
            url: window.location.href,
          });
        } catch (error) {
          console.error('Error sharing:', error);
        }
      } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(window.location.href);
        // You could show a toast here
      }
    };

    return (
      <Button variant="outline" size="sm" onClick={handleShare}>
        <Share2 className="h-4 w-4 mr-2" />
        Share
      </Button>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <Link to="/products" className="hover:text-blue-600">
            Products
          </Link>
          <span>/</span>
          {product.category && (
            <>
              <Link 
                to={`/products?category=${product.category.slug}`}
                className="hover:text-blue-600"
              >
                {product.category.name}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-gray-900">{product.name}</span>
        </nav>

        {/* Back Button */}
        <div className="mb-6">
          <Link to="/products">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Products
            </Button>
          </Link>
        </div>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Images */}
          <div>
            <ProductImageGallery />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Badges */}
            <div className="flex gap-2 flex-wrap">
              {product.is_bestseller && (
                <Badge className="bg-orange-500">Bestseller</Badge>
              )}
              {product.is_featured && (
                <Badge className="bg-blue-500">Featured</Badge>
              )}
              {product.is_new && (
                <Badge className="bg-green-500">New</Badge>
              )}
              {product.discount_percentage > 0 && (
                <Badge className="bg-red-500">
                  -{product.discount_percentage}% OFF
                </Badge>
              )}
            </div>

            {/* Brand */}
            {product.brand && (
              <div className="text-sm text-gray-600">
                <Link 
                  to={`/products?brand=${product.brand.slug}`}
                  className="hover:text-blue-600 font-medium"
                >
                  {product.brand.name}
                </Link>
              </div>
            )}

            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-900">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product.average_rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                {product.average_rating.toFixed(1)} ({product.total_reviews} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-green-600">
                  {product.price_display}
                </span>
                {product.original_price && product.original_price > product.price && (
                  <span className="text-xl text-gray-500 line-through">
                    ${product.original_price.toFixed(2)}
                  </span>
                )}
              </div>
              {product.discount_amount > 0 && (
                <p className="text-sm text-green-600 font-medium">
                  You save ${product.discount_amount}
                </p>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${
                product.in_stock ? 'bg-green-500' : 'bg-red-500'
              }`} />
              <span className={`font-medium ${
                product.in_stock ? 'text-green-600' : 'text-red-600'
              }`}>
                {product.stock_status}
              </span>
              {product.in_stock && product.stock_quantity <= 10 && (
                <span className="text-sm text-orange-600">
                  Only {product.stock_quantity} left!
                </span>
              )}
            </div>

            {/* Short Description */}
            {product.short_description && (
              <p className="text-gray-600 text-lg">
                {product.short_description}
              </p>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <Button 
                size="lg" 
                className="flex-1"
                disabled={!product.in_stock}
              >
                {product.in_stock ? 'Contact for Purchase' : 'Out of Stock'}
              </Button>
              <Button variant="outline" size="lg">
                <Heart className="h-4 w-4" />
              </Button>
              <ShareButton />
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-600" />
                <span className="text-sm">Warranty Protected</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-blue-600" />
                <span className="text-sm">Free Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="h-5 w-5 text-orange-600" />
                <span className="text-sm">30-Day Returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Information Tabs */}
        <Card className="mb-12">
          <CardContent className="p-6">
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="specifications">Specifications</TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="mt-6">
                <div className="prose prose-gray max-w-none">
                  {product.description ? (
                    <div dangerouslySetInnerHTML={{ __html: product.description.replace(/\n/g, '<br/>') }} />
                  ) : (
                    <p>No detailed description available.</p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="specifications" className="mt-6">
                {product.specifications && Object.keys(product.specifications).length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between border-b pb-2">
                        <span className="font-medium text-gray-700">{key}:</span>
                        <span className="text-gray-900">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No specifications available.</p>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Related Products */}
        {filteredRelatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRelatedProducts.map((relatedProduct) => (
                <Link key={relatedProduct.id} to={`/products/${relatedProduct.id}`}>
                  <Card className="group hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className="aspect-square rounded-lg overflow-hidden mb-4 bg-gray-100">
                        <img
                          src={relatedProduct.featured_image || relatedProduct.images[0] || "/placeholder.svg"}
                          alt={relatedProduct.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/placeholder.svg";
                          }}
                        />
                      </div>
                      <h3 className="font-semibold line-clamp-2 mb-2">
                        {relatedProduct.name}
                      </h3>
                      <div className="flex items-center gap-1 mb-2">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm text-gray-600">
                          {relatedProduct.average_rating.toFixed(1)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-green-600">
                          {relatedProduct.price_display}
                        </span>
                        <Badge variant={relatedProduct.in_stock ? "default" : "destructive"}>
                          {relatedProduct.in_stock ? 'In Stock' : 'Out of Stock'}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
