/*
 * Hi!
 *
 * Note that this is an EXAMPLE Backstage backend. Please check the README.
 *
 * Happy hacking!
 */

// import { createBackend } from '@backstage/backend-defaults';
// import { createBackendModule } from '@backstage/backend-plugin-api';
// import { githubAuthenticator } from '@backstage/plugin-auth-backend-module-github-provider';
// import { oidcAuthenticator } from '@backstage/plugin-auth-backend-module-oidc-provider';
// import {
//   authProvidersExtensionPoint,
//   createOAuthProviderFactory,
// } from '@backstage/plugin-auth-node';
// import { stringifyEntityRef } from '@backstage/catalog-model';


// // inside main/bootstrap async fn
// // The auth backend is registered later with backend.add(import('@backstage/plugin-auth-backend')).
// // createAuthRouter from the newer package exports a BackendFeature and is not callable here,
// // so do not call it directly or attach it to an express router.

// const backend = createBackend();

// backend.add(import('@backstage/plugin-app-backend'));
// backend.add(import('@backstage/plugin-proxy-backend'));

// // scaffolder plugin
// backend.add(import('@backstage/plugin-scaffolder-backend'));
// backend.add(import('@backstage/plugin-scaffolder-backend-module-github'));
// backend.add(
//   import('@backstage/plugin-scaffolder-backend-module-notifications'),
// );

// // techdocs plugin
// backend.add(import('@backstage/plugin-techdocs-backend'));

// // auth plugin
// backend.add(import('@backstage/plugin-auth-backend'));
// // See https://backstage.io/docs/backend-system/building-backends/migrating#the-auth-plugin
// // Guest auth disabled to enforce Cognito-only access
// backend.add(import('@backstage/plugin-auth-backend-module-oidc-provider'));

// // catalog plugin
// backend.add(import('@backstage/plugin-catalog-backend'));
// backend.add(
//   import('@backstage/plugin-catalog-backend-module-scaffolder-entity-model'),
// );

// // See https://backstage.io/docs/features/software-catalog/configuration#subscribing-to-catalog-errors
// backend.add(import('@backstage/plugin-catalog-backend-module-logs'));

// // permission plugin
// backend.add(import('@backstage/plugin-permission-backend'));
// // See https://backstage.io/docs/permissions/getting-started for how to create your own permission policy
// backend.add(
//   import('@backstage/plugin-permission-backend-module-allow-all-policy'),
// );

// // search plugin
// backend.add(import('@backstage/plugin-search-backend'));

// // search engine
// // See https://backstage.io/docs/features/search/search-engines
// backend.add(import('@backstage/plugin-search-backend-module-pg'));

// // search collators
// backend.add(import('@backstage/plugin-search-backend-module-catalog'));
// backend.add(import('@backstage/plugin-search-backend-module-techdocs'));

// // kubernetes plugin
// backend.add(import('@backstage/plugin-kubernetes-backend'));

// // notifications and signals plugins
// backend.add(import('@backstage/plugin-notifications-backend'));
// backend.add(import('@backstage/plugin-signals-backend'));

// // backend.add(import('@backstage/plugin-auth-backend'));
// // backend.add(import('@backstage/plugin-auth-backend-module-github-provider'));

// //Authentication with GitHub

// const customAuthResolver = createBackendModule({
//   // This ID must be exactly "auth" because that's the plugin it targets
//   pluginId: 'auth',
//   // This ID must be unique, but can be anything
//   moduleId: 'custom-auth-provider',
//   register(reg) {
//     reg.registerInit({
//       deps: { providers: authProvidersExtensionPoint },
//       async init({ providers }) {
//         providers.registerProvider({
//           // This ID must match the actual provider config, e.g. addressing
//           // auth.providers.github means that this must be "github".
//           providerId: 'github',
//           // Use createProxyAuthProviderFactory instead if it's one of the proxy
//           // based providers rather than an OAuth based one
//           factory: createOAuthProviderFactory({
//             authenticator: githubAuthenticator,
//             async signInResolver(info, ctx) {
//               /*********************************************************************
//                * Custom resolver code goes here, see farther down in this article! *
//                * "info" is the sign in result from the upstream (github here), and *
//                * "ctx" contains useful utilities for token issuance etc.           *
//                *********************************************************************/
//               const { profile: { email } } = info;

//               // Profiles are not always guaranteed to have an email address.
//               // You can also find more provider-specific information in `info.result`.
//               // It typically contains a `fullProfile` object as well as ID and/or access
//               // tokens that you can use for additional lookups.
//               const resolvedEmail = email || info.result.fullProfile.email;
//               const userId = (resolvedEmail ? resolvedEmail.split('@')[0] : info.profile.displayName || 'unknown-user');

//               // You can add your own custom validation logic here.
//               // Logins can be prevented by throwing an error like the one above.
//               //myEmailValidator(email);

//               // This example resolver simply uses the local part of the email as the name.
//               // const [userId] = email.split('@');

//               // This helper function handles sign-in by looking up a user in the catalog.
//               // The lookup can be done either by reference, annotations, or custom filters.
//               //
//               // The helper also issues a token for the user, using the standard group
//               // membership logic to determine the ownership references of the user.
//               //
//               // There are a number of other methods on the ctx, feel free to explore them!
//               const userEntity = stringifyEntityRef({
//                 kind: 'User',
//                 name: userId,
//                 namespace: 'default',
//               });

//               return ctx.issueToken({
//                 claims: {
//                   sub: userEntity,
//                   ent: [ userEntity ],
//                 },
//               });
//             },
//           }),
//         });
//         providers.registerProvider({
//           providerId: 'oidc',
//               factory: createOAuthProviderFactory({
//                 authenticator: oidcAuthenticator,
//                 // Use this new resolver:
//                 async signInResolver(info, ctx) {
//                   // 'info' is OidcAuthResult.
//                   // We requested 'openid profile email' scopes,
//                   // so the claims are in info.profile.
                  
//                   const email = info.profile.email;
//                   const displayName = info.profile.displayName || info.profile.name;

//                   // Use the email local-part as the ID if available.
//                   // Otherwise, use the 'displayName' (slugified).
//                   // As a last resort, use the 'sub' claim (Cognito's unique ID).
//                   const userId = email
//                     ? email.split('@')[0]
//                     : displayName
//                     ? displayName.replace(/\s+/g, '-').toLowerCase()
//                     : info.profile.sub; // 'sub' is the unique subject claim

//                   if (!userId) {
//                     // This should be rare if 'sub' is always present
//                     throw new Error('Could not resolve user ID from Cognito profile.');
//                   }

//                   const userEntity = stringifyEntityRef({
//                     kind: 'User',
//                     name: userId,
//                     namespace: 'default',
//                   });

//                   return ctx.issueToken({
//                     claims: {
//                       sub: userEntity,
//                       ent: [ userEntity ],
//                     },
//                   });
//                 },
//               }),
//             });
//       },
//     });
//   },
// });


// backend.add(customAuthResolver);

// backend.start();


// import { createBackend } from '@backstage/backend-defaults';
// import { createBackendModule } from '@backstage/backend-plugin-api';
// import { githubAuthenticator } from '@backstage/plugin-auth-backend-module-github-provider';
// import { oidcAuthenticator } from '@backstage/plugin-auth-backend-module-oidc-provider';
// import {
//   authProvidersExtensionPoint,
//   createOAuthProviderFactory,
// } from '@backstage/plugin-auth-node';
// import { stringifyEntityRef } from '@backstage/catalog-model';

// const backend = createBackend();

// backend.add(import('@backstage/plugin-app-backend'));
// backend.add(import('@backstage/plugin-proxy-backend'));

// // scaffolder plugin
// backend.add(import('@backstage/plugin-scaffolder-backend'));
// backend.add(import('@backstage/plugin-scaffolder-backend-module-github'));
// backend.add(
//   import('@backstage/plugin-scaffolder-backend-module-notifications'),
// );

// // techdocs plugin
// backend.add(import('@backstage/plugin-techdocs-backend'));

// // auth plugin
// backend.add(import('@backstage/plugin-auth-backend'));

// // ADD THESE PROVIDER MODULES - This is what was missing!
// backend.add(import('@backstage/plugin-auth-backend-module-github-provider'));
// backend.add(import('@backstage/plugin-auth-backend-module-oidc-provider'));

// // catalog plugin
// backend.add(import('@backstage/plugin-catalog-backend'));
// backend.add(
//   import('@backstage/plugin-catalog-backend-module-scaffolder-entity-model'),
// );

// backend.add(import('@backstage/plugin-catalog-backend-module-logs'));

// // permission plugin
// backend.add(import('@backstage/plugin-permission-backend'));
// backend.add(
//   import('@backstage/plugin-permission-backend-module-allow-all-policy'),
// );

// // search plugin
// backend.add(import('@backstage/plugin-search-backend'));
// backend.add(import('@backstage/plugin-search-backend-module-pg'));

// // search collators
// backend.add(import('@backstage/plugin-search-backend-module-catalog'));
// backend.add(import('@backstage/plugin-search-backend-module-techdocs'));

// // kubernetes plugin
// backend.add(import('@backstage/plugin-kubernetes-backend'));

// // notifications and signals plugins
// backend.add(import('@backstage/plugin-notifications-backend'));
// backend.add(import('@backstage/plugin-signals-backend'));

// // Custom Auth Resolvers - Override the default resolvers
// const customAuthResolver = createBackendModule({
//   pluginId: 'auth',
//   moduleId: 'custom-auth-resolver',
//   register(reg) {
//     reg.registerInit({
//       deps: { providers: authProvidersExtensionPoint },
//       async init({ providers }) {
//         // GitHub Provider with custom resolver
//         providers.registerProvider({
//           providerId: 'github',
//           factory: createOAuthProviderFactory({
//             authenticator: githubAuthenticator,
//             async signInResolver(info, ctx) {
//               const { profile: { email } } = info;

//               const resolvedEmail = email || info.result.fullProfile.email;
//               const userId = (resolvedEmail 
//                 ? resolvedEmail.split('@')[0] 
//                 : info.profile.displayName || 'unknown-user');

//               const userEntity = stringifyEntityRef({
//                 kind: 'User',
//                 name: userId,
//                 namespace: 'default',
//               });

//               return ctx.issueToken({
//                 claims: {
//                   sub: userEntity,
//                   ent: [ userEntity ],
//                 },
//               });
//             },
//           }),
//         });

//         // OIDC/Cognito Provider with custom resolver
//         providers.registerProvider({
//           providerId: 'oidc',
//           factory: createOAuthProviderFactory({
//             authenticator: oidcAuthenticator,
//             async signInResolver(info, ctx) {
//               const email = info.profile.email;
//               const displayName = info.profile.displayName || info.profile.name;

//               const userId = email
//                 ? email.split('@')[0]
//                 : displayName
//                 ? displayName.replace(/\s+/g, '-').toLowerCase()
//                 : info.profile.sub;

//               if (!userId) {
//                 throw new Error('Could not resolve user ID from Cognito profile.');
//               }

//               const userEntity = stringifyEntityRef({
//                 kind: 'User',
//                 name: userId,
//                 namespace: 'default',
//               });

//               return ctx.issueToken({
//                 claims: {
//                   sub: userEntity,
//                   ent: [ userEntity ],
//                 },
//               });
//             },
//           }),
//         });
//       },
//     });
//   },
// });

// backend.add(customAuthResolver);

// backend.start();

import { createBackend } from '@backstage/backend-defaults';
import { createBackendModule } from '@backstage/backend-plugin-api';
import { githubAuthenticator } from '@backstage/plugin-auth-backend-module-github-provider';
import { oidcAuthenticator } from '@backstage/plugin-auth-backend-module-oidc-provider';
import {
  authProvidersExtensionPoint,
  createOAuthProviderFactory,
} from '@backstage/plugin-auth-node';
import { stringifyEntityRef } from '@backstage/catalog-model';

const backend = createBackend();

backend.add(import('@backstage/plugin-app-backend'));
backend.add(import('@backstage/plugin-proxy-backend'));

// scaffolder plugin
backend.add(import('@backstage/plugin-scaffolder-backend'));
backend.add(import('@backstage/plugin-scaffolder-backend-module-github'));
backend.add(
  import('@backstage/plugin-scaffolder-backend-module-notifications'),
);

// techdocs plugin
backend.add(import('@backstage/plugin-techdocs-backend'));

// auth plugin - ONLY add the main auth backend, NOT the provider modules
backend.add(import('@backstage/plugin-auth-backend'));

// DO NOT add these lines - they conflict with custom resolver:
// backend.add(import('@backstage/plugin-auth-backend-module-github-provider'));
// backend.add(import('@backstage/plugin-auth-backend-module-oidc-provider'));

// catalog plugin
backend.add(import('@backstage/plugin-catalog-backend'));
backend.add(
  import('@backstage/plugin-catalog-backend-module-scaffolder-entity-model'),
);

backend.add(import('@backstage/plugin-catalog-backend-module-logs'));

// permission plugin
backend.add(import('@backstage/plugin-permission-backend'));
backend.add(
  import('@backstage/plugin-permission-backend-module-allow-all-policy'),
);

// search plugin
backend.add(import('@backstage/plugin-search-backend'));
backend.add(import('@backstage/plugin-search-backend-module-pg'));

// search collators
backend.add(import('@backstage/plugin-search-backend-module-catalog'));
backend.add(import('@backstage/plugin-search-backend-module-techdocs'));

// kubernetes plugin
backend.add(import('@backstage/plugin-kubernetes-backend'));

// notifications and signals plugins
backend.add(import('@backstage/plugin-notifications-backend'));
backend.add(import('@backstage/plugin-signals-backend'));

// Custom Auth Resolvers - This registers AND configures both providers
const customAuthResolver = createBackendModule({
  pluginId: 'auth',
  moduleId: 'custom-auth-resolver',
  register(reg) {
    reg.registerInit({
      deps: { providers: authProvidersExtensionPoint },
      async init({ providers }) {
        // GitHub Provider with custom resolver
        providers.registerProvider({
          providerId: 'github',
          factory: createOAuthProviderFactory({
            authenticator: githubAuthenticator,
            async signInResolver(info, ctx) {
              const { profile: { email } } = info;

              const resolvedEmail = email || info.result.fullProfile.email;
              const userId = (resolvedEmail 
                ? resolvedEmail.split('@')[0] 
                : info.profile.displayName || 'unknown-user');

              const userEntity = stringifyEntityRef({
                kind: 'User',
                name: userId,
                namespace: 'default',
              });

              return ctx.issueToken({
                claims: {
                  sub: userEntity,
                  ent: [userEntity],
                },
              });
            },
          }),
        });

        // OIDC/Cognito Provider with custom resolver
        providers.registerProvider({
          providerId: 'oidc',
          factory: createOAuthProviderFactory({
            authenticator: oidcAuthenticator,
            async signInResolver(info, ctx) {
              const email = info.profile.email;
              const displayName = info.profile.displayName || info.profile.name;

              const userId = email
                ? email.split('@')[0]
                : displayName
                ? displayName.replace(/\s+/g, '-').toLowerCase()
                : info.profile.sub;

              if (!userId) {
                throw new Error('Could not resolve user ID from Cognito profile.');
              }

              const userEntity = stringifyEntityRef({
                kind: 'User',
                name: userId,
                namespace: 'default',
              });

              return ctx.issueToken({
                claims: {
                  sub: userEntity,
                  ent: [userEntity],
                },
              });
            },
          }),
        });
      },
    });
  },
});

backend.add(customAuthResolver);

backend.start();