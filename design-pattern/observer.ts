interface WeatherObserver {
    update(station: WeatherStation): void;
}

class WeatherStation {
    private temperature: number = 0;
    private humidity: number = 0;
    private pressure: number = 0;
    private observers: WeatherObserver[] = [];

    registerObserver(observer: WeatherObserver): void {
        // TODO: Add observer to the list
        this.observers.push(observer);
    }

    removeObserver(observer: WeatherObserver): void {
        // TODO: Remove observer from the list
        this.observers.filter((item)=> 
            {
                return (item !== observer) 
                
            }
        )
    }

    private notifyObservers(): void {
        // TODO: Call update on each observer, passing this

        // why this is send into observer
        this.observers.forEach((item) =>
            item.update(this)
        )

    }

    // business logic
    setMeasurements(temperature: number, humidity: number, pressure: number): void {
        // TODO: Update fields and notify observers
        this.temperature = temperature;
        this.humidity = humidity;
        this.pressure = pressure;

        this.notifyObservers()

    }

    getTemperature(): number { return this.temperature; }
    getHumidity(): number { return this.humidity; }
    getPressure(): number { return this.pressure; }
}

class CurrentConditionsDisplay implements WeatherObserver {
    update(station: WeatherStation): void {
        // TODO: Print "Current Conditions -> Temp: X, Humidity: Y%, Pressure: Z hPa"
        console.log(`Current Conditions -> Temp: ${station.getTemperature()}, Humidity: ${station.getHumidity()}%, Pressure: ${station.getPressure()} hPa`)

    }
}

class StatisticsDisplay implements WeatherObserver {
    private readings: number[] = [];

    update(station: WeatherStation): void {
        // TODO: Add temperature to readings, compute average, print "Statistics -> Avg Temperature: X"
        this.readings.push(station.getTemperature());
        console.log(this.readings.reduce((item, curr) => item+ curr )/ this.readings.length);

    }
}

const station = new WeatherStation();
const current = new CurrentConditionsDisplay();
const stats = new StatisticsDisplay();
station.registerObserver(current);
station.registerObserver(stats);
station.setMeasurements(25.0, 65.0, 1013.0);
station.setMeasurements(28.0, 70.0, 1012.0);
station.setMeasurements(22.0, 90.0, 1011.0);