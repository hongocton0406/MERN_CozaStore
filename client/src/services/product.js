import { createFormData } from "helpers/form";
import { publicRequest, userRequest } from "helpers/requestMethod";
import queryString from "query-string";

const createNewProduct = (product) => {
    const formData = createFormData(product);
    return userRequest.post("product", formData, { headers: { "Content-Type": "multipart/form-data" } });
};

const getProducts = ({ category = "all", page = 1, search = "", status = null }) => {
    let query = {};
    if (category !== "all") query.category = category;
    if (page !== 1) query.page = page;
    if (search !== "") query.search = search;
    if (status) query.status = status;
    return userRequest.get(`product?${queryString.stringify(query)}`);
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

const getProducstInCategory = ({ category = "all", page = 1, search = "", sort, price, color, size, tag }) => {
    let query = {};
    if (page !== 1) query.page = page;
    if (search !== "") query.search = search;
    if (sort) query.sort = sort;
    if (price) query.price = price;
    if (color) query.color = color;
    if (size) query.size = size;
    if (tag) query.tag = tag;

    return publicRequest.get(`product/${category}${queryString.stringify(query)}`);
};

const getProductDetailBySlug = (slug) => {
    return publicRequest.get(`product/find-by-slug/${slug}`);
};

const addReview = (slug, data) => {
    return publicRequest.post(`product/review/${slug}`, data);
};

const changeStatus = (id, currentStatus) => {
    return userRequest.put(`product/change-status/${id}`, { currentStatus: currentStatus });
};

const productServices = {
    createNewProduct,
    getProducts,
    getOneProduct,
    updateProduct,
    deleteProduct,
    getProducstInCategory,
    getProductDetailBySlug,
    addReview,
    changeStatus,
};

export default productServices;
