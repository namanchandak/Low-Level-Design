// The parking lot should have multiple levels, each level with a certain number of parking spots.
// The parking lot should support different types of vehicles, such as cars, motorcycles, and trucks.
// Each parking spot should be able to accommodate a specific type of vehicle.
// The system should assign a parking spot to a vehicle upon entry and release it when the vehicle exits.
// The system should track the availability of parking spots and provide real-time information to customers.
// The system should handle multiple entry and exit points and support concurrent access.

// Entity
// https://dev.to/ankitdevcode/parking-lot-system-design-lld-in-action-part-1-6f0

class ParkingOrchestrator {
  floor: Map<string, Floor> = new Map();
  activeTickets: Map<string, ParkingTicket> = new Map();

  addFloors(floorId: string){
    if(this.floor.get(floorId))
    {
      throw new Error("This Floor Already Exist");
      
    }

    // for now I hardcode 
    // here I have used record first time need to look at Record
    const floorConfig: Record<vehicleType, number> = {'BIKE' : 10, "CAR" : 12, "TRUCK": 4 };

    const newFloor = new Floor(floorId, floorConfig )
    this.floor.set(floorId, newFloor);

  }

  parkVehicle(vehicle: Vehicle): ParkingTicket {
    for (const currentFloor of this.floor.values()) {
      const ticket = currentFloor.assingSpot(vehicle);
      if (ticket) {
        this.activeTickets.set(ticket.ticketId, ticket);
        return ticket;
      }
    }

    throw new Error("No Vacant Space found");
  }

  releaseVehicle(ticket: ParkingTicket, payment: PaymentStrategy) {
    // need to apply payment strategy here

    const releaseTicket = this.activeTickets.get(ticket.ticketId);

    if (!releaseTicket ) {
      throw new Error("This ticket is invalid");
    }

    const releaseFloorId = releaseTicket.floorId;

    const releaseFloor = this.floor.get(releaseFloorId);
    if (!releaseFloor) {
      throw new Error("This floor is not exist");
    }

    function calculateAmount (releaseTicket: ParkingTicket): number{
        const timeLapse = Date.now() - releaseTicket.entryTime.getTime() ;
        return timeLapse * 20 / (1000 * 60 * 60 );
    }

    if(!payment.makePayment(calculateAmount(releaseTicket)))
    {
      throw new Error("Payment Failed");
    }

    releaseFloor.releaseSpot(releaseTicket);

    this.activeTickets.delete(releaseTicket.ticketId)
  }
}


class Floor {
  floorId: string;
  spots: Map<string, ParkingSpot> = new Map();

  constructor(floorId: string, config: Record<vehicleType, number> ) {
    this.floorId = floorId;


    for(const [type, count ] of Object.entries(config))
    {
      for(let i=0; i< count; i++)
      {
        this.addSpotsToFloor(`${i+1}-${this.floorId}-${type}`, type as vehicleType  , floorId);
      }

    }
    
  }

  addSpotsToFloor(spotId: string, typeOfVehicle: vehicleType, floorId: string){
    const newSpot = new ParkingSpot(spotId, typeOfVehicle , floorId);
    this.spots.set(spotId, newSpot);
  }
  

  findVacantSpot(vehicleType: vehicleType): ParkingSpot | null {
    for (const spot of this.spots.values()) {
      if (spot.isOccupied == false && spot.typeOfVehicle == vehicleType)
        return spot;
    }

    return null;
  }

  assingSpot(vehicle: Vehicle): ParkingTicket | null {
    const vacantSpot = this.findVacantSpot(vehicle.typeOfVehicle);
    if (vacantSpot) {
      return vacantSpot.assing(vehicle);
    }

    return null;
  }

  releaseSpot(ticket: ParkingTicket) {
    const spot = this.spots.get(ticket.spotId);
    if (!spot) {
      throw new Error("This Spot is invalid");
    }
    spot.releaseVehicle(ticket);
  }
}

class ParkingSpot {
  spotId: string;
  floorId: string;
  isOccupied: boolean = false;
  typeOfVehicle: vehicleType;
  vehicle: Vehicle | null = null;

  constructor(spotId: string, typeOfVehicle: vehicleType, floorId: string) {
    this.spotId = spotId;
    this.typeOfVehicle = typeOfVehicle;
    this.floorId = floorId;
  }

  assing(vehicle: Vehicle): ParkingTicket | null {
    if (vehicle.typeOfVehicle != this.typeOfVehicle) {
      throw new Error("Vehicle type does not match spot type"); // programmer error — fail loud
    }

    if (this.isOccupied) return null;

    this.isOccupied = true;
    this.vehicle = vehicle;
    return new ParkingTicket(vehicle.vehicleNumber, this.spotId, this.floorId);
  }

  releaseVehicle(ticket: ParkingTicket) {
    this.isOccupied = false;
    this.vehicle = null;

    console.log("this vehicle is released Hope you come again soon");
  }
}

class ParkingTicket {
  entryTime: Date;
  vehicleNumber: string;
  ticketId: string;
  spotId: string;
  floorId: string;

  constructor(vehicleNumber: string, spotId: string, floorId: string) {
    this.entryTime = new Date();
    this.vehicleNumber = vehicleNumber;
    this.ticketId = vehicleNumber + this.entryTime;
    this.spotId = spotId;
    this.floorId = floorId;
  }
}

class Vehicle {
  vehicleNumber: string;
  typeOfVehicle: vehicleType;

  constructor(vehicleNumber: string, typeOfVehicle: vehicleType) {
    this.vehicleNumber = vehicleNumber;
    this.typeOfVehicle = typeOfVehicle;
  }
}

enum vehicleType {
  CAR = "CAR",
  BIKE = "BIKE",
  TRUCK = "TRUCK",
}

interface PaymentStrategy{
  makePayment(amount : number): boolean
}

class UpiPayment implements PaymentStrategy{
  
  makePayment(amount: number): boolean {
    console.log(`Upi payment successful ${amount}`)  
    return true;
  }

}

class CashPayment implements PaymentStrategy{
  
  makePayment(amount: number): boolean {
    console.log(`cash payment successful ${amount}`) 
    return true; 
  }

}

class CardPayment implements PaymentStrategy{
  
  makePayment(amount: number): boolean {
    console.log(`Card payment successful ${amount}`)  
    return true;
  }

}


// const ParkingLot = new ParkingOrchestrator();
// ParkingLot.addFloors("1");
// ParkingLot.addFloors("2");
// ParkingLot.addFloors("3");
// ParkingLot.addFloors("4");
// ParkingLot.addFloors("5");
// ParkingLot.addFloors("6");





// ============ TEST RUNNER (minimal, no framework) ============

let passed = 0;
let failed = 0;

function test(name: string, fn: () => void) {
  try {
    fn();
    console.log(`✅ PASS: ${name}`);
    passed++;
  } catch (err: any) {
    console.log(`❌ FAIL: ${name} — ${err.message}`);
    failed++;
  }
}

function assertEqual(actual: any, expected: any, msg?: string) {
  if (actual !== expected) {
    throw new Error(msg ?? `expected ${expected}, got ${actual}`);
  }
}

function assertThrows(fn: () => void, msg?: string) {
  try {
    fn();
  } catch {
    return;
  }
  throw new Error(msg ?? "expected function to throw, but it didn't");
}

function assertTrue(cond: boolean, msg?: string) {
  if (!cond) throw new Error(msg ?? "expected condition to be true");
}

// ============ TESTS ============
// NOTE: your addFloors() hardcodes { BIKE: 10, CAR: 12, TRUCK: 4 } internally,
// so every floor created below has that same fixed capacity.

test("addFloors creates a floor with correct total spot count (10+12+4=26)", () => {
  const lot = new ParkingOrchestrator();
  lot.addFloors("1");

  const floor = lot.floor.get("1");
  assertTrue(!!floor, "floor should exist after addFloors");
  assertEqual(floor!.spots.size, 26, "floor should have 10 BIKE + 12 CAR + 4 TRUCK = 26 spots");
});

test("addFloors throws when adding a duplicate floorId", () => {
  const lot = new ParkingOrchestrator();
  lot.addFloors("1");
  assertThrows(() => lot.addFloors("1"), "duplicate floorId should throw");
});

test("parkVehicle assigns a spot and returns a valid ticket", () => {
  const lot = new ParkingOrchestrator();
  lot.addFloors("1");

  const car = new Vehicle("KA-01-1234", vehicleType.CAR);
  const ticket = lot.parkVehicle(car);

  assertEqual(ticket.vehicleNumber, "KA-01-1234");
  assertEqual(ticket.floorId, "1");
  assertTrue(lot.activeTickets.has(ticket.ticketId), "ticket should be tracked in activeTickets");
});

test("parkVehicle marks the assigned spot as occupied", () => {
  const lot = new ParkingOrchestrator();
  lot.addFloors("1");

  const car = new Vehicle("KA-01-0001", vehicleType.CAR);
  const ticket = lot.parkVehicle(car);

  const floor = lot.floor.get("1")!;
  const spot = floor.spots.get(ticket.spotId)!;
  assertTrue(spot.isOccupied, "spot should be occupied after parking");
  assertEqual(spot.vehicle?.vehicleNumber, "KA-01-0001");
});

test("parkVehicle throws when no vacant spot exists for that vehicle type (fill all 4 TRUCK spots)", () => {
  const lot = new ParkingOrchestrator();
  lot.addFloors("1");

  for (let i = 0; i < 4; i++) {
    lot.parkVehicle(new Vehicle(`TRUCK-${i}`, vehicleType.TRUCK));
  }

  assertThrows(
    () => lot.parkVehicle(new Vehicle("TRUCK-OVERFLOW", vehicleType.TRUCK)),
    "should throw once all 4 TRUCK spots on the only floor are full"
  );
});

test("parkVehicle falls through to the next floor if current floor is full", () => {
  const lot = new ParkingOrchestrator();
  lot.addFloors("1");
  lot.addFloors("2");

  // fill all 4 TRUCK spots on floor 1
  for (let i = 0; i < 4; i++) {
    lot.parkVehicle(new Vehicle(`TRUCK-${i}`, vehicleType.TRUCK));
  }

  // 5th truck should land on floor 2
  const ticket = lot.parkVehicle(new Vehicle("TRUCK-5", vehicleType.TRUCK));
  assertEqual(ticket.floorId, "2", "should fall through to floor 2 once floor 1's TRUCK spots are full");
});

test("releaseVehicle frees the spot and removes ticket from activeTickets", () => {
  const lot = new ParkingOrchestrator();
  lot.addFloors("1");

  const car = new Vehicle("KA-01-9999", vehicleType.CAR);
  const ticket = lot.parkVehicle(car);

  lot.releaseVehicle(ticket, new UpiPayment());

  const floor = lot.floor.get("1")!;
  const spot = floor.spots.get(ticket.spotId)!;
  assertTrue(!spot.isOccupied, "spot should be free after release");
  assertEqual(spot.vehicle, null, "spot's vehicle ref should be cleared after release");
  assertTrue(!lot.activeTickets.has(ticket.ticketId), "ticket should be removed from activeTickets after release");
});

test("releaseVehicle throws on an unknown/invalid ticket", () => {
  const lot = new ParkingOrchestrator();
  lot.addFloors("1");

  const fakeTicket = new ParkingTicket("GHOST-1", "nonexistent-spot", "1");
  assertThrows(() => lot.releaseVehicle(fakeTicket, new CashPayment()), "should throw for a ticket never issued by this lot");
});

test("releasing a spot allows a new vehicle to be parked in it", () => {
  const lot = new ParkingOrchestrator();
  lot.addFloors("1");

  const first = lot.parkVehicle(new Vehicle("CAR-A", vehicleType.CAR));
  lot.releaseVehicle(first, new CardPayment());

  const second = lot.parkVehicle(new Vehicle("CAR-B", vehicleType.CAR));
  assertEqual(second.spotId, first.spotId, "the same physical spot should be reused");
});

test("ParkingSpot.assing throws when vehicle type doesn't match spot type", () => {
  const spot = new ParkingSpot("spot-1", vehicleType.CAR, "1");
  const truck = new Vehicle("TRUCK-99", vehicleType.TRUCK);
  assertThrows(() => spot.assing(truck), "assigning a truck to a car-only spot should throw");
});

test("ParkingSpot.assing returns null when already occupied", () => {
  const spot = new ParkingSpot("spot-1", vehicleType.CAR, "1");
  spot.assing(new Vehicle("CAR-1", vehicleType.CAR));

  const result = spot.assing(new Vehicle("CAR-2", vehicleType.CAR));
  assertEqual(result, null, "assigning to an already-occupied spot should return null, not throw");
});

// ============ RESULTS ============

console.log(`\n${passed} passed, ${failed} failed`);
