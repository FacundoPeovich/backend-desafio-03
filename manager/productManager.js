import fs from "fs";

class ProductManager {
    constructor(filePath) {
        this.path = filePath;
        this.products = [];
        this.initializeFile();
        this.loadProducts();
    }

    initializeFile() {
        try {
            if (!fs.existsSync(this.path)) {
                fs.writeFileSync(this.path, '[]');
            }
        } catch (error) {
            console.error('Error al inicializar el archivo:', error);
        }
    }

    loadProducts() {
        try {
            const data = fs.readFileSync(this.path, 'utf8');
            this.products = JSON.parse(data);
        } catch (error) {
            console.error('Error al cargar los productos:', error);
            this.products = [];
        }
    }

    saveProducts() {
        try {
            fs.writeFileSync(this.path, JSON.stringify(this.products, null, "\t"));
        } catch (error) {
            console.error("Error al guardar los productos:", error.message);
            throw error;
        }
    }

    addProduct(title, description, thumbnail, code, stock) {
        if (
            typeof title !== 'string' ||
            typeof description !== 'string' ||
            typeof thumbnail !== 'string' ||
            typeof code !== 'string' ||
            typeof stock !== 'number' || stock < 0
        ) {
            console.error("Parámetros inválidos");
            return null;
        }

        try {
            this.checkDuplicateCode(code);

            const product = {
                id: this.generateUniqueID(),
                code: code,
                title: title,
                description: description,
                thumbnail: thumbnail,
                stock: stock
            };

            this.products.push(product);
            this.saveProducts();
            return this.products;

        } catch (error) {
            console.error("Error al agregar el producto:", error.message);
            return null;
        }
    }

    generateUniqueID() {
        const randomPart = Math.random().toString(36).substr(2, 9);
        const timePart = Date.now().toString(36);
        return randomPart + timePart;
    }

    checkDuplicateCode(code) {
        const existingProduct = this.products.find(product => product.code === code);
        if (existingProduct) {
            throw new Error("El código de producto ya está en uso");
        }
    }

    getProducts() {
        console.log("**** Productos ****");
        console.table(this.products);
        return this.products;
    }

    updateProduct(id, updatedProduct) {
        try {
            const index = this.products.findIndex(product => product.id === id);
            if (index >= 0) {
                this.checkDuplicateCode(updatedProduct.code);
                this.products[index] = { ...updatedProduct, id: id };
                this.saveProducts();
                return this.products;
            } else {
                console.log("Actualización fallida. ¡ID de producto no encontrado!");
            }
        } catch (error) {
            console.error("Error al actualizar el producto:", error.message);
        }
    }

    deleteProduct(id) {
        try {
            const index = this.products.findIndex(product => product.id === id);
            if (index >= 0) {
                this.products.splice(index, 1);
                this.saveProducts();
                return this.products;
            } else {
                console.log("Eliminación fallida. ¡ID de producto no encontrado!");
                return null;
            }
        } catch (error) {
            console.error("Error al eliminar el producto:", error.message);
        }
    }

    getProductById(id) {
        try {
            const product = this.products.find(product => product.id === id);
            if (product) {
                return product;
            } else {
                console.log("¡Producto no encontrado!");
                return null;
            }
        } catch (error) {
            console.error("Error al obtener el producto por ID:", error.message);
            return null;
        }
    }
}

export default ProductManager;
