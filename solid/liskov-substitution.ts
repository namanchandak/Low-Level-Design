// Before: Square extends Rectangle but breaks its contract

interface Shape{
    getArea(): number;
}

class Rectangle implements Shape {
    protected width: number = 0;
    protected height: number = 0;

    constructor(height: number, width: number)
    {
        this.height = height
        this.width  = width
    }

    // setWidth(w: number): void { this.width = w; }
    // setHeight(h: number): void { this.height = h; }
    getArea(): number { return this.width * this.height; }
}

class Square implements Shape {
    // setWidth(w: number): void { this.width = w; this.height = w; }
    // setHeight(h: number): void { this.width = h; this.height = h; }

    protected length: number;
    constructor(length: number)
    {
        this.length = length
    }
    // console.log(this.length)

    getArea(): number { return Math.pow(this.length, 2) };

}

// Client code that breaks with Square
function resize(rect: Rectangle): void {
    // rect.setWidth(5);
    // rect.setHeight(10);
    console.log("Area:", rect.getArea());
}

resize(new Rectangle(10,20)); // Area: 50

const squ = new Square(40);
console.log(squ.getArea(), )

    // Area: 100 -- LSP violation!

// TODO: Refactor using a Shape interface with getArea().
// TODO: Rectangle and Square should be independent implementations of Shape.