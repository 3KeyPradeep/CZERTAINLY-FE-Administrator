import { iif, of } from "rxjs";
import { catchError, filter, map, mergeMap, switchMap } from "rxjs/operators";

import { AppEpic } from "ducks";
import { extractError } from "utils/net";

import * as slice from "./roles";
import { actions as appRedirectActions } from "./app-redirect";

import {
    transformRoleDetailDtoToModel,
    transformRoleRequestModelToDto,
    transformSubjectPermissionsDtoToModel,
} from "./transform/roles";
import { transformUserResponseDtoToModel } from "./transform/users";
import { transformRoleResponseDtoToModel } from "./transform/auth";


const list: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.list.match
      ),
      switchMap(

         () => deps.apiClients.roles.listRoles().pipe(

            map(
               list => slice.actions.listSuccess({ roles: list.map(role => transformRoleResponseDtoToModel(role)) })
            ),

            catchError(
               err => of(
                  slice.actions.listFailure({ error: extractError(err, "Failed to get roles list") }),
                  appRedirectActions.fetchError({ error: err, message: "Failed to get roles list" })
               )
            )

         )

      )

   )

}


const getDetail: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.getDetail.match
      ),
      switchMap(

         action => deps.apiClients.roles.getRole({ roleUuid: action.payload.uuid }).pipe(

            map(
               role => slice.actions.getDetailSuccess({ role: transformRoleDetailDtoToModel(role) })
            ),

            catchError(
               err => of(
                  slice.actions.getDetailFailure({ error: extractError(err, "Failed to get role detail") }),
                  appRedirectActions.fetchError({ error: err, message: "Failed to get role detail" })
               )
            )

         )

      )

   )

}


const create: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.create.match
      ),
      switchMap(

         action => deps.apiClients.roles.createRole({ roleRequestDto: transformRoleRequestModelToDto(action.payload) }).pipe(

            mergeMap(
               role => of(
                  slice.actions.createSuccess({ role: transformRoleDetailDtoToModel(role) }),
                  appRedirectActions.redirect({ url: `../detail/${role.uuid}` }),

               )
            ),

            catchError(
               err => of(
                  slice.actions.createFailure({ error: extractError(err, "Failed to create role") }),
                  appRedirectActions.fetchError({ error: err, message: "Failed to create role" })
               )
            )

         )

      )

   )

}


const update: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.update.match
      ),
      switchMap(

         action => deps.apiClients.roles.updateRole({ roleUuid: action.payload.uuid, roleRequestDto: action.payload.roleRequest }
         ).pipe(

            mergeMap(
               role => of(
                  slice.actions.updateSuccess({ role: transformRoleDetailDtoToModel(role) }),
                  appRedirectActions.redirect({ url: `../../detail/${role.uuid}` }),
               )
            ),

            catchError(
               err => of(
                  slice.actions.updateFailure({ error: extractError(err, "Failed to update role") }),
                  appRedirectActions.fetchError({ error: err, message: "Failed to update role" })
               )
            )

         )

      )

   )

}


const deleteRole: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.delete.match
      ),
      mergeMap(

         action => deps.apiClients.roles.deleteRole({ roleUuid: action.payload.uuid }).pipe(

            mergeMap(
               () => iif(
                  () => !!action.payload.redirect,
                  of(
                     slice.actions.deleteSuccess({ uuid: action.payload.uuid, redirect: action.payload.redirect }),
                     appRedirectActions.redirect({ url: action.payload.redirect! }),
                  ),
                  of(
                     slice.actions.deleteSuccess({ uuid: action.payload.uuid, redirect: action.payload.redirect }),
                  )
               )

            ),

            catchError(
               err => of(
                  slice.actions.deleteFailure({ error: extractError(err, "Failed to delete role") }),
                  appRedirectActions.fetchError({ error: err, message: "Failed to delete role" })
               )
            )

         )

      )

   )

}


const getUsers: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.getUsers.match
      ),
      switchMap(

         action => deps.apiClients.roles.getRoleUsers({ roleUuid: action.payload.uuid }).pipe(

            map(
               users => slice.actions.getUsersSuccess({
                  uuid: action.payload.uuid,
                  users: users.map(transformUserResponseDtoToModel)
               })
            ),

            catchError(
               err => of(
                  slice.actions.getUsersFailure({ error: extractError(err, "Failed to get role users") }),
                  appRedirectActions.fetchError({ error: err, message: "Failed to get role users" })
               )
            )

         )

      )

   )

}


const updateUsers: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.updateUsers.match
      ),
      switchMap(

         action => deps.apiClients.roles.updateUsers({ roleUuid: action.payload.uuid, requestBody: action.payload.users }).pipe(

            mergeMap(
               role => of(
                  slice.actions.updateUsersSuccess({ role: transformRoleDetailDtoToModel(role) }),
                  appRedirectActions.goBack()
               )
            ),

            catchError(
               err => of(
                  slice.actions.updateUsersFailure({ error: extractError(err, "Failed to update role users") }),
                  appRedirectActions.fetchError({ error: err, message: "Failed to update role users" })
               )
            )

         )

      )

   )

}


const getPermissions: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.getPermissions.match
      ),
      switchMap(

         action => deps.apiClients.roles.getRolePermissions({ roleUuid: action.payload.uuid }).pipe(

            map(
               permissions => slice.actions.getPermissionsSuccess({
                  uuid: action.payload.uuid,
                  permissions: transformSubjectPermissionsDtoToModel(permissions)
               })
            ),

            catchError(
               err => of(
                  slice.actions.getPermissionsFailure({ error: extractError(err, "Failed to get role permissions") }),
                  appRedirectActions.fetchError({ error: err, message: "Failed to get role permissions" })
               )
            )

         )

      )

   )

}


const updatePermissions: AppEpic = (action$, state, deps) => {

   return action$.pipe(

      filter(
         slice.actions.updatePermissions.match
      ),
      switchMap(

         action => deps.apiClients.roles.savePermissions({ roleUuid: action.payload.uuid, rolePermissionsRequestDto: action.payload.permissions }
         ).pipe(

            mergeMap(
               permissions => of(
                  slice.actions.updatePermissionsSuccess({
                     uuid: action.payload.uuid,
                     permissions: transformSubjectPermissionsDtoToModel(permissions)
                  }),
                  appRedirectActions.goBack()
               )
            ),

            catchError(
               err => of(
                  slice.actions.updatePermissionsFailure({ error: extractError(err, "Failed to update role permissions") }),
                  appRedirectActions.fetchError({ error: err, message: "Failed to update role permissions" })
               )
            )

         )

      )

   )

}


const epics = [
   list,
   getDetail,
   create,
   update,
   deleteRole,
   getUsers,
   getPermissions,
   updateUsers,
   updatePermissions,
];


export default epics;
