import * as yup from "yup";

export const productValidation = yup.object().shape({
    name: yup.string().min(2).max(100).required(),
    status: yup.string().required(),
    category: yup.object().nullable().required(),
    images: yup
        .array()
        .min(1)
        .of(
            yup.object().shape({
                name: yup.mixed().required(),
            })
        )
        .required(),
    color: yup.array().min(1).required(),
    tag: yup.array().min(1).required(),
    size: yup.array().min(1).required(),
    quantity: yup
        .number()
        .min(1)
        .typeError("quantity must be a number")
        .positive("quantity must be greater than zero")
        .required(),
    price: yup
        .number()
        .min(1)
        .typeError("price must be a number")
        .positive("price must be greater than zero")
        .required(),
    discount: yup.number().typeError("discount must be a number").required(),
    description: yup.string().max(1000).required(),
});

export const productCategoryValidation = yup.object().shape({
    name: yup
        .string()
        .min(2)
        .max(100)
        .matches(/^[aA-zZ\s]+$/, "name is not in correct format")
        .required(),
    status: yup.string().required(),
    color: yup.array().min(1).required(),
    tag: yup.array().min(1).required(),
    size: yup.array().min(1).required(),
    description: yup.string().max(1000).required(),
});

export const blogCategoryValidation = yup.object().shape({
    name: yup
        .string()
        .min(5)
        .max(100)
        .matches(/^[aA-zZ\s]+$/, "name is not in correct format")
        .required(),
    status: yup.string().required(),
    description: yup.string().max(1000).required(),
});

export const blogValidation = yup.object().shape({
    name: yup.string().min(5).max(100).required(),
    status: yup.string().required(),
    category: yup.object().nullable().required(),
    images: yup
        .array()
        .min(1)
        .of(
            yup.object().shape({
                name: yup.mixed().required(),
            })
        )
        .required(),
    description: yup.string().max(10000).required(),
});

export const reviewValidation = yup.object().shape({
    name: yup.string().min(5).max(100).required(),
    email: yup.string().email().required(),
    content: yup.string().max(1000).required(),
});

export const addProductValidation = yup.object().shape({
    color: yup.object().required(),
    size: yup.object().required(),
    quantity: yup
        .number()
        .min(1)
        .typeError("quantity must be a number")
        .positive("quantity must be greater than zero")
        .required(),
});

export const couponValidation = yup.object().shape({
    name: yup.string().min(5).max(100).required(),
    code: yup.string().min(5).max(100).required(),
    status: yup.string().required(),
    quantity: yup
        .number()
        .min(1)
        .typeError("quantity must be a number")
        .positive("quantity must be greater than zero")
        .required(),
    condition: yup
        .number()
        .min(1)
        .typeError("quantity must be a number")
        .positive("quantity must be greater than zero")
        .required(),
    discount: yup
        .number()
        .min(1)
        .typeError("price must be a number")
        .positive("price must be greater than zero")
        .required(),
    expiredTime: yup.string().required(),
    description: yup.string().max(1000).required(),
});

export const checkoutValidation = yup.object().shape({
    firstname: yup.string().max(100).required(),
    lastname: yup.string().max(100).required(),
    email: yup.string().email().required(),
    phone: yup.number().typeError("phone must be a number").required(),
    province: yup.object().nullable().required(),
    district: yup.object().nullable().required(),
    ward: yup.object().nullable().required(),
    street: yup.string().min(5).max(100).required(),
});

export const orderTrackingValidation = yup.object().shape({
    orderId: yup.string().max(100).required(),
});

export const sliderValidation = yup.object().shape({
    name: yup.string().min(5).max(100).required(),
    path: yup.string().required(),
    status: yup.string().required(),
    images: yup
        .array()
        .min(1)
        .of(
            yup.object().shape({
                name: yup.mixed().required(),
            })
        )
        .required(),
    description: yup.string().max(10000).required(),
});

export const contactValidation = yup.object().shape({
    email: yup.string().email().required(),
});

export const searchValidation = yup.object().shape({
    keyword: yup.string().required(),
});
