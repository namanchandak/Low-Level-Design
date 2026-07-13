abstract class Logger {
    protected level: string;

    constructor(level: string) {
        this.level = level;
    }

    // Abstract method: subclasses decide HOW to deliver the message
    abstract log(message: string): void;

    // Concrete method: shared formatting logic inherited by all subclasses
    formatMessage(message: string): string {
        const timestamp = new Date().toISOString().replace("T", " ").substring(0, 19);
        return `[${timestamp}] [${this.level}] ${message}`;
    }
}

class ConsoleLogger extends Logger {
    constructor(level: string) {
        super(level);
    }

    log(message: string): void {
        console.log(this.formatMessage(message));
    }
}

class FileLogger extends Logger {
    private filePath: string;

    constructor(level: string, filePath: string) {
        super(level);
        this.filePath = filePath;
    }

    log(message: string): void {
        console.log(`Writing to ${this.filePath}: ${this.formatMessage(message)}`);
    }
}

// logger