// // Before: Fat interface bundles three unrelated sets of operations
// interface UserService {
//     createUser(name: string, email: string): void;
//     getUser(userId: string): string;
//     updateUser(userId: string, newEmail: string): void;
//     deleteUser(userId: string): void;

//     banUser(userId: string, reason: string): void;
//     promoteUser(userId: string, role: string): void;

//     getLoginHistory(userId: string): string[];
//     getActivityLog(userId: string): string[];
// }

// class BasicUserService implements UserService {
//     createUser(name: string, email: string): void {
//         console.log(`Creating user: ${name} (${email})`);
//     }

//     getUser(userId: string): string {
//         console.log(`Fetching user: ${userId}`);
//         return `User-${userId}`;
//     }

//     updateUser(userId: string, newEmail: string): void {
//         console.log(`Updating user ${userId} email to ${newEmail}`);
//     }

//     deleteUser(userId: string): void {
//         console.log(`Deleting user: ${userId}`);
//     }

//     banUser(userId: string, reason: string): void {
//         throw new Error("Not an admin service.");
//     }

//     promoteUser(userId: string, role: string): void {
//         throw new Error("Not an admin service.");
//     }

//     getLoginHistory(userId: string): string[] {
//         throw new Error("No audit capability.");
//     }

//     getActivityLog(userId: string): string[] {
//         throw new Error("No audit capability.");
//     }
// }

// // Usage
// const svc = new BasicUserService();
// svc.createUser("Alice", "alice@example.com");
// svc.getUser("u123");

// // TODO: Create UserCrud, AdminControls, and AuditLog interfaces.
// // TODO: Refactor BasicUserService to implement only UserCrud.
// // TODO: Create an AdminUserService that implements UserCrud and AdminControls.
// // TODO: Create a FullUserService that implements all three interfaces.


interface UserCrud{

    createUser(name: string, email: string): void;
    getUser(userId: string): string;
    updateUser(userId: string, newEmail: string): void;
    deleteUser(userId: string): void;

}

interface AdminControls{
    banUser(userId: string, reason: string): void;
    promoteUser(userId: string, role: string): void;

}

interface AuditLog{
    getLoginHistory(userId: string): string[];
    getActivityLog(userId: string): string[];

}

class BasicUserService implements UserCrud{

    createUser(name: string, email: string): void {
        console.log(`Creating user: ${name} (${email})`);
    }

    getUser(userId: string): string {
        console.log(`Fetching user: ${userId}`);
        return `User-${userId}`;
    }

    updateUser(userId: string, newEmail: string): void {
        console.log(`Updating user ${userId} email to ${newEmail}`);
    }

    deleteUser(userId: string): void {
        console.log(`Deleting user: ${userId}`);
    }

}

class AdminUserService implements UserCrud, AdminControls{


    createUser(name: string, email: string): void {
        console.log(`Creating user: ${name} (${email})`);
    }

    getUser(userId: string): string {
        console.log(`Fetching user: ${userId}`);
        return `User-${userId}`;
    }

    updateUser(userId: string, newEmail: string): void {
        console.log(`Updating user ${userId} email to ${newEmail}`);
    }

    deleteUser(userId: string): void {
        console.log(`Deleting user: ${userId}`);
    }


    banUser(userId: string, reason: string): void {
        console.log(`Banning user: ${userId} because ${reason}`);
    }

    promoteUser(userId: string, role: string): void {
            console.log(`Promote user: ${userId} because ${role}`);
    }


}

class FullUserService implements UserCrud, AdminControls, AuditLog{

    createUser(name: string, email: string): void {
        console.log(`Creating user: ${name} (${email})`);
    }

    getUser(userId: string): string {
        console.log(`Fetching user: ${userId}`);
        return `User-${userId}`;
    }

    updateUser(userId: string, newEmail: string): void {
        console.log(`Updating user ${userId} email to ${newEmail}`);
    }

    deleteUser(userId: string): void {
        console.log(`Deleting user: ${userId}`);
    }


    banUser(userId: string, reason: string): void {
        console.log(`Banning user: ${userId} because ${reason}`);
    }

    promoteUser(userId: string, role: string): void {
            console.log(`Promote user: ${userId} because ${role}`);
    }

    getLoginHistory(userId: string): string[] {
        console.log(`History user: ${userId} `);
        return ["user created", "user become admin"]
    }

    getActivityLog(userId: string): string[] {
        console.log(`Activity user: ${userId} `);
        return ["user login", "user logout"]
    }

}

const svc = new BasicUserService();
svc.createUser("Alice", "alice@example.com");
svc.getUser("u123");


const basic = new BasicUserService();
basic.createUser("Alice", "alice@example.com");
basic.getUser("u123");

const admin = new AdminUserService();
admin.createUser("Bob", "bob@example.com");
admin.banUser("u456", "spam");
admin.promoteUser("u456", "admin");

const full = new FullUserService();
full.createUser("Carol", "carol@example.com");
full.banUser("u789", "abuse");
full.getLoginHistory("u789");