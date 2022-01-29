import { Backdrop, CircularProgress, Container } from "@mui/material";
import Breadcrumbs from "components/Breadcrumbs";
import { CreatableSelectField, Form, InputField, RadioField, TextEditorField } from "components/CustomForm";
import Footer from "components/Footer";
import Header from "components/Header";
import Message from "components/Message";
import { COLOR_OPTIONS, DEFAULT_VALUE_CATEGORY_PRODUCT, SIZE_OPTIONS, STATUS_RADIO, TAG_OPTIONS } from "constants/Data";
import { productCategoryValidation } from "helpers/validation";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import productCategoryServices from "services/productCategory";
import { GetALlCategoryProduct } from "redux/categorySlice";
import { useDispatch } from "react-redux";

const linkData = [
    {
        name: "Admin",
        path: "/admin",
    },
];

function ProductCategoryForm() {
    const dispatch = useDispatch();
    dispatch(GetALlCategoryProduct());

    const navigate = useNavigate();
    const { id: currentId } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState();
    const [initialValue, setInitialValue] = useState(DEFAULT_VALUE_CATEGORY_PRODUCT);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (currentId) {
                    const res = await productCategoryServices.getOneProductCategory(currentId);
                    const categoryDetail = res.data.category;
                    setInitialValue({
                        name: categoryDetail.name,
                        status: categoryDetail.status,
                        color: categoryDetail.color,
                        tag: categoryDetail.tag,
                        size: categoryDetail.size,
                        description: categoryDetail.description,
                    });
                }
            } catch (error) {
                console.log(error);
                setMessage({ type: "error", content: error.response.data.message });
            }
        };
        fetchData();
    }, [currentId]);

    const onSubmit = async (data) => {
        setIsLoading(true);
        setMessage("");
        try {
            const response = currentId
                ? await productCategoryServices.updateProductCategory(currentId, data)
                : await productCategoryServices.createNewProductCategory(data);
            setMessage({ type: "success", content: response.data.message });
            setIsLoading(false);
            navigate("/admin/product-category/table");
        } catch (error) {
            setIsLoading(false);
            setMessage({ type: "error", content: error.response.data.message });
        }
    };

    return (
        <>
            <Header />
            <div className="main">
                <Container>
                    <Breadcrumbs links={linkData} current="Product Category Form" />
                    <div className="card">
                        <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isLoading}>
                            <CircularProgress color="inherit" />
                        </Backdrop>
                        <h3 className="card-header">Product Category Form</h3>
                        <div className="card-body">
                            {message && <Message type={message.type}>{message.content}</Message>}
                            <Form
                                onSubmit={onSubmit}
                                defaultValues={initialValue}
                                validation={productCategoryValidation}
                            >
                                <InputField name="name" placeholder="Name" />
                                <RadioField name="status" options={STATUS_RADIO} />
                                <CreatableSelectField
                                    name="tag"
                                    options={TAG_OPTIONS}
                                    isMultiple
                                    placeholder="Tag..."
                                />
                                <CreatableSelectField
                                    name="size"
                                    options={SIZE_OPTIONS}
                                    isMultiple
                                    placeholder="Size..."
                                />
                                <CreatableSelectField
                                    name="color"
                                    options={COLOR_OPTIONS}
                                    isMultiple
                                    placeholder="Color..."
                                />
                                <TextEditorField name="description" />
                                <div className="form-button">
                                    <Link to="/admin/product-category/table" className="btn btn-danger">
                                        Cancel
                                    </Link>
                                    <button className="btn btn-primary">{currentId ? "Update" : "Submit"}</button>
                                </div>
                            </Form>
                        </div>
                    </div>
                </Container>
            </div>
            <Footer />
        </>
    );
}

export default ProductCategoryForm;
