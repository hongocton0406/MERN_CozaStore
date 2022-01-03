import Image from "./Image";

import DashboardIcon from "@mui/icons-material/Dashboard";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import CategoryIcon from "@mui/icons-material/Category";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import AttachEmailIcon from "@mui/icons-material/AttachEmail";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import SecurityIcon from "@mui/icons-material/Security";
import PersonIcon from "@mui/icons-material/Person";
import CheckroomSharpIcon from "@mui/icons-material/CheckroomSharp";
import IceSkatingSharpIcon from "@mui/icons-material/IceSkatingSharp";
import SportsMotorsportsSharpIcon from "@mui/icons-material/SportsMotorsportsSharp";

export const OBJECTS = [
    { id: 0, name: "Men" },
    { id: 1, name: "Women" },
    { id: 2, name: "Kids" },
];

export const CATEGORY_PRODUCT = [
    { id: 0, name: "Shoes" },
    { id: 1, name: "Clothing" },
    { id: 2, name: "Accessory and Equipment" },
];

export const DATA_TAB = [
    {
        name: "Esprit Ruffle Shirt",
        price: 16.64,
        image: Image.PRODUCT1,
    },
    {
        name: "Herschel Supply",
        price: 16.64,
        image: Image.PRODUCT2,
    },
    {
        name: "Only Check Trouser",
        price: 16.64,
        image: Image.PRODUCT3,
    },
    {
        name: "Classic Trench Coat",
        price: 16.64,
        image: Image.PRODUCT4,
    },
    {
        name: "Front Pocket Jumper",
        price: 16.64,
        image: Image.PRODUCT5,
    },
    {
        name: "Vintage Inspired Classic",
        price: 16.64,
        image: Image.PRODUCT6,
    },
    {
        name: "Shirt in Stretch Cotton",
        price: 16.64,
        image: Image.PRODUCT7,
    },
    {
        name: "Pieces Metallic Printed",
        price: 16.64,
        image: Image.PRODUCT8,
    },
];

export const ADMIN_SIDEBAR = [
    {
        title: "Dashboard",
        path: "/admin",
        icon: <DashboardIcon fontSize="small" />,
    },
    {
        title: "Users",
        path: "",
        icon: <GroupAddIcon />,
        iconClosed: <KeyboardArrowLeftIcon fontSize="small" />,
        iconOpened: <KeyboardArrowDownIcon fontSize="small" />,
        SubMenu: [
            {
                title: "Admin",
                path: "/user/admin",
                icon: <SecurityIcon fontSize="small" />,
            },
            {
                title: "Customer",
                path: "/user/customer",
                icon: <PersonIcon fontSize="small" />,
            },
        ],
    },
    {
        title: "Products",
        path: "",
        icon: <CategoryIcon />,
        iconClosed: <KeyboardArrowLeftIcon fontSize="small" />,
        iconOpened: <KeyboardArrowDownIcon fontSize="small" />,
        SubMenu: [
            {
                title: "Shoes",
                path: "/product/shoes",
                icon: <IceSkatingSharpIcon fontSize="small" />,
            },
            {
                title: "Clothing",
                path: "/product/clothing",
                icon: <CheckroomSharpIcon fontSize="small" />,
            },
            {
                title: "Accessory & Equipment",
                path: "/product/accessory-equipment",
                icon: <SportsMotorsportsSharpIcon fontSize="small" />,
            },
        ],
    },
];

export const CATEGORY_OPTIONS = [
    { value: "men", label: "Men" },
    { value: "women", label: "Women" },
    { value: "kids", label: "Kids" },
];

export const COLOR_OPTIONS = [
    { value: "ocean", label: "Ocean" },
    { value: "blue", label: "Blue", isDisabled: true },
    { value: "purple", label: "Purple" },
    { value: "red", label: "Red" },
    { value: "orange", label: "Orange" },
    { value: "yellow", label: "Yellow" },
    { value: "green", label: "Green" },
    { value: "forest", label: "Forest" },
    { value: "slate", label: "Slate" },
    { value: "silver", label: "Silver" },
];

export const TAG_OPTIONS = [
    { value: "lifestyle", label: "Lifestyle" },
    { value: "sports", label: "Sports" },
    { value: "fashion", label: "Fashion" },
    { value: "classic", label: "Classic" },
    { value: "romantic", label: "Romantic" },
    { value: "traditional", label: "Traditional" },
];

export const SIZE_OPTIONS = [
    { value: "extra-small", label: "XS" },
    { value: "small", label: "S" },
    { value: "medium", label: "M" },
    { value: "large", label: "L" },
    { value: "extra-large", label: "XL" },
];

export const STATUS_RADIO = [
    { name: "Active", value: "active" },
    { name: "Inactive", value: "inactive" },
];
