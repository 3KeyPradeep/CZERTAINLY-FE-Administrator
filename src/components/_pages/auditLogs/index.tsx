import CustomTable, { TableDataRow, TableHeader } from "components/CustomTable";
import Widget from "components/Widget";

import { actions as auditLogActions, selectors } from "ducks/auditLogs";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { Button, ButtonGroup, Container } from "reactstrap";
import { AuditLogFilterModel } from "types/auditLogs";
import { dateFormatter } from "utils/dateUtil";

import styles from "./auditLogs.module.scss";

import AuditLogsFilters from "./AuditLogsFilters";
import ObjectValues from "./ObjectValues";

const defaultPageSize = 10;

function AuditLogs() {

   const dispatch = useDispatch();

   const totalPages = useSelector(selectors.totalPagesAvailable);
   const loadedPageSize = useSelector(selectors.loadedPageSize);
   const isFetchingPageData = useSelector(selectors.isFetchingPageData);
   const isFetchingObjects = useSelector(selectors.isFetchingObjects);
   const isFetchingOperations = useSelector(selectors.isFetchingOperations);
   const isFetchingStatuses = useSelector(selectors.isFetchingStatuses);
   const isPurging = useSelector(selectors.isPurging);
   const exportUrl = useSelector(selectors.exportUrl);
   const isExporting = useSelector(selectors.isExporting);
   const logs = useSelector(selectors.pageData);
   const objects = useSelector(selectors.objects);
   const operations = useSelector(selectors.operations);
   const states = useSelector(selectors.statuses);

   const isBusy = isFetchingPageData || isFetchingObjects || isFetchingOperations || isFetchingStatuses || isPurging || isExporting;
   const isFilterBusy = isFetchingObjects || isFetchingOperations || isFetchingStatuses;

   const [page, setPage] = useState(1);
   const [pageSize, setPageSize] = useState(defaultPageSize);

   const [filters, setFilters] = useState<AuditLogFilterModel>({});


   useEffect(

      () => {

         dispatch(auditLogActions.listObjects());
         dispatch(auditLogActions.listOperations());
         dispatch(auditLogActions.listStatuses());

      },
      [dispatch]

   );


   useEffect(

      () => {

         dispatch(auditLogActions.listLogs({ page: page - 1, size: pageSize, filters }));

      },
      [page, pageSize, filters, dispatch]

   );

   useEffect(() => {
       const link = document.getElementById("exportLink");
       if (link && exportUrl) {
           link.click();
       }
   }, [exportUrl])


   const onFiltersChanged = useCallback(

      (filters: AuditLogFilterModel) => {

         const filterValues = Object.entries(filters).reduce(
            (acc, [key, value]) =>
               value ? { ...acc, [key]: value.toString() } : acc, {}
         );

         setFilters(filterValues);
         setPage(1);

      },
      [setFilters]

   );


   const onClearFilters = useCallback(

      () => {

         setFilters({});
         setPage(1);

      },
      [setFilters]

   );


    const purgeCallback = useCallback(
        () => dispatch(auditLogActions.purgeLogs({ page: page - 1, size: pageSize, filters })),
        [dispatch, page, pageSize, filters]
    );

    const exportCallback = useCallback(
        () => dispatch(auditLogActions.exportLogs({ page: page - 1, size: pageSize, filters })),
        [dispatch, page, pageSize, filters]
    );

    const auditLogsTitle = useMemo(

      () => (

         <div className="d-flex justify-content-between align-items-center">

            <h5>
               <span className="fw-semi-bold">Audit Logs</span>
            </h5>

             <div>
                 <ButtonGroup>
                    <Button color={"default"} onClick={exportCallback}>Export</Button>
                     <a id={"exportLink"} href={exportUrl} download="auditLogs.zip" hidden={true}/>
                    <Button type="submit" color="primary" onClick={purgeCallback}>Purge</Button>
                 </ButtonGroup>
             </div>

         </div>
      ),
      [purgeCallback, exportCallback, exportUrl]

   );

    const auditLogsRowHeaders: TableHeader[] = useMemo(
        () => [
            {
                content: "Id",
                // sortable: true,
                // sortType: "numeric",
                align: "left",
                id: "id",
                width: "5%"
            },
            {
                content: "Author",
                // sortable: true,
                align: "left",
                id: "author",
                width: "10%"
            },
            {
                content: "Created",
                // sortable: true,
                // sortType: "date",
                id: "created",
                width: "10%"
            },
            {
                content: "Operation Status",
                id: "",
                width: "10%"
            },
            {
                content: "Origination",
                id: "",
                width: "5%"
            },
            {
                content: "Affected Data",
                id: "",
                width: "5%"
            },
            {
                content: "Object Identifier",
                id: "",
                width: "10%"
            },
            {
                content: "Operation",
                id: "",
                width: "10%"
            },
            {
                content: "Additional Data",
                id: "",
                width: "10%"
            },
        ],
        []

    );

    const auditLogsList: TableDataRow[] = useMemo(

        () => logs.map(

            log => {

                return {

                    id: log.id,

                    columns: [

                        ""+log.id,
                        log.author,
                        <span style={{whiteSpace: "nowrap"}}>{dateFormatter(log.created)}</span>,
                        log.operationStatus,
                        log.origination,
                        log.affected,
                        log.objectIdentifier,
                        log.operation,
                        log.additionalData ? <span className={styles.showMore}>Show more...</span> : "None",
                    ],

                    detailColumns: !log.additionalData ? undefined : [<></>, <ObjectValues obj={log.additionalData} />]

                }

            }

        ),
        [logs]

    );

    const paginationData = useMemo(

        () => ({
            page,
            totalItems: page === totalPages ? (totalPages - 1) * pageSize + loadedPageSize : totalPages * pageSize,
            pageSize,
            loadedPageSize,
            totalPages,
            itemsPerPageOptions: [10, 20, 50, 100],
        }),
        [page, totalPages, pageSize, loadedPageSize]

    );

    const onPageSizeChanged = useCallback(

        (pageSize: number) => {
            setPageSize(pageSize);
            setPage(1);
        },
        [setPageSize, setPage]

    );


    return (

      <Container className="themed-container" fluid>

         <Widget title="Filter Audit Logs" busy={isFilterBusy}>

            <AuditLogsFilters
               operations={operations}
               operationStates={states}
               objects={objects}
               onClear={onClearFilters}
               onFilters={onFiltersChanged}
            />

         </Widget>


         <Widget title={auditLogsTitle} busy={isBusy}>

             <CustomTable
                 headers={auditLogsRowHeaders}
                 data={auditLogsList}
                 hasPagination={true}
                 hasDetails={true}
                 canSearch={false}
                 paginationData={paginationData}
                 onPageChanged={setPage}
                 onPageSizeChanged={onPageSizeChanged}
             />

         </Widget>

      </Container>

   );

}

export default AuditLogs;
