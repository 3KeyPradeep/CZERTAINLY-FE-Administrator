import { AppEpic } from "ducks";
import { of } from "rxjs";
import { catchError, filter, map, mergeMap, switchMap } from "rxjs/operators";
import { FunctionGroupCode } from "types/openapi";
import { extractError } from "utils/net";
import { actions as alertActions } from "./alerts";
import { actions as appRedirectActions } from "./app-redirect";

import { slice } from "./credentials";
import { transformAttributeDescriptorDtoToModel } from "./transform/attributes";
import { transformConnectorResponseDtoToModel } from "./transform/connectors";
import { transformCredentialCreateRequestModelToDto, transformCredentialEditRequestModelToDto, transformCredentialResponseDtoToModel } from "./transform/credentials";

const listCredentials: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.listCredentials.match
      ),
      switchMap(

         () => deps.apiClients.credentials.listCredentials().pipe(

            map(
               credentials => slice.actions.listCredentialsSuccess({
                  credentialList: credentials.map(transformCredentialResponseDtoToModel)
               })
            ),

            catchError(
               error => of(
                  slice.actions.listCredentialsFailure({ error: extractError(error, "Failed to get Credential list") }),
                  appRedirectActions.fetchError({ error, message: "Failed to get Credential list" })
               )
            )

         )

      )

   );

}


const getCredentialDetail: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.getCredentialDetail.match
      ),
      switchMap(

         action => deps.apiClients.credentials.getCredential({ uuid: action.payload.uuid }).pipe(

            map(
               credential => slice.actions.getCredentialDetailSuccess({
                  credential: transformCredentialResponseDtoToModel(credential)
               })
            ),

            catchError(
               error => of(
                  slice.actions.getCredentialDetailFailure({ error: extractError(error, "Failed to get Credential") }),
                  appRedirectActions.fetchError({ error, message: "Failed to get Credential" })
               )
            )

         )

      )

   );

}


const listCredentialProviders: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.listCredentialProviders.match
      ),
      switchMap(
         () => deps.apiClients.connectors.listConnectors({ functionGroup: FunctionGroupCode.CredentialProvider }).pipe(

            map(
               providers => slice.actions.listCredentialProvidersSuccess({
                  connectors: providers.map(transformConnectorResponseDtoToModel)
               })
            ),

            catchError(
               error => of(
                  slice.actions.listCredentialProvidersFailure({ error: extractError(error, "Failed to get Credential Provider list") }),
                  appRedirectActions.fetchError({ error, message: "Failed to get Credential Provider list" })
               )
            )
         )
      )
   );
}


const getCredentialProviderAttributeDescriptors: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.getCredentialProviderAttributesDescriptors.match
      ),
      switchMap(

         action => deps.apiClients.connectors.getAttributes({ uuid: action.payload.uuid, functionGroup: FunctionGroupCode.CredentialProvider, kind: action.payload.kind }
         ).pipe(

            map(
               attributeDescriptors => slice.actions.getCredentialProviderAttributesDescriptorsSuccess({
                  credentialProviderAttributesDescriptors: attributeDescriptors.map(transformAttributeDescriptorDtoToModel)
               })
            ),

            catchError(
               error => of(
                  slice.actions.getCredentialProviderAttributesDescriptorsFailure({ error: extractError(error, "Failed to get Credential Provider Attribute Descriptor list") }),
                  appRedirectActions.fetchError({ error, message: "Failed to get Credential Provider Attribute Descriptor list" })
               )
            )

         )

      )

   );
}


const createCredential: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.createCredential.match
      ),
      switchMap(

         action => deps.apiClients.credentials.createCredential({ credentialRequestDto: transformCredentialCreateRequestModelToDto(action.payload) }
         ).pipe(

            mergeMap(
               obj => of(
                  slice.actions.createCredentialSuccess({ uuid: obj.uuid }),
                  appRedirectActions.redirect({ url: `../detail/${obj.uuid}` })
               )
            ),

            catchError(
               error => of(
                  slice.actions.createCredentialFailure({ error: extractError(error, "Failed to create Credential") }),
                  appRedirectActions.fetchError({ error, message: "Failed to create Credential" })
               )
            )

         )

      )

   );

}


const deleteCredential: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.deleteCredential.match
      ),
      switchMap(

         action => deps.apiClients.credentials.deleteCredential({ uuid: action.payload.uuid }).pipe(

            mergeMap(
               () => of(
                  slice.actions.deleteCredentialSuccess({ uuid: action.payload.uuid }),
                  appRedirectActions.redirect({ url: "../../" })
               )
            ),

            catchError(
               error => of(
                  slice.actions.deleteCredentialFailure({ error: extractError(error, "Failed to delete Credential") }),
                  appRedirectActions.fetchError({ error, message: "Failed to delete Credential" })
               )
            )

         )

      )

   );

}


const updateCredential: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.updateCredential.match
      ),
      switchMap(

         action => deps.apiClients.credentials.editCredential({ uuid: action.payload.uuid, credentialUpdateRequestDto: transformCredentialEditRequestModelToDto(action.payload.credentialRequest) }
         ).pipe(

            mergeMap(

               credential => of(

                  slice.actions.updateCredentialSuccess({
                     credential: transformCredentialResponseDtoToModel(credential)
                  }),

                  appRedirectActions.redirect({ url: "../../detail/" + credential.uuid })
               )

            ),

            catchError(
               error => of(
                  slice.actions.updateCredentialFailure({ error: extractError(error, "Failed to update Credential") }),
                  appRedirectActions.fetchError({ error, message: "Failed to update Credential" })
               )
            )

         )

      )

   );

}


const bulkDeleteCredential: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.bulkDeleteCredentials.match
      ),
      switchMap(

         action => deps.apiClients.credentials.bulkDeleteCredential({ requestBody: action.payload.uuids }).pipe(

             mergeMap(
                 () => of(
                     slice.actions.bulkDeleteCredentialsSuccess({ uuids: action.payload.uuids }),
                     alertActions.success("Selected credentials successfully deleted.")
                 )
             ),

            catchError(
               error => of(
                  slice.actions.bulkDeleteCredentialsFailure({ error: extractError(error, "Failed to update Credential") }),
                  appRedirectActions.fetchError({ error, message: "Failed to update Credential" })
               )
            )

         )

      )

   );

}


const epics = [
   listCredentials,
   listCredentialProviders,
   getCredentialProviderAttributeDescriptors,
   getCredentialDetail,
   createCredential,
   deleteCredential,
   updateCredential,
   bulkDeleteCredential,
];

export default epics;
