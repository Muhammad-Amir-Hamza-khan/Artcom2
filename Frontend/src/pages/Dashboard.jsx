import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { signOut } from "../services/authService";
import { getProducts } from "../services/productService";
import { useAuth } from "../context/AuthContext";

import ProductCard from "../components/ProductCard";

const categories = [
    "All",
    "Electronics",
    "Fashion",
    "Home & Living",
    "Beauty & Personal Care",
    "Sports & Outdoors",
    "Books & Stationery",
    "Toys & Games"
];

function Dashboard() {

    const navigate = useNavigate();
    const { user } = useAuth();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");

    useEffect(() => {
        let isMounted = true;

        const fetchProducts = async () => {
            try {
                const data = await getProducts();

                if (isMounted) {
                    // Remove duplicate records by ID
                    const uniqueProducts = Array.from(
                        new Map(
                            data.map(product => [product.id, product])
                        ).values()
                    );

                    setProducts(uniqueProducts);
                }
            } catch (err) {
                if (isMounted) {
                    setError(err.message);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchProducts();

        return () => {
            isMounted = false;
        };
    }, []);

    const handleLogout = async () => {
        try {
            await signOut();
            navigate("/signin");
        } catch (err) {
            setError(err.message);
        }
    };

    const filteredProducts = products.filter((product) => {

        const matchesSearch = product.name
            .toLowerCase()
            .includes(search.toLowerCase());

        const matchesCategory =
            category === "All" ||
            product.category === category;

        return matchesSearch && matchesCategory;
    });

    return (

        <div className="dashboard">

            {/* SIDEBAR */}

            <aside className="sidebar">

                <h2
                    className="logo"
                    onClick={() => {
                        setCategory("All");
                        setSearch("");
                        navigate("/dashboard");
                    }}
                >
                    <span>Λ</span> Artcom
                </h2>

                <nav>

                    {categories.map((item) => (

                        <button
                            key={item}
                            className={category === item ? "active" : ""}
                            onClick={() => setCategory(item)}
                        >
                            {item}
                        </button>

                    ))}

                </nav>

                <div className="sidebar-bottom">

                    <p>
                        Welcome,{" "}
                        {user?.user_metadata?.name ||
                            user?.email?.split("@")[0]}
                    </p>

                    <button
                        className="logout-btn"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                </div>

            </aside>


            {/* MAIN CONTENT */}

            <main className="main-content">

                {/* HEADER */}

                <header className="dashboard-header">

                    <input
                        type="text"
                        placeholder="Search for products..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <div className="user-section">

                        <span>{user?.email}</span>

                        <button onClick={handleLogout}>
                            Logout
                        </button>

                    </div>

                </header>


                {/* BANNER */}

                <section className="hero-banner">

                    <div>
                        <span>Limited Time Offer</span>

                        <h1>
                            Upgrade Your Life with
                            <br />
                            <strong>Artcom</strong>
                        </h1>

                        <p>Smart Devices. Smarter Choices.</p>

                        <button
                            onClick={() => {
                                setCategory("All");
                                document.getElementById("products")?.scrollIntoView({
                                    behavior: "smooth"
                                });
                            }}
                        >
                            Shop The Deal →
                        </button>
                    </div>

                </section>


                {/* CATEGORY SECTION */}

                <section className="category-section">

                    {categories.map((item) => (

                        <button
                            key={item}
                            onClick={() => setCategory(item)}
                            className={category === item ? "category-active" : ""}
                        >
                            {item}
                        </button>

                    ))}

                </section>


                {/* PRODUCTS */}

                <section
                    className="products-section"
                    id="products"
                >

                    <h2> All Products</h2>

                    {loading && <p>Loading products...</p>}

                    {error && <p className="error">{error}</p>}

                    {!loading && !error && (
                        <div className="products-grid">

                            {filteredProducts.length > 0 ? (

                                filteredProducts.map((product) => (

                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                    />

                                ))

                            ) : (

                                <p>No products found.</p>

                            )}

                        </div>
                    )}

                </section>

            </main>

        </div>
    );
}

export default Dashboard;