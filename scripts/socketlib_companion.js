import {
    MODULE,
    SOCKET_PERMISSIONS
} from "./constants.js";

export class Socketlib_Companion {
    static socket;

    static init() {
        Socketlib_Companion.prepare_hook_handlers();

        // Create a global object to expose only the desired functions
        window.Boneyard = window.Boneyard ?? {};
        window.Boneyard.Socketlib_Companion = {
            debug: false,
            executeAsGM: Socketlib_Companion.executeAsGM,
            executeAsUser: Socketlib_Companion.executeAsUser,
            executeForAllGMs: Socketlib_Companion.executeForAllGMs,
            executeForOtherGMs: Socketlib_Companion.executeForOtherGMs,
            executeForEveryone: Socketlib_Companion.executeForEveryone,
            executeForOthers: Socketlib_Companion.executeForOthers,
            executeForUsers: Socketlib_Companion.executeForUsers
        };

        Socketlib_Companion.log("Socketlib companion initialized");
    }

    static log(log_str, additional_log_data) {
        if (log_str === undefined) return;
        console.log(`====== Boneyard ======\n - ${log_str}`);
        if (additional_log_data === undefined) return;
        console.log(additional_log_data);
    }

    static prepare_hook_handlers() {
        Hooks.once("socketlib.ready", Socketlib_Companion.register_socket);
    }

    static register_socket() {
        Socketlib_Companion.socket = socketlib.registerModule(MODULE);
        Socketlib_Companion.socket.register("boneyard_exec", Socketlib_Companion.boneyard_exec)
        Socketlib_Companion.log("socket set");
    }

    static prepare_func(func) {
        return `return (${func.toString()})(args);`;
    }
    static recover_func(func_str) {
        return new Function("args", func_str);
    }

    // Functions must be of the form (args)=>{} 
    // where 'args' is an object containing all arguments for the function.
    static async boneyard_exec(func_str, args) {
        const func = Socketlib_Companion.recover_func(func_str);
        if (window?.Boneyard?.Socketlib_Companion?.debug) {
            Socketlib_Companion.log("executing function", {
                func
            });
        }
        return (await func(args));
    }
	
	static user_has_permission() {
		if (game.user.role >= game.settings.get(MODULE, SOCKET_PERMISSIONS)) {
			return true;
		} else {
			ui.notifications.warn("You do not have permission to make calls to Boneyard Socketlib Companion.");
			return false;
		}
	}

    static async executeAsGM(func, args) {
		if (!Socketlib_Companion.user_has_permission()) return;
        if (typeof func !== 'function') throw new TypeError("Parameter 'func' missing/incorrect type.");
        if (args !== undefined && typeof args !== 'object') throw new TypeError("Parameter 'args' incorrect type.");
        return Socketlib_Companion.socket.executeAsGM("boneyard_exec", Socketlib_Companion.prepare_func(func), args);
    }

    static async executeAsUser(userID, func, args) {
		if (!Socketlib_Companion.user_has_permission()) return;
        if (typeof userID !== 'string') throw new TypeError("Parameter 'userID' missing/incorrect type.");
        if (typeof func !== 'function') throw new TypeError("Parameter 'func' missing/incorrect type.");
        if (args !== undefined && typeof args !== 'object') throw new TypeError("Parameter 'args' incorrect type.");
        return Socketlib_Companion.socket.executeAsUser("boneyard_exec", userID, Socketlib_Companion.prepare_func(func), args);
    }

    static async executeForAllGMs(func, args) {
		if (!Socketlib_Companion.user_has_permission()) return;
        if (typeof func !== 'function') throw new TypeError("Parameter 'func' missing/incorrect type.");
        if (args !== undefined && typeof args !== 'object') throw new TypeError("Parameter 'args' incorrect type.");
        return Socketlib_Companion.socket.executeForAllGMs("boneyard_exec", Socketlib_Companion.prepare_func(func), args);
    }

    static async executeForOtherGMs(func, args) {
		if (!Socketlib_Companion.user_has_permission()) return;
        if (typeof func !== 'function') throw new TypeError("Parameter 'func' missing/incorrect type.");
        if (args !== undefined && typeof args !== 'object') throw new TypeError("Parameter 'args' incorrect type.");
        return Socketlib_Companion.socket.executeForOtherGMs("boneyard_exec", Socketlib_Companion.prepare_func(func), args);
    }

    static async executeForEveryone(func, args) {
		if (!Socketlib_Companion.user_has_permission()) return;
        if (typeof func !== 'function') throw new TypeError("Parameter 'func' missing/incorrect type.");
        if (args !== undefined && typeof args !== 'object') throw new TypeError("Parameter 'args' incorrect type.");
        return Socketlib_Companion.socket.executeForEveryone("boneyard_exec", Socketlib_Companion.prepare_func(func), args);
    }

    static async executeForOthers(func, args) {
		if (!Socketlib_Companion.user_has_permission()) return;
        if (typeof func !== 'function') throw new TypeError("Parameter 'func' missing/incorrect type.");
        if (args !== undefined && typeof args !== 'object') throw new TypeError("Parameter 'args' incorrect type.");
        return Socketlib_Companion.socket.executeForOthers("boneyard_exec", Socketlib_Companion.prepare_func(func), args);
    }

    static async executeForUsers(recipients, func, args) {
		if (!Socketlib_Companion.user_has_permission()) return;
        if (Object.prototype.toString.call(recipients) !== '[object Array]') throw new TypeError("Parameter 'recipients' missing/incorrect type.");
        if (typeof func !== 'function') throw new TypeError("Parameter 'func' missing/incorrect type.");
        if (args !== undefined && typeof args !== 'object') throw new TypeError("Parameter 'args' incorrect type.");
        return Socketlib_Companion.socket.executeForUsers("boneyard_exec", recipients, Socketlib_Companion.prepare_func(func), args);
    }

}
