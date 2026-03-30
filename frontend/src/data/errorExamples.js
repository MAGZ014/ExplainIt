export const ERROR_EXAMPLES = [
  {
    id: 1,
    label: "TypeError - undefined.map",
    text: `TypeError: Cannot read properties of undefined (reading 'map')
    at UserList.vue:42:18
    at renderComponentRoot (runtime-core.esm-bundler.js:939:12)
    at ReactiveEffect.componentUpdateFn [as fn] (runtime-core.esm-bundler.js:4160:46)
    at ReactiveEffect.run (reactivity.esm-bundler.js:167:19)`,
  },
  {
    id: 2,
    label: "ReferenceError - no existe variable",
    text: `ReferenceError: userData is not defined
    at fetchProfile (ProfileService.js:78:23)
    at async handleSubmit (ProfileForm.vue:55:17)
    at processTicksAndRejections (internal/process/task_queues.js:95:5)`,
  },
  {
    id: 3,
    label: "SyntaxError - token inesperado",
    text: `SyntaxError: Unexpected token '<'
    at parse (acorn/dist/acorn.mjs:2980:10)
    at parseExpressionAt (acorn/dist/acorn.mjs:3151:15)
    at parseStatement (acorn/dist/acorn.mjs:3310:12)
    at parseTopLevel (acorn/dist/acorn.mjs:3362:10)`,
  },
  {
    id: 4,
    label: "RangeError - stack overflow",
    text: `RangeError: Maximum call stack size exceeded
    at recurse (utils.js:12:5)
    at recurse (utils.js:12:5)
    at recurse (utils.js:12:5)
    at processImmediate (internal/timers/task_queues.js:97:5)`,
  },
  {
    id: 5,
    label: "URIError - URI mal formada",
    text: `URIError: URI malformed
    at decodeURIComponent (<anonymous>)
    at loadResource (apiClient.js:45:22)
    at async fetchData (dataService.js:33:17)
    at async mounted (App.vue:120:9)`,
  },
  {
    id: 6,
    label: "Error - conexión rechazada",
    text: `Error: connect ECONNREFUSED 127.0.0.1:3000
    at TCPConnectWrap.afterConnect [as oncomplete] (net.js:1191:14)
    at processTicksAndRejections (internal/process/task_queues.js:95:5)`,
  },
  {
    id: 7,
    label: "EADDRINUSE - puerto en uso",
    text: `Error: listen EADDRINUSE: address already in use :::8080
    at Server.setupListenHandle [as _listen2] (net.js:1318:16)
    at listenInCluster (net.js:1366:12)
    at Server.listen (net.js:1452:7)
    at Object.<anonymous> (server.js:23:8)
    at Module._compile (internal/modules/cjs/loader.js:999:30)`,
  },
  {
    id: 8,
    label: "MODULE_NOT_FOUND - dependencia no instalada",
    text: `Error: Cannot find module 'axios'
Require stack:
- /home/user/project/src/services/apiClient.js
- /home/user/project/src/main.js
    at Function.Module._resolveFilename (internal/modules/cjs/loader.js:902:15)
    at Function.Module._load (internal/modules/cjs/loader.js:746:27)
    at Module.require (internal/modules/cjs/loader.js:974:19)
    at require (internal/modules/helpers.js:93:18)
Hint: Run \`npm install\` to install missing dependencies.`,
  },
  {
    id: 9,
    label: "ENOENT - archivo no encontrado",
    text: `Error: ENOENT: no such file or directory, open '/home/user/project/.env'
    at Object.openSync (fs.js:476:3)
    at Object.readFileSync (fs.js:377:35)
    at loadEnv (config/env.js:12:18)
    at Object.<anonymous> (src/main.js:5:1)
    at Module._compile (internal/modules/cjs/loader.js:999:30)`,
  },
  {
    id: 10,
    label: "CORS - origen bloqueado",
    text: `Access to XMLHttpRequest at 'http://api.example.com/users' from origin 'http://localhost:5173'
has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present
on the requested resource.
    at dispatchXhrRequest (axios/lib/adapters/xhr.js:180:12)
    at xhr.onreadystatechange (axios/lib/adapters/xhr.js:102:7)`,
  },
  {
    id: 11,
    label: "npm ERR - versión de Node incompatible",
    text: `npm ERR! code EBADENGINE
npm ERR! engine Unsupported engine
npm ERR! engine Not compatible with your version of node/npm: node@14.17.0
npm ERR! engine Required: {"node":">=18.0.0","npm":">=9.0.0"}
npm ERR! engine Current: {"node":"14.17.0","npm":"6.14.13"}
npm ERR! 
npm ERR! Fix the upstream dependency conflict, or retry
npm ERR! this command with --force or --legacy-peer-deps.`,
  },
  {
    id: 12,
    label: "Vite - import no resuelto",
    text: `[vite] Internal server error: Failed to resolve import "@/components/Button" from "src/views/Home.vue".
Does the file exist?
    at formatError (vite/dist/node/chunks/dep-CHZK6zbr.js:45981:46)
    at TransformContext.error (vite/dist/node/chunks/dep-CHZK6zbr.js:45977:19)
    at normalizeUrl (vite/dist/node/chunks/dep-CHZK6zbr.js:66716:33)`,
  },
  {
    id: 13,
    label: "TypeError - null es no objeto",
    text: `TypeError: null is not an object (evaluating 'document.getElementById("app").innerHTML')
    at initApp (main.js:14:38)
    at HTMLDocument.DOMContentLoaded (main.js:120:5)`,
  },
  {
    id: 14,
    label: "404 - recurso no encontrado",
    text: `GET http://localhost:3000/api/products/9999 404 (Not Found)
    at createError (axios/lib/core/createError.js:16:15)
    at settle (axios/lib/core/settle.js:17:12)
    at XMLHttpRequest.onloadend (axios/lib/adapters/xhr.js:66:7)
Error: Request failed with status code 404`,
  },
  {
    id: 15,
    label: "JWT - token expirado",
    text: `JsonWebTokenError: TokenExpiredError: jwt expired
    at /verify (jsonwebtoken/verify.js:89:21)
    at authMiddleware (middleware/auth.js:34:16)
    at Layer.handle [as handle_request] (express/lib/router/layer.js:95:5)
    at next (express/lib/router/route.js:144:13)
Expiry: 2024-01-15T10:32:00.000Z | Now: 2024-01-15T11:00:42.000Z`,
  },
  {
    id: 16,
    label: "Webpack - memoria insuficiente",
    text: `FATAL ERROR: CALL_AND_RETRY_LAST Allocation failed - JavaScript heap out of memory
 1: 0xb7c5e0 node::Abort() [webpack]
 2: 0xa91a7e node::FatalError(char const*, char const*) [webpack]
 3: 0xd9fe8e v8::Utils::ReportOOMFailure(v8::internal::Isolate*, char const*, bool) [webpack]
 4: 0xd9fefe v8::internal::V8::FatalProcessOutOfMemory(v8::internal::Isolate*, char const*, bool) [webpack]

Hint: Try increasing --max-old-space-size. Example: NODE_OPTIONS=--max-old-space-size=4096`,
  },
  {
    id: 17,
    label: "Prisma - conexión a BD fallida",
    text: `PrismaClientInitializationError: Can't reach database server at \`localhost:5432\`
Please make sure your database server is running at \`localhost:5432\`.
    at cb (/node_modules/@prisma/client/runtime/library.js:128:15)
    at processTicksAndRejections (internal/process/task_queues.js:95:5)
    at async connectDB (lib/prisma.js:8:3)
    at async startServer (server.js:15:3)`,
  },
  {
    id: 18,
    label: "ESLint - error de linting en CI",
    text: `/src/components/UserCard.vue
  12:5   error  'userId' is assigned a value but never used  no-unused-vars
  28:17  error  Expected '===' and instead saw '=='              eqeqeq
  45:1   error  Trailing spaces not allowed                      no-trailing-spaces

✖ 3 problems (3 errors, 0 warnings)
npm ERR! code 1  |  ESLint found errors. Fix them before committing.`,
  },
  {
    id: 19,
    label: "Git - conflicto de merge",
    text: `Auto-merging src/store/userStore.js
CONFLICT (content): Merge conflict in src/store/userStore.js
Automatic merge failed; fix conflicts and then commit the result.

<<<<<<< HEAD
  const userId = store.getters['auth/currentUserId'];
=======
  const userId = useAuthStore().user?.id;
>>>>>>> feature/pinia-migration`,
  },
  {
    id: 20,
    label: "TypeScript - tipo incompatible",
    text: `error TS2322: Type 'string | undefined' is not assignable to type 'string'.
  Type 'undefined' is not assignable to type 'string'.

src/components/Avatar.tsx:18:5
  18   username={user.name}
       ~~~~~~~~
The expected type comes from property 'username' which is declared here on type 'AvatarProps'`,
  },
];
