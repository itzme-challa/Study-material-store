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
  const [loading, setLoading] = useState(true);

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

        let idCounter = 1000;
        const materialProducts = materialData.flatMap((group) =>
          (group.items || []).map((item) => ({
            id: (idCounter++).toString(),
            name: item.label || 'Untitled',
            link: `https://t.me/Material_eduhubkmrbot?start=${item.key}`,
            description: `${item.label || 'Material'} - ${group.title || 'General'}`,
            category: 'NEET,JEE,BOARDS',
          }))
        );

        const allProducts = [
          ...(productsData || []).map((p) => ({
            ...p,
            id: p.id.toString(),
          })),
          ...materialProducts,
        ];

        const foundProduct = allProducts.find((p) => p.id === id);
        setProduct(foundProduct);
      } catch (err) {
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <p className="text-gray-500 text-lg">Product not found.</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <ToastContainer />
      <main className="flex-grow">
        <div className="hero bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{product.name}</h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto">{product.description}</p>
          </div>
        </div>
        <div className="container mx-auto px-4 py-12">
          <div className="bg-white shadow-lg rounded-2xl p-8 max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">{product.name}</h2>
            <p className="text-gray-700 mb-6">{product.description}</p>
            <p className="text-sm text-gray-500 mb-6">Category: {product.category}</p>
            <a
              href={product.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-indigo-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-indigo-700 transition"
            >
              Buy Now
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
