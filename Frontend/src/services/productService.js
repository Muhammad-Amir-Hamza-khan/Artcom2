import { supabase } from "./authService";

// Get all products
export const getProducts = async () => {
    const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        throw error;
    }

    return data;
};