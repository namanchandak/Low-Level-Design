abstract class Discount {
    protected label: string;

    constructor(label: string) { this.label = label; }

    abstract apply(price: number): number;

    describe(originalPrice: number): void {
        // TODO: call this.apply(originalPrice) and print:
        //   "label: $originalPrice -> $discountedPrice"
        // Hint: use value.toFixed(2) for formatting
        console.log(`label: ${this.apply}, ${originalPrice}`)
    }
}

class PercentageDiscount extends Discount {
    private percentage: number;

    constructor(percentage: number) {
        super(percentage.toFixed(1) + "% off");
        // TODO: initialize this.percentage using the parameter
        this.percentage = percentage;
    }

    apply(price: number): number {
        // TODO: return price * (1 - percentage / 100)
        return price * (1- (this.percentage/100) );
    }
}

class FlatDiscount extends Discount {
    private amount: number;

    constructor(amount: number) {
        super("$" + amount.toFixed(1) + " off");
        // TODO: initialize this.amount using the parameter
        this.amount = amount;
    }

    apply(price: number): number {
        // TODO: return Math.max(price - amount, 0)
        return Math.max(price - this.amount, 0);
    }
}

class BuyOneGetOneFree extends Discount {
    constructor() {
        super("Buy 1 Get 1 Free");
    }

    apply(price: number): number {
        // TODO: return price / 2
        return price/2;
    }
}

class OrderProcessor {
    processOrder(itemName: string, price: number, discount: Discount): void {
        // TODO: print "Item: itemName" then call discount.describe(price)
        console.log(` ${itemName} , ${discount.apply(price)}`)
    }
}

const processor = new OrderProcessor();

processor.processOrder("Laptop", 999.99, new PercentageDiscount(20));
processor.processOrder("Headphones", 49.99, new FlatDiscount(15));
processor.processOrder("Keyboard", 79.98, new BuyOneGetOneFree());


// polymorphism 1