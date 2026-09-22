// Requirements:
// 1. Carrier deposits a package by specifying size (small, medium, large)
//    - System assigns an available compartment of matching size
//    - Opens compartment and returns access token, or error if no space
// 2. Upon successful deposit, an access token is generated and returned
//    - One access token per package
// 3. User retrieves package by entering access token
//    - System validates code and opens compartment
//    - Throws specific error if code is invalid or expired
// 4. Access tokens expire after 7 days
//    - Expired codes are rejected if used for pickup
//    - Package remains in compartment until staff removes it
// 5. Staff can open all expired compartments to manually handle packages
//    - System opens all compartments with expired tokens
//    - Staff physically removes packages and returns them to sender
// 6. Invalid access tokens are rejected with clear error messages
//    - Wrong code, already used, or expired - user gets specific feedback

// Out of scope:
// - How the package gets to the locker (delivery logistics)
// - How the access token reaches the customer (SMS/email notification)
// - Lockout after failed access token attempts
// - UI/rendering layer
// - Multiple locker stations
// - Payment or pricing

class LockingMaster {
  compartment: Compartment[];
  TokenMap = new Map<string, Token>();

  constructor(compartment: Compartment[]) {
    this.compartment = compartment;
  }

  depositPackage(requestedSize: Size): string {

    // to confirm package is placed -
    // we can have 2 phase commit 
    
    const sizeInOrder = [Size.small, Size.medium, Size.large];

    for (
        // @me 
      let index = sizeInOrder.findIndex(
        (givenSize) => givenSize === requestedSize,
      );
      index < sizeInOrder.length;
      index++
    ) {
      for (let i = 0; i < this.compartment.length; i++) {
        const currentCompartment = this.compartment[i];
        if (
          currentCompartment.getSize() == sizeInOrder[index] &&
          currentCompartment.isOccupied() == false
        ) {
          const token = new Token(crypto.randomUUID(), currentCompartment);
          this.TokenMap.set(token.getToken(), token);
          currentCompartment.occupy();
          return token.getToken();
        }
      }
    }

    throw new Error("No vaccant compartment");
  }

  collectPackage(token: string) {
    const collectToken = this.TokenMap.get(token);
    if (!collectToken) {
      throw new Error("This token is Invalid");
    }
    if (collectToken.isExpired()) {
      throw new Error("Token Expired");
    }

    const openCompartment = collectToken.compartment;

    if (!this.compartment.includes(openCompartment)) {
      throw new Error("This compartment doesn't exist");
    }

    openCompartment.open();
    openCompartment.release();

    this.TokenMap.delete(token);
  }

  collectExpired() {
    this.TokenMap.forEach((value, key) => {
      if (value.isExpired()) {
        // this.TokenMap.delete(key);
        // we may delete later on
        value.compartment.open();
        value.compartment.release();
      }
    });
  }
}

class Token {
  token: string;
  expire: EpochTimeStamp;
  compartment: Compartment;

  constructor(token: string, compartment: Compartment) {
    this.token = token;
    this.expire = Date.now() + 7 * 24 * 60 * 60 * 1000;
    this.compartment = compartment;
  }

  getToken(): string {
    return this.token;
  }

  isExpired(): boolean {
    return Date.now() > this.expire;
  }
}

class Compartment {
  occupied: boolean;
  size: Size;

  constructor(size: Size) {
    this.size = size;

    this.occupied = false;
  }

  isOccupied(): boolean {
    return this.occupied;
  }

  getSize(): Size {
    return this.size;
  }

  occupy() {
    this.occupied = true;
  }

  release() {
    this.occupied = false;
  }

  open() {
    console.log("This Compartment is open");
  }
}

enum Size {
  small,
  medium,
  large,
}

const compartment1 = new Compartment(Size.large);
const compartment2 = new Compartment(Size.small);
const compartment3 = new Compartment(Size.large);
const compartment4 = new Compartment(Size.small);
const compartment5 = new Compartment(Size.medium);
const compartment6 = new Compartment(Size.medium);
const compartment7 = new Compartment(Size.medium);

const locker = new LockingMaster([
  compartment1,
  compartment2,
  compartment3,
  compartment4,
  compartment5,
  compartment6,
  compartment7,
]);
