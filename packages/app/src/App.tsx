// import { Navigate, Route } from 'react-router-dom';
// import { apiDocsPlugin, ApiExplorerPage } from '@backstage/plugin-api-docs';
// import {
//   CatalogEntityPage,
//   CatalogIndexPage,
//   catalogPlugin,
// } from '@backstage/plugin-catalog';
// import {
//   CatalogImportPage,
//   catalogImportPlugin,
// } from '@backstage/plugin-catalog-import';
// import { ScaffolderPage, scaffolderPlugin } from '@backstage/plugin-scaffolder';
// import { orgPlugin } from '@backstage/plugin-org';
// import { SearchPage } from '@backstage/plugin-search';
// import {
//   TechDocsIndexPage,
//   techdocsPlugin,
//   TechDocsReaderPage,
// } from '@backstage/plugin-techdocs';
// import { TechDocsAddons } from '@backstage/plugin-techdocs-react';
// import { ReportIssue } from '@backstage/plugin-techdocs-module-addons-contrib';
// import { UserSettingsPage } from '@backstage/plugin-user-settings';
// import { apis } from './apis';
// import { entityPage } from './components/catalog/EntityPage';
// import { searchPage } from './components/search/SearchPage';
// import { Root } from './components/Root';

// import {
//   AlertDisplay,
//   OAuthRequestDialog,
//   SignInPage
// } from '@backstage/core-components';
// import { createApp } from '@backstage/app-defaults';
// import { AppRouter, FlatRoutes } from '@backstage/core-app-api';
// import { CatalogGraphPage } from '@backstage/plugin-catalog-graph';
// import { RequirePermission } from '@backstage/plugin-permission-react';
// import { catalogEntityCreatePermission } from '@backstage/plugin-catalog-common/alpha';
// import { NotificationsPage } from '@backstage/plugin-notifications';
// import { SignalsDisplay } from '@backstage/plugin-signals';
// import { githubAuthApiRef } from '@backstage/core-plugin-api';
// import { oidcAuthApiRef } from '@backstage/plugin-auth-react';
// // import { createApiRef } from '@backstage/core-plugin-api';
// // import { OpenIdConnectApi, ProfileInfoApi, BackstageIdentityApi, SessionApi } from '@backstage/core-plugin-api';

// // export const oidcAuthApiRef = createApiRef<OpenIdConnectApi & ProfileInfoApi & BackstageIdentityApi & SessionApi>({
// //   id: 'auth.keycloak', // Use a unique identifier
// // });
// // // OIDC auth - Backstage automatically discovers providers from backend config
// // // The provider will be available as 'oidc' based on auth.providers.oidc.cognito config

// const app = createApp({
//   apis,
//   bindRoutes({ bind }) {
//     bind(catalogPlugin.externalRoutes, {
//       createComponent: scaffolderPlugin.routes.root,
//       viewTechDoc: techdocsPlugin.routes.docRoot,
//       createFromTemplate: scaffolderPlugin.routes.selectedTemplate,
//     });
//     bind(apiDocsPlugin.externalRoutes, {
//       registerApi: catalogImportPlugin.routes.importPage,
//     });
//     bind(scaffolderPlugin.externalRoutes, {
//       registerComponent: catalogImportPlugin.routes.importPage,
//       viewTechDoc: techdocsPlugin.routes.docRoot,
//     });
//     bind(orgPlugin.externalRoutes, {
//       catalogIndex: catalogPlugin.routes.catalogIndex,
//     });
//   },
//   components: {
//     SignInPage: props => <SignInPage {...props} auto providers={[ 
//         { 
//           id: 'github',
//           title: 'GitHub',
//           message: 'Sign in using GitHub',
//           apiRef: githubAuthApiRef,
//         },
//         {
//           id: 'oidc',
//           title: 'Cognito',
//           message: 'Sign in using AWS Cognito',
//           apiRef: oidcAuthApiRef,
//         }]} />,
//   },
// });

// const routes = (
//   <FlatRoutes>
//     <Route path="/" element={<Navigate to="catalog" />} />
//     <Route path="/catalog" element={<CatalogIndexPage />} />
//     <Route
//       path="/catalog/:namespace/:kind/:name"
//       element={<CatalogEntityPage />}
//     >
//       {entityPage}
//     </Route>
//     <Route path="/docs" element={<TechDocsIndexPage />} />
//     <Route
//       path="/docs/:namespace/:kind/:name/*"
//       element={<TechDocsReaderPage />}
//     >
//       <TechDocsAddons>
//         <ReportIssue />
//       </TechDocsAddons>
//     </Route>
//     <Route path="/create" element={<ScaffolderPage />} />
//     <Route path="/api-docs" element={<ApiExplorerPage />} />
//     <Route
//       path="/catalog-import"
//       element={
//         <RequirePermission permission={catalogEntityCreatePermission}>
//           <CatalogImportPage />
//         </RequirePermission>
//       }
//     />
//     <Route path="/search" element={<SearchPage />}>
//       {searchPage}
//     </Route>
//     <Route path="/settings" element={<UserSettingsPage />} />
//     <Route path="/catalog-graph" element={<CatalogGraphPage />} />
//     <Route path="/notifications" element={<NotificationsPage />} />
//   </FlatRoutes>
// );

// export default app.createRoot(
//   <>
//     <AlertDisplay />
//     <OAuthRequestDialog />
//     <SignalsDisplay />
//     <AppRouter>
//       <Root>{routes}</Root>
//     </AppRouter>
//   </>,
// );

import { Navigate, Route } from 'react-router-dom';
import { apiDocsPlugin, ApiExplorerPage } from '@backstage/plugin-api-docs';
import {
  CatalogEntityPage,
  CatalogIndexPage,
  catalogPlugin,
} from '@backstage/plugin-catalog';
import {
  CatalogImportPage,
  catalogImportPlugin,
} from '@backstage/plugin-catalog-import';
import { ScaffolderPage, scaffolderPlugin } from '@backstage/plugin-scaffolder';
import { orgPlugin } from '@backstage/plugin-org';
import { SearchPage } from '@backstage/plugin-search';
import {
  TechDocsIndexPage,
  techdocsPlugin,
  TechDocsReaderPage,
} from '@backstage/plugin-techdocs';
import { TechDocsAddons } from '@backstage/plugin-techdocs-react';
import { ReportIssue } from '@backstage/plugin-techdocs-module-addons-contrib';
import { UserSettingsPage } from '@backstage/plugin-user-settings';
import { apis, oidcAuthApiRef } from './apis';
import { entityPage } from './components/catalog/EntityPage';
import { searchPage } from './components/search/SearchPage';
import { Root } from './components/Root';

import {
  AlertDisplay,
  OAuthRequestDialog,
  SignInPage
} from '@backstage/core-components';
import { createApp } from '@backstage/app-defaults';
import { AppRouter, FlatRoutes } from '@backstage/core-app-api';
import { CatalogGraphPage } from '@backstage/plugin-catalog-graph';
import { RequirePermission } from '@backstage/plugin-permission-react';
import { catalogEntityCreatePermission } from '@backstage/plugin-catalog-common/alpha';
import { NotificationsPage } from '@backstage/plugin-notifications';
import { SignalsDisplay } from '@backstage/plugin-signals';
import { githubAuthApiRef } from '@backstage/core-plugin-api';

// --- ADD THIS LINE ---
// This imports the new custom catalog page you created
import { CustomCatalogPage } from './components/catalog/CustomCatalogPage';
// --- END OF ADDITION ---

const app = createApp({
  apis,
  bindRoutes({ bind }) {
    bind(catalogPlugin.externalRoutes, {
      createComponent: scaffolderPlugin.routes.root,
      viewTechDoc: techdocsPlugin.routes.docRoot,
      createFromTemplate: scaffolderPlugin.routes.selectedTemplate,
    });
    bind(apiDocsPlugin.externalRoutes, {
      registerApi: catalogImportPlugin.routes.importPage,
    });
    bind(scaffolderPlugin.externalRoutes, {
      registerComponent: catalogImportPlugin.routes.importPage,
      viewTechDoc: techdocsPlugin.routes.docRoot,
    });
    bind(orgPlugin.externalRoutes, {
      catalogIndex: catalogPlugin.routes.catalogIndex,
    });
  },
  components: {
    SignInPage: props => (
      <SignInPage 
        {...props} 
        
        providers={[ 
          { 
            id: 'github',
            title: 'GitHub',
            message: 'Sign in using GitHub',
            apiRef: githubAuthApiRef,
          },
          {
            id: 'oidc',
            title: 'AWS Cognito',
            message: 'Sign in using AWS Cognito',
            apiRef: oidcAuthApiRef,
          }
        ]} 
      />
    ),
  },
});

const routes = (
  <FlatRoutes>
    <Route path="/" element={<Navigate to="catalog" />} />

    {/* --- THIS LINE IS MODIFIED --- */}
    {/* It now points to your new CustomCatalogPage component */}
    <Route path="/catalog" element={<CustomCatalogPage />} />
    {/* --- END OF MODIFICATION --- */}

    <Route path="/catalog" element={<CatalogIndexPage />} />
    <Route
      path="/catalog/:namespace/:kind/:name"
      element={<CatalogEntityPage />}
    >
      {entityPage}
    </Route>
    <Route path="/docs" element={<TechDocsIndexPage />} />
    <Route
      path="/docs/:namespace/:kind/:name/*"
      element={<TechDocsReaderPage />}
    >
      <TechDocsAddons>
        <ReportIssue />
      </TechDocsAddons>
    </Route>
    <Route path="/create" element={<ScaffolderPage />} />
    <Route path="/api-docs" element={<ApiExplorerPage />} />
    <Route
      path="/catalog-import"
      element={
        <RequirePermission permission={catalogEntityCreatePermission}>
          <CatalogImportPage />
        </RequirePermission>
      }
    />
    <Route path="/search" element={<SearchPage />}>
      {searchPage}
    </Route>
    <Route path="/settings" element={<UserSettingsPage />} />
    <Route path="/catalog-graph" element={<CatalogGraphPage />} />
    <Route path="/notifications" element={<NotificationsPage />} />
  </FlatRoutes>
);

export default app.createRoot(
  <>
    <AlertDisplay />
    <OAuthRequestDialog />
    <SignalsDisplay />
    <AppRouter>
      <Root>{routes}</Root>
    </AppRouter>
  </>,
);