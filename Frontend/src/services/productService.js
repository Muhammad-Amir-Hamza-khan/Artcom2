import { supabase } from "./authService";

// Get all products
export const getProducts = async () => {
    const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) throw error;

    return data;
};

// Get single product by ID
export const getProductById = async (id) => {
    const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

    if (error) throw error;

    return data;
};

// Get related products
export const getRelatedProducts = async (category, currentId) => {
    const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("category", category)
        .neq("id", currentId)
        .limit(4);

    if (error) throw error;

    return data;
};