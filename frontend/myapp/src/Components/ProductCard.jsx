import axios from "axios";
import { useAuth } from "../Context/AuthContext";
function ProductCard({ product }) {

  const {accessToken,addTrackedProduct } = useAuth()

  async function handleTrackedProduct(product) {
  try {
    

    const res =await axios.post(
      "http://localhost:8000/api/v1/track-product/",
      {
        product_url: product.url,
        product_title: product.title,
        current_price: product.price,
        target_price: product.price // default same as current
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );

    alert("Product tracked successfully!");
    addTrackedProduct(res.data);
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
  }
}

  // console.log(product)
  return (
    <div className="product-card card shadow-sm border-0 h-100">
      <a href="#">
        <div className="product-image-wrapper">
          {product.image ? (
            <img
              src={product.image}
              alt={product.title}
              className="product-image card-img-top"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://placehold.co/300x300/cccccc/000000?text=Image+Error";
              }}
            />
          ) : (
            <div className="image-placeholder">{product.title}</div>
          )}
        </div>
      </a>
      <div className="card-body text-center p-3">
        <a href={product.url} className="product-title" target="blank">
          {product.title}
        </a>
        <p className="product-price">
          Amazon: <span>₹{product.price ? product.price.toLocaleString() : "N/A"}</span>
        </p>
        <button className="track-btn btn w-100" onClick={()=> handleTrackedProduct(product)}>Track Price</button>
      </div>
    </div>
  );
}

export default ProductCard;
