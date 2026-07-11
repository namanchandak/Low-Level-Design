interface Formatter {
    format(message: string): string;
}

class PlainFormatter implements Formatter {
    format(message: string): string {
        // Return the message as-is
        console.log(message)
        return message;
    }
}

class JsonFormatter implements Formatter {
    format(message: string): string {
        // Return the message wrapped in JSON: {"log": "message"}
        console.log(JSON.stringify({"log": message}))
        return JSON.stringify({"log": message});
        
    }
}

class Logger {
    private formatter: Formatter;

    constructor(formatter: Formatter) {
        this.formatter = formatter;
    }

    log(message: string): void {
        // Use the formatter to format the message, then print the result
        // console.log("reached", message)
        this.formatter.format(message)
    }
}

// Test your implementation
const plainLogger = new Logger(new PlainFormatter());
plainLogger.log("Server started on port 8080");

const jsonLogger = new Logger(new JsonFormatter());
jsonLogger.log("Server started on port 8080");