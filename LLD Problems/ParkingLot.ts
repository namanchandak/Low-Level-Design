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




// ============ TEST RUNNER ============

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
  if (actual !== expected) throw new Error(msg ?? `expected ${expected}, got ${actual}`);
}
function assertThrows(fn: () => void, msg?: string) {
  try { fn(); } catch { return; }
  throw new Error(msg ?? "expected function to throw, but it didn't");
}
function assertTrue(cond: boolean, msg?: string) {
  if (!cond) throw new Error(msg ?? "expected condition to be true");
}
function assertApprox(actual: number, expected: number, tolerance: number, msg?: string) {
  if (Math.abs(actual - expected) > tolerance) {
    throw new Error(msg ?? `expected ~${expected} (±${tolerance}), got ${actual}`);
  }
}

// A payment strategy you control, for testing success/failure paths deterministically
class AlwaysSucceedsPayment implements PaymentStrategy {
  lastAmount: number | null = null;
  makePayment(amount: number): boolean {
    this.lastAmount = amount;
    return true;
  }
}
class AlwaysFailsPayment implements PaymentStrategy {
  makePayment(_amount: number): boolean {
    return false;
  }
}

// ============ FLOOR / SETUP TESTS ============

test("addFloors creates a floor with correct total spot count (10 BIKE + 12 CAR + 4 TRUCK = 26)", () => {
  const lot = new ParkingOrchestrator();
  lot.addFloors("1");
  const floor = lot.floor.get("1");
  assertTrue(!!floor, "floor should exist");
  assertEqual(floor!.spots.size, 26);
});

test("addFloors throws on duplicate floorId", () => {
  const lot = new ParkingOrchestrator();
  lot.addFloors("1");
  assertThrows(() => lot.addFloors("1"));
});

test("addFloors allows multiple distinct floors", () => {
  const lot = new ParkingOrchestrator();
  lot.addFloors("1");
  lot.addFloors("2");
  lot.addFloors("3");
  assertEqual(lot.floor.size, 3);
});

// ============ PARKING TESTS ============

test("parkVehicle assigns a spot and returns a ticket with correct fields", () => {
  const lot = new ParkingOrchestrator();
  lot.addFloors("1");
  const ticket = lot.parkVehicle(new Vehicle("CAR-1", vehicleType.CAR));

  assertEqual(ticket.vehicleNumber, "CAR-1");
  assertEqual(ticket.floorId, "1");
  assertTrue(lot.activeTickets.has(ticket.ticketId));
});

test("parkVehicle marks spot occupied and stores the vehicle reference", () => {
  const lot = new ParkingOrchestrator();
  lot.addFloors("1");
  const ticket = lot.parkVehicle(new Vehicle("CAR-1", vehicleType.CAR));

  const spot = lot.floor.get("1")!.spots.get(ticket.spotId)!;
  assertTrue(spot.isOccupied);
  assertEqual(spot.vehicle?.vehicleNumber, "CAR-1");
});

test("parkVehicle assigns each vehicle type to a spot of the matching type only", () => {
  const lot = new ParkingOrchestrator();
  lot.addFloors("1");

  const bikeTicket = lot.parkVehicle(new Vehicle("BIKE-1", vehicleType.BIKE));
  const truckTicket = lot.parkVehicle(new Vehicle("TRUCK-1", vehicleType.TRUCK));

  const floor = lot.floor.get("1")!;
  assertEqual(floor.spots.get(bikeTicket.spotId)!.typeOfVehicle, vehicleType.BIKE);
  assertEqual(floor.spots.get(truckTicket.spotId)!.typeOfVehicle, vehicleType.TRUCK);
});

test("parkVehicle throws once all spots of a given type are full (exhaust 4 TRUCK spots)", () => {
  const lot = new ParkingOrchestrator();
  lot.addFloors("1");
  for (let i = 0; i < 4; i++) lot.parkVehicle(new Vehicle(`TRUCK-${i}`, vehicleType.TRUCK));

  assertThrows(() => lot.parkVehicle(new Vehicle("TRUCK-OVERFLOW", vehicleType.TRUCK)));
});

test("parkVehicle throws when zero floors exist", () => {
  const lot = new ParkingOrchestrator();
  assertThrows(() => lot.parkVehicle(new Vehicle("CAR-1", vehicleType.CAR)));
});

test("parkVehicle falls through to the next floor once the first is full", () => {
  const lot = new ParkingOrchestrator();
  lot.addFloors("1");
  lot.addFloors("2");

  for (let i = 0; i < 4; i++) lot.parkVehicle(new Vehicle(`TRUCK-${i}`, vehicleType.TRUCK));
  const ticket = lot.parkVehicle(new Vehicle("TRUCK-5", vehicleType.TRUCK));

  assertEqual(ticket.floorId, "2");
});

test("different vehicle types don't compete for the same spot pool", () => {
  const lot = new ParkingOrchestrator();
  lot.addFloors("1");
  for (let i = 0; i < 4; i++) lot.parkVehicle(new Vehicle(`TRUCK-${i}`, vehicleType.TRUCK)); // fill all trucks

  // CAR spots should be untouched — this should NOT throw
  const carTicket = lot.parkVehicle(new Vehicle("CAR-1", vehicleType.CAR));
  assertTrue(!!carTicket);
});

// ============ SPOT-LEVEL TESTS ============

test("ParkingSpot.assing throws when vehicle type doesn't match spot type", () => {
  const spot = new ParkingSpot("s1", vehicleType.CAR, "1");
  assertThrows(() => spot.assing(new Vehicle("TRUCK-1", vehicleType.TRUCK)));
});

test("ParkingSpot.assing returns null (not throw) when already occupied by same type", () => {
  const spot = new ParkingSpot("s1", vehicleType.CAR, "1");
  spot.assing(new Vehicle("CAR-1", vehicleType.CAR));
  const result = spot.assing(new Vehicle("CAR-2", vehicleType.CAR));
  assertEqual(result, null);
});

test("ParkingSpot.releaseVehicle clears occupied flag and vehicle reference", () => {
  const spot = new ParkingSpot("s1", vehicleType.CAR, "1");
  const ticket = spot.assing(new Vehicle("CAR-1", vehicleType.CAR))!;
  spot.releaseVehicle(ticket);

  assertTrue(!spot.isOccupied);
  assertEqual(spot.vehicle, null);
});

// ============ RELEASE / PAYMENT TESTS ============

test("releaseVehicle frees the spot and removes the ticket on successful payment", () => {
  const lot = new ParkingOrchestrator();
  lot.addFloors("1");
  const ticket = lot.parkVehicle(new Vehicle("CAR-1", vehicleType.CAR));

  lot.releaseVehicle(ticket, new AlwaysSucceedsPayment());

  const spot = lot.floor.get("1")!.spots.get(ticket.spotId)!;
  assertTrue(!spot.isOccupied);
  assertEqual(spot.vehicle, null);
  assertTrue(!lot.activeTickets.has(ticket.ticketId));
});

test("releaseVehicle throws on an invalid/unknown ticketId", () => {
  const lot = new ParkingOrchestrator();
  lot.addFloors("1");
  const fakeTicket = new ParkingTicket("GHOST", "no-such-spot", "1");
  assertThrows(() => lot.releaseVehicle(fakeTicket, new AlwaysSucceedsPayment()));
});

test("releaseVehicle throws when payment fails, and does NOT free the spot", () => {
  const lot = new ParkingOrchestrator();
  lot.addFloors("1");
  const ticket = lot.parkVehicle(new Vehicle("CAR-1", vehicleType.CAR));

  assertThrows(() => lot.releaseVehicle(ticket, new AlwaysFailsPayment()));

  // critical: spot must STILL be occupied since payment failed
  const spot = lot.floor.get("1")!.spots.get(ticket.spotId)!;
  assertTrue(spot.isOccupied, "spot should remain occupied if payment failed");
  assertTrue(lot.activeTickets.has(ticket.ticketId), "ticket should remain active if payment failed");
});

test("releasing frees the spot for reuse by a new vehicle", () => {
  const lot = new ParkingOrchestrator();
  lot.addFloors("1");
  const first = lot.parkVehicle(new Vehicle("CAR-A", vehicleType.CAR));
  lot.releaseVehicle(first, new AlwaysSucceedsPayment());

  const second = lot.parkVehicle(new Vehicle("CAR-B", vehicleType.CAR));
  assertEqual(second.spotId, first.spotId);
});

test("releasing the same ticket twice throws the second time", () => {
  const lot = new ParkingOrchestrator();
  lot.addFloors("1");
  const ticket = lot.parkVehicle(new Vehicle("CAR-1", vehicleType.CAR));

  lot.releaseVehicle(ticket, new AlwaysSucceedsPayment());
  assertThrows(() => lot.releaseVehicle(ticket, new AlwaysSucceedsPayment()));
});

// ============ FEE CALCULATION TESTS ============

test("fee is proportional to elapsed time (~20/hour rate)", () => {
  const lot = new ParkingOrchestrator();
  lot.addFloors("1");
  const ticket = lot.parkVehicle(new Vehicle("CAR-1", vehicleType.CAR));

  // simulate 2 hours having passed by backdating entryTime
  ticket.entryTime = new Date(Date.now() - 2 * 60 * 60 * 1000);

  const payment = new AlwaysSucceedsPayment();
  lot.releaseVehicle(ticket, payment);

  assertApprox(payment.lastAmount!, 40, 1, "2 hours at 20/hour should charge ~40");
});

test("fee for a very short duration is near zero, not negative", () => {
  const lot = new ParkingOrchestrator();
  lot.addFloors("1");
  const ticket = lot.parkVehicle(new Vehicle("CAR-1", vehicleType.CAR));

  const payment = new AlwaysSucceedsPayment();
  lot.releaseVehicle(ticket, payment);

  assertTrue(payment.lastAmount! >= 0, "fee should never be negative");
});

// ============ TRUST-BOUNDARY / TAMPERING TEST ============
// This test targets the bug where releaseVehicle uses the caller-supplied
// `ticket` object instead of the internally looked-up `releaseTicket`.
// It SHOULD PASS once releaseVehicle uses releaseTicket consistently;
// it will FAIL if the code still trusts the caller's object for entryTime/fee calc.

test("releaseVehicle computes fee from the STORED ticket's entryTime, not a caller-supplied fake one", () => {
  const lot = new ParkingOrchestrator();
  lot.addFloors("1");
  const realTicket = lot.parkVehicle(new Vehicle("CAR-1", vehicleType.CAR));

  // backdate the REAL stored ticket by 5 hours (should cost ~100)
  realTicket.entryTime = new Date(Date.now() - 5 * 60 * 60 * 1000);

  // attacker/bug scenario: construct a lookalike ticket with the same ticketId
  // but a tampered (very recent) entryTime, hoping to be undercharged
  const tamperedTicket = new ParkingTicket(realTicket.vehicleNumber, realTicket.spotId, realTicket.floorId);
  tamperedTicket.ticketId = realTicket.ticketId; // same ID as the real one
  tamperedTicket.entryTime = new Date(); // "just parked" — should NOT be trusted

  const payment = new AlwaysSucceedsPayment();
  lot.releaseVehicle(tamperedTicket, payment);

  assertApprox(
    payment.lastAmount!,
    100,
    1,
    "fee must be based on the internally stored ticket's entryTime (~100), not the caller-supplied tampered one"
  );
});

// ============ PAYMENT STRATEGY TESTS ============

test("CashPayment.makePayment returns true", () => {
  assertEqual(new CashPayment().makePayment(50), true);
});
test("CardPayment.makePayment returns true", () => {
  assertEqual(new CardPayment().makePayment(50), true);
});
test("UpiPayment.makePayment returns true", () => {
  assertEqual(new UpiPayment().makePayment(50), true);
});

// ============ SEQUENTIAL "RACE-LIKE" TEST ============
// Not true concurrency (Node is single-threaded), but proves that
// two back-to-back attempts on a 1-spot floor never both succeed.

test("only one of two rapid park attempts on a single-spot type succeeds", () => {
  const lot = new ParkingOrchestrator(); // 4 TRUCK spots on default config
  lot.addFloors("1");
  for (let i = 0; i < 3; i++) lot.parkVehicle(new Vehicle(`FILLER-${i}`, vehicleType.TRUCK)); // leave exactly 1 TRUCK spot

  const t1 = lot.parkVehicle(new Vehicle("TRUCK-RACE-1", vehicleType.TRUCK)); // takes the last spot
  assertThrows(
    () => lot.parkVehicle(new Vehicle("TRUCK-RACE-2", vehicleType.TRUCK)),
    "second attempt on the same last spot must fail, not double-book it"
  );
  assertTrue(!!t1);
});

// ============ RESULTS ============

console.log(`\n${passed} passed, ${failed} failed`);