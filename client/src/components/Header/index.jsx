import { yupResolver } from "@hookform/resolvers/yup";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CloseIcon from "@mui/icons-material/Close";
import HelpIcon from "@mui/icons-material/Help";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import HomeIcon from "@mui/icons-material/Home";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import LogoutIcon from "@mui/icons-material/Logout";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Avatar, Badge, Modal, Slide } from "@mui/material";
import Dropdown from "components/Dropdown";
import { ADMIN_SIDEBAR, IMAGE_CLOUDINARY } from "constants/Config";
import Image from "constants/Image";
import { stringAvatar } from "helpers/string";
import { toastMessage } from "helpers/toastMessage";
import { searchValidation } from "helpers/validation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LogOut } from "redux/authSlice";
import { clearCart, removeProduct } from "redux/cartSlice";
import userServices from "services/user";
import styled from "styled-components";
import Sidebar from "../Sidebar";
import "./Header.scss";

const Backdrop = styled.div`
    z-index: -1;
    position: fixed;
    right: 0;
    bottom: 0;
    top: 0;
    left: 0;
    background-color: rgba(255, 255, 255, 0.8);
    -webkit-tap-highlight-color: transparent;
`;

function Header() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ resolver: yupResolver(searchValidation) });

    const currentPath = pathname.split("/")[1];

    const user = useSelector((state) => state.auth.currentUser);
    const { categoryProduct, categoryBlog } = useSelector((state) => state.category);
    const { products, quantity, total, coupon } = useSelector((state) => state.cart);

    const [openSearch, setOpenSearch] = useState(false);
    const [openCart, setOpenCart] = useState(false);
    const [openMenu, setOpenMenu] = useState(false);

    const handleOpenSearch = () => setOpenSearch(true);
    const handleCloseSearch = () => setOpenSearch(false);
    const handleOpenCart = () => setOpenCart(true);
    const handleCloseCart = () => setOpenCart(false);
    const handleOpenMenu = () => setOpenMenu(true);
    const handleCloseMenu = () => setOpenMenu(false);

    const handleLogin = () => navigate("/login");

    const handleLogout = async () => {
        if (products.length > 0) {
            try {
                await userServices.saveCart(user._id, { products, quantity, total, coupon });
            } catch (error) {
                toastMessage({ type: "error", message: error.message });
            }
        } else {
            try {
                await userServices.cleanCart(user._id);
            } catch (error) {
                toastMessage({ type: "error", message: error.message });
            }
        }
        dispatch(LogOut());
        dispatch(clearCart());
        navigate("/");
    };

    const handleRemoveFromCart = (product) => dispatch(removeProduct(product));

    const onSubmit = (data) => navigate(`/product-category/all?search=${data.keyword}`);

    return (
        <header className="header">
            <nav className="header__wrapper">
                <Link to="/" className="header__logo-link">
                    <img src={Image.LOGO} alt="" className="header__logo-img" />
                </Link>
                <div className="nav">
                    <ul className="nav__items">
                        <li className="nav__item">
                            <Link to="/" className={`nav__item-link ${currentPath === "" ? "active" : ""}`}>
                                Home
                            </Link>
                        </li>
                        <li className="nav__item">
                            <Link
                                to="/product-category/all"
                                className={`nav__item-link ${currentPath === "product-category" ? "active" : ""}`}
                            >
                                Category
                            </Link>
                            <ul className="sub-nav">
                                {categoryProduct &&
                                    categoryProduct.map((item) => (
                                        <li key={item._id}>
                                            <Link className="sub-nav-link" to={`/product-category/${item.slug}`}>
                                                {item.name}
                                            </Link>
                                        </li>
                                    ))}
                            </ul>
                        </li>
                        <li className="nav__item">
                            <Link
                                to="/blog-category/all"
                                className={`nav__item-link ${currentPath === "blog-category" ? "active" : ""}`}
                            >
                                Blog
                            </Link>
                            <ul className="sub-nav">
                                {categoryBlog &&
                                    categoryBlog.map((item) => (
                                        <li key={item._id}>
                                            <Link className="sub-nav-link" to={`/blog-category/${item.slug}`}>
                                                {item.name}
                                            </Link>
                                        </li>
                                    ))}
                            </ul>
                        </li>
                        <li className="nav__item">
                            <Link to="/about" className={`nav__item-link ${currentPath === "about" ? "active" : ""}`}>
                                About
                            </Link>
                        </li>
                        <li className="nav__item">
                            <Link
                                to="/contact"
                                className={`nav__item-link ${currentPath === "contact" ? "active" : ""}`}
                            >
                                Contact
                            </Link>
                        </li>
                    </ul>
                </div>
                <div className="header-icons">
                    <div className="header-icons__container">
                        <button className="header-btn" onClick={handleOpenSearch}>
                            <SearchIcon className="header-icon" />
                        </button>
                        <button className="header-btn border-left-right" onClick={handleOpenCart}>
                            <Badge badgeContent={quantity} color="primary">
                                <ShoppingCartIcon className="header-icon" />
                            </Badge>
                        </button>
                        {user ? (
                            <button className="header-btn border-left-right" onClick={handleOpenMenu}>
                                <Avatar {...stringAvatar(user.username)} />
                            </button>
                        ) : (
                            <button className="header-btn border-left-right" onClick={handleLogin}>
                                <AccountCircleIcon className="header-icon" />
                            </button>
                        )}
                    </div>
                </div>
            </nav>
            <Modal open={openSearch} onClose={handleCloseSearch} BackdropComponent={Backdrop}>
                <Slide in={openSearch} direction="down">
                    <div className="search-modal">
                        <button variant="text" className="button-close" onClick={handleCloseSearch}>
                            <CloseIcon sx={{ fontSize: 36, color: "#333" }} />
                        </button>
                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className={`search-modal__form ${errors["keyword"] ? "error" : ""}`}
                        >
                            <button className="search-modal__button">
                                <SearchIcon sx={{ fontSize: 52 }} />
                            </button>
                            <input
                                {...register("keyword")}
                                type="text"
                                className="search-modal__input"
                                placeholder="Search..."
                            />
                        </form>
                    </div>
                </Slide>
            </Modal>
            <Sidebar isOpen={openCart} onClose={handleCloseCart}>
                <div className="sidebar__container">
                    <div className="sidebar__title">
                        <h3>Your Cart</h3>
                        <button onClick={handleCloseCart}>
                            <CloseIcon sx={{ fontSize: 36 }} />
                        </button>
                    </div>
                    <div className="sidebar__content">
                        <ul className="cart__list">
                            {products.map((item) => (
                                <li className="cart__item" key={item._id + item.size + item.color}>
                                    <img src={IMAGE_CLOUDINARY + item.images[0]} alt={item.name} className="cart-img" />
                                    <div className="cart__desc">
                                        <Link to={`/product/${item.slug}`} className="cart__desc-title">
                                            {item.name}
                                        </Link>
                                        <p>
                                            | Size: {item.size} | {item.color} |
                                        </p>
                                        <p className="cart__desc-subtitle">
                                            {item.quantity} x ${item.price}
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        className="btn-sidebar-cart"
                                        onClick={() => handleRemoveFromCart(item)}
                                    >
                                        <HighlightOffIcon />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="sidebar__footer">
                        <div className="cart__total">{`Total: $${total}`}</div>
                        <div className="cart__buttons">
                            <Link to="/cart" className="btn btn-dark text-uppercase">
                                View Cart
                            </Link>
                            <Link to="/checkout" className="btn btn-dark text-uppercase">
                                Check Out
                            </Link>
                        </div>
                    </div>
                </div>
            </Sidebar>
            {user && (
                <Sidebar isOpen={openMenu} onClose={handleCloseMenu}>
                    <div className="sidebar__container p-0">
                        <div className="sidebar__title">
                            <div></div>
                            <button onClick={handleCloseMenu}>
                                <CloseIcon sx={{ fontSize: 36 }} />
                            </button>
                        </div>
                        <div className="sidebar-avatar">
                            <Avatar {...stringAvatar(user.username, { width: 80, height: 80 })} />
                            <div className="description">
                                <h5>{user.username}</h5>
                                {user.isAdmin && <span>Admin</span>}
                            </div>
                        </div>
                        <div className="sidebar__content options">
                            {user && user.isAdmin && (
                                <>
                                    <h4 className="options-title">@Database</h4>
                                    <ul className="sidebar-links">
                                        {ADMIN_SIDEBAR.map((item, index) => (
                                            <Dropdown item={item} key={index} />
                                        ))}
                                    </ul>
                                </>
                            )}
                            <h4 className="options-title">@General</h4>
                            <ul className="sidebar-links">
                                <li>
                                    <Link to="#" className="sidebar-link">
                                        <HomeIcon /> &nbsp; Home
                                    </Link>
                                </li>
                                <li>
                                    <Link to="#" className="sidebar-link">
                                        <ManageAccountsIcon /> &nbsp; My Account
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/order-tracking" className="sidebar-link">
                                        <LocalShippingIcon /> &nbsp; Track Order
                                    </Link>
                                </li>
                                <li>
                                    <Link to="#" className="sidebar-link">
                                        <HelpIcon /> &nbsp; Help & FAQs
                                    </Link>
                                </li>
                                <li>
                                    <button to="" className="sidebar-link" onClick={handleLogout}>
                                        <LogoutIcon /> &nbsp; Logout
                                    </button>
                                </li>
                            </ul>
                            <div className="sidebar-gallery">
                                <h4 className="options-title">@CozaStore</h4>
                                <div className="sidebar-gallery__list">
                                    <button>
                                        <img src={Image.GALLERY1} alt="gallery" />
                                    </button>
                                    <button>
                                        <img src={Image.GALLERY2} alt="gallery" />
                                    </button>
                                    <button>
                                        <img src={Image.GALLERY3} alt="gallery" />
                                    </button>
                                    <button>
                                        <img src={Image.GALLERY4} alt="gallery" />
                                    </button>
                                    <button>
                                        <img src={Image.GALLERY5} alt="gallery" />
                                    </button>
                                    <button>
                                        <img src={Image.GALLERY6} alt="gallery" />
                                    </button>
                                    <button>
                                        <img src={Image.GALLERY7} alt="gallery" />
                                    </button>
                                    <button>
                                        <img src={Image.GALLERY8} alt="gallery" />
                                    </button>
                                    <button>
                                        <img src={Image.GALLERY9} alt="gallery" />
                                    </button>
                                </div>
                            </div>
                            <div className="sidebar-about">
                                <h4 className="options-title">About Us</h4>
                                <p>
                                    Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ipsum expedita animi
                                    dolorum cum repudiandae similique nostrum dolorem facere commodi voluptatem!
                                    Doloremque atque nobis veniam debitis corporis suscipit rem minima labore.
                                </p>
                            </div>
                        </div>
                    </div>
                </Sidebar>
            )}
        </header>
    );
}

export default Header;
