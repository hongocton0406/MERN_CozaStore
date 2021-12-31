const router = require("express").Router();

const Product = require("../models/Product");
const { verifyTokenAndAdmin } = require("../middleware/verifyToken");

// CREATE
// @localhost:5000/api/product/
router.post("/", verifyTokenAndAdmin, async (req, res) => {
    const newProduct = new Product(req.body);

    if (!newProduct.title || !newProduct.desc || !newProduct.thumb || !newProduct.price)
        return res.status(401).json({ success: false, message: "Missing necessary information" });

    try {
        const existProduct = await Product.findOne({ title: newProduct.title });
        if (existProduct) return res.status(400).json({ success: false, message: "Product already exist" });

        const savedProduct = await newProduct.save();
        res.json({ success: true, message: "Product created successfully", product: savedProduct });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

// UPDATE
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.json({ success: true, message: "Update product successfully", product: updatedProduct });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

// DELETE
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const deletedProduct = await Product.findOneAndDelete(req.params.id);
        if (!deletedProduct) return res.status(401).json({ success: false, message: "Product not found" });
        res.json({ success: true, message: "Product has been deleted" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

// GET PRODUCT
router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(401).json({ success: false, message: "Product not found" });
        res.json({ success: true, message: "Get product successfully", product });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

// GET ALL PRODUCT
router.get("/", verifyTokenAndAdmin, async (req, res) => {
    try {
        const product = await Product.find();
        if (!product) return res.status(401).json({ success: false, message: "Products not found" });
        res.json({ success: true, message: "Get products successfully", product });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});
module.exports = router;