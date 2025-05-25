// pages/products/[id].js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ProductDetails() {
  const router = useRouter();
  const { id } = router.query;

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const [productsRes, materialRes] = await Promise.all([
          fetch('/products.json'),
          fetch('/material.json'),
        ]);

        const productsData = await productsRes.json().catch(() => []);
        const materialData = await materialRes.json().catch(() => []);

        const materialProducts = transformMaterialToProducts(materialData);
        const allProducts = [...(productsData || []), ...materialProducts];

        const foundProduct = allProducts.find(
          (item) => item.id?.toString() === id.toString()
        );

        setProduct(foundProduct || null);
      } catch (error) {
        console.error('Failed to load product:', error);
        setProduct(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  function transformMaterialToProducts(materialData) {
    let idCounter = 1000;
    const category = 'NEET,JEE,BOARDS';

    if (!Array.isArray(materialData)) return [];

    return materialData.flatMap((group) =>
      (group.items || []).map((item) => ({
        id: idCounter++,
        name: item.label || 'Untitled',
        link: `https://t.me/Material_eduhubkmrbot?start=${item.key}`,
        description: `${item.label || 'Material'} - ${group.title || 'General'}`,
        category,
      }))
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <ToastContainer />
      <main className="flex-grow">
        {isLoading ? (
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : !product ? (
          <div className="text-center py-20">
            <h2 className="text-2xl font-semibold text-gray-700">Product Not Found</h2>
            <p className="text-gray-500 mt-2">The product you are looking for does not exist or was removed.</p>
          </div>
        ) : (
          <section className="container mx-auto px-4 py-12">
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-3xl mx-auto">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
              <p className="text-gray-700 mb-6 text-lg">{product.description}</p>
              {product.category && (
                <p className="text-sm text-indigo-600 font-medium mb-6">
                  Categories: {product.category}
                </p>
              )}
              <a
                href={product.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg transition duration-300"
              >
                Access Material
              </a>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
