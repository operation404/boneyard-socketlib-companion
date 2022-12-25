import { prepare_settings } from "./scripts/settings.js";
import { Socketlib_Companion } from "./scripts/socketlib_companion.js";

Hooks.once("init", prepare_settings);

// 'socketlib.ready' hook fires during the 'init' hook phase,
// so I must either attach a handler before that, or initialize
// during the 'setup' hook phase since socketlib is ready then.

// TODO
// I should probably initialize fully at 'setup' instead since 
// the world settings aren't registered yet and could throw an
// error if used before then technically. This is a non-issue in
// realistic use, but is something to consider.
Socketlib_Companion.init(); 