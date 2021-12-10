import express from 'express'
import {body,validationResult} from 'express-validator'
import Product from '../services/mongodb/models/Product'
const router = express.Router()

/*
type:GET
path:/api/v1/products/all
params:none
isProtected:false(public)
*/
router.get('/all',async(req,res)=>{
    try{
        const products = await Product.find({})
        return res.status(200).json({products,
        message: "Successfully fetched products"})
    }catch(error){
         console.log(error.message)
         return res.status(500).json({products:[],
        message:"error fetching products" })
    }
})
/*
type : GET
path : /api/v1/product/all
params : none
query: categoryId
isProtected: false (public)
*/

router.get('/all', async (req, res) => {
    try {
        const { categoryId } = req.query
        const products = await Product.find({ category: categoryId })
        return res.status(200).json({ products, message: "Successfully fetched products" })
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ products: [], message: "error fetching products" })
    }
})
/*
type:Post
path:/api/v1/products/add
params:none
isProtected:private(admin)
*/
router.post('/add',
    body('name').isLength({ min: 5}),
    body('description').isLength({ min: 10 }),
    body('price').isNumeric(),
    body('listprice').isNumeric(),
    body('color').isLength({min:1}),
    body('stock').isNumeric(),
    body('imageUrl').isURL()
    , async (req, res) => {

        const { errors } = validationResult(req)
        if (errors.length > 0) return res.status(403).json({ errors, message: "Bad request" })

        try {
            const category = await Category.findById(req.body.category)
            if (!category) return res.status(300).json({
                product: null,
                message: "Invalid category"
            })
            const product = new Product(req.body);
            await product.save()
            res.status(200).json({
                product, message: "Saved category in DB"
            })
        } catch (error) {
            return res.status(500).json({
                product: null,
                message: "Unable to save category in DB"
            })
        }
    })
/*
type : PUT
path : /api/v1/category/:id
params : id
isProtected: private (admin)
*/
router.put('/update/:id'
    , async (req, res) => {
        const { id } = req.params
        try {
            if (req.body.category) {
                const category = await Category.findById(req.body.category)
                if (!category) return res.status(300).json({
                    product: null,
                    message: "Invalid category"
                })
            }
            const product = await Product.findOneAndUpdate({ _id: id }, req.body, {
                new: true
            })
            res.status(200).json({
                product, message: "Updated product in DB"
            })
        } catch (error) {
            return res.status(500).json({
                product: null,
                message: "Unable to update product in DB"
            })
        }
    })

/*
type : DELETE
path : /api/v1/category/:id
params : id
isProtected: private (admin)
*/
router.delete('/delete/:id'
    , async (req, res) => {
        const { id } = req.params
        try {
            const product= await Product.findByIdAndRemove(id)
            res.status(200).json({
                product, message: "deleted product in DB"
            })
        } catch (error) {
            return res.status(500).json({
                product: null,
                message: "Unable to delete category in DB"
            })
        }
    })





export default router
