abstract class Shape {
    protected name: string;

    constructor(name: string) {
        this.name = name;
    }

    abstract area(): number;
    abstract perimeter(): number;

    describe(): void {
        // Print: "Shape: [name], Area: [area], Perimeter: [perimeter]"
        // Use .toFixed(2) for formatting
        console.log(`Shape: ${this.name}, Area: ${this.area().toFixed(2)}, Perimeter: ${this.perimeter().toFixed(2)}`);

    }
}

class Circle extends Shape {
    private radius: number;
    private pi = 3.14 

    constructor(radius: number) {
        super("Circle");
        this.radius = radius;
    }

    area(): number {
        // Area = pi * r^2

        return this.pi* this.radius * this.radius ;
    }

    perimeter(): number {
        // Perimeter = 2 * pi * r
        return 2 * this.pi * this.radius;
    }
}

class Rectangle extends Shape {
    private width: number;
    private height: number;

    constructor(width: number, height: number) {
        super("Rectangle");
        this.width = width;
        this.height = height;
    }

    area(): number {
        // Area = width * height

        this.name = "node js "
        return this.width * this.height;
    }

    perimeter(): number {
        // Perimeter = 2 * (width + height)
        return 2 * (this.width + this.height);
    }

}

const circle: Shape = new Circle(5.0);
circle.describe();

// const rectangle: Shape = new Rectangle(4.0, 6.0);
// rectangle.describe();


// doubts
// how parent method inherit child this/ this keyword is 


// abstraction practice