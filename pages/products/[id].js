import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ProductPage() {
  const router = useRouter();
  const { id } = router.query;

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

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

  const handleBuyNow = async () => {
    if (!product) return;

    setIsProcessing(true);
    try {
      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: product.name,
          productId: product.id,
          successUrl: `${window.location.origin}/success?productId=${product.id}`,
        }),
      });

      const data = await res.json();
      if (data.paymentLink) {
        window.location.href = data.paymentLink;
      } else {
        toast.error('Failed to initiate payment. Please try again.');
      }
    } catch (err) {
      toast.error('Something went wrong. Please try again.');
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <ToastContainer />
      <main className="flex-grow">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : !product ? (
          <p className="text-center text-gray-500">Product not found.</p>
        ) : (
          <>
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16 text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-2">{product.name}</h1>
              <p className="text-lg">{product.description}</p>
            </div>

            <div className="container mx-auto px-4 py-12 max-w-4xl">
              <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-200">
                <div className="md:flex">
                  <div className="md:w-64 w-full">
                    <img
                      src={product.image || '/default-product.jpg'}
                      alt={product.name}
                      className="object-cover w-full h-64 md:h-full"
                    />
                  </div>
                  <div className="p-6 flex flex-col justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800 mb-2">{product.name}</h2>
                      <p className="text-gray-600 mb-4">{product.description}</p>
                      <div className="flex gap-2 flex-wrap">
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
                    <button
                      onClick={handleBuyNow}
                      disabled={isProcessing}
                      className={`mt-6 inline-block bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-semibold px-6 py-3 rounded-xl shadow ${
                        isProcessing ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      {isProcessing ? 'Processing...' : 'Buy Now'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
