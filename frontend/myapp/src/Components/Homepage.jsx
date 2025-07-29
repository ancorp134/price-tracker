import "../assets/css/homepage.css"
import Products from './Products'

function Homepage(){


    return (
    <div>
      
    <section className="bg-primary text-white text-center py-5 rounded-lg shadow-lg home dark" >
        <h1 className="dark display-3 fw-bold mb-3">
            Track Prices, Save Money. Get Alerts.
        </h1>
        <p className="lead dark mb-4">
          Your ultimate tool for smart shopping on Amazon and Flipkart.
        </p>
        <div className="mx-auto d-flex rounded overflow-hidden" style={{ maxWidth: '800px' }}>
          <input
            type="text"
            placeholder="Paste Amazon or Flipkart Product URL here..."
            className="form-control p-3 border-0 rounded-0"
          />
          <button className="btn dark px-4 py-2 fw-semibold">
            Track Price
          </button>
        </div>

    </section>  

    <Products></Products>
    </div>
    )
}

export default Homepage;