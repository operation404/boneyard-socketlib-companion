import {
    MODULE,
    SOCKET_PERMISSIONS
} from "./constants.js";

export function prepare_settings() {

    game.settings.register(MODULE, SOCKET_PERMISSIONS, {
        name: "SETTINGS.Socket_Permissions_Name",
        hint: "SETTINGS.Socket_Permissions_Hint",
        scope: 'world', // "world" = sync to db, "client" = local storage
        config: true, // false if you dont want it to show in module config
        type: Number, // Number, Boolean, String, Object
        default: CONST.USER_ROLES.GAMEMASTER,
        choices: {
            //[CONST.USER_ROLES.NONE]: "SETTINGS.FOUNDRY_CONST.NONE", // Not sure if this one is needed
            [CONST.USER_ROLES.PLAYER]: "SETTINGS.FOUNDRY_CONST.PLAYER",
            [CONST.USER_ROLES.TRUSTED]: "SETTINGS.FOUNDRY_CONST.TRUSTED",
            [CONST.USER_ROLES.ASSISTANT]: "SETTINGS.FOUNDRY_CONST.ASSISTANT",
            [CONST.USER_ROLES.GAMEMASTER]: "SETTINGS.FOUNDRY_CONST.GAMEMASTER"
        },
        //requiresReload: false,
        //onChange: value => {} // value is the new value of the setting
    });

}