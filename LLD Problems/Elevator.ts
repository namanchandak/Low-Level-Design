// Requirements:
// 1. System manages 3 elevators serving 10 floors (0-9)
// 2. Users can request an elevator from any floor (hall call). System decides which elevator to dispatch.
// 3. Once inside, users can select one or more destination floors
// 4. Simulation runs in discrete time steps (e.g., a `step()` or `tick()` call advances time)
// 5. Elevator stops come in two types:
//     - Hall calls: Request from a floor with direction (UP or DOWN)
//     - Destination: Request from inside elevator (no direction specified)
// 6. System handles multiple concurrent pickup requests across floors
// 7. Invalid requests should be rejected (return false)
//     - Non-existent floor numbers
// 8. Requests for the current floor are treated as a no-op / already served (doors out of scope)

// Out of scope:
// - Weight capacity and passenger limits
// - Door open/close mechanics
// - Emergency stop functionality
// - Dynamic floor/elevator configuration
// - UI/rendering layer

// there  may be 1 tick lag in this case


class ElevatorController {
  elevatorList: Set<Elevator>;

  requestElevator(type: RequestType, floor: number) {
    // core logic
    // 1 find the best elevator to handle this request;
    // 2 send the request to elevator

    // egde cases
    if (floor < 0 || floor > 10) return false;

    const request = new RequestElevator(type, floor);
    const bestElevator = this.selectBestElevator(request);

    bestElevator.addRequest(request);

    return bestElevator;
  }

  private selectBestElevator(request: RequestElevator): Elevator {
    // find the elecator moving towards us
    // find idle elevator
    // pick the nearest elevator

    const bestMovingTowards = this.findMovingTowards(request);
    if (bestMovingTowards) return bestMovingTowards;

    const bestIdleNearest = this.findIdleElevator(request);
    if (bestIdleNearest) return bestIdleNearest;

    return this.findFarthestInOppositeDirection(request);
  }

  private findMovingTowards(request: RequestElevator): Elevator | null {
    const floor = request.getFloor();
    const direction =
      request.getTypeOfRequest() == RequestType.PICKUP_UP
        ? ElevatorDirection.UP
        : ElevatorDirection.DOWN;

    let nearest: Elevator | null = null;
    let minDistance: number = 1e9;

    this.elevatorList.forEach((elevator) => {
      if (elevator.getDirection() != direction) {
        // continue;
      } else if (
        (direction == ElevatorDirection.UP && elevator.getFloor() > floor) ||
        (direction == ElevatorDirection.DOWN && elevator.getFloor() < floor)
      ) {
        // continue;
      } else {
        if (minDistance > Math.abs(elevator.getFloor() - floor)) {
          nearest = elevator;
          minDistance = Math.abs(elevator.getFloor() - floor);
        }
      }
    });

    return nearest;
  }

  private findIdleElevator(request: RequestElevator): Elevator | null {
    const floor = request.getFloor();
    // const direction = request.getTypeOfRequest() ==  RequestType.PICKUP_UP ? ElevatorDirection.UP : ElevatorDirection.DOWN

    let nearest: Elevator | null = null;
    let minDistance: number = 1e9;

    this.elevatorList.forEach((elevator) => {
      if (elevator.getDirection() != ElevatorDirection.IDLE) {
        // continue;
      }
      // else if((direction == ElevatorDirection.UP && elevator.getFloor() > floor  )
      //      || (direction == ElevatorDirection.DOWN && elevator.getFloor() < floor  )  )
      // {
      //     // continue;
      // }
      else {
        if (minDistance > Math.abs(elevator.getFloor() - floor)) {
          nearest = elevator;
          minDistance = Math.abs(elevator.getFloor() - floor);
        }
      }
    });

    return nearest;
  }

  private findFarthestInOppositeDirection(request: RequestElevator): Elevator {
    // no idle
    // no nearest comming towards our direction

    const floor = request.getFloor();
    // const direction = request.getTypeOfRequest() ==  RequestType.PICKUP_UP ? ElevatorDirection.UP : ElevatorDirection.DOWN

    let nearest: Elevator | null = null;
    let maxDistance: number = -1e9;

    this.elevatorList.forEach((elevator) => {
      if (maxDistance < Math.abs(elevator.getFloor() - floor)) {
        nearest = elevator;
        maxDistance = Math.abs(elevator.getFloor() - floor);
      }
    });

    if (nearest == null) throw new Error("No Elevator assigned Here");

    return nearest;
  }

  step() {
    this.elevatorList.forEach((elevator) => {
      elevator.step();
    });
  }

  constructor(elevatorList: Set<Elevator>) {
    this.elevatorList = elevatorList;
  }
}

enum ElevatorDirection {
  UP,
  DOWN,
  IDLE,
}

class Elevator {
  private floor: number;
  private direction: ElevatorDirection;
  private request: Set<RequestElevator>;

  constructor(floor: number, direction: ElevatorDirection) {
    this.floor = floor;
    this.direction = direction;
    this.request = new Set<RequestElevator>();
  }

  step() {
    // 1 if nothing to do set the elevator to idle
    if (this.request.size === 0) this.direction = ElevatorDirection.IDLE;
    // if elevator is idle and we have request
    
    if (this.direction == ElevatorDirection.IDLE) {
      const nearestRequest: RequestElevator = this.getNearestRequest();
      this.direction =
        nearestRequest.getFloor() > this.floor
          ? (this.direction = ElevatorDirection.UP)
          : ElevatorDirection.DOWN;
    }
    // turn direction
    else if (!this.hasAhedRequest()) {
      this.direction =
        this.direction == ElevatorDirection.UP
          ? ElevatorDirection.DOWN
          : ElevatorDirection.UP;
    }

    // stop on this floor
    // else {
      this.request.forEach((req) => {
        if (
          req.getTypeOfRequest() == RequestType.DESTINATION &&
          this.floor == req.getFloor()
        ) {
          this.stopHere();
          this.request.delete(req);
        } else if (
          (this.direction == ElevatorDirection.DOWN &&
            req.getTypeOfRequest() == RequestType.PICKUP_DOWN) ||
          (this.direction == ElevatorDirection.UP &&
            req.getTypeOfRequest() == RequestType.PICKUP_UP &&
            req.getFloor() == this.floor)
        ) {
          this.stopHere();
          this.request.delete(req);
        }
      });
    // }

    // go up or donw
    if (this.direction == ElevatorDirection.UP) {
      this.floor++;
    } else if (this.direction == ElevatorDirection.DOWN) {
      this.floor--;
    }
  }

  hasAhedRequest(): boolean {
    let hadRequest = false;
    this.request.forEach((req) => {
      if (
        (req.getFloor() > this.floor &&
          this.direction == ElevatorDirection.UP) ||
        (req.getFloor() < this.floor &&
          this.direction == ElevatorDirection.DOWN)
      )
        hadRequest = true;
    });

    return hadRequest;
  }

  getNearestRequest(): RequestElevator {
    let minDistance = -1e9;
    let nearestRequest: RequestElevator | null = null;
    this.request.forEach((req) => {
      let distance = Math.abs(this.floor - req.getFloor());
      if (distance > minDistance) {
        distance  = minDistance ;
        nearestRequest = req;
      }
    });

    if (!nearestRequest) {
      throw new Error("Request Not found");
    }

    return nearestRequest;
  }

  stopHere() {
    console.log("Elevator stop");
  }

  getFloor() {
    return this.floor;
  }

  getDirection() {
    return this.direction;
  }

  addRequest(request: RequestElevator) {
    this.request.add(request);
  }

  completeRequest(request: RequestElevator) {
    this.request.delete(request);
  }
}

enum RequestType {
  PICKUP_UP,
  PICKUP_DOWN,
  DESTINATION,
}

class RequestElevator {
  private typeOfRequest: RequestType;
  private floor: number;

  constructor(typeOfRequest: RequestType, floor: number) {
    this.typeOfRequest = typeOfRequest;
    this.floor = floor;
  }

  getFloor() {
    return this.floor;
  }

  getTypeOfRequest() {
    return this.typeOfRequest;
  }
}

const installElevtor = new Set<Elevator>();
installElevtor.add(new Elevator(0, ElevatorDirection.IDLE));
installElevtor.add(new Elevator(0, ElevatorDirection.IDLE));
installElevtor.add(new Elevator(0, ElevatorDirection.IDLE));

const startSystem = new ElevatorController(installElevtor);












// --- HELPER FUNCTION TO VISUALIZE THE SYSTEM ---
// function printSystemState(step: number) {
//   console.log(`\n--- Time Step ${step} ---`);
//   let id = 1;
//   startSystem.elevatorList.forEach((e) => {
//     const dir =
//       e.getDirection() === ElevatorDirection.UP
//         ? "UP"
//         : e.getDirection() === ElevatorDirection.DOWN
//         ? "DOWN"
//         : "IDLE";
//     console.log(`Elevator ${id} | Floor: ${e.getFloor()} | Direction: ${dir}`);
//     id++;
//   });
// }



// // written by AI
// // --- SIMULATION RUN ---
// console.log("=== STARTING ELEVATOR SIMULATION ===");
// printSystemState(0);

// // 1. User on Floor 3 presses the UP button in the hallway
// console.log("\n[!] Hall Call: Someone on Floor 3 wants to go UP.");
// // Note: We cast to Elevator because your method might return false
// const dispatchedElevator = startSystem.requestElevator(RequestType.PICKUP_UP, 3) as Elevator;

// // 2. Advance time until it reaches Floor 3
// startSystem.step(); printSystemState(1); // Elev 1 moves to Floor 1
// startSystem.step(); printSystemState(2); // Elev 1 moves to Floor 2
// startSystem.step(); printSystemState(3); // Elev 1 moves to Floor 3, should print "Elevator stop"

// // 3. User gets in and presses Floor 6 on the elevator panel
// console.log("\n[!] Destination Call: User gets inside and presses Floor 6.");
// dispatchedElevator.addRequest(new RequestElevator(RequestType.DESTINATION, 6));

// // 4. Advance time until it reaches Floor 6
// startSystem.step(); printSystemState(4); // Elev 1 moves to Floor 4
// startSystem.step(); printSystemState(5); // Elev 1 moves to Floor 5
// startSystem.step(); printSystemState(6); // Elev 1 moves to Floor 6, should print "Elevator stop"

// // 5. Let it sit idle
// startSystem.step(); printSystemState(7); // Elev 1 should switch to IDLE

// // 6. Test invalid input (Requirement #7)
// console.log("\n[!] Edge Case: Someone requests Floor 99");
// const isDispatched = startSystem.requestElevator(RequestType.PICKUP_UP, 99);
// console.log(`Was invalid request accepted? ${isDispatched !== false ? "Yes (FAIL)" : "No (PASS)"}`);



// // --- HELPER FUNCTION ---
// function printSystemState(system: ElevatorController, step: number) {
//   console.log(`\n--- Time Step ${step} ---`);
//   let id = 1;
//   system.elevatorList.forEach((e) => {
//     const dir =
//       e.getDirection() === ElevatorDirection.UP ? "UP"
//         : e.getDirection() === ElevatorDirection.DOWN ? "DOWN"
//         : "IDLE";
//     console.log(`Elevator ${id} | Floor: ${e.getFloor()} | Direction: ${dir}`);
//     id++;
//   });
// }

// // ==========================================
// //          CONCURRENT SIMULATION
// // ==========================================
// console.log("\n=== STARTING MULTI-USER SIMULATION ===");

// // 1. Create a fresh system so we don't mix with previous tests
// const testElevators = new Set<Elevator>();
// testElevators.add(new Elevator(0, ElevatorDirection.IDLE));
// testElevators.add(new Elevator(0, ElevatorDirection.IDLE));
// testElevators.add(new Elevator(0, ElevatorDirection.IDLE));
// const multiSystem = new ElevatorController(testElevators);

// printSystemState(multiSystem, 0);

// // --- TICK 0 ---
// console.log("\n[!] TICK 0: Person A on Floor 2 calls UP.");
// const elevA = multiSystem.requestElevator(RequestType.PICKUP_UP, 2) as Elevator;

// multiSystem.step(); 
// printSystemState(multiSystem, 1); 
// // At Step 1, Elevator 1 should now officially be moving UP.

// // --- TICK 1 ---
// console.log("\n[!] TICK 1: Person B on Floor 7 calls DOWN.");
// // Elevator 1 is moving UP, so the system should assign IDLE Elevator 2
// const elevB = multiSystem.requestElevator(RequestType.PICKUP_DOWN, 7) as Elevator;

// console.log("[!] TICK 1: Person C on Floor 4 calls UP.");
// // Elevator 1 is already moving UP from Floor 1. Floor 4 is on its way! 
// // Your `findMovingTowards` logic should brilliantly assign this to Elevator 1.
// const elevC = multiSystem.requestElevator(RequestType.PICKUP_UP, 4) as Elevator;

// multiSystem.step(); 
// printSystemState(multiSystem, 2); 
// // Elevator 1 reaches Floor 2 and stops for Person A!

// console.log("\n[!] Person A gets in and presses Floor 8");
// elevA.addRequest(new RequestElevator(RequestType.DESTINATION, 8));

// multiSystem.step(); printSystemState(multiSystem, 3); // Elev 1 at Fl 3, Elev 2 at Fl 2
// multiSystem.step(); printSystemState(multiSystem, 4); 
// // Elevator 1 reaches Floor 4 and stops for Person C!

// console.log("\n[!] Person C gets in and presses Floor 9");
// elevC.addRequest(new RequestElevator(RequestType.DESTINATION, 9));

// // Let the simulation play out for a few more ticks to watch Elev 2 reach Floor 7
// for(let i = 5; i <= 8; i++) {
//     multiSystem.step();
//     printSystemState(multiSystem, i);
    
//     if (i === 7) {
//         console.log("\n[!] Person B gets in at Floor 7 and presses Floor 1");
//         elevB.addRequest(new RequestElevator(RequestType.DESTINATION, 1));
//     }
// }