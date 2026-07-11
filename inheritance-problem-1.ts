class BankAccount {
    protected ownerName: string;
    protected accountNumber: string;
    protected balance: number;

    constructor(ownerName: string, accountNumber: string, balance: number) {
        // TODO: initialize using the constructor parameters
        this.ownerName = ownerName;
        this.accountNumber = accountNumber;
        this.balance = balance;
    }

    deposit(amount: number): boolean {
        // TODO: add amount to balance if amount > 0, return true if successful
        if(amount >0 )
        {
            this.balance += amount
            return true;
        }

        return false;
    }

    withdraw(amount: number): boolean {
        // TODO: subtract amount from balance if balance >= amount, return true

        if(this.balance >= amount)
        {
            this.balance -= amount
            return true;
        }

        return false;
    }

    displayAccount(): void {
        // TODO: print "ownerName (accountNumber) | Balance: $balance"
        // Hint: use this.balance.toFixed(2) for formatting

        console.log(`ownerName ${this.ownerName} | balance ${this.balance}`)

    }
}

class SavingsAccount extends BankAccount {
    private interestRate: number;

    constructor(ownerName: string, accountNumber: string,
                balance: number, interestRate: number) {
        super(ownerName, accountNumber, balance);
        // TODO: initialize this.interestRate using the parameter

        this.interestRate = interestRate;
    }

    withdraw(amount: number): boolean {
        // TODO: only allow if (balance - amount) >= 100
        if(this.balance - amount >= 100)
        {
            this.balance -= amount;
            return true;
        }

        return false;
    }

    applyInterest(): void {
        // TODO: add (balance * interestRate / 100) to balance
        this.balance += (this.balance * this.interestRate / 100)
    }
}

class CheckingAccount extends BankAccount {
    private overdraftLimit: number;

    constructor(ownerName: string, accountNumber: string,
                balance: number, overdraftLimit: number) {
        super(ownerName, accountNumber, balance);
        // TODO: initialize this.overdraftLimit using the parameter
        this.overdraftLimit = overdraftLimit;
    }

    withdraw(amount: number): boolean {
        // TODO: allow if (balance + overdraftLimit) >= amount
        if(this.balance + this.overdraftLimit >= amount)
        {
            this.balance -= amount
            return true;
        }
        return false;
    }
}

const savings = new SavingsAccount("Alice", "SAV-001", 1000, 2.0);
savings.displayAccount();
console.log("Withdraw $950: " + savings.withdraw(950));
savings.applyInterest();
savings.displayAccount();

console.log();

const checking = new CheckingAccount("Bob", "CHK-002", 500, 300);
checking.displayAccount();
console.log("Withdraw $700: " + checking.withdraw(700));
checking.displayAccount();

// inheritance problem 1