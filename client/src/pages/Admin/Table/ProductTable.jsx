import { faCheck, faPenToSquare, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import SearchIcon from "@mui/icons-material/Search";
import { Backdrop, CircularProgress, Container, Grid, Pagination } from "@mui/material";
import Error404 from "components/404";
import Breadcrumbs from "components/Breadcrumbs";
import Footer from "components/Footer";
import Header from "components/Header";
import Preloader from "components/Preloader";
import StatusFilter from "components/StatusFilter";
import { IMAGE_CLOUDINARY } from "constants/Config";
import { toastMessage } from "helpers/toastMessage";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useSelector } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";
import Select from "react-select";
import productServices from "services/product";
import "./Table.scss";

const linkData = [
    {
        name: "Admin",
        path: "/admin",
    },
];

const TITLE_PAGE = "Product List";

function ProductTable() {
    let [searchParams, setSearchParams] = useSearchParams();
    const { categoryProduct } = useSelector((state) => state.category);

    const [search, setSearch] = useState(searchParams.get("search") || "");
    const [products, setProducts] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(1);
    const [statistics, setStatistics] = useState();
    const [categoryOptions, setCategoryOptions] = useState([{ value: "all", label: "All" }]);

    useEffect(() => {
        if (categoryProduct) {
            let cateOptions = [{ value: "all", label: "All" }];
            categoryProduct.forEach((item) => {
                cateOptions.push({ value: item.slug, label: item.name });
            });
            setCategoryOptions(cateOptions);
        }
    }, [categoryProduct]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setIsLoading(true);
                const res = await productServices.getItems(Object.fromEntries([...searchParams]));
                if (res.data.success) {
                    setProducts(res.data.items);
                    setStatistics(res.data.statistics);
                    setTotalPages(res.data.pages);
                }
                setIsLoading(false);
            } catch (error) {
                toastMessage({ type: "error", message: error.message });
            }
        };
        fetchProducts();
    }, [searchParams]);

    const requestSearch = (value) => {
        setSearch(value);
        if (value !== "") {
            searchParams.delete("page");
            setSearchParams({ ...Object.fromEntries([...searchParams]), search: value });
        } else {
            searchParams.delete("search");
            setSearchParams(searchParams);
        }
    };

    const handleChangePage = (event, value) => {
        if (value !== 1) setSearchParams({ ...Object.fromEntries([...searchParams]), page: value });
        else {
            searchParams.delete("page");
            setSearchParams(searchParams);
        }
    };

    const handleSelect = (data) => {
        if (data.value !== "all") {
            searchParams.delete("page");
            setSearchParams({ ...Object.fromEntries([...searchParams]), category: data.value });
        } else {
            searchParams.delete("category");
            setSearchParams(searchParams);
        }
    };

    const handleDelete = async (id) => {
        try {
            setIsLoading(true);
            const res = await productServices.deleteProduct(id);
            if (res.data.success) {
                const updateProducts = products.filter((product) => product._id !== id);
                setProducts(updateProducts);
                toastMessage({ type: "success", message: res.data.message });
            } else toastMessage({ type: "error", message: res.data.message });
            setIsLoading(false);
        } catch (error) {
            toastMessage({ type: "error", message: error.message });
        }
    };

    const handleChangeStatus = async (id, value) => {
        try {
            setIsLoading(true);
            const res = await productServices.changeStatus(id, value);
            if (res.data.success) {
                const updateProducts = products.map((product) => {
                    if (product._id === id) product.status = value === "active" ? "inactive" : "active";
                    return product;
                });
                setProducts(updateProducts);
                setIsLoading(false);
                toastMessage({ type: "success", message: res.data.message });
            } else toastMessage({ type: "error", message: res.data.message });
        } catch (error) {
            toastMessage({ type: "error", message: error.message });
        }
    };

    return (
        <>
            <Helmet>
                <title>{TITLE_PAGE}</title>
            </Helmet>
            <Preloader isHidden={products} />
            <Header />
            <div className="main">
                <Container>
                    <Breadcrumbs links={linkData} current={TITLE_PAGE} />
                    <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isLoading}>
                        <CircularProgress color="inherit" />
                    </Backdrop>
                    <div className="card">
                        <h3 className="card-header">Filter & Search</h3>
                        <div className="card-body">
                            <div className="toolbar">
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6} md={4} lg={4}>
                                        {statistics && <StatusFilter keyword="status" data={statistics} />}
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={4} lg={4}>
                                        <div className="select">
                                            <Select
                                                value={categoryOptions.filter(
                                                    (option) => option.value === searchParams.get("category")
                                                )}
                                                options={categoryOptions}
                                                onChange={handleSelect}
                                            />
                                        </div>
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={4} lg={4}>
                                        <div className="search">
                                            <SearchIcon className="search-icon" />
                                            <input
                                                placeholder="Search"
                                                value={search}
                                                onChange={(event) => requestSearch(event.target.value)}
                                                className="search-input"
                                            />
                                            <CloseIcon
                                                className="search-icon delete"
                                                onClick={() => requestSearch("")}
                                                style={{
                                                    visibility: search ? "visible" : "hidden",
                                                }}
                                            />
                                        </div>
                                    </Grid>
                                </Grid>
                            </div>
                        </div>
                    </div>
                    <div className="card">
                        <h3 className="card-header">{TITLE_PAGE}</h3>
                        <div className="card-body">
                            <div className="actions">
                                <button className="btn btn-danger">
                                    <FileDownloadIcon />
                                    Export
                                </button>
                                <Link to="/admin/product/form" className="btn btn-primary">
                                    <AddIcon />
                                    Add New
                                </Link>
                            </div>
                            {products && products.length > 0 ? (
                                <div className="table">
                                    <table className=" table-border">
                                        <thead>
                                            <tr>
                                                <th>No.</th>
                                                <th>Product</th>
                                                <th>Category</th>
                                                <th>Status</th>
                                                <th>Price</th>
                                                <th>Color</th>
                                                <th>Size</th>
                                                <th>Tag</th>
                                                <th style={{ width: "100px" }}>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {products.map((item, index) => (
                                                <tr key={item._id}>
                                                    <td className="text-center">{index + 1}</td>
                                                    <td className="text-center">
                                                        <div>
                                                            <img
                                                                src={IMAGE_CLOUDINARY + item.images[0]}
                                                                alt={item.name}
                                                            />
                                                        </div>
                                                        <Link to={`/product/${item.slug}`}>{item.name}</Link>
                                                    </td>
                                                    <td className="text-center">{item.category.name}</td>
                                                    <td className="text-center">
                                                        <button
                                                            className={`btn btn-rounded ${
                                                                item.status === "active"
                                                                    ? "btn-success"
                                                                    : "btn-secondary btn-disabled"
                                                            } btn-sm`}
                                                            onClick={() => handleChangeStatus(item._id, item.status)}
                                                        >
                                                            <FontAwesomeIcon icon={faCheck} />
                                                        </button>
                                                    </td>
                                                    <td className="text-center">${item.price}</td>
                                                    <td>
                                                        <div className="tags">
                                                            {item.color.map((item) => (
                                                                <span key={item.value} className="tag">
                                                                    {item.label}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="tags">
                                                            {item.size.map((item) => (
                                                                <span key={item.value} className="tag">
                                                                    {item.label}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="tags">
                                                            {item.tag.map((item) => (
                                                                <span key={item.value} className="tag">
                                                                    {item.label}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </td>
                                                    <td className="text-center">
                                                        <Link
                                                            to={`/admin/product/form/${item._id}`}
                                                            className="btn btn-rounded btn-primary btn-sm"
                                                        >
                                                            <FontAwesomeIcon icon={faPenToSquare} />
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(item._id)}
                                                            className="btn btn-rounded btn-danger btn-sm"
                                                        >
                                                            <FontAwesomeIcon icon={faTrashCan} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <Error404 />
                            )}
                        </div>
                        {totalPages > 1 && (
                            <div className="card-footer">
                                <div className="pagination">
                                    <div className="left">
                                        <h4>Pagination</h4>
                                    </div>
                                    <div className="right">
                                        <Pagination
                                            page={Number(searchParams.get("page") || 1)}
                                            count={totalPages}
                                            onChange={handleChangePage}
                                            variant="outlined"
                                            shape="rounded"
                                            color="primary"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </Container>
            </div>
            <Footer />
        </>
    );
}

export default ProductTable;
