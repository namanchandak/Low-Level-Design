class PaymentProcess{
    private amount: number;
    private cardNumber: string;

    constructor(cardNumber: string, amount: number)
    {
        this.cardNumber = cardNumber;
        this.amount = amount
    }    

    private maskCardNumber (cardNumber: string,): string
    {
        return "****-****-****-" + cardNumber.substring(this.cardNumber.length -4)
    }

    processPayment(): void{
        console.log(`payment of card ${this.maskCardNumber(this.cardNumber)} for amount ${this.amount}`)
    }

}

const paymentInit = new PaymentProcess("1234-1234-1234-6543", 100)
paymentInit.processPayment()


