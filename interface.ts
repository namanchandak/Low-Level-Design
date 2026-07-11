// payment gateway


interface paymentGateway{
    initialisePayment (amount : number) : void 
}

class paypal implements paymentGateway {
    initialisePayment(amount : number) {
        console.log(`paypal payment of \$ ${amount} success`)
    }
}

class stripe implements paymentGateway {
    initialisePayment(amount : number) {
        console.log(`stripe payment of Rupees ${amount} success`)
    }
}

class subscribe {
    private paymentGateway: paymentGateway;

    constructor (myPaymentGateway: paymentGateway )
    {
        this.paymentGateway = myPaymentGateway
    }

    setPaymentGateway(myPaymentGateway: paymentGateway ) : void
    {
        this.paymentGateway = myPaymentGateway
    }

    makeTransaction(amount: number): boolean{
        this.paymentGateway.initialisePayment(amount)

        return true
    }
}

function main () : void {
    const paypalObject = new paypal

    const subscribeNetflix = new subscribe(paypalObject)
    subscribeNetflix.makeTransaction(199)

    const ott = new stripe
    const subscribeGW = new subscribe(paypalObject)
    subscribeGW.setPaymentGateway(ott)
    subscribeGW.makeTransaction(999)

}

main()

