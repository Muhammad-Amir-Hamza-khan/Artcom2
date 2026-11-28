
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
    getProductById,
    getRelatedProducts
} from "../services/productService";

import ProductCard from "../components/ProductCard";

function ProductDetails() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [related, setRelated] = useState([]);
    const [selectedImage, setSelectedImage] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState("Description");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        const fetchProduct = async () => {
            setLoading(true);
            setError("");
            setProduct(null);
            setRelated([]);
            setQuantity(1);

            try {
                const data = await getProductById(id);

                setProduct(data);
                setSelectedImage(data.image_url || "");

                const relatedProducts = await getRelatedProducts(
                    data.category,
                    data.id
                );

                setRelated(relatedProducts);

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();

    }, [id]);

    if (loading) {
        return <div className="details-loading">Loading product...</div>;
    }

    if (error || !product) {
        return (
            <div className="details-loading">
                <h2>Product not found</h2>
                <button onClick={() => navigate("/dashboard")}>
                    Back to Home
                </button>
            </div>
        );
    }

    const images = [
        product.image_url,
        ...(product.gallery_urls || [])
    ].filter(Boolean);

    const specifications = product.specifications || {};

    const discount = product.original_price
        ? Math.round(
            ((product.original_price - product.price) /
                product.original_price) * 100
        )
        : 0;

    const changeQuantity = (amount) => {
        setQuantity((previous) =>
            Math.max(1, Math.min(
                product.stock,
                previous + amount
            ))
        );
    };

    return (

        <div className="product-details-page">

            {/* BREADCRUMB */}

            <div className="breadcrumb">

                <span onClick={() => navigate("/dashboard")}>
                    Home
                </span>

                <span>›</span>

                <span
                    onClick={() =>
                        navigate(`/dashboard?category=${encodeURIComponent(product.category)}`)
                    }
                >
                    {product.category}
                </span>

                <span>›</span>

                <strong>{product.name}</strong>

            </div>


            {/* PRODUCT MAIN SECTION */}

            <div className="details-layout">

                {/* IMAGE GALLERY */}

                <div className="gallery-section">

                    <div className="thumbnail-list">

                        {images.map((image, index) => (

                            <button
                                key={index}
                                className={
                                    selectedImage === image
                                        ? "thumbnail active-thumbnail"
                                        : "thumbnail"
                                }
                                onClick={() => setSelectedImage(image)}
                            >

                                <img src={image} alt={`${product.name} ${index + 1}`} />

                            </button>

                        ))}

                    </div>

                    <div className="main-product-image">

                        {discount > 0 && (
                            <span className="details-discount">
                                {discount}% OFF
                            </span>
                        )}

                        <img
                            src={selectedImage || product.image_url}
                            alt={product.name}
                        />

                    </div>

                </div>


                {/* PRODUCT INFORMATION */}

                <div className="product-information">

                    <h1>{product.name}</h1>

                    <div className="product-rating">

                        <span className="stars">★★★★★</span>

                        <strong>{product.rating || 0}</strong>

                        <span>
                            ({product.review_count || 0} reviews)
                        </span>

                    </div>

                    <div className="details-price">

                        <strong>
                            ${Number(product.price).toFixed(2)}
                        </strong>

                        {product.original_price && (
                            <del>
                                ${Number(product.original_price).toFixed(2)}
                            </del>
                        )}

                        {discount > 0 && (
                            <span>{discount}% OFF</span>
                        )}

                    </div>

                    <p className="product-description">
                        {product.description}
                    </p>


                    {/* QUICK SPECIFICATIONS */}

                    <div className="quick-specifications">

                        {Object.entries(specifications)
                            .slice(0, 4)
                            .map(([key, value]) => (

                                <div key={key} className="quick-spec-item">

                                    <strong>{value}</strong>
                                    <span>{key}</span>

                                </div>

                            ))}

                    </div>


                    {/* STOCK */}

                    <p className="stock-status">
                        {product.stock > 0
                            ? `✓ In Stock  (${product.stock} available)`
                            : "✕ Out of Stock"}
                    </p>


                    <p className="delivery-info">
                        🚚 Free Shipping on orders above 500 TK
                    </p>

                    <p className="delivery-info">
                        📦 Estimated Delivery: 1-2 Days
                    </p>


                    {/* QUANTITY */}

                    <div className="quantity-section">

                        <strong>Quantity:</strong>

                        <div className="quantity-control">

                            <button
                                disabled={quantity <= 1}
                                onClick={() => changeQuantity(-1)}
                            >
                                −
                            </button>

                            <span>{quantity}</span>

                            <button
                                disabled={quantity >= product.stock}
                                onClick={() => changeQuantity(1)}
                            >
                                +
                            </button>

                        </div>

                    </div>


                    {/* ACTION BUTTONS */}

                    <div className="purchase-buttons">

                        <button
                            className="details-cart-btn"
                            disabled={product.stock <= 0}
                        >
                            🛒 Add to Cart
                        </button>

                        <button
                            className="buy-now-btn"
                            disabled={product.stock <= 0}
                        >
                            ⚡ Buy Now
                        </button>

                    </div>

                    <div className="extra-actions">

                        <button>♡ Add to Wishlist</button>

                        <button
                            onClick={() => {
                                navigator.clipboard?.writeText(
                                    window.location.href
                                );
                            }}
                        >
                            ↗ Share
                        </button>

                    </div>

                </div>


                {/* RIGHT SIDEBAR */}

                <aside className="product-sidebar">

                    <div className="features-card">

                        <h3>⚡ Key Features</h3>

                        {product.features?.length > 0 ? (

                            product.features.map((feature, index) => (

                                <p key={index}>✓ {feature}</p>

                            ))

                        ) : (

                            <p>No features available.</p>

                        )}

                    </div>


                    <div className="review-summary">

                        <h3>Customer Reviews and Ratings</h3>

                        <div className="review-score">

                            <strong>{product.rating || 0}</strong>

                            <span className="stars">★★★★★</span>

                        </div>

                        <p>
                            Based on {product.review_count || 0} reviews
                        </p>

                        <button
                            onClick={() => setActiveTab("Reviews")}
                        >
                            View Reviews
                        </button>
                        <button
                            onClick={() => setActiveTab("Reviews")}
                        >
                            Write Reviews
                        </button>

                    </div>

                </aside>

            </div>


            {/* PRODUCT TABS */}

            <div className="details-bottom">

                <div className="details-tabs">

                    {[
                        "Description",
                        "Specifications",
                        "Reviews",
                        "Shipping & Returns"
                    ].map((tab) => (

                        <button
                            key={tab}
                            className={
                                activeTab === tab ? "tab-active" : ""
                            }
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </button>

                    ))}

                </div>


                <div className="tab-content">

                    {activeTab === "Description" && (

                        <div>
                            <h2>About This Product</h2>
                            <p>{product.description || "No description available."}</p>

                            <ul>
                                {product.features?.map((feature, index) => (
                                    <li key={index}>✓ {feature}</li>
                                ))}
                            </ul>
                        </div>

                    )}


                    {activeTab === "Specifications" && (

                        <div>
                            <h2>Product Specifications</h2>

                            {Object.entries(specifications).map(
                                ([key, value]) => (

                                    <div className="spec-row" key={key}>
                                        <strong>{key}</strong>
                                        <span>{value}</span>
                                    </div>

                                )
                            )}

                        </div>

                    )}


                    {activeTab === "Reviews" && (

                        <div>
                            <h2>Customer Reviews</h2>

                            <p>
                                Average rating: {product.rating || 0}/5
                            </p>

                            <p>
                                Total reviews: {product.review_count || 0}
                            </p>

                            <p>
                                Individual customer reviews will appear here
                                when we implement the reviews system.
                            </p>
                        </div>

                    )}


                    {activeTab === "Shipping & Returns" && (

                        <div>
                            <h2>Shipping & Returns</h2>

                            <p>
                                Estimated delivery: 1-2 business days.
                            </p>

                            <p>
                                Free shipping on orders above 500 Tk.
                            </p>

                            <p>
                                Return eligibility and policies will be
                                configured in the store settings.
                            </p>
                        </div>

                    )}

                </div>


                {/* RELATED PRODUCTS */}

                <div className="related-products">

                    <div className="related-heading">

                        <h2>You May Also Like</h2>

                        <button onClick={() => navigate("/dashboard")}>
                            View All →
                        </button>

                    </div>

                    <div className="related-grid">

                        {related.map((item) => (

                            <ProductCard
                                key={item.id}
                                product={item}
                            />

                        ))}

                    </div>

                </div>

            </div>

        </div>

    );
}

export default ProductDetails;
