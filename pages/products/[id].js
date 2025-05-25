// pages/products/[id].js

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Link from 'next/link';

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
        const combined = [...(productsData || []), ...materialProducts];
        const matched = combined.find((item) => String(item.id) === String(id));

        setProduct(matched || null);
      } catch (error) {
        console.error('Error fetching product:', error);
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
        image: item.image || '/default-product.jpg',
        price: item.price || 0,
      }))
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-12">
        {isLoading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading product...</p>
          </div>
        ) : !product ? (
          <p className="text-center text-gray-500">Product not found.</p>
        ) : (
          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
            {product.image && (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-64 object-cover rounded mb-6"
              />
            )}
            <h1 className="text-3xl font-bold mb-4 text-gray-800">{product.name}</h1>
            <p className="text-gray-700 mb-4">{product.description}</p>
            <p className="text-sm text-gray-500 mb-4">Category: {product.category}</p>
            {product.price > 0 ? (
              <>
                <p className="text-xl font-semibold text-green-600 mb-4">
                  Price: ₹{product.price}
                </p>
                <Link
                  href={`/buy?id=${product.id}`}
                  className="inline-block bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
                >
                  Buy Now
                </Link>
              </>
            ) : (
              <a
                href={product.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition"
              >
                Access Material
              </a>
            )}
            <div className="mt-6">
              <Link href="/" className="text-indigo-600 hover:underline">
                ← Back to Home
              </Link>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
