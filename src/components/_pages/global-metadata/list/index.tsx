import CustomTable, { TableDataRow, TableHeader } from "components/CustomTable";
import Dialog from "components/Dialog";
import Widget from "components/Widget";
import WidgetButtons, { WidgetButtonProps } from "components/WidgetButtons";

import { actions, selectors } from "ducks/globalMetadata";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Container } from "reactstrap";
import ConnectorMetadataDialog from "./ConnectorMetadataDialog";

export default function GlobalMetadataList() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const checkedRows = useSelector(selectors.checkedRows);
    const globalMetadata = useSelector(selectors.globalMetadataList);
    const isFetching = useSelector(selectors.isFetchingList);
    const isDeleting = useSelector(selectors.isDeleting);
    const isBulkDeleting = useSelector(selectors.isBulkDeleting);
    const isUpdating = useSelector(selectors.isUpdating);
    const isBusy = isFetching || isDeleting || isUpdating || isBulkDeleting;

    const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
    const [showPromote, setShowPromote] = useState<boolean>(false);

    useEffect(
        () => {
            dispatch(actions.setCheckedRows({checkedRows: []}));
            dispatch(actions.listGlobalMetadata());
        },
        [dispatch],
    );

    const onDeleteConfirmed = useCallback(
        () => {
            dispatch(actions.bulkDeleteGlobalMetadata(checkedRows));
            setConfirmDelete(false);
        },
        [checkedRows, dispatch],
    );

    const setCheckedRows = useCallback(
        (rows: (string | number)[]) => {
            dispatch(actions.setCheckedRows({checkedRows: rows as string[]}));
        },
        [dispatch],
    );

    const buttons: WidgetButtonProps[] = useMemo(() => [
        {icon: "plus", disabled: false, tooltip: "Create", onClick: () => navigate(`./add`)},
        {icon: "push", disabled: false, tooltip: "Promote", onClick: () => setShowPromote(true)},
        {icon: "trash", disabled: checkedRows.length === 0, tooltip: "Delete", onClick: () => setConfirmDelete(true)},
    ], [checkedRows, navigate]);

    const title = useMemo(
        () => (
            <div>
                <div className="fa-pull-right mt-n-xs">
                    <WidgetButtons buttons={buttons}/>
                </div>

                <h5 className="mt-0">
                    List of <span className="fw-semi-bold">Global Metadata</span>
                </h5>
            </div>
        ),
        [buttons],
    );

    const globalMetadataTableHeaders: TableHeader[] = useMemo(
        () => [
            {
                id: "name",
                content: "Name",
                sortable: true,
                sort: "asc",
                width: "20%",
            },
            {
                id: "contentType",
                content: "Content Type",
                sortable: true,
                width: "20%",
            },
            {
                id: "description",
                content: "Description",
                sortable: true,
                width: "40%",
            },
        ],
        [],
    );

    const globalMetadataTableData: TableDataRow[] = useMemo(
        () => globalMetadata.map(
            metadata => ({
                id: metadata.uuid,
                columns: [
                    <Link to={`./detail/${metadata.uuid}`}>{metadata.name}</Link>,
                    metadata.contentType,
                    metadata.description,
                ],
            }),
        ),
        [globalMetadata],
    );

    return (
        <Container className="themed-container" fluid>
            <Widget title={title} busy={isBusy}>
                <br/>
                <CustomTable
                    headers={globalMetadataTableHeaders}
                    data={globalMetadataTableData}
                    onCheckedRowsChanged={setCheckedRows}
                    canSearch={true}
                    hasCheckboxes={true}
                    hasPagination={true}
                />
            </Widget>

            <Dialog
                isOpen={confirmDelete}
                caption={`Delete Global Metadata`}
                body={`You are about to delete selected Global Metadata. Is this what you want to do?`}
                toggle={() => setConfirmDelete(false)}
                buttons={[
                    {color: "danger", onClick: onDeleteConfirmed, body: "Yes, delete"},
                    {color: "secondary", onClick: () => setConfirmDelete(false), body: "Cancel"},
                ]}
            />

            <ConnectorMetadataDialog show={showPromote} setShow={setShowPromote}/>

        </Container>
    );
}
