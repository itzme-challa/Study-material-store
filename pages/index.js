import { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/products.json').then((res) => res.json()).catch(() => []),
      fetch('/material.json').then((res) => res.json()).catch(() => []),
    ])
      .then(([productsData, materialData]) => {
        const materialProducts = transformMaterialToProducts(materialData);
        setProducts([...productsData, ...materialProducts]);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error loading data:', error);
        setIsLoading(false);
      });
  }, []);

  function transformMaterialToProducts(materialData) {
    let idCounter = 1000; // offset to prevent ID clash
    const category = 'NEET,JEE,BOARDS';

    return materialData.flatMap((group) =>
      group.items.map((item) => ({
        id: idCounter++,
        name: item.label,
        link: `https://t.me/Material_eduhubkmrbot?start=${item.key}`,
        description: `${item.label} - ${group.title}`,
        category,
      }))
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <ToastContainer />
      <main className="flex-grow">
        <div className="hero bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Discover Your Next Favorite Book</h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto">
              Explore our curated collection of premium study materials and books to excel in your learning journey.
            </p>
          </div>
        </div>
        <div className="container mx-auto px-4 py-12">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : (
            <>
              <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Our Collection</h2>
              <div className="product-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
