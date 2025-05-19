import Image from 'next/image';
import StarRating from './StarRating';

export default function ProductCard({ product, onClick }) {
  return (
    <div 
      onClick={onClick}
      className="product-card bg-white rounded-xl shadow-md overflow-hidden cursor-pointer transition-all hover:shadow-xl hover:-translate-y-1"
    >
      <div className="relative h-48 sm:h-56 w-full bg-gray-100">
        <Image 
          src={product.image || '/default-book.jpg'} 
          alt={product.name} 
          fill
          className="object-contain"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
      </div>
      
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 mb-1 truncate">{product.name}</h3>
        
        <div className="flex items-center mb-2">
          <StarRating rating={parseFloat(product.rating)} />
          <span className="ml-1 text-sm text-gray-600">{product.rating}</span>
        </div>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
        
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-indigo-600">₹{product.price}</span>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
            className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-md text-sm font-medium hover:bg-indigo-200 transition-colors"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}
