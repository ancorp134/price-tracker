import ProductCard from "./ProductCard";
import "../assets/css/products.css";
import { useState,useEffect } from "react";

const ALL_PRODUCTS_DATA = [
  {
    id: 'prod-001',
    name: 'Samsung Galaxy S24 Ultra',
    description: 'The latest flagship smartphone from Samsung with advanced camera features and a powerful processor.',
    imageUrl: 'https://placehold.co/300x300/1E90FF/FFFFFF?text=S24+Ultra',
    amazonUrl: 'https://www.amazon.in/dp/B0CKJ9J93N',
    flipkartUrl: 'https://www.flipkart.com/samsung-s24-ultra',
    currentAmazonPrice: 129999,
    currentFlipkartPrice: 128500,
    priceHistory: [
      { date: '2025-01-01', amazonPrice: 135000, flipkartPrice: 134000 },
      { date: '2025-02-01', amazonPrice: 132000, flipkartPrice: 131500 },
      { date: '2025-03-01', amazonPrice: 130500, flipkartPrice: 129800 },
      { date: '2025-04-01', amazonPrice: 129999, flipkartPrice: 129000 },
      { date: '2025-05-01', amazonPrice: 129999, flipkartPrice: 128800 },
      { date: '2025-06-01', amazonPrice: 129999, flipkartPrice: 128500 },
      { date: '2025-07-01', amazonPrice: 129999, flipkartPrice: 128500 },
      { date: '2025-07-15', amazonPrice: 129999, flipkartPrice: 128500 },
    ],
    lowestPriceEver: 128500,
    highestPriceEver: 135000,
    averagePrice: 130800,
  },
  {
    id: 'prod-002',
    name: 'Sony WH-1000XM5 Noise Cancelling Headphones',
    description: 'Industry-leading noise cancellation with exceptional sound quality and comfortable design for all-day listening.',
    imageUrl: 'https://placehold.co/300x300/FF4500/FFFFFF?text=Sony+XM5',
    amazonUrl: 'https://www.amazon.in/dp/B0B4J38M7V',
    flipkartUrl: 'https://www.flipkart.com/sony-wh-1000xm5',
    currentAmazonPrice: 26990,
    currentFlipkartPrice: 25990,
    priceHistory: [
      { date: '2025-01-01', amazonPrice: 29000, flipkartPrice: 28500 },
      { date: '2025-02-01', amazonPrice: 28000, flipkartPrice: 27800 },
      { date: '2025-03-01', amazonPrice: 27500, flipkartPrice: 27000 },
      { date: '2025-04-01', amazonPrice: 26990, flipkartPrice: 26500 },
      { date: '2025-05-01', amazonPrice: 26990, flipkartPrice: 26200 },
      { date: '2025-06-01', amazonPrice: 26990, flipkartPrice: 25990 },
      { date: '2025-07-01', amazonPrice: 26990, flipkartPrice: 25990 },
      { date: '2025-07-15', amazonPrice: 26990, flipkartPrice: 25990 },
    ],
    lowestPriceEver: 25990,
    highestPriceEver: 29000,
    averagePrice: 27100,
  },
  {
    id: 'prod-003',
    name: 'LG 55-inch 4K Smart TV',
    description: 'Immersive 4K visuals with smart features, perfect for your living room entertainment.',
    imageUrl: 'https://placehold.co/300x300/32CD32/FFFFFF?text=LG+TV',
    amazonUrl: 'https://www.amazon.in/dp/B09XXX',
    flipkartUrl: 'https://www.flipkart.com/lg-55-inch-tv',
    currentAmazonPrice: 48999,
    currentFlipkartPrice: 47500,
    priceHistory: [
      { date: '2025-01-01', amazonPrice: 52000, flipkartPrice: 51000 },
      { date: '2025-02-01', amazonPrice: 50000, flipkartPrice: 49500 },
      { date: '2025-03-01', amazonPrice: 49500, flipkartPrice: 48800 },
      { date: '2025-04-01', amazonPrice: 48999, flipkartPrice: 48000 },
      { date: '2025-05-01', amazonPrice: 48999, flipkartPrice: 47800 },
      { date: '2025-06-01', amazonPrice: 48999, flipkartPrice: 47500 },
      { date: '2025-07-01', amazonPrice: 48999, flipkartPrice: 47500 },
      { date: '2025-07-15', amazonPrice: 48999, flipkartPrice: 47500 },
    ],
    lowestPriceEver: 47500,
    highestPriceEver: 52000,
    averagePrice: 49200,
  },
  {
    id: 'prod-004',
    name: 'HP Pavilion Gaming Laptop',
    description: 'Powerful gaming laptop with a fast processor and dedicated graphics card for an immersive gaming experience.',
    imageUrl: 'https://placehold.co/300x300/8A2BE2/FFFFFF?text=HP+Laptop',
    amazonUrl: 'https://www.amazon.in/dp/B09YYY',
    flipkartUrl: 'https://www.flipkart.com/hp-pavilion-gaming-laptop',
    currentAmazonPrice: 75000,
    currentFlipkartPrice: 76500,
    priceHistory: [
      { date: '2025-01-01', amazonPrice: 78000, flipkartPrice: 79000 },
      { date: '2025-02-01', amazonPrice: 77000, flipkartPrice: 78000 },
      { date: '2025-03-01', amazonPrice: 76000, flipkartPrice: 77000 },
      { date: '2025-04-01', amazonPrice: 75000, flipkartPrice: 76500 },
      { date: '2025-05-01', amazonPrice: 75000, flipkartPrice: 76500 },
      { date: '2025-06-01', amazonPrice: 75000, flipkartPrice: 76500 },
      { date: '2025-07-01', amazonPrice: 75000, flipkartPrice: 76500 },
      { date: '2025-07-15', amazonPrice: 75000, flipkartPrice: 76500 },
    ],
    lowestPriceEver: 75000,
    highestPriceEver: 79000,
    averagePrice: 76500,
  },
];



function Products() {

  const [products, setProducts] = useState([]);

  useEffect(() => {
    const socket = new WebSocket(`ws://${window.location.hostname}:8000/ws/featured/`);
    
    socket.onopen = () => {
        console.log("✅ WebSocket connected");
    };

    socket.onmessage = (event) => {
        console.log("📩 Message from server:", event.data);
        setProducts(JSON.parse(event.data))
    };

    socket.onclose = (event) => {
        console.log("❌ WebSocket disconnected", event);
    };

    socket.onerror = (error) => {
        console.error("⚠️ WebSocket error", error);
    };

    return () => {
        console.log(products)
        console.log("Cleaning up WebSocket...");
        socket.close();
    };
  }, []);


  return (
    <section id="featured" className="py-5">
      <h2 className="text-center mb-4 text-white">
        Trending Deals You Can't Miss
      </h2>
      <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-4 g-4">
        {products.map((product,index) => (
          <div className="col" key={index}>
            <ProductCard product={product}  />
          </div>
        ))}
      </div>
    </section>
  );
}

export default Products