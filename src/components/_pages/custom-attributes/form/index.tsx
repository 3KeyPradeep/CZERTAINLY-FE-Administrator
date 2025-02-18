import CheckboxField from "components/Input/CheckboxField";
import DynamicContent from "components/Input/DynamicContent";
import TextField from "components/Input/TextField";
import ProgressButton from "components/ProgressButton";
import Widget from "components/Widget";

import { actions, selectors } from "ducks/customAttributes";
import React, { useCallback, useEffect, useMemo } from "react";
import { Field, Form } from "react-final-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import { Button, ButtonGroup, Form as BootstrapForm, FormGroup, Label } from "reactstrap";
import { CustomAttributeCreateRequestModel, CustomAttributeUpdateRequestModel } from "types/customAttributes";
import { AttributeContentType } from "types/openapi";
import { validateAlphaNumeric, validateRequired } from "utils/validators";

export default function CustomAttributeForm() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {id} = useParams();
    const editMode = useMemo(() => !!id, [id]);

    const customAttributeDetail = useSelector(selectors.customAttribute);
    const resources = useSelector(selectors.resources);
    const isFetchingDetail = useSelector(selectors.isFetchingDetail);
    const isFetchingResources = useSelector(selectors.isFetchingResources);
    const isCreating = useSelector(selectors.isCreating);
    const isUpdating = useSelector(selectors.isUpdating);

    const isBusy = useMemo(
        () => isFetchingDetail || isCreating || isUpdating || isFetchingResources,
        [isCreating, isFetchingDetail, isUpdating, isFetchingResources],
    );

    type FormValues = Omit<CustomAttributeCreateRequestModel, "resources"> & { resources?: Array<{label: string, value: string}>};
    const defaultValuesCreate: FormValues = useMemo(
        () => ({
            name: "",
            label: "",
            description: "",
            contentType: AttributeContentType.Text,
            group: "",
            list: false,
            multiSelect: false,
            visible: true,
            required: false,
            readOnly: false,
            resources: [],
            content: undefined,
        }),
        [],
    );
    const defaultValuesUpdate: FormValues = useMemo(
        () => (customAttributeDetail ? {...customAttributeDetail, resources: customAttributeDetail.resources?.map(r => ({label: r, value: r}))} : defaultValuesCreate),
        [customAttributeDetail, defaultValuesCreate],
    );

    const onSubmitCreate = useCallback((values: CustomAttributeCreateRequestModel) => dispatch(actions.createCustomAttribute(values)), [dispatch]);
    const onSubmitUpdate = useCallback(
        (values: CustomAttributeUpdateRequestModel) => dispatch(actions.updateCustomAttribute({
            uuid: id!,
            customAttributeUpdateRequest: values,
        })),
        [dispatch, id],
    );

    useEffect(() => {
        dispatch(actions.listResources());
        if (editMode && id !== customAttributeDetail?.uuid) {
            dispatch(actions.getCustomAttribute(id!));
        }
    }, [dispatch, editMode, id, customAttributeDetail?.uuid]);

    return (
        <Widget title={editMode ? "Edit Custom Attribute" : "Add Custom Attribute"} busy={isBusy}>
            <Form<FormValues> initialValues={editMode ? defaultValuesUpdate : defaultValuesCreate}
                  onSubmit={(values) => {
                      const valuesToSubmit = {...values, resources: values.resources?.map((r: any) => r.value)};
                      if (editMode) {
                          onSubmitUpdate(valuesToSubmit)
                      } else {
                          onSubmitCreate(valuesToSubmit)
                      }
                  }}>
                {({handleSubmit, pristine, submitting, valid, values, form}) => (
                    <BootstrapForm onSubmit={handleSubmit}>

                        <TextField label={"Name"} id={"name"} disabled={editMode} validators={[validateRequired(), validateAlphaNumeric()]}/>
                        <TextField label={"Label"} id={"label"} validators={[validateRequired(), validateAlphaNumeric()]}/>
                        <TextField label={"Description"} id={"description"} validators={[validateAlphaNumeric()]}/>
                        <TextField label={"Group"} id={"group"} validators={[validateAlphaNumeric()]}/>

                        <Field name="resources" type={"text"}>
                            {({input}) => (
                                <FormGroup>
                                    <Label for="resources">Resources</Label>
                                    <Select
                                        {...input}
                                        id="resources"
                                        placeholder="Resources"
                                        options={resources.map(r => ({label: r, value: r}))}
                                        isMulti={true}
                                        isClearable={true}/>
                                </FormGroup>
                            )}
                        </Field>

                        <CheckboxField label={"Visible"} id={"visible"}/>
                        <CheckboxField label={"Required"} id={"required"}/>
                        <CheckboxField label={"Read Only"} id={"readOnly"}/>
                        <CheckboxField label={"List"} id={"list"} onChange={(value) => !value ? form.change("multiSelect", false) : false}/>
                        <CheckboxField label={"Multi Select"} id={"multiSelect"} disabled={!values["list"]}/>

                        <DynamicContent editable={!editMode} isList={!!values["list"]}/>

                        <div className="d-flex justify-content-end">
                            <ButtonGroup>
                                <ProgressButton
                                    title={editMode ? "Update" : "Create"}
                                    inProgressTitle={editMode ? "Updating..." : "Creating..."}
                                    inProgress={submitting}
                                    disabled={pristine || submitting || !valid}
                                />
                                <Button color="default" onClick={() => navigate(-1)} disabled={submitting}>
                                    Cancel
                                </Button>
                            </ButtonGroup>
                        </div>

                    </BootstrapForm>
                )}
            </Form>
        </Widget>
    );
}