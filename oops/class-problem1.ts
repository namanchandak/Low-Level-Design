

class TemperatureSensor {
    private readings: number[] = [];

    addReading(value: number): void {
        // Only add if value is between -50 and 150 (inclusive)
        if(value >= -50 && value <=150)
        this.readings.push(value);
        else 
        {
            // throw new Error(`Invalid degrees`)
            console.log(`error temp ${value}`)
        }
    }

    getAverage(): number {
        // Return the average of all readings, or 0 if no readings exist
        let sum = this.readings.reduce((acc, init) => acc+ init )
        
        return sum/this.readings.length;
    }

    getReadingCount(): number {
        // Return how many readings have been recorded
        return this.readings.length;
    }

    getReadings(): number[] {
        // Return a copy of the readings array (not the original)
        const copy = this.readings
        return copy;
    }
}

// Test your implementation
const sensor = new TemperatureSensor();
sensor.addReading(22.5);
sensor.addReading(23.1);
sensor.addReading(200.0);  // Should be rejected
sensor.addReading(-10.0);

console.log(`Count: ${sensor.getReadingCount()}`);  // 3
console.log(`Average: ${sensor.getAverage()}`);     // 11.87