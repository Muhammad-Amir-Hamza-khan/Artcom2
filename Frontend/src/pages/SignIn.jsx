import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signIn } from "../services/authService";

function SignIn() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await signIn(email, password);
            navigate("/dashboard");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <form className="auth-card" onSubmit={handleSubmit}>
                <h2>Welcome Back</h2>
                <p>Sign in to your account</p>

                {error && <div className="error">{error}</div>}

                <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button disabled={loading}>
                    {loading ? "Signing In..." : "Sign In"}
                </button>

                <p>
                    Don't have an account? <Link to="/signup">Sign Up</Link>
                </p>
            </form>
        </div>
    );
}

export default SignIn;