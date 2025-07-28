import ProductCard from "./ProductCard";
import "../assets/css/products.css";
import { useState, useEffect, useRef } from "react";
import Pagination from "react-bootstrap/Pagination";
import Spinner from "react-bootstrap/Spinner";

function Products() {
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const socketRef = useRef(null);

  //pagination logic

  let activepage = currentPage;
  let items = [];

  for (let page = 1; page <= totalPages; page++) {
    items.push(
      <Pagination.Item
        key={page}
        active={page == activepage}
        onClick={() => requestPage(page)}
      >
        {page}
      </Pagination.Item>
    );
  }

  const requestPage = (page) => {
    // console.log("entering.....")
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ action: "get_page", page }));
    }
    setCurrentPage(page);
  };

  useEffect(() => {
    const socket = new WebSocket(
      `ws://${window.location.hostname}:8000/ws/featured/`
    );

    socketRef.current = socket;

    socket.onopen = () => {
      // console.log("✅ WebSocket connected");
      socket.send(JSON.stringify({ action: "get_page", page: 1 }));
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      // console.log("📩 Message from server:", data);

      if (data.products) {
        setProducts(Array.isArray(data.products) ? data.products : []);
        setTotalPages(data.total_pages);
        setCurrentPage(data.page);
        setLoading(false);
      }

      if (data.type === "update_available") {
        // console.log("🔔 New data available, refreshing...");
        socket.send(JSON.stringify({ action: "get_page", page: currentPage }));
      }
    };

    socket.onclose = (event) => {
      // console.log("❌ WebSocket disconnected", event);
    };

    socket.onerror = (error) => {
      // console.error("⚠️ WebSocket error", error);
    };

    return () => {
      // console.log("Cleaning up WebSocket...");
      socket.close();
    };
  }, []);

  return (
    <section id="featured" className="py-5">
      <h2 className="text-center mb-4 text-white">
        Trending Deals You Can't Miss
      </h2>

      {loading ? (
        <div className="col-md-6 mx-auto mt-4 d-flex justify-content-center">
          <Spinner animation="grow" variant="primary" />
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-4 g-4">
          {products.map((product, index) => (
            <div className="col" key={index}>
              <ProductCard product={product} />
            </div>
          ))}

          <div className="col-md-6 mx-auto mt-4 d-flex justify-content-center">
            <Pagination className="justify-content-center">
              <Pagination.First
                onClick={() => requestPage(1)}
                disabled={currentPage === 1}
              />
              <Pagination.Prev
                onClick={() => requestPage(currentPage - 1)}
                disabled={currentPage === 1}
              />
              {items}
              <Pagination.Next
                onClick={() => requestPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              />
              <Pagination.Last
                onClick={() => requestPage(totalPages)}
                disabled={currentPage === totalPages}
              />
            </Pagination>
          </div>
        </div>
      )}
    </section>
  );
}

export default Products;
