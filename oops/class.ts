class BankAccount{
    private accountHolder: string
    private amount: number

    constructor (accountHolder: string, amount?: number)
    {
        this.accountHolder = accountHolder
        this.amount = amount ? amount : 0
    }

    getBalance() : number
    {
        return this.amount
    }

    getAccountHolder() : string
    {
        return this.accountHolder
    }

    deposit(amount : number): boolean
    {
        if(this.amount <0){
            throw new Error('invalid balance')
            // return false
        }
        this.amount += amount
        return true;
    }

    withdraw(amount : number): void
    {
        if(amount>this.amount)
        {
            throw new Error('Insufficient balance');

        }

        this.amount -= amount;
    }


}

const account123 = new BankAccount("naman", 100000000)
console.log(account123.getBalance())
console.log(account123.getAccountHolder())
account123.withdraw(100)

console.log(account123.getBalance())

account123.deposit(100)
console.log(account123.getBalance())