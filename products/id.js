import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import StarRating from '../../components/StarRating';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ProductDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [couponCode, setCouponCode] = useState('');
  const [discountedPrice, setDiscountedPrice] = useState(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  useEffect(() => {
    if (!id) return;

    fetch('/products.json')
      .then((res) => res.json())
      .then((data) => {
        const foundProduct = data.find(p => p.id === id);
        if (foundProduct) {
          // Add rating and reviews for demo
          const productWithRating = {
            ...foundProduct,
            rating: (Math.random() * 1 + 4).toFixed(1),
            reviews: Math.floor(Math.random() * 100) + 20
          };
          setProduct(productWithRating);
        } else {
          toast.error('Product not found');
          router.push('/');
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error loading product:', error);
        toast.error('Failed to load product');
        setIsLoading(false);
      });
  }, [id]);

  const applyCoupon = () => {
    if (!couponCode) return;
    
    setIsApplyingCoupon(true);
    // Simulate API call
    setTimeout(() => {
      if (couponCode.toUpperCase() === 'STUDY20') {
        const discount = product.price * 0.2;
        setDiscountedPrice(product.price - discount);
        toast.success('Coupon applied! 20% discount');
      } else if (couponCode.toUpperCase() === 'LEARN15') {
        const discount = product.price * 0.15;
        setDiscountedPrice(product.price - discount);
        toast.success('Coupon applied! 15% discount');
      } else {
        toast.error('Invalid coupon code');
      }
      setIsApplyingCoupon(false);
    }, 1000);
  };

  const handleBuyNow = async () => {
    toast.info('Redirecting to checkout...');
    // Your existing payment logic here
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <p className="text-gray-600">Product not found</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <ToastContainer position="bottom-right" />
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-12">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="md:flex">
              {/* Product Image */}
              <div className="md:w-1/2 lg:w-2/5 p-6 md:p-8">
                <div className="relative h-64 md:h-80 lg:h-96 rounded-lg overflow-hidden bg-gray-100">
                  <img 
                    src={product.image || '/default-book.jpg'} 
                    alt={product.name}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
              
              {/* Product Details */}
              <div className="md:w-1/2 lg:w-3/5 p-6 md:p-8">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                
                <div className="flex items-center mb-4">
                  <StarRating rating={parseFloat(product.rating)} />
                  <span className="ml-2 text-gray-600">{product.rating} ({product.reviews} reviews)</span>
                </div>
                
                <div className="mb-6">
                  <span className={`text-3xl font-bold ${discountedPrice ? 'text-red-500' : 'text-indigo-600'}`}>
                    ₹{discountedPrice || product.price}
                  </span>
                  {discountedPrice && (
                    <span className="ml-2 text-gray-500 line-through">₹{product.price}</span>
                  )}
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Description</h3>
                  <p className="text-gray-700">{product.description}</p>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Features</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {product.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
                
                {/* Coupon Code */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-2">Apply Coupon</h3>
                  <div className="flex">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Enter coupon code"
                      className="flex-grow px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                      onClick={applyCoupon}
                      disabled={isApplyingCoupon}
                      className={`bg-indigo-600 text-white px-4 py-2 rounded-r-lg hover:bg-indigo-700 transition-colors ${
                        isApplyingCoupon ? 'opacity-75 cursor-not-allowed' : ''
                      }`}
                    >
                      {isApplyingCoupon ? 'Applying...' : 'Apply'}
                    </button>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    Try <span className="font-mono bg-gray-100 px-1">STUDY20</span> for 20% off or <span className="font-mono bg-gray-100 px-1">LEARN15</span> for 15% off
                  </p>
                </div>
                
                <button
                  onClick={handleBuyNow}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
