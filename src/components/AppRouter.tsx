import { selectors } from "ducks/auth";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import AcmeAccountDetail from "./_pages/acme-accounts/detail";

import AcmeAccountsList from "./_pages/acme-accounts/list";
import AcmeProfileDetail from "./_pages/acme-profiles/detail";
import AcmeProfileEdit from "./_pages/acme-profiles/form";

import AcmeProfilesList from "./_pages/acme-profiles/list";
import AuditLogs from "./_pages/auditLogs";
import AuthorityDetail from "./_pages/authorities/detail";
import AuthorityEdit from "./_pages/authorities/form";

import AuthoritiesList from "./_pages/authorities/list";
import CertificateDetail from "./_pages/certificates/detail";
import CertificateEdit from "./_pages/certificates/form";

import CertificatesList from "./_pages/certificates/list";
import ComplianceProfileDetail from "./_pages/compliance-profiles/detail";
import ComplianceProfileEdit from "./_pages/compliance-profiles/form";

import ComplianceProfilesList from "./_pages/compliance-profiles/list";
import ConnectorDetail from "./_pages/connectors/detail";
import ConnectorEdit from "./_pages/connectors/form";

import ConnectorsList from "./_pages/connectors/list";
import CredentialDetail from "./_pages/credentials/detail";
import CredentialEdit from "./_pages/credentials/form";

import CredentialsList from "./_pages/credentials/list";
import CryptographicKeyDetail from "./_pages/cryptographic-keys/detail";
import CryptographicKeyForm from "./_pages/cryptographic-keys/form";
import CryptographicKeyList from "./_pages/cryptographic-keys/list";
import CustomAttributesDetail from "./_pages/custom-attributes/detail";
import CustomAttributesEdit from "./_pages/custom-attributes/form";

import CustomAttributesList from "./_pages/custom-attributes/list";
import Dashboard from "./_pages/dashboard";
import DiscoveryDetail from "./_pages/discoveries/detail";
import DiscoveryEdit from "./_pages/discoveries/form";

import DiscoveriesList from "./_pages/discoveries/list";
import EntityDetail from "./_pages/entities/detail";
import EntityEdit from "./_pages/entities/form";

import EntitiesList from "./_pages/entities/list";
import GlobalMetadataDetail from "./_pages/global-metadata/detail";
import GlobalMetadataEdit from "./_pages/global-metadata/form";

import GlobalMetadataList from "./_pages/global-metadata/list";
import GroupDetail from "./_pages/group/detail";
import GroupEdit from "./_pages/group/form";

import GroupList from "./_pages/group/list";

import LocationDetail from "./_pages/locations/detail";
import LocationEdit from "./_pages/locations/form";

import LocationsList from "./_pages/locations/list";
import RaProfileDetail from "./_pages/ra-profiles/detail";
import RaProfileEdit from "./_pages/ra-profiles/form";

import RaProfilesList from "./_pages/ra-profiles/list";
import RoleDetail from "./_pages/roles/detail";

import PlatformSettingsDetail from "./_pages/platform-settings/detail";
import PlatformSettingsEdit from "./_pages/platform-settings/form";
import RolesList from "./_pages/roles/list";
import RoleEdit from "./_pages/roles/RoleForm";
import RolePermissions from "./_pages/roles/RolePermissionsForm";
import RoleUsers from "./_pages/roles/RoleUsersForm";
import TokenProfileDetail from "./_pages/token-profiles/detail";
import TokenProfileForm from "./_pages/token-profiles/form";
import TokenProfileList from "./_pages/token-profiles/list";
import TokenDetail from "./_pages/tokens/detail";
import TokenEdit from "./_pages/tokens/form";

import TokenList from "./_pages/tokens/list";

import UserProfileDetail from "./_pages/user-profile/detail";
import UserProfileEdit from "./_pages/user-profile/form";
import UserDetail from "./_pages/users/detail";
import UserEdit from "./_pages/users/form";

import AppLogin from "./AppLogin/AppLogin";
import UsersList from "./_pages/users/list";

import AppRedirect from "./AppRedirect";

import Layout from "./Layout";
import Spinner from "./Spinner";

export default function AppRouter() {
   const profile = useSelector(selectors.profile);

   const appRoutes = useMemo(

      () => (

         <>
            <Route element={< Layout />}>

               <Route path="" element={<Navigate to="/dashboard" />} />
               <Route path="/" element={<Navigate to="/dashboard" />} />

               <Route path="/dashboard" element={<Dashboard />} />

               <Route path="/users" element={<UsersList />} />
               <Route path="/users/list" element={<Navigate to="/users" />} />
               <Route path="/users/detail/:id" element={<UserDetail />} />
               <Route path="/users/add" element={<UserEdit />} />
               <Route path="/users/edit/:id" element={<UserEdit />} />

               <Route path="/roles" element={<RolesList />} />
               <Route path="/roles/list" element={<Navigate to="/roles" />} />
               <Route path="/roles/detail/:id" element={<RoleDetail />} />
               <Route path="/roles/add" element={<RoleEdit />} />
               <Route path="/roles/edit/:id" element={<RoleEdit />} />
               <Route path="/roles/users/:id" element={<RoleUsers />} />
               <Route path="/roles/permissions/:id" element={<RolePermissions />} />

               <Route path="/certificates" element={<CertificatesList />} />
               <Route path="/certificates/list" element={<Navigate to="/certificates" />} />
               <Route path="/certificates/detail/:id" element={<CertificateDetail />} />
               <Route path="/certificates/add" element={<CertificateEdit />} />

               <Route path="/connectors" element={<ConnectorsList />} />
               <Route path="/connectors/list" element={<Navigate to="/connectors" />} />
               <Route path="/connectors/detail/:id" element={<ConnectorDetail />} />
               <Route path="/connectors/add" element={<ConnectorEdit />} />
               <Route path="/connectors/edit/:id" element={<ConnectorEdit />} />

               <Route path="/discoveries" element={<DiscoveriesList />} />
               <Route path="/discoveries/list" element={<Navigate to="/discoveries" />} />
               <Route path="/discoveries/detail/:id" element={<DiscoveryDetail />} />
               <Route path="/discoveries/add" element={<DiscoveryEdit />} />

               <Route path="/authorities" element={<AuthoritiesList />} />
               <Route path="/authorities/list" element={<Navigate to="/authorities" />} />
               <Route path="/authorities/detail/:id" element={<AuthorityDetail />} />
               <Route path="/authorities/add" element={<AuthorityEdit />} />
               <Route path="/authorities/edit/:id" element={<AuthorityEdit />} />

               <Route path="/raprofiles" element={<RaProfilesList />} />
               <Route path="/raprofiles/list" element={<Navigate to="/raprofiles" />} />
               <Route path="/raprofiles/detail/:authorityId/:id" element={<RaProfileDetail />} />
               <Route path="/raprofiles/add" element={<RaProfileEdit />} />
               <Route path="/raprofiles/edit/:authorityId/:id" element={<RaProfileEdit />} />

               <Route path="/complianceprofiles" element={<ComplianceProfilesList />} />
               <Route path="/complianceprofiles/list" element={<Navigate to="/complianceprofiles" />} />
               <Route path="/complianceprofiles/detail/:id" element={<ComplianceProfileDetail />} />
               <Route path="/complianceprofiles/add" element={<ComplianceProfileEdit />} />

               <Route path="/acmeprofiles" element={<AcmeProfilesList />} />
               <Route path="/acmeprofiles/list" element={<Navigate to="/acmeprofiles" />} />
               <Route path="/acmeprofiles/detail/:id" element={<AcmeProfileDetail />} />
               <Route path="/acmeprofiles/edit/:id" element={<AcmeProfileEdit />} />
               <Route path="/acmeprofiles/add" element={<AcmeProfileEdit />} />

               <Route path="/acmeaccounts" element={<AcmeAccountsList />} />
               <Route path="/acmeaccounts/list" element={<Navigate to="/acmeaccounts" />} />
               <Route path="/acmeaccounts/detail/:acmeProfileId/:id" element={<AcmeAccountDetail />} />

               <Route path="/groups" element={<GroupList />} />
               <Route path="/groups/list" element={<Navigate to="/groups" />} />
               <Route path="/groups/detail/:id" element={<GroupDetail />} />
               <Route path="/groups/add" element={<GroupEdit />} />
               <Route path="/groups/edit/:id" element={<GroupEdit />} />

               <Route path="/credentials" element={<CredentialsList />} />
               <Route path="/credentials/list" element={<Navigate to="/credentials" />} />
               <Route path="/credentials/detail/:id" element={<CredentialDetail />} />
               <Route path="/credentials/add" element={<CredentialEdit />} />
               <Route path="/credentials/edit/:id" element={<CredentialEdit />} />

               <Route path="/entities" element={<EntitiesList />} />
               <Route path="/entities/list" element={<Navigate to="/entities" />} />
               <Route path="/entities/detail/:id" element={<EntityDetail />} />
               <Route path="/entities/add" element={<EntityEdit />} />
               <Route path="/entities/edit/:id" element={<EntityEdit />} />

               <Route path="/locations" element={<LocationsList />} />
               <Route path="/locations/list" element={<Navigate to="/locations" />} />
               <Route path="/locations/detail/:entityId/:id" element={<LocationDetail />} />
               <Route path="/locations/add" element={<LocationEdit />} />
               <Route path="/locations/edit/:entityId/:id" element={<LocationEdit />} />

               <Route path="/userprofile" element={<UserProfileDetail />} />
               <Route path="/userprofile/edit" element={<UserProfileEdit />} />

               <Route path="/audit" element={<AuditLogs />} />

               <Route path="/customattributes" element={<CustomAttributesList />} />
               <Route path="/customattributes/list" element={<Navigate to="/customattributes" />} />
               <Route path="/customattributes/detail/:id" element={<CustomAttributesDetail />} />
               <Route path="/customattributes/add" element={<CustomAttributesEdit />} />
               <Route path="/customattributes/edit/:id" element={<CustomAttributesEdit />} />

               <Route path="/globalmetadata" element={<GlobalMetadataList />} />
               <Route path="/globalmetadata/list" element={<Navigate to="/globalmetadata" />} />
               <Route path="/globalmetadata/detail/:id" element={<GlobalMetadataDetail />} />
               <Route path="/globalmetadata/add" element={<GlobalMetadataEdit />} />
               <Route path="/globalmetadata/edit/:id" element={<GlobalMetadataEdit />} />

               <Route path="/tokens" element={<TokenList />} />
               <Route path="/tokens/list" element={<Navigate to="/tokens" />} />
               <Route path="/tokens/detail/:id" element={<TokenDetail />} />
               <Route path="/tokens/add" element={<TokenEdit />} />
               <Route path="/tokens/edit/:id" element={<TokenEdit />} />

               <Route path="/tokenprofiles" element={<TokenProfileList />} />
               <Route path="/tokenprofiles/list" element={<Navigate to="/tokenprofiles" />} />
               <Route path="/tokenprofiles/detail/:tokenId/:id" element={<TokenProfileDetail />} />
               <Route path="/tokenprofiles/add" element={<TokenProfileForm />} />
               <Route path="/tokenprofiles/edit/:tokenId/:id" element={<TokenProfileForm />} />

               <Route path="/cryptographickeys" element={<CryptographicKeyList />} />
               <Route path="/cryptographickeys/list" element={<Navigate to="/cryptographickeys" />} />
               <Route path="/cryptographickeys/detail/:tokenId/:id" element={<CryptographicKeyDetail />} />
               <Route path="/cryptographickeys/add" element={<CryptographicKeyForm />} />
               <Route path="/cryptographickeys/edit/:tokenId/:id" element={<CryptographicKeyForm />} />

               <Route path="/platform" element={<PlatformSettingsDetail />} />
               <Route path="/platform/edit" element={<PlatformSettingsEdit />} />

            </Route >

            {
               /*
               Please keep this remarked until migration is finished
               <Route path="*" element={<Navigate to="/home"/>}/>
               */
            }
            <Route path="*" element={<h1>404</h1>} />

         </>

      ),
      []

   )

   return (

      <HashRouter>

         <AppRedirect />

         <Routes>

            <Route path="/login" element={<AppLogin />} />

            {
               profile ? appRoutes : <Route path="*" element={<Spinner active={true} />} />
            }

         </Routes>

      </HashRouter >

   );

}
