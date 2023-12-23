const Book = require("../models/Product");
const escapeStringRegexp = require("escape-string-regexp-node");

// CRUD
const createProduct = async (req, res) => {
    try {
        const { name, author, image, type, slot, position } = req.body;
        if (!name || !image || !type || !author || !slot || !position) {
            return res.status(400).json({ message: "missing something ?" });
        }

        const newProduct = await new Book({
            name,
            image,
            type,
            author,
            slot,
            position,
        });
        const product = await newProduct.save();
        return res.status(200).json({ message: "thành công", product });
    } catch (error) {
        return res.status(400).json({ message: error });
    }
};

const getAllProduct = async (req, res) => {
    const pageIndex = req.query.page;
    const page = +pageIndex + 1;
    try {
        const countProducts = await Book.count();
        const Products = await Book.find()
            .limit(10)
            .skip(pageIndex * 10);
        const totalPage = Math.ceil(countProducts / 10);
        // const product = Products.map((product) => product.toObject());
        return res.status(200).json({ page, countProducts, totalPage, Products });
    } catch (error) {
        return res.status(400).json({ message: error });
    }
};

const getProduct = async (req, res) => {
    try {
        const productItem = await Book.findOne({ _id: req.params.id });
        return res.status(200).json(productItem);
    } catch (error) {
        return res.status(400).json({ message: error, status: 400 });
    }
};

const updateProduct = async (req, res) => {
    try {
        const { name, author, image, type, slot } = req.body;
        if (!name || !author || !image || !slot || !type) {
            return res.status(400).json({ message: "missing something ?" });
        }
        const product = await Book.updateOne({ _id: req.params.id }, req.body);
        return res.status(200).json({ message: "suscces" });
    } catch (error) {
        return res.status(400).json({ message: error });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const product = await Book.delete({ _id: req.params.id });
        return res.status(200).json({ message: "suscces" });
    } catch (error) {
        return res.status(400).json({ message: error });
    }
};

// panigated
const PanigatedSearch = async (req, res) => {
    try {
        const filter = req.query.filter;
        console.log(filter);
        const searchIndex = req.query.search;
        const limit = 8;
        const productLength = await Book.count();
        const pages = Number(searchIndex + 1);
        const totalPage = Math.ceil(productLength / limit);
        if (filter) {
            const $regex = escapeStringRegexp(filter);
            const Products = await Book.find({
                $or: [
                    { name: { $regex, $options: "i" } },
                    { type: { $regex, $options: "i" } },
                    { author: { $regex, $options: "i" } },
                ],
            })
                .limit(limit)
                .skip(searchIndex * limit);

            return res.status(200).json({ productLength, pages, totalPage, Products });
        }
        const Products = await Book.find()
            .limit(limit)
            .skip(searchIndex * limit);
        return res.status(200).json({ productLength, pages, totalPage, Products });
    } catch (error) {
        return res.status(400).json({ message: error });
    }
};

const getObjectProduct = async (req, res) => {
    try {
        const { sort, page } = req.query;
        const param = req.params.ob;
        const paramtype = req.query.type;
        const totalOb = await Book.count({ Ob: param });
        const limit = 9;
        const pages = Number(page) + 1;
        const totalPage = Math.ceil(totalOb / limit);
        if (param !== "man" && param !== "woman" && param !== "kids") {
            return res.status(400).json({ message: "sorry we dont found this page" });
        }
        if (!page) {
            return res.status(400).json("No page numbers found");
        }

        if (paramtype) {
            const totalOb = await Book.count({ Ob: param, type: paramtype });
            const totalPage = Math.ceil(totalOb / limit);
            if (sort) {
                const Products = await Book.find({ Ob: param, type: paramtype })
                    .limit(limit)
                    .skip(page * limit)
                    .sort({
                        [sort[1]]: sort[0],
                    });
                return res.status(200).json({ totalOb, pages, totalPage, Products });
            }

            const Products = await Book.find({ Ob: param, type: paramtype })
                .limit(limit)
                .skip(page * limit);
            return res.status(200).json({ totalOb, pages, totalPage, Products });
        }

        if (sort) {
            const Products = await Book.find({ Ob: param })
                .limit(limit)
                .skip(page * limit)
                .sort({
                    [sort[1]]: sort[0],
                });
            return res.status(200).json({ totalOb, pages, totalPage, page, Products });
        }
        const Products = await Book.find({ Ob: param })
            .limit(limit)
            .skip(page * limit);

        return res.status(200).json({ totalOb, pages, totalPage, page, Products });
    } catch (error) {
        return res.status(400).json({ message: error });
    }
};

module.exports = {
    createProduct,
    getAllProduct,

    getProduct,
    updateProduct,
    PanigatedSearch,
    getObjectProduct,
    deleteProduct,
};
