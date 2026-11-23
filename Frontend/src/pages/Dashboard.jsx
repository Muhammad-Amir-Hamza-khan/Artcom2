import { useNavigate } from "react-router-dom";
import { signOut } from "../services/authService";
import { useAuth } from "../context/AuthContext";

function Dashboard() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleLogout = async () => {
        await signOut();
        navigate("/signin");
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Dashboard</h2>
                <p>Welcome, {user?.user_metadata?.name || user?.email}</p>
                <button onClick={handleLogout}>Logout</button>
            </div>
        </div>
    );
}

export default Dashboard;