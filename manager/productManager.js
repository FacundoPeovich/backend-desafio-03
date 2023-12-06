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
            console.error('Error initializing the file:', error);
        }
    }

    loadProducts() {
        try {
            const data = fs.readFileSync(this.path, 'utf8');
            this.products = JSON.parse(data);
        } catch (error) {
            console.error('Error loading products:', error);
            this.products = [];
        }
    }

    saveProducts() {
        try {
            fs.writeFileSync(this.path, JSON.stringify(this.products, null, "\t"));
        } catch (error) {
            console.error("Error saving products:", error.message);
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
            console.error("Invalid parameters");
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
            console.error("Error adding product:", error.message);
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
            throw new Error("Product code is already in use");
        }
    }

    getProducts() {
        console.log("**** Products ****");
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
                console.log("Update failed. Product ID not found!");
            }
        } catch (error) {
            console.error("Error updating product:", error.message);
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
                console.log("Deletion failed. Product ID not found!");
                return null;
            }
        } catch (error) {
            console.error("Error deleting product:", error.message);
        }
    }
}

export default ProductManager;
