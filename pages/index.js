import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import ProductCard from '../components/ProductCard';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CouponBanner from '../components/CouponBanner';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch('/products.json')
      .then((res) => res.json())
      .then((data) => {
        // Add random ratings between 4 and 5
        const productsWithRatings = data.map(product => ({
          ...product,
          rating: (Math.random() * 1 + 4).toFixed(1), // 4.0 to 5.0
          reviews: Math.floor(Math.random() * 100) + 20 // 20-120 reviews
        }));
        setProducts(productsWithRatings);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error loading products:', error);
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <ToastContainer position="bottom-right" />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="hero bg-gradient-to-r from-indigo-900 to-purple-800 text-white py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Premium Educational Resources</h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-8">
              Access high-quality study materials to excel in your exams and master your subjects
            </p>
            <button 
              onClick={() => window.scrollTo({ top: document.querySelector('.products-section').offsetTop - 100, behavior: 'smooth' })}
              className="bg-white text-indigo-800 font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition-all shadow-lg"
            >
              Browse Books
            </button>
          </div>
        </div>

        {/* Coupon Banner */}
        <CouponBanner />

        {/* Products Section */}
        <section className="products-section container mx-auto px-4 py-12 md:py-16">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900">Featured Books</h2>
                <div className="text-indigo-600 font-medium">Showing {products.length} products</div>
              </div>
              
              <div className="product-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {products.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onClick={() => router.push(`/products/${product.id}`)}
                  />
                ))}
              </div>
            </>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
