import express from "express";
import ProductManager from "./manager/productManager.js";

const PORT = 8080;

const app = express();

app.use(express.urlencoded({extended:true}))


const path = "./files/products.json";
const managerProduct = new ProductManager(path);

app.get('/products/', async (req,res)=>{
    
    const limite = req.query.limit;
    let productos = await managerProduct.getProducts();
    let productosAcotados = [];
    if (limite && limite > 0){
        let i;
        for (i=0;i<=limite-1;i++) { 
            productosAcotados.push(productos[i]);
        }
        return res.send({productosAcotados});
    } else {
        return res.send({productos});
    }

})

app.get('/products/:ipid', async (req,res)=>{
    
    const prodId = req.params.ipid;
    const productobyId = await managerProduct.getProductById(prodId);     //Copiar un id del archivo products.json para probar
    if (productobyId) {
        return res.send({productobyId});
    } else {
        return res.send("Not Found!!!");
    }
    

})

app.listen(PORT, ()=>{
    console.log(`Servidor funcionando en el puerto: ${PORT}`);
})