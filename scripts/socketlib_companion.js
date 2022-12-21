class Socketlib_Companion {
    static module_id = "boneyard-socketlib-companion";
    static socket;

    static init() {
        Socketlib_Companion.prepare_hook_handlers();

        // Create a global object to expose only the desired functions
		window.Boneyard = window.Boneyard ?? {};
        window.Boneyard.Socketlib_Companion = {
            module_id: Socketlib_Companion.module_id,
            debug: false,
			prepare_func: Socketlib_Companion.prepare_func,
			recover_func: Socketlib_Companion.recover_func,
			boneyard_exec: Socketlib_Companion.boneyard_exec,
			executeAsGM_wrapper: Socketlib_Companion.executeAsGM_wrapper,
			executeAsUser_wrapper: Socketlib_Companion.executeAsUser_wrapper,
			executeForAllGMs_wrapper: Socketlib_Companion.executeForAllGMs_wrapper,
			executeForOtherGMs_wrapper: Socketlib_Companion.executeForOtherGMs_wrapper,
			executeForEveryone_wrapper: Socketlib_Companion.executeForEveryone_wrapper,
			executeForOthers_wrapper: Socketlib_Companion.executeForOthers_wrapper,
			executeForUsers_wrapper: Socketlib_Companion.executeForUsers_wrapper
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
        Socketlib_Companion.socket = socketlib.registerModule(Socketlib_Companion.module_id);
        Socketlib_Companion.socket.register("boneyard_exec", Socketlib_Companion.boneyard_exec)
		if (window?.Boneyard?.Socketlib_Companion !== undefined) window.Boneyard.Socketlib_Companion.socket = Socketlib_Companion.socket;
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
			Socketlib_Companion.log("executing function", {func});
		}
        return (await func(args));
    }

    static async executeAsGM_wrapper(func, args) {
        return Socketlib_Companion.socket.executeAsGM("boneyard_exec", Socketlib_Companion.prepare_func(func), args);
    }
    static async executeAsUser_wrapper(userID, func, args) {
        return Socketlib_Companion.socket.executeAsUser("boneyard_exec", userID, Socketlib_Companion.prepare_func(func), args);
    }
    static async executeForAllGMs_wrapper(func, args) {
        return Socketlib_Companion.socket.executeForAllGMs("boneyard_exec", Socketlib_Companion.prepare_func(func), args);
    }
    static async executeForOtherGMs_wrapper(func, args) {
        return Socketlib_Companion.socket.executeForOtherGMs("boneyard_exec", Socketlib_Companion.prepare_func(func), args);
    }
    static async executeForEveryone_wrapper(func, args) {
        return Socketlib_Companion.socket.executeForEveryone("boneyard_exec", Socketlib_Companion.prepare_func(func), args);
    }
    static async executeForOthers_wrapper(func, args) {
        return Socketlib_Companion.socket.executeForOthers("boneyard_exec", Socketlib_Companion.prepare_func(func), args);
    }
    static async executeForUsers_wrapper(recipients, func, args) {
        return Socketlib_Companion.socket.executeForUsers("boneyard_exec", recipients, Socketlib_Companion.prepare_func(func), args);
    }

}

Socketlib_Companion.init();