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

  releaseVehicle(ticket: ParkingTicket) {
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
    releaseFloor.releaseSpot(ticket);

    this.activeTickets.delete(ticket.ticketId)
  }
}

class Floor {
  floorId: string;
  spots: Map<string, ParkingSpot> = new Map();

  constructor(floorId: string) {
    this.floorId = floorId;
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
  entryTime: EpochTimeStamp;
  vehicleNumber: string;
  ticketId: string;
  spotId: string;
  floorId: string;

  constructor(vehicleNumber: string, spotId: string, floorId: string) {
    this.entryTime = Date.now();
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
  CAR,
  BUS,
  TRUCK,
}
