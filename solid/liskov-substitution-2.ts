// Before: Penguin extends Bird but can't fly
// class Bird {
//     eat(): void {
//         console.log(`${this.constructor.name} is eating`);
//     }

//     fly(): void {
//         console.log(`${this.constructor.name} is flying`);
//     }
// }

// class Sparrow extends Bird {}

// class Penguin extends Bird {
//     fly(): void {
//         throw new Error("Penguins can't fly!");
//     }
// }

// function makeBirdFly(bird: Bird): void {
//     bird.fly(); // Crashes for Penguin!
// }

// makeBirdFly(new Sparrow()); // Works fine
// makeBirdFly(new Penguin()); // Error!

// TODO: Split Bird into a Bird interface (eat) and a FlyingBird interface (fly).
// TODO: Sparrow implements FlyingBird, Penguin implements only Bird.


interface Bird{
    eat(): void
}

interface FlyingBird extends Bird{
    
    eat(): void,
    fly(): void;

}

class Sparrow implements FlyingBird{

    private name: string

    constructor(name: string){
        this.name = name
    }

    
    eat(): void{
        console.log(`${this.name} is eating`);

    }
    fly(): void{
        console.log(`${this.name} is flying`);

    }
}

class Penguin implements Bird{
    private name: string

    constructor(name: string){
        this.name = name
    }
    eat(): void{
        console.log(`${this.name} is eating`);

    }
}

const MyPenguin = new Penguin("Linux");
const MySparrow = new Sparrow("sparrow ");

MyPenguin.eat()
MySparrow.eat()
MySparrow.fly()





