


interface Database{
    insert(table: string, data: string): void;
    query(table: string, id: string): string;
}

class MySQLDatabase implements Database{
    insert(table: string, data: string): void {
        console.log(`MySQL: Inserting into ${table} -> ${data}`);
    }

    query(table: string, id: string): string {
        console.log(`MySQL: Querying ${table} for id ${id}`);
        return `{ id: ${id}, item: 'Widget' }`;
    }


}

class PostgresDatabase implements Database{
    insert(table: string, data: string): void {
        console.log(`PostgresDatabase: Inserting into ${table} -> ${data}`);
    }

    query(table: string, id: string): string {
        console.log(`PostgresDatabase: Querying ${table} for id ${id}`);
        return `{ id: ${id}, item: 'Widget' }`;
    }


}


class OrderService {
    private database: Database;

    constructor(database: Database) {
        this.database = database;
    }

    placeOrder(orderId: string, orderData: string): void {
        console.log(`Placing order: ${orderId}`);
        this.database.insert("orders", orderData);
        console.log("Order placed successfully.");
    }

    getOrder(orderId: string): string {
        return this.database.query("orders", orderId);
    }
}


const postgresCall = new OrderService(new PostgresDatabase());
postgresCall.getOrder("pen");
postgresCall.placeOrder("123", "item is pen");


const mysqlCall = new OrderService(new MySQLDatabase());
mysqlCall.getOrder("pen");
mysqlCall.placeOrder("123", "item is pen");