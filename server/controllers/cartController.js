const Carts = require('../models/allModels');
const Inventory = require('../models/allModels');

const cartController = {};

//SELECT i.*
//FROM inventory i LEFT JOIN carts c 
//ON p.productid = c.productid 
//Mu4abc!@#
// WORKS
// add product name, price, quantity, image!
cartController.getProducts = async (req, res, next) => {
    const userID = req.params.userID;
    try{
        const sqlQuery = `SELECT c.userid, i.productid, 
        i.productname, c.quantity, i.price, i.img
        FROM inventory i JOIN carts c 
        ON i.productid = c.productid WHERE c.userid = ${userID};`;
        const cart = await Carts.query(sqlQuery);
        console.log('cart.rows from cartcontroller getproducts', cart.rows)
        res.locals.cart = cart.rows;
        return next();
    }
    catch {
        console.log('caught something in cartController getProducta');
        return next('could not get cart products');
      }
}
// WORKS
cartController.updateCart = async (req, res, next) => {
    const userID = req.params.userID;
    const productID = req.params.productID
    const { quantity } = req.body;

    console.log('userid', userID)
    console.log('productID', productID)
    console.log('quantity', quantity)

    try{
        const sqlQuery = `
          UPDATE carts 
          SET quantity = ${quantity} 
          WHERE userID = ${userID} AND productID = ${productID}
          RETURNING *
        `; 
        const updatedCartItem = await Carts.query(sqlQuery); 
        console.log(updatedCartItem);
        res.locals.updatedCartItem = updatedCartItem.rows[0]; 

        return next(); 
    }
    catch {
        console.log('caught something in cartController updateProduct');
        return next('could not update cart');
      }

    
    // try{
    //     let cart = await Carts.findOne({userId});
    //     let product = await Inventory.findOne({_id: productId});

    //     if(!product)
    //         return res.status(404).send('product not found!');
        
    //     if(!cart)
    //       return res.status(400).send("Cart not found");
    //     else{
    //         // if cart exists for the user
    //         let productIndex = cart.products.findIndex(p => p.productId == productId);

    //         // Check if product exists or not
    //         if(productIndex == -1)
    //           return res.status(404).send('Product not found in cart!');
    //         else {
    //             let productItem = cart.products[productIndex];
    //             productItem.quantity = qty;
    //             cart.products[productIndex] = productItem;
    //         }
    //         cart.bill = cart.products.reduce((sum, item) => sum + item.price * item.quantity,0);
    //         cart = await cart.save();
    //         return res.status(201).send(cart);
    //     }     
    // }
    // catch (err) {
    //     // just printing the error wont help us find where is the error. Add some understandable string to it.
    //     console.log("Error in update cart", err);
    //     res.status(500).send("Something went wrong");
    // }
}
// add product to user cart
cartController.addProduct = async (req, res, next) => {
    const userID = req.params.userID;
    const productID = req.params.productID
    const { quantity } = req.body;

    try{
      // check if product exists in user cart then update otherwise add new row to carts db
      const checkCartQuery = `
      SELECT * FROM carts 
      WHERE userid = ${userID} 
      AND productid = ${productID};
      `;
      const currCart = await Carts.query(checkCartQuery); 
      if (currCart.rows.length) {
        const updateQuery = `
              UPDATE carts
              SET quantity = quantity + ${quantity} 
              WHERE productID = ${productID}
              AND userid = ${userID}
              RETURNING *
            `; 
        const addedProduct = await Carts.query(updateQuery); 
        res.locals.addedProduct = addedProduct.rows[0]; 
        return next();
      } else {
        const params = [quantity, userID, productID];
        const sqlQuery = `
          INSERT INTO carts (quantity, userid, productid)
          VALUES ($1, $2, $3) RETURNING *; 
        `; 
        const addedProduct = await Carts.query(sqlQuery, params); 
        res.locals.addedProduct = addedProduct.rows[0]; 
        return next(); 
      }


        // let cart = await Carts.findOne({userId});
        // let product = await Inventory.findOne({_id: productId});
        // if(!product){
        //     res.status(404).send('Product not found!')
        // }
        // const price = product.price;
        // const name = product.title;
        
        // if(cart){
        //     // if cart exists for the user
        //     let productIndex = cart.products.findIndex(p => p.productId == productId);

        //     // Check if product exists or not
        //     if(productIndex > -1)
        //     {
        //         let productItem = cart.products[itemIndex];
        //         productItem.quantity += quantity;
        //         cart.products[productIndex] = productItem;
        //     }
        //     else {
        //         cart.products.push({ productId, name, quantity, price });
        //     }
        //     cart.bill += quantity*price;
        //     cart = await cart.save();
        //     return res.status(201).send(cart);
        // }
        // else{
        //     // no cart exists, create one
        //     const newCart = await Carts.create({
        //         userId,
        //         products: [{ productId, name, quantity, price }],
        //         bill: quantity*price
        //     });
        //     return res.status(201).send(newCart);
        // }       
    }
    catch(err) {
        console.log('caught something in cartController addProduct');
        return next('could not add product to cart');
      }
}
// WORKS
cartController.deleteProduct = async (req, res, next) => {
    const userID = req.params.userID;
    const productID = req.params.productID;
    try {
        const sqlQuery = `DELETE FROM carts WHERE (productId = ${productID} AND userid = ${userID});`;
        const deletedProduct = await Carts.query(sqlQuery);
        res.locals.deletedProduct = deletedProduct.rows;
        return next();
      }
      catch(err) {
        console.log('caught something in cartController deleteProduct');
        return next('could not delete product from cart');
      }
    // try{
    //     let cart = await Carts.findOne({userId});
    //     let productIndex = cart.products.findIndex(p => p.productId == productId);
    //     if(productIndex > -1)
    //     {
    //         let productItem = cart.products[productIndex];
    //         cart.bill -= productItem.quantity*productItem.price;
    //         cart.products.splice(productIndex,1);
    //     }
    //     cart = await cart.save();
    //     return res.status(201).send(cart);
    // }
    // catch (err) {
    //     console.log(err);
    //     res.status(500).send("Something went wrong");
    // }
}

module.exports = cartController;