interface Logger {
    log(level: string, message: string): void;
    getDestination(): string;
}

class ConsoleLogger implements Logger {
    log(level: string, message: string): void {
        // TODO: print "[level] message" to console
        console.log(level, message)
    }

    getDestination(): string {
        // TODO: return "Console"
        return "console";
    }
}

class FileLogger implements Logger {
    private filePath: string;

    constructor(filePath: string) {
        // TODO: initialize this.filePath using the parameter
        this.filePath = filePath;
    }

    log(level: string, message: string): void {
        // TODO: print "Writing to filePath: [level] message"
        console.log(level, this.filePath, message ,"dest")

    }

    getDestination(): string {
        // TODO: return "File: filePath"
        return `File ${this.filePath}`;
    }
}

class DatabaseLogger implements Logger {
    private tableName: string;

    constructor(tableName: string) {
        // TODO: initialize this.tableName using the parameter
        this.tableName = tableName;
    }

    log(level: string, message: string): void {
        // TODO: print "INSERT INTO tableName: [level] message"
        console.log(level, message, this.tableName)

    }

    getDestination(): string {
        // TODO: return "Database: tableName"
        return `Database ${this.tableName}`;
    }
}

class Application {
    private logger: Logger;

    constructor(logger: Logger) {
        this.logger = logger;
    }

    run(): void {
        // TODO: log three messages with level "INFO":
        //   "Application starting..."
        //   "Processing data..."
        //   "Application shutting down."
        this.logger.log("level", "message is here")
    }
}

const loggers: Logger[] = [
    new ConsoleLogger(),
    new FileLogger("/var/log/app.log"),
    new DatabaseLogger("app_logs"),
];

for (const logger of loggers) {
    console.log(`--- Using ${logger.getDestination()} ---`);
    const app = new Application(logger);
    app.run();
    console.log();
}

// problem 2 polymorphism