const order = require("../models/OrderProduct");
const Product = require("../models/Product");
const user = require("../models/userDataBase");
const io = require("socket.io-client");
const socket = io("http://localhost:5000");
const getAllOrder = async (req, res) => {
    try {
        const getAll = await order.find();
        return res.status(200).json(getAll);
    } catch (error) {
        return res.status(400).json({ message: error });
    }
};
const deleteOrder = async (req, res) => {
    try {
        const { idProduct, idOrder } = req.body;

        // Sử dụng Order thay vì order
        const orderAfterDelete = await order.findOneAndUpdate(
            {
                _id: idOrder,
            },
            {
                $pull: {
                    orderItems: {
                        product: idProduct,
                    },
                },
            },
            {
                new: true,
            }
        );

        // Kiểm tra nếu orderAfterDelete là null, có thể nghĩa là không tìm thấy đơn hàng
        if (!orderAfterDelete) {
            return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
        }
        const product = await Product.findOneAndUpdate(
            { _id: idProduct },
            { $inc: { slot: 1 } }, // Thay thế "quantity" bằng tên trường bạn muốn cộng thêm 1
            { new: true }
        );
        return res
            .status(200)
            .json({ message: "Bạn đã xóa thành công", order: orderAfterDelete, product: product });
    } catch (error) {
        return res.status(500).json({ message: "Đã xảy ra lỗi", error: error.message });
    }
};

const borrow = async (req, res) => {
    try {
        const { name, image, type, author, _id, dateBorrow } = req.body;
        const id = req.params.id;
        const muon = await order.findOne({ user: id });
        const product = await Product.findOne({ _id: _id });
        const human = await user.findOne({ _id: id });
        if (human.punish) {
            return res.status(200).json({ message: "bạn đã bị phạt không thể mượn sách" });
        }
        if (product.slot <= 0) {
            return res.status(200).json({ message: "Số lượng sách đã hết" });
        }

        product.slot = product.slot - 1;
        await product.save();

        if (!!muon) {
            await muon.orderItems.push({
                name: name,
                image: image,
                type: type,
                author: author,
                product: _id,
                dateBorrow: dateBorrow,
            });

            await muon.save();
            socket.emit("data", muon);
            return res.status(200).json({ message: "Mượn thành công", muon });
        } else {
            const newOrder = await new order({
                orderItems: [
                    {
                        name: name,
                        image: image,
                        type: type,
                        author: author,
                        product: _id,
                        dateBorrow: dateBorrow,
                    },
                ],
                user: id,
            });
            const newOrderSave = await newOrder.save();
            return res.status(200).json(newOrderSave);
        }
    } catch (error) {
        return res.status(400).json({ message: error });
    }
};

const userBorrow = async (req, res) => {
    console.log(req.params);
    try {
        const idUser = req.params.id;

        const getAll = await order.findOne({ user: idUser });
        return res.status(200).json(getAll);
    } catch (error) {
        return res.status(400).json({ message: error });
    }
};
module.exports = {
    deleteOrder,
    getAllOrder,
    borrow,
    userBorrow,
};
