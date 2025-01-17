require("./bundle-config");

const app = require("application");

/*
Importing all rxjs operators increases build output and duration
so it is better to import the operators in use only;
also, due to the polyfill-ish nature of the RxJS modules,
it is enough to import an operator once at a single, centralized location.
*/
require("./rxjs-imports");

/*
The {N} Firebase plugin needs some initialization steps before it is ready
for use. Check out the initialization script at /shared/firebase.common.ts
along with more information about it.
*/
require("./shared/firebase.common");


global.listLoaded = false; 

app.run({ moduleName: "app-root" });

/*
Do not place any code after the application has been started as it will not
be executed on iOS.
*/
