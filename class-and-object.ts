class Car{
    private brand: string
    private model: string;
    private speed: number;


    constructor(brand: string, model: string)
    {
        this.brand = brand
        this.model = model;
        this.speed = 0
    }

    // function keyword in not written
    acceleration(speed : number): void {
        this.speed += speed

    }
    speedometer () : number {
        console.log(`${this.brand} is running on ${this.speed}`)
        return this.speed
    }


}


function main1() :void {
    const bmw = new Car("BMW", "M2")
    const audi = new Car("Audi", "Q5")

    bmw.acceleration(10)
    bmw.acceleration(100)
    bmw.speedometer()

    audi.speedometer()

}

main1()
