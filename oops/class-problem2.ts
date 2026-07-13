class ShoppingCart {
    private items: Map<string, number> = new Map();
    private discountApplied: boolean = false;
    private isCheckedOut: boolean = false;

    addItem(name: string, price: number): void {
        // Add item to cart, but reject if already checked out
        if(!this.isCheckedOut)
        {
            this.items.set(name, price)

        }
        else{
            console.log(`item checkout mode`)
        }
    }

    applyDiscount(code: string): boolean {
        // If code is "SAVE10" and no discount applied yet and not checked out,
        // mark discount as applied and return true. Otherwise return false.

        if( !this.discountApplied && code === 'SAVE10' && !this.isCheckedOut)
        {
            this.discountApplied = true;
            return true;
        }

        return false;
    }

    getTotal(): number {
        // Sum all item prices. If discount was applied, subtract 10%.
        let amount  = 0
        this.items.forEach((price, item) =>{
            amount += price
        })
        if(this.discountApplied)
        {
            return amount - amount*0.1;
        }
        return amount;
    }

    checkout(): void {
        // Mark cart as checked out (only if it has items and isn't already checked out)
        if(!this.isCheckedOut)
        {
            this.isCheckedOut = true
        }
    }
}

// Test your implementation
const cart = new ShoppingCart();
cart.addItem("Laptop", 999.99);
cart.addItem("Mouse", 29.99);

console.log(`Total: $${cart.getTotal().toFixed(2)}`);                    // 1029.98

console.log(`Discount: ${cart.applyDiscount("SAVE10")}`);                // true
console.log(`Total: $${cart.getTotal().toFixed(2)}`);                    // 926.98

console.log(`Discount: ${cart.applyDiscount("SAVE10")}`);                // false

cart.checkout();
cart.addItem("Keyboard", 79.99); // Should be rejected
console.log(`Total: $${cart.getTotal().toFixed(2)}`);                    // 926.98


// problem number 2