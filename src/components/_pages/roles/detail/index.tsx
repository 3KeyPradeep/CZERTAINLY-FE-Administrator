import CustomTable, { TableDataRow, TableHeader } from "components/CustomTable";
import Dialog from "components/Dialog";

import Widget from "components/Widget";
import WidgetButtons, { WidgetButtonProps } from "components/WidgetButtons";

import { actions, selectors } from "ducks/roles";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Badge, Container } from "reactstrap";
import { Resource } from "../../../../types/openapi";
import CustomAttributeWidget from "../../../Attributes/CustomAttributeWidget";

export default function UserDetail() {

   const dispatch = useDispatch();
   const navigate = useNavigate();

   const { id } = useParams();

   const role = useSelector(selectors.role);
   const permissions = useSelector(selectors.permissions);

   const isFetchingDetail = useSelector(selectors.isFetchingDetail);
   const isFetchingPermissions = useSelector(selectors.isFetchingPermissions);

   const [confirmDelete, setConfirmDelete] = useState<boolean>(false);


   useEffect(
      () => {
         dispatch(actions.resetState());
      },
      [dispatch]
   );

   useEffect(

      () => {

         if (!id) return;
         dispatch(actions.getDetail({ uuid: id }));

      },
      [dispatch, id]

   );

   useEffect(

      () => {

         if (!role || role.uuid !== id || permissions?.uuid === id || isFetchingPermissions) return;
         dispatch(actions.getPermissions({ uuid: id }));

      },
      [role, dispatch, permissions?.uuid, isFetchingPermissions, id]

   );


   const onEditClick = useCallback(

      () => {

         navigate(`../../roles/edit/${role?.uuid}`);

      },
      [role, navigate]

   );


   const onEditRoleUsersClick = useCallback(

      () => {
         navigate(`../../roles/users/${role?.uuid}`);
      },
      [navigate, role?.uuid]

   );


   const onEditRolePermissionsClick = useCallback(

      () => {
         navigate(`../../roles/permissions/${role?.uuid}`);
      },
      [navigate, role?.uuid]

   );


   const onDeleteConfirmed = useCallback(

      () => {

         if (!role) return;

         dispatch(actions.delete({ uuid: role.uuid, redirect: `../../` }));
         setConfirmDelete(false);

      },
      [role, dispatch]

   );


   const buttons: WidgetButtonProps[] = useMemo(

      () => [
         { icon: "pencil", disabled: role?.systemRole || false, tooltip: "Edit", onClick: () => { onEditClick(); } },
         { icon: "trash", disabled: role?.systemRole || false, tooltip: "Delete", onClick: () => { setConfirmDelete(true); } },
         { icon: "user", disabled: role?.systemRole || false, tooltip: "Edit role users", onClick: () => { onEditRoleUsersClick() } },
         { icon: "lock", disabled: role?.systemRole || false, tooltip: "Edit role permissions", onClick: () => { onEditRolePermissionsClick() } }
      ],
      [role?.systemRole, onEditClick, onEditRoleUsersClick, onEditRolePermissionsClick]

   );


   const attributesTitle = useMemo(

      () => (

         <div>

            <div className="fa-pull-right mt-n-xs">
               <WidgetButtons buttons={buttons} />
            </div>

            <h5>
               Role <span className="fw-semi-bold">Details</span>
            </h5>

         </div>

      ), [buttons]

   );


   const usersTitle = useMemo(

      () => (

         <h5>
            Assigned <span className="fw-semi-bold">Users</span>
         </h5>

      ),
      []

   );


   const permissionsTitle = useMemo(

      () => (

         <h5>
            Role <span className="fw-semi-bold">Permissions</span>
         </h5>

      ),
      []

   );


   const detailHeaders: TableHeader[] = useMemo(

      () => [
         {
            id: "property",
            content: "Property",
         },
         {
            id: "value",
            content: "Value",
         },
      ],
      []

   );


   const detailData: TableDataRow[] = useMemo(

      () => !role ? [] : [
         {
            id: "roleName",
            columns: ["Name", role.name]
         },
         {
            id: "description",
            columns: ["Description", role.description || ""]
         },
         {
            id: "systemRole",
            columns: ["System role ", <Badge color={!role.systemRole ? "success" : "danger"}>{role.systemRole ? "Yes" : "No"}</Badge>]
         }
      ],
      [role]

   );


   const usersHeaders: TableHeader[] = useMemo(

      () => [
         {
            id: "username",
            content: "Username",
         },
         {
            id: "descrtiption",
            content: "Description",
         },
         {
            id: "firstName",
            content: "First name",
         },
         {
            id: "lastName",
            content: "Last name",
         },
         {
            id: "email",
            content: "Email",
         }
      ],
      []

   );


   const usersData: TableDataRow[] = useMemo(

      () => !role ? [] : role.users.map(

         user => ({
            id: user.uuid,
            columns: [
               <span style={{whiteSpace: "nowrap"}}>{user.username || ""}</span>,
               <span style={{whiteSpace: "nowrap"}}>{user.description || ""}</span>,
               <span style={{whiteSpace: "nowrap"}}>{user.firstName || ""}</span>,
               <span style={{whiteSpace: "nowrap"}}>{user.lastName || ""}</span>,
               <span style={{whiteSpace: "nowrap"}}>{user.email || ""}</span>,
            ]
         })

      ),
      [role]

   );


   const permsHeaders: TableHeader[] = useMemo(

      () => [
         {
            id: "resourceName",
            content: "Resource",
            width: "auto"
         },
         {
            id: "allActionsAllowed",
            content: "All Actions",
            width: "1%",
            align: "center"
         },
         {
            id: "actions",
            content: "Allowed Actions",
            width: "5%"
         },
         {
            id: "denyActions",
            content: "Denied Actions",
            width: "5%"
         },
         {
            id: "noAllowedObjects",
            content: "No. Objects",
            width: "1%",
            align: "center"
         }

      ],

      []

   );


   const permsData: TableDataRow[] = useMemo(

      () => !permissions ? [] : permissions.permissions.resources.map(
         resource => ({
            id: resource.name,
            columns: [
               resource.name,
               <Badge color={!resource.allowAllActions ? "danger" : "success"}>{resource.allowAllActions ? "Yes" : "No"}</Badge>,
               <span style={{whiteSpace: "nowrap"}}>{resource.actions.join(", ")}</span>,
               <></>,
               resource.objects?.length.toString() || "0"
            ],
            detailColumns: !resource.objects || resource.objects.length === 0 ? undefined : [
               <></>,
               resource.objects.map(object => <div key={object.name}>{object.name}</div>),
               <></>,
               resource.objects.map(object => <div key={object.uuid}>{object.allow.join(",") || <span>&nbsp;</span>}</div>),
               resource.objects.map(object => <div key={object.uuid}>{object.deny.join(",") || <span>&nbsp;</span>}</div>),
               <></>
            ]
         })
      ),
      [permissions]

   );

   return (

      <Container className="themed-container" fluid>

         <Widget title={attributesTitle} busy={isFetchingDetail}>

            <br />
            <CustomTable
               headers={detailHeaders}
               data={detailData}
            />

         </Widget>


         <Widget title={usersTitle} busy={isFetchingDetail}>

            <br />
            <CustomTable
               headers={usersHeaders}
               data={usersData}
            />

         </Widget>


          {role && <CustomAttributeWidget resource={Resource.Roles} resourceUuid={role.uuid} attributes={role.customAttributes} />}


          <Widget title={permissionsTitle} busy={isFetchingDetail || isFetchingPermissions}>

            <br />
            {

               !permissions ? <></> : (

                  <>
                     <p><input type="checkbox" checked={permissions.permissions.allowAllResources} disabled />&nbsp;&nbsp;&nbsp;All resources allowed</p>

                     {
                        permissions.permissions.resources.length === 0 ? <></> : (

                           <>
                              <p>List of allowed resources</p>
                              <CustomTable
                                 headers={permsHeaders}
                                 data={permsData}
                                 hasDetails={true}
                              />
                           </>
                        )
                     }

                  </>

               )

            }


         </Widget>


         <Dialog
            isOpen={confirmDelete}
            caption="Delete Role"
            body="You are about to delete an Role. Is this what you want to do?"
            toggle={() => setConfirmDelete(false)}
            buttons={[
               { color: "danger", onClick: onDeleteConfirmed, body: "Yes, delete" },
               { color: "secondary", onClick: () => setConfirmDelete(false), body: "Cancel" },
            ]}
         />

      </Container>
   );


}

