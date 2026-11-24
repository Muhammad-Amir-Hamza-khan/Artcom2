import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signUp } from "../services/authService";

function SignUp() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const data = await signUp(
                form.name,
                form.email,
                form.password
            );

            if (!data.session) {
                setError(
                    "Account created successfully! Please check your Gmail and verify your email before signing in."
                );
            } else {
                setError("Check your email to verify your account.");
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <form className="auth-card" onSubmit={handleSubmit}>
                <h2>Create Account</h2>
                <p>Sign up to get started</p>

                {error && <div className="error">{error}</div>}

                <input
                    name="name"
                    placeholder="Full Name"
                    value={form.name}
                    onChange={handleChange}
                    required
                />

                <input
                    name="email"
                    type="email"
                    placeholder="Email Address"
                    value={form.email}
                    onChange={handleChange}
                    required
                />

                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    minLength={8}
                    required
                />

                <button disabled={loading}>
                    {loading ? "Creating Account..." : "Sign Up"}
                </button>
                <p>
                    Minimum Length is 8 digit
                </p>

                <p>
                    Already have an account? <Link to="/signin">Sign In</Link>
                </p>
            </form>
        </div>
    );
}

export default SignUp;