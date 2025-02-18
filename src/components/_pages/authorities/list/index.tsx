import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Badge, Container, Table } from "reactstrap";

import { actions, selectors } from "ducks/authorities";

import Widget from "components/Widget";
import WidgetButtons, { WidgetButtonProps } from "components/WidgetButtons";
import CustomTable, { TableDataRow, TableHeader } from "components/CustomTable";
import Dialog from "components/Dialog";


function AuthorityList() {

   const dispatch = useDispatch();
   const navigate = useNavigate();

   const checkedRows = useSelector(selectors.checkedRows);
   const authorities = useSelector(selectors.authorities);

   const bulkDeleteErrorMessages = useSelector(selectors.bulkDeleteErrorMessages);

   const isFetching = useSelector(selectors.isFetchingList);
   const isDeleting = useSelector(selectors.isDeleting);
   const isUpdating = useSelector(selectors.isUpdating);
   const isBulkDeleting = useSelector(selectors.isBulkDeleting);
   const isBulkForceDeleting = useSelector(selectors.isBulkForceDeleting);

   const [confirmDelete, setConfirmDelete] = useState(false);
   const [confirmForceDelete, setConfirmForceDelete] = useState<boolean>(false);

   const isBusy = isFetching || isDeleting || isUpdating || isBulkDeleting || isBulkForceDeleting;


   useEffect(

      () => {
         dispatch(actions.setCheckedRows({ checkedRows: [] }));
         dispatch(actions.clearDeleteErrorMessages());
         dispatch(actions.listAuthorities());

      },
      [dispatch]

   );


   useEffect(

      () => {

         setConfirmForceDelete(bulkDeleteErrorMessages.length > 0);

      },
      [bulkDeleteErrorMessages]

   );


   const onAddClick = useCallback(

      () => {

         navigate("./add");

      },
      [navigate]

   );


   const setCheckedRows = useCallback(

      (rows: (string | number)[]) => {

         dispatch(actions.setCheckedRows({ checkedRows: rows as string[] }));

      },
      [dispatch]

   );


   const onDeleteConfirmed = useCallback(

      () => {

         setConfirmDelete(false);
         dispatch(actions.clearDeleteErrorMessages());
         dispatch(actions.bulkDeleteAuthority({ uuids: checkedRows }));

      },
      [dispatch, checkedRows]

   );


   const onForceDeleteConfirmed = useCallback(

      () => {

         dispatch(actions.clearDeleteErrorMessages());
         dispatch(actions.bulkForceDeleteAuthority({ uuids: checkedRows }));

      },
      [dispatch, checkedRows]

   );


   const buttons: WidgetButtonProps[] = useMemo(

      () => [
         { icon: "plus", disabled: false, tooltip: "Create", onClick: () => { onAddClick(); } },
         { icon: "trash", disabled: checkedRows.length === 0, tooltip: "Delete", onClick: () => { setConfirmDelete(true); } },
      ],
      [checkedRows, onAddClick]

   );


   const title = useMemo(

      () => (

         <div>

            <div className="fa-pull-right mt-n-xs">
               <WidgetButtons buttons={buttons} />
            </div>

            <h5 className="mt-0">
               <span className="fw-semi-bold">Authority Store</span>
            </h5>

         </div>

      ),
      [buttons]

   );


   const authoritiesRowHeaders: TableHeader[] = useMemo(

      () => [
         {
            content: "Name",
            sortable: true,
            sort: "asc",
            id: "authorityName",
            width: "auto",
         },
         {
            content: "Authority Provider",
            align: "center",
            sortable: true,
            id: "auhtorityProvider",
            width: "15%",
         },
         {
            content: "Kinds",
            align: "center",
            sortable: true,
            id: "kinds",
            width: "15%",
         }
      ],
      []

   );


   const authorityList: TableDataRow[] = useMemo(

      () => authorities.map(

         authority => ({

            id: authority.uuid,

            columns: [

               <Link to={`./detail/${authority.uuid}`}>{authority.name}</Link>,

               <Badge color="primary" >{authority.connectorName}</Badge>,

               <Badge color="primary" >{authority.kind}</Badge>,

            ]

         })

      ),
      [authorities]

   );



   const forceDeleteBody = useMemo(

      () => (

         <div>

            <div>Failed to delete {checkedRows.length > 1 ? "Authorities" : "an Authority"}. Please find the details below:</div>

            <Table className="table-hover" size="sm">

               <thead>

                  <tr>
                     <th>
                        <b>Name</b>
                     </th>
                     <th>
                        <b>Dependencies</b>
                     </th>
                  </tr>

               </thead>

               <tbody>

                  {bulkDeleteErrorMessages?.map(
                     message => (
                        <tr>
                           <td>{message.name}</td>
                           <td>{message.message}</td>
                        </tr>
                     )
                  )}

               </tbody>

            </Table >

         </div>

      ),
      [bulkDeleteErrorMessages, checkedRows.length]

   );


   return (

      <Container className="themed-container" fluid>

         <Widget title={title} busy={isBusy}>

            <br />

            <CustomTable
               headers={authoritiesRowHeaders}
               data={authorityList}
               onCheckedRowsChanged={setCheckedRows}
               hasCheckboxes={true}
               hasPagination={true}
               canSearch={true}
            />

         </Widget>


         <Dialog
            isOpen={confirmDelete}
            caption={`Delete ${checkedRows.length > 1 ? "Authorities" : "an Authority"}`}
            body={`You are about to delete ${checkedRows.length > 1 ? "Authorities" : "a Authority"}. Is this what you want to do?`}
            toggle={() => setConfirmDelete(false)}
            buttons={[
               { color: "danger", onClick: onDeleteConfirmed, body: "Yes, delete" },
               { color: "secondary", onClick: () => setConfirmDelete(false), body: "Cancel" },
            ]}
         />

         <Dialog
            isOpen={confirmForceDelete}
            caption={`Force Delete ${checkedRows.length > 1 ? "Authorities" : "an Authority"}`}
            body={forceDeleteBody}
            toggle={() => setConfirmForceDelete(false)}
            buttons={[
               { color: "danger", onClick: onForceDeleteConfirmed, body: "Force delete" },
               { color: "secondary", onClick: () => dispatch(actions.clearDeleteErrorMessages()), body: "Cancel" },
            ]}
         />

      </Container>

   );
}

export default AuthorityList;
