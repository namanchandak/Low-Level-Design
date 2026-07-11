abstract class DataExporter {
    validate(data: string[]): boolean {
        // Return false and print "Export failed: No data to export." if data is empty
        // Return true and print "Validation passed. Exporting N records." otherwise

        if(data.length === 0)
        {
            console.log("Export failed: No data to export.")
            return false;
        }

        console.log(`Validation passed. Exporting ${data.length} records.`)

        return true;
    }

    abstract export(data: string[]): void;
}

class CSVExporter extends DataExporter {
    export(data: string[]): void {
        // Call this.validate(data) first. If validation fails, return early.
        // Otherwise, print CSV format: "CSV: Alice,Bob,Charlie"
        // Hint: use data.join(",")

        this.validate(data);
        console.log(`${data.join(',')}`)

    }
}

class JSONExporter extends DataExporter {
    export(data: string[]): void {
        // Call this.validate(data) first. If validation fails, return early.
        // Otherwise, print JSON array format: JSON: ["Alice", "Bob", "Charlie"]

        this.validate(data);
        console.log(data)
    }
}

const csv = new CSVExporter();
csv.export(["Alice", "Bob", "Charlie"]);

console.log();

const json = new JSONExporter();
json.export(["Alice", "Bob", "Charlie"]);

console.log();

csv.export([]); // Should fail validation


// abstraction problem 2