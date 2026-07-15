// // Before: Fat interface forces BasicPrinter to implement everything
// interface MultiFunctionDevice {
//     print(document: string): void;
//     scan(document: string): void;
//     fax(document: string, number: string): void;
//     staple(document: string): void;
// }

// class BasicPrinter implements MultiFunctionDevice {
//     print(document: string): void {
//         console.log(`Printing: ${document}`);
//     }

//     scan(document: string): void {
//         throw new Error("BasicPrinter cannot scan.");
//     }

//     fax(document: string, number: string): void {
//         throw new Error("BasicPrinter cannot fax.");
//     }

//     staple(document: string): void {
//         throw new Error("BasicPrinter cannot staple.");
//     }
// }

// // Usage
// const printer = new BasicPrinter();
// printer.print("report.pdf");

// // TODO: Create Printable, Scannable, Faxable, and Stapleable interfaces.
// // TODO: Refactor BasicPrinter to implement only Printable.
// // TODO: Create an OfficePrinter that implements Printable, Scannable, and Faxable.
// // TODO: Create a FullDevice that implements all four interfaces.



interface Printable{
    print():void

}
interface Scannable
{
    scan():void

} 
interface Faxable{
    fax():void

} 

interface Stapleable{
    stap():void

}

class BasicPrinter implements Printable{
    
    print(): void{
        console.log("Basic Printer Print");
    }
}

class OfficePrinter implements Printable, Scannable, Faxable{

    print(): void{
        console.log("Office Printer Print");
    }

    scan():void{
        console.log("Office Printer Scan");

    }

    fax():void{
        console.log("Office Printer Fax");

    }

}

class FullDevice implements  Printable, Scannable, Faxable, Stapleable{
    print(): void{
        console.log("Full Functional Printer Print");
    }

    scan():void{
        console.log("Full Functional Printer Scan");

    }

    fax():void{
        console.log("Full Functional Printer Fax");

    }
    stap():void{
        console.log("Full Functional Printer Stap");

    }
}

const basic = new BasicPrinter();
const office = new OfficePrinter();
const full = new FullDevice();

basic.print();
office.scan();
full.stap();