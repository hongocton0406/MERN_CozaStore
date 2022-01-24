import { createFormData } from "helpers/form";
import { publicRequest, userRequest } from "helpers/requestMethod";

const createNewProduct = (product) => {
    const formData = createFormData(product);
    return userRequest.post("product", formData, { headers: { "Content-Type": "multipart/form-data" } });
};

const getAllProduct = () => {
    return publicRequest.get("product");
};

const getOneProduct = (currentId) => {
    return userRequest.get(`product/find/${currentId}`);
};

const updateProduct = (currentId, product) => {
    const formData = createFormData(product);
    return userRequest.put(`product/${currentId}`, formData, { headers: { "Content-Type": "multipart/form-data" } });
};

const deleteProduct = (id) => {
    return userRequest.delete(`product/${id}`);
};

const getProductByCategory = (slugCategory) => {
    return publicRequest.get(`product/${slugCategory}`);
};

const getProductDetailBySlug = (slug) => {
    return publicRequest.get(`product/find-by-slug/${slug}`);
};

const productServices = {
    createNewProduct,
    getAllProduct,
    getOneProduct,
    updateProduct,
    deleteProduct,
    getProductByCategory,
    getProductDetailBySlug,
};

export default productServices;
