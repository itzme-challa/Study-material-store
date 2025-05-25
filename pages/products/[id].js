import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ProductPage() {
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

        const found = allProducts.find((item) => item.id.toString() === id);
        setProduct(found || null);
      } catch (error) {
        console.error('Error fetching product:', error);
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
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <ToastContainer />
      <main className="flex-grow container mx-auto px-4 py-12">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : !product ? (
          <p className="text-center text-gray-500">Product not found.</p>
        ) : (
          <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-6 border border-gray-200">
            <h1 className="text-4xl font-bold text-indigo-700 mb-2">{product.name}</h1>
            <p className="text-gray-600 mb-4">{product.description}</p>

            <div className="flex items-center mb-4">
              <div className="flex text-yellow-400 text-xl">
                {'★★★★★'.split('').map((_, idx) => (
                  <span key={idx}>★</span>
                ))}
              </div>
              <span className="ml-2 text-sm text-gray-500">(4.9/5 rating)</span>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {product.category?.split(',').map((cat) => (
                <span
                  key={cat}
                  className="bg-indigo-100 text-indigo-700 px-3 py-1 text-sm font-medium rounded-full"
                >
                  {cat.trim()}
                </span>
              ))}
            </div>

            <a
              href={product.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-semibold px-6 py-3 rounded-xl shadow"
            >
              Access on Telegram
            </a>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
