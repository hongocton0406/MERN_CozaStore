const router = require("express").Router();
const { changeAlias } = require("../helpers/string");
const BlogCategory = require("../models/BlogCategory");
const { verifyTokenAndAdmin } = require("../middleware/verifyToken");

// @DESC Create new blog category
// @ROUTE POST /api/blog-category/
// @ACCESS Private
router.post("/", verifyTokenAndAdmin, async (req, res) => {
    const newCategory = new BlogCategory(req.body);

    if (!newCategory.name) return res.status(401).json({ success: false, message: "Missing necessary information" });

    try {
        newCategory.slug = changeAlias(newCategory.name);
        const existCategory = await BlogCategory.findOne({
            name: newCategory.name,
        });
        if (existCategory) return res.status(400).json({ success: false, message: "Blog category already exist" });
        const savedCategory = await newCategory.save();
        res.json({
            success: true,
            message: "Blog category created successfully",
            category: savedCategory,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

// @DESC Update a blog
// @ROUTE PUT /api/blog-category/:id
// @ACCESS Privates
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
    const updateCategory = req.body;
    try {
        const oldCategory = await BlogCategory.findById(req.params.id);
        if (oldCategory) {
            updateCategory.slug = changeAlias(updateCategory.name);
            const updatedCategory = await BlogCategory.findByIdAndUpdate({ _id: req.params.id }, updateCategory, {
                new: true,
            });
            res.json({
                success: true,
                message: "Update blog category successfully",
                category: updatedCategory,
            });
        } else {
            return res.status(401).json({ success: false, message: "Product Category is invalid" });
        }
    } catch (error) {
        console.log(error);
        let msg = "Internal server error";
        if (error.code === 11000) msg = "Invalid data";
        res.status(500).json({ success: false, message: msg });
    }
});

// @DESC Delete a blog
// @ROUTE DELETE /api/blog-category/:id
// @ACCESS Privates
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const deletedCategory = await BlogCategory.findOneAndDelete({ _id: req.params.id });
        if (!deletedCategory) return res.status(401).json({ success: false, message: "Blog category not found" });
        res.json({ success: true, message: "Blog category has been deleted" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

// @DESC Find a blog
// @ROUTE GET /api/blog-category/find/:id
// @ACCESS Privates
router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const category = await BlogCategory.findById(req.params.id);
        if (!category) return res.status(401).json({ success: false, message: "Blog category not found" });
        res.json({ success: true, message: "Get blog category successfully", category });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

// @DESC Get all  blog
// @ROUTE GET /api/blog-category/
// @ACCESS Public
router.get("/", async (req, res) => {
    try {
        const category = await BlogCategory.find().select("id name status tag slug description");
        if (!category) return res.status(401).json({ success: false, message: "Blog categories not found" });
        res.json({ success: true, message: "Get blog categories successfully", category });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

// @DESC Change blog-category's status
// @ROUTE PUT /api/blog-cateogry/change-status/:id
// @ACCESS Privates
router.put("/change-status/:id", verifyTokenAndAdmin, async (req, res) => {
    const { currentStatus } = req.body;
    const statusValue = currentStatus === "active" ? "inactive" : "active";
    try {
        const oldCategory = await BlogCategory.findById(req.params.id);
        if (oldCategory) {
            await BlogCategory.updateOne({ _id: req.params.id }, { status: statusValue });
            res.json({
                success: true,
                message: "Update blog-category's status successfully",
            });
        } else {
            return res.status(401).json({ success: false, message: "Blog category is invalid" });
        }
    } catch (error) {
        console.log(error);
        let msg = "Internal server error";
        if (error.code === 11000) msg = "Invalid data";
        res.status(500).json({ success: false, message: msg });
    }
});
module.exports = router;
