See my other modules in the [Boneyard Collection](https://github.com/operation404/boneyard-collection).

# Boneyard Socketlib Companion
- [Security Warning](#security-warning)
- [Requirements](#requirements)
- [Socketlib Anonymous Function Wrappers](#socketlib-anonymous-function-wrappers)
- [Understanding Serialization](#understanding-serialization)
- [TODO](#todo)

## Security Warning
Boneyard Socketlib Companion provides the ability to **execute arbitrary Javascript** code on other clients connected to a Foundry server. While this can be quite handy in its intended use as a library for macros that can allow players to modify actors and other documents they don't have permissions to access or perform any other actions that require GM privileges, it also has the potential to be used maliciously to perform **Javascript Injection** attacks. 

As such, the author of this module can only recommend a GM to install it if you both understand how to properly utilize it and fully trust any players who are given access to it. Likewise as a player, you should only play in a Foundry game that has the Boneyard Socketlib Companion module if you fully trust the game's GM.

### Permissions
Boneyard Socketlib Compaion registers a world setting that defines the minimum user role level required to access its API. By default it is set to Game Master, meaning only GMs are able to use it. This should only be set to a lower permission level if you trust everyone who will be granted access.

## Requirements
The following modules are required for Boneyard Socketlib Companion to function:
* [socketlib](https://github.com/manuelVo/foundryvtt-socketlib)

## Socketlib Anonymous Function Wrappers
Boneyard Socketlib Companion acquires a socket through socketlib and registers utility functions that allow anonymous functions to be sent over its socket and executed on other clients connected to the Foundry server. Boneyard Socketlib Companion then registers a handler for each of the socketlib api functions. These handlers all take in a function and arguments object as parameters and call the registered parsing function through their respective socketlib api call.

```js
Boneyard.Socketlib_Companion.executeForEveryone((args) => {
  console.log(`Greetings ${game.user.name}!`);
});

// Each user should see 'Greetings' followed by their name
```

Boneyard Socketlib Companion provides an asynchronous wrapper function for each of the socketlib api functions. These functions are available to be called through the global `Boneyard.Socketlib_Companion` namespace. 

```js
async executeAsGM(func, args);
async executeAsUser(userID, func, args);
async executeForAllGMs(func, args);
async executeForOtherGMs(func, args);
async executeForEveryone(func, args);
async executeForOthers(func, args);
async executeForUsers(recipients, func, args);

// example call
Boneyard.Socketlib_Companion.executeForEveryone(fn, args);
```

The function wrappers all require a function argument to be passed, of which that function can optionally have a single argument `args` which should be an object containing any actual parameters the passed function might need. Some wrapper functions also require additional parameters, specifically:
- `executeAsUser()` requires the `userID` parameter which should be a string representing a user ID.
- `executeForUsers()` requires the `recipients` parameter which should be an array of strings representing user IDs.

These wrapper functions also return the socketlib api call return value, allowing you to receive information back from the clients the anonymous function was executed on.

```js
let result = await Boneyard.Socketlib_Companion.executeAsGM((args) => {
  console.log(args.a);
  console.log(args.b);
  const c = args.a+args.b;
  console.log(c);
  return c;
}, {a: 5, b: 3});

result += 1;
console.log(result);

// Client should output 5, 3, and 8
// Sender should output 9
```

## Understanding Serialization
Before Boneyard Socketlib Companion can send a given function and its `args` object through a socket they must each first be serialized. The function being executed will have no knowledge of the context it was originally declared in and is executed in the global scope. Any non-global variables not declared inside of the function or passed as parameters through the `args` object will not be defined. Additionally, any values `args` includes will be **copies** of their original values, breaking any references and potentially creating an infinite loop during serialization if there is a circular reference chain. 

Most (if not all) Foundry Documents override the base object serialization process and safely serialize themselves despite having circular reference chains. However, the serialized data the client receives is still just a copy and will no longer refer to an actual Document. If your declared function needs a Document to do anything beyond read what data it had at the time of serialization, the Document's ID should be passed as an argument and the function should use that ID to retrieve the Document.

```js
// This function causes an error when any client besides the sender executes it
// because 'game.user.targers' won't persist as desired through serialization
Boneyard.Socketlib_Companion.executeAsGM((args)=>{
    args.targets.forEach(token => { // Throws an error
        token.actor.update({
            "data.hp.value": token.actor.data.data.hp.value - 1, // Reduce target hp by 1
        });
    });
}, {targets: game.user.targets});

// This function correctly accomplishes the desired result of the previous example
// by sending the targets as a list of IDs that the client uses to find the tokens
Boneyard.Socketlib_Companion.executeAsGM((args)=>{
    args.target_ids.forEach(id => {
        const token = canvas.tokens.documentCollection.get(id);
        if (token === undefined) return; // Check to see if token was found
        token.actor.update({
            "data.hp.value": token.actor.data.data.hp.value - 1, // Reduce target hp by 1
        });
    });
}, {target_ids: game.user.targets.ids});
```

## TODO
- [x] ~~Add proper module settings so that the GM can determine which users are allowed to use the wrappers.~~
