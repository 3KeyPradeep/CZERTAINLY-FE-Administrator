import CustomTable, { TableDataRow, TableHeader } from "components/CustomTable";
import Dialog from "components/Dialog";
import StatusBadge from "components/StatusBadge";
import Widget from "components/Widget";
import WidgetButtons, { WidgetButtonProps } from "components/WidgetButtons";

import { actions, selectors } from "ducks/customAttributes";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { Container } from "reactstrap";

export default function CustomAttributesList() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const checkedRows = useSelector(selectors.checkedRows);
    const customAttributes = useSelector(selectors.customAttributes);
    const isFetching = useSelector(selectors.isFetchingList);
    const isDeleting = useSelector(selectors.isDeleting);
    const isBulkDeleting = useSelector(selectors.isBulkDeleting);
    const isBulkEnabling = useSelector(selectors.isBulkEnabling);
    const isBulkDisabling = useSelector(selectors.isBulkDisabling);
    const isUpdating = useSelector(selectors.isUpdating);
    const isBusy = isFetching || isDeleting || isUpdating || isBulkDeleting || isBulkEnabling || isBulkDisabling;

    const [confirmDelete, setConfirmDelete] = useState<boolean>(false);

    useEffect(
        () => {
            dispatch(actions.setCheckedRows({checkedRows: []}));
            dispatch(actions.listCustomAttributes());
        },
        [dispatch],
    );

    const onAddClick = useCallback(
        () => {
            navigate(`./add`);
        },
        [navigate],
    );

    const onDeleteConfirmed = useCallback(
        () => {
            dispatch(actions.bulkDeleteCustomAttributes(checkedRows));
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
        {icon: "plus", disabled: false, tooltip: "Create", onClick: onAddClick},
        {icon: "trash", disabled: checkedRows.length === 0, tooltip: "Delete", onClick: () => setConfirmDelete(true)},
        {icon: "check", disabled: checkedRows.length === 0, tooltip: "Enable", onClick: () => dispatch(actions.bulkEnableCustomAttributes(checkedRows))},
        {icon: "times", disabled: checkedRows.length === 0, tooltip: "Disable", onClick: () => dispatch(actions.bulkDisableCustomAttributes(checkedRows))},
    ], [checkedRows, onAddClick, dispatch]);

    const title = useMemo(
        () => (
            <div>
                <div className="fa-pull-right mt-n-xs">
                    <WidgetButtons buttons={buttons}/>
                </div>

                <h5 className="mt-0">
                    List of <span className="fw-semi-bold">Custom Attributes</span>
                </h5>
            </div>
        ),
        [buttons],
    );

    const customAttributesTableHeaders: TableHeader[] = useMemo(
        () => [
            {
                id: "name",
                content: "Name",
                sortable: true,
                sort: "asc",
                width: "20%",
            },
            {
                id: "status",
                content: "Status",
                sortable: true,
                width: "5%",
            },
            {
                id: "contentType",
                content: "Content Type",
                sortable: true,
                width: "15%",
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

    const customAttributesTableData: TableDataRow[] = useMemo(
        () => customAttributes.map(
            customAttribute => ({
                id: customAttribute.uuid,
                columns: [
                    <Link to={`./detail/${customAttribute.uuid}`}>{customAttribute.name}</Link>,
                    <StatusBadge enabled={customAttribute.enabled} />,
                    customAttribute.contentType,
                    customAttribute.description,
                ],
            }),
        ),
        [customAttributes],
    );

    return (
        <Container className="themed-container" fluid>
            <Widget title={title} busy={isBusy}>
                <br/>
                <CustomTable
                    headers={customAttributesTableHeaders}
                    data={customAttributesTableData}
                    onCheckedRowsChanged={setCheckedRows}
                    canSearch={true}
                    hasCheckboxes={true}
                    hasPagination={true}
                />
            </Widget>

            <Dialog
                isOpen={confirmDelete}
                caption={`Delete ${checkedRows.length > 1 ? "Custom Attributes" : "Custom Attribute"}`}
                body={`You are about to delete ${checkedRows.length > 1 ? "Custom Attributes" : "Custom Attribute"}. Is this what you want to do?`}
                toggle={() => setConfirmDelete(false)}
                buttons={[
                    {color: "danger", onClick: onDeleteConfirmed, body: "Yes, delete"},
                    {color: "secondary", onClick: () => setConfirmDelete(false), body: "Cancel"},
                ]}
            />
        </Container>
    );
}
