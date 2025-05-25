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
        image: '/default-product.jpg', // fallback image
      }))
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <ToastContainer />
      <main className="flex-grow container mx-auto px-4 py-10">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : !product ? (
          <p className="text-center text-gray-500">Product not found.</p>
        ) : (
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
            <div className="md:flex">
              <div className="flex-shrink-0 w-full md:w-64">
                <img
                  src={product.image || '/default-product.jpg'}
                  alt={product.name}
                  className="object-cover h-64 w-full md:h-full md:w-64"
                />
              </div>
              <div className="p-6 flex flex-col justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-indigo-700 mb-2">{product.name}</h1>
                  <p className="text-gray-600 mb-4">{product.description}</p>

                  <div className="flex items-center mb-3">
                    <div className="flex text-yellow-400 text-lg">
                      {'★★★★★'.split('').map((_, idx) => (
                        <span key={idx}>★</span>
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-500">(4.9/5 rating)</span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {product.category?.split(',').map((cat) => (
                      <span
                        key={cat}
                        className="bg-indigo-100 text-indigo-700 px-3 py-1 text-sm font-medium rounded-full"
                      >
                        {cat.trim()}
                      </span>
                    ))}
                  </div>
                </div>

                <a
                  href={product.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-block bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-semibold px-6 py-3 rounded-xl shadow"
                >
                  Buy Now on Telegram
                </a>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
