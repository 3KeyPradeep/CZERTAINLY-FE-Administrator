import {
   ACMEAccountManagementApi,
   ACMEProfileManagementApi,
   AuditLogApi,
   AuthenticationManagementApi,
   AuthorityManagementApi,
   CallbackApi,
   CertificateInventoryApi,
   CertificateKeyGroupApi,
   ClientOperationsV2Api,
   ComplianceProfileManagementApi,
   Configuration,
   ConnectorManagementApi,
   CredentialManagementApi,
   CryptographicKeyControllerApi,
   CryptographicOperationsControllerApi,
   CustomAttributesApi,
   DiscoveryManagementApi,
   EntityManagementApi,
   GlobalMetadataApi,
   LocationManagementApi,
   RAProfileManagementApi,
   RoleManagementApi,
   SettingsApi,
   StatisticsDashboardApi,
   TokenProfileManagementApi,
   UserManagementApi
} from "types/openapi";
import { TokenInstanceControllerApi } from "types/openapi/apis/TokenInstanceControllerApi";
import { ActuatorApi, CertificateUtilsAPIApi, CertificationRequestUtilsAPIApi, Configuration as ConfigurationUtils } from "types/openapi/utils";
import { OIDUtilsAPIApi } from "./types/openapi/utils";

const configuration = new Configuration({ basePath: ((window as any).__ENV__.API_URL) });

export interface ApiClients {
   auth: AuthenticationManagementApi;
   users: UserManagementApi;
   roles: RoleManagementApi;
   auditLogs: AuditLogApi;
   raProfiles: RAProfileManagementApi;
   credentials: CredentialManagementApi;
   connectors: ConnectorManagementApi;
   callback: CallbackApi;
   statisticsDashboard: StatisticsDashboardApi;
   authorities: AuthorityManagementApi;
   entities: EntityManagementApi;
   locations: LocationManagementApi;
   certificates: CertificateInventoryApi;
   acmeAccounts: ACMEAccountManagementApi;
   acmeProfiles: ACMEProfileManagementApi;
   certificateGroups: CertificateKeyGroupApi;
   clientOperations: ClientOperationsV2Api;
   discoveries: DiscoveryManagementApi;
   complianceProfile: ComplianceProfileManagementApi;
   customAttributes: CustomAttributesApi;
   globalMetadata: GlobalMetadataApi;
   settings: SettingsApi;
   tokenInstances: TokenInstanceControllerApi;
   tokenProfiles: TokenProfileManagementApi;
   cryptographicKeys: CryptographicKeyControllerApi;
   cryptographicOperations: CryptographicOperationsControllerApi;
   utilsOid?: OIDUtilsAPIApi;
   utilsActuator?: ActuatorApi;
   utilsCertificate?: CertificateUtilsAPIApi;
   utilsCertificateRequest?: CertificationRequestUtilsAPIApi;
}


export const backendClient: ApiClients = {
   auth: new AuthenticationManagementApi(configuration),
   users: new UserManagementApi(configuration),
   roles: new RoleManagementApi(configuration),
   certificates: new CertificateInventoryApi(configuration),
   auditLogs: new AuditLogApi(configuration),
   raProfiles: new RAProfileManagementApi(configuration),
   credentials: new CredentialManagementApi(configuration),
   authorities: new AuthorityManagementApi(configuration),
   entities: new EntityManagementApi(configuration),
   locations: new LocationManagementApi(configuration),
   connectors: new ConnectorManagementApi(configuration),
   callback: new CallbackApi(configuration),
   statisticsDashboard: new StatisticsDashboardApi(configuration),
   acmeAccounts: new ACMEAccountManagementApi(configuration),
   acmeProfiles: new ACMEProfileManagementApi(configuration),
   certificateGroups: new CertificateKeyGroupApi(configuration),
   clientOperations: new ClientOperationsV2Api(configuration),
   discoveries: new DiscoveryManagementApi(configuration),
   complianceProfile: new ComplianceProfileManagementApi(configuration),
   customAttributes: new CustomAttributesApi(configuration),
   globalMetadata: new GlobalMetadataApi(configuration),
   settings: new SettingsApi(configuration),
   tokenInstances: new TokenInstanceControllerApi(configuration),
   tokenProfiles: new TokenProfileManagementApi(configuration),
   cryptographicKeys: new CryptographicKeyControllerApi(configuration),
   cryptographicOperations: new CryptographicOperationsControllerApi(configuration),
};

export const updateBackendUtilsClients = (url: string | undefined) => {
   if (url && url !== "") {
      const configuration = new ConfigurationUtils({basePath: url});
      backendClient.utilsCertificate = new CertificateUtilsAPIApi(configuration);
      backendClient.utilsOid = new OIDUtilsAPIApi(configuration);
      backendClient.utilsCertificateRequest = new CertificationRequestUtilsAPIApi(configuration);
      backendClient.utilsActuator = new ActuatorApi(configuration);
   } else {
      backendClient.utilsCertificate = undefined;
      backendClient.utilsOid = undefined;
      backendClient.utilsCertificateRequest = undefined;
      backendClient.utilsActuator = undefined;
   }
}