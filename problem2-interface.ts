interface Validator {
    validate(input: string): boolean;
}

class EmailValidator implements Validator {
    validate(input: string): boolean {
        // Return true if input includes "@"
        // console.log(input)
        if(input.includes('@'))
        return true;

        return false;
    }
}

class PasswordValidator implements Validator {
    validate(input: string): boolean {
        // Return true if input.length >= 8
        if(input.length >=8)
        return true;

        return false;
    }
}

class RegistrationService {
    private validators: Validator[];

    constructor(validators: Validator[]) {
        this.validators = validators;
    }

    register(input: string): void {
        // Run all validators on input. If all pass, print "input" - PASSED
        // If any fail, print "input" - FAILED
        for( let i =0; i< this.validators.length; i++)
        {

            // console.log( this.validators[i].validate(input))
            if( ! this.validators[i].validate(input))
            {
                console.log("Fail")
                return ;
            }
            console.log("Pass")
        }
        

        
    }
}

// Test your implementation
const emailReg = new RegistrationService([new EmailValidator()]);
emailReg.register("user@example.com"); // Should pass
emailReg.register("invalid-email");     // Should fail

const passReg = new RegistrationService([new PasswordValidator()]);
passReg.register("strongpassword"); // Should pass
passReg.register("short");           // Should fail

// problem 2 on interface