function ProductCard({ product, onTrackClick }) {
  const lowestCurrentPrice = Math.min(product.currentAmazonPrice, product.currentFlipkartPrice);
  const isAmazonCheaper = product.currentAmazonPrice <= product.currentFlipkartPrice;

  return (
    <div className="rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-105 product-card dark">
      <a href={`/dashboard/products/${product.id}`}>
        <div className="relative w-full h-48">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover rounded-t-lg"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://placehold.co/300x300/cccccc/000000?text=Image+Error";
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-800 font-bold text-lg">
              {product.shortName || product.name.substring(0, 10)}
            </div>
          )}
        </div>
      </a>
      <div className="p-4">
        <a href={`/dashboard/products/${product.id}`}>
          <h4 className="truncate">
            {product.name}
          </h4>
        </a>
        <div className="mt-2 text-sm">
          <p>
            Amazon:{" "}
            <span
              className={
                isAmazonCheaper ? "text-green-600 font-bold" : "font-semibold"
              }
            >
              ₹{product.currentAmazonPrice.toLocaleString("en-IN")}
            </span>
          </p>
          <p>
            Flipkart:{" "}
            <span
              className={
                !isAmazonCheaper ? "text-green-600 font-bold" : "font-semibold"
              }
            >
              ₹{product.currentFlipkartPrice.toLocaleString("en-IN")}
            </span>
          </p>
        </div>
        {product.lowestPriceEver && (
          <p className="text-xs">
            Lowest Ever: ₹{product.lowestPriceEver.toLocaleString("en-IN")}
          </p>
        )}
        <div className="mt-4">
          <button
            
            className="btn px-4 py-2 fw-semibold transition duration-200"
          >
            Track Price
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
