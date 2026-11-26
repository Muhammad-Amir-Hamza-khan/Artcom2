function ProductCard({ product }) {

    const discount = product.original_price
        ? Math.round(
            ((product.original_price - product.price) /
                product.original_price) * 100
        )
        : 0;

    return (
        <div className="product-card">

            <div className="product-image">
                {discount > 0 && (
                    <span className="discount">
                        -{discount}%
                    </span>
                )}

                <img
                    src={product.image_url || "https://placehold.co/300x250?text=Product"}
                    alt={product.name}
                />
            </div>

            <div className="product-info">

                <h4>{product.name}</h4>

                <p className="product-category">
                    {product.category}
                </p>

                <div className="product-price">
                    <strong>
                        ${Number(product.price).toFixed(2)}
                    </strong>

                    {product.original_price && (
                        <del>
                            ${Number(product.original_price).toFixed(2)}
                        </del>
                    )}
                </div>

                <p className="stock">
                    {product.stock > 0
                        ? `${product.stock} available`
                        : "Out of stock"}
                </p>

                <button
                    disabled={product.stock <= 0}
                    className="add-cart-btn"
                >
                    Add to Cart
                </button>

            </div>

        </div>
    );
}

export default ProductCard;