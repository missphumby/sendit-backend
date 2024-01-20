const express = require("express");
const router = express.Router();
const Order = require("../models/order");
// const mongoose = require("mongoose");
const { authorizeUser } = require("../auth/verifyToken");

router.get("/posts", (req, res) => {
  res.send("they are on home");
});

router.post("/", authorizeUser, (req, res) => {
  const orderDetails = req.body;
  if (req.decoded.id == req.body.userId) {
    Order.create(orderDetails, (err, data) => {
      if (err) {
        res.json({ err });
      } else {
        res.json({ data });
      }
    });
  } else {
    res.json({ error: "can't create order for another user" });
  }
});

// router.get('/:userId', (req, res) => {
//     Order.findById({userId: req.params.userId}, (err, data) => {
//         if(err) throw err
//         res.json({data})
//     })
// })

router.get("/", async (req, res, next) => {
  try {
    const order = await Order.find();
    res.status(200).send({ data: order });
  } catch (err) {
    if (err)
      return res.status(500).send("There was a problem finding the order.");
    // if (!order) return res.status(404).send("No order found.");
  }
});

//find specific user orders by userId
router.get("/:userId", authorizeUser, async (req, res, next) => {
  if (req.decoded.id == req.params.userId) {
    Order.find({ userId: req.params.userId }, (err, data) => {
      if (err) {
        res.status(500).send("There was a problem finding the order.");
      }
      res.status(200).send({ data });
    });
  } else {
    res.json({ error: "Can't fetch orders for another user" });
  }
});

router.patch("/:orderId/cancel", async (req, res) => {
  try {
    const updatedOrder = await Order.findOneAndUpdate(
      { orderId: req.params.orderId },
      { $set: { status: "Cancelled" } },
      { new: true }
    );
    res.status(200).send({
      success: true,
      data: updatedOrder,
    });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

//update request
router.put('/:id', authorizeUser, (req, res) =>{
    const id = req.params.id;
    const newData = req.body;
    Order.update({_id: id}, newData)
    .exec()
    .then((result)=> {
        res.status(200).json({
            message: 'data updated',
            updatedData: result
        })
    })
    .catch((err) => {
        res.status(401).json({
            message: 'an error occured',
            error: err
        })
    })
    
});
//patch request
router.patch('/:orderId', authorizeUser, (req, res) =>{
    const id = req.params.orderId;
    const newData = req.body;
    Order.update({_id: id}, newData)
    .exec()
    .then((result)=> {
        console.log(result);
        res.status(200).json({
            message: 'data patched',
            updatedData: result
        })
    })
    .catch((err) => {
        res.status(401).json({
            message: 'an error occured',
            error: err
        })
    })  
});


router.delete("/:orderId", async (req, res) => {
  try {
    const removedPost = await Order.remove({ orderId: req.params.orderId });
    res.status(200).json({ success: true, data: removedPost });
  } catch (err) {
    res.json({ error: err });
  }
});

module.exports = router;


