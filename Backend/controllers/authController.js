const supabase = require("../config/supabase");

// SIGN UP
exports.signUp = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required",
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                message: "Password must be at least 8 characters",
            });
        }

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { name },
            },
        });

        if (error) throw error;

        res.status(201).json({
            message: "Registration successful. Check your email to verify your account.",
            user: data.user,
            session: data.session,
        });
    } catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
};

// SIGN IN
exports.signIn = async (req, res) => {
    try {
        const { email, password } = req.body;

        const { data, error } =
            await supabase.auth.signInWithPassword({
                email,
                password,
            });

        if (error) throw error;

        res.status(200).json({
            message: "Login successful",
            user: data.user,
            session: data.session,
        });
    } catch (error) {
        res.status(401).json({
            message: error.message,
        });
    }
};

// SIGN OUT
exports.signOut = async (req, res) => {
    try {
        const { accessToken } = req.body;

        if (!accessToken) {
            return res.status(400).json({
                message: "Access token required",
            });
        }

        const { createClient } = require("@supabase/supabase-js");

        const userSupabase = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_ANON_KEY,
            {
                global: {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                },
                auth: {
                    persistSession: false,
                    autoRefreshToken: false,
                    detectSessionInUrl: false,
                },
            }
        );

        const { error } = await userSupabase.auth.signOut();

        if (error) throw error;

        return res.status(200).json({
            message: "Logged out successfully",
        });

    } catch (error) {
        return res.status(400).json({
            message: error.message,
        });
    }
};