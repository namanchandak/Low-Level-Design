class Shape {
    protected name: string;

    constructor(name: string) {
        this.name = name;
    }

    area(): number {
        // TODO: return 0 by default
        return 0;
    }

    perimeter(): number {
        // TODO: return 0 by default
        return 0;
    }

    describe(): void {
        // TODO: print "Shape: name, Area: area, Perimeter: perimeter"
        // Hint: use value.toFixed(2) for formatting
        console.log(`${this.name} is the shape, ${this.area()}- area, ${this.perimeter()} - perimeter`)
    }
}

class Circle extends Shape {
    private radius: number;

    constructor(radius: number) {
        super("Circle");
        // TODO: initialize this.radius using the parameter
        this.radius = radius;
    }

    area(): number {
        // TODO: return Math.PI * radius * radius
        return Math.PI * this.radius * this.radius;
    }

    perimeter(): number {
        // TODO: return 2 * Math.PI * radius
        return Math.PI *2 * this.radius;
    }
}

class Rectangle extends Shape {
    private width: number;
    private height: number;

    constructor(width: number, height: number) {
        super("Rectangle");
        // TODO: initialize this.width and this.height using the parameters
        this.width = width;
        this.height = height;
    }

    area(): number {
        // TODO: return width * height
        return this.width * this.height;
    }

    perimeter(): number {
        // TODO: return 2 * (width + height)
        return 2 * (this.width + this.height);
    }
}

const circle = new Circle(5.0);
circle.describe();

const rect = new Rectangle(4.0, 6.0);
rect.describe();

// problem 2 inheritance