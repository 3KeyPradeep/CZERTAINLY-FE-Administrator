import AttributeEditor from "components/Attributes/AttributeEditor";
import ProgressButton from "components/ProgressButton";
import Widget from "components/Widget";
import { actions as connectorActions, actions as connectorsActions } from "ducks/connectors";

import { actions, selectors } from "ducks/credentials";
import { useCallback, useEffect, useMemo, useState } from "react";

import { Field, Form } from "react-final-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import Select from "react-select";
import { Button, ButtonGroup, Form as BootstrapForm, FormFeedback, FormGroup, Input, Label } from "reactstrap";
import { AttributeDescriptorModel } from "types/attributes";
import { ConnectorResponseModel } from "types/connectors";
import { CredentialResponseModel } from "types/credentials";
import { mutators } from "utils/attributes/attributeEditorMutators";

import { collectFormAttributes } from "utils/attributes/attributes";

import { composeValidators, validateAlphaNumeric, validateRequired } from "utils/validators";
import { actions as customAttributesActions, selectors as customAttributesSelectors } from "../../../../ducks/customAttributes";
import { FunctionGroupCode, Resource } from "../../../../types/openapi";
import TabLayout from "../../../Layout/TabLayout";

interface FormValues {
   name: string | undefined;
   credentialProvider: { value: string; label: string } | undefined;
   storeKind: { value: string; label: string } | undefined;
}


export default function CredentialForm() {

   const dispatch = useDispatch();
   const navigate = useNavigate();

   const { id } = useParams();

   const editMode = useMemo( () => !!id, [id] );

   const credentialSelector = useSelector(selectors.credential);
   const credentialProviders = useSelector(selectors.credentialProviders);
   const credentialProviderAttributeDescriptors = useSelector(selectors.credentialProviderAttributeDescriptors);
    const resourceCustomAttributes = useSelector(customAttributesSelectors.resourceCustomAttributes);
    const isFetchingResourceCustomAttributes = useSelector(customAttributesSelectors.isFetchingResourceCustomAttributes);

   const isFetchingCredentialDetail = useSelector(selectors.isFetchingDetail);
   const isFetchingCredentialProviders = useSelector(selectors.isFetchingCredentialProviders);
   const isFetchingAttributeDescriptors = useSelector(selectors.isFetchingCredentialProviderAttributeDescriptors);
   const isCreating = useSelector(selectors.isCreating);
   const isUpdating = useSelector(selectors.isUpdating);

   const [groupAttributesCallbackAttributes, setGroupAttributesCallbackAttributes] = useState<AttributeDescriptorModel[]>([]);

   const [credential, setCredential] = useState<CredentialResponseModel>();
   const [credentialProvider, setCredentialProvider] = useState<ConnectorResponseModel>();

   const isBusy = useMemo(
      () => isFetchingCredentialDetail || isFetchingCredentialProviders || isCreating || isUpdating || isFetchingAttributeDescriptors || isFetchingResourceCustomAttributes,
      [isFetchingCredentialDetail, isFetchingCredentialProviders, isCreating, isUpdating, isFetchingAttributeDescriptors, isFetchingResourceCustomAttributes]
   );

   useEffect(
      () => {
         dispatch(actions.listCredentialProviders());
         dispatch(connectorsActions.clearCallbackData());
         dispatch(customAttributesActions.listResourceCustomAttributes(Resource.Credentials));

         if (editMode) dispatch(actions.getCredentialDetail({ uuid: id! }));
      },
      [dispatch, editMode, id]
   );


   useEffect(
      () => {

         if (editMode && credentialSelector && credential?.uuid !== credentialSelector.uuid) {
            setCredential(credentialSelector);
         }

      },
      [editMode, credential, credentialSelector]
   );


   useEffect(

      () => {

         if (editMode && credentialProviders && credentialProviders.length > 0 && credential?.uuid === id) {

            const provider = credentialProviders.find(p => p.uuid === credential?.connectorUuid);
            if (!provider) return;

            setCredentialProvider(provider);

            dispatch(
               actions.getCredentialProviderAttributesDescriptors({
                  uuid: credential!.connectorUuid,
                  kind: credential!.kind
               })
            );

         }

      },
      [credential, credentialProviders, dispatch, editMode, id]

   );


   const onCredentialProviderChange = useCallback(

      (event: { label: string, value: string }) => {

         if (!event.value || !credentialProviders) return;
          dispatch(connectorActions.clearCallbackData());
          setGroupAttributesCallbackAttributes([]);
          const provider = credentialProviders.find(p => p.uuid === event.value);

         if (!provider) return;
         setCredentialProvider(provider);

      },
      [credentialProviders, dispatch]

   );


   const onKindChange = useCallback(

      (event: { label: string, value: string }) => {

         if (!event.value || !credentialProvider) return;
          dispatch(connectorActions.clearCallbackData());
          setGroupAttributesCallbackAttributes([]);
         dispatch(actions.getCredentialProviderAttributesDescriptors({ uuid: credentialProvider.uuid, kind: event.value }));

      },
      [dispatch, credentialProvider]

   );


   const onSubmit = useCallback(

      (values: FormValues, form: any) => {

         if (editMode) {

            dispatch(actions.updateCredential({
               uuid: id!,
                credentialRequest: {
                   attributes: collectFormAttributes("credential", [...(credentialProviderAttributeDescriptors ?? []), ...groupAttributesCallbackAttributes], values),
                   customAttributes: collectFormAttributes("customCredential", resourceCustomAttributes, values)
                }
            }));

         } else {

            dispatch(actions.createCredential({
               name: values.name!,
               connectorUuid: values.credentialProvider!.value,
               kind: values.storeKind?.value!,
               attributes: collectFormAttributes("credential", [...(credentialProviderAttributeDescriptors ?? []), ...groupAttributesCallbackAttributes], values),
               customAttributes: collectFormAttributes("customCredential", resourceCustomAttributes, values)
            }));

         }

      },
      [editMode, dispatch, id, credentialProviderAttributeDescriptors, groupAttributesCallbackAttributes, resourceCustomAttributes]
   );


   const onCancel = useCallback(

      () => {
         navigate(-1);
      },
      [navigate]

   )


   const submitTitle = useMemo(

      () => editMode ? "Save" : "Create",
      [editMode]
   )


   const inProgressTitle = useMemo(

      () => editMode ? "Saving..." : "Creating...",
      [editMode]

   )


   const optionsForCredentialProviders = useMemo(

      () => credentialProviders?.map(
         provider => ({
            label: provider.name,
            value: provider.uuid,
         })
      ),
      [credentialProviders]

   );


   const optionsForKinds = useMemo(

      () => credentialProvider?.functionGroups.find(
         fg => fg.functionGroupCode === FunctionGroupCode.CredentialProvider
      )?.kinds.map(
         kind => ({
            label: kind,
            value: kind
         })
      ) ?? [],
      [credentialProvider]

   );


   const defaultValues: FormValues = useMemo(

      () => ({
         name: editMode ? credential?.name || undefined : undefined,
         credentialProvider: editMode ? credential ? { value: credential.connectorUuid, label: credential.connectorName } : undefined : undefined,
         storeKind: editMode ? credential ? { value: credential?.kind, label: credential?.kind } : undefined : undefined,
      }),
      [editMode, credential]

   );


   const title = useMemo(

      () => editMode ? "Edit Credential" : "Create Credential",
      [editMode]

   );


   return (

      <Widget title={title} busy={isBusy}>

         <Form initialValues={defaultValues} onSubmit={onSubmit} mutators={{ ...mutators<FormValues>() }} >

            {({ handleSubmit, pristine, submitting, values, valid }) => (

               <BootstrapForm onSubmit={handleSubmit}>

                  <Field name="name" validate={composeValidators(validateRequired(), validateAlphaNumeric())}>

                     {({ input, meta }) => (

                        <FormGroup>

                           <Label for="name">Credential Name</Label>

                           <Input
                              {...input}
                              valid={!meta.error && meta.touched}
                              invalid={!!meta.error && meta.touched}
                              type="text"
                              placeholder="Enter the Credential Name"
                              disabled={editMode}
                           />

                           <FormFeedback>{meta.error}</FormFeedback>

                        </FormGroup>
                     )}

                  </Field>

                  {!editMode ? (

                     <Field name="credentialProvider" validate={validateRequired()}>

                        {({ input, meta }) => (

                           <FormGroup>

                              <Label for="credentialProvider">Credential Provider</Label>

                              <Select
                                 {...input}
                                 maxMenuHeight={140}
                                 menuPlacement="auto"
                                 options={optionsForCredentialProviders}
                                 placeholder="Select Credential Provider"
                                 onChange={(event) => { onCredentialProviderChange(event); input.onChange(event); }}
                                 styles={{ control: (provided) => (meta.touched && meta.invalid ? { ...provided, border: "solid 1px red", "&:hover": { border: "solid 1px red" } } : { ...provided }) }}
                              />

                              <div className="invalid-feedback" style={meta.touched && meta.invalid ? { display: "block" } : {}}>{meta.error}</div>

                           </FormGroup>

                        )}

                     </Field>

                  ) : (

                     <Field name="credentialProvider" format={(value) => value ? value.label : ""} validate={validateRequired()}>

                        {({ input, meta }) => (

                           <FormGroup>

                              <Label for="credentialProvider">Credential Provider</Label>

                              <Input
                                 {...input}
                                 valid={!meta.error && meta.touched}
                                 invalid={!!meta.error && meta.touched}
                                 type="text"
                                 placeholder="Credential Name"
                                 disabled={editMode}
                              />

                           </FormGroup>

                        )}

                     </Field>

                  )}

                  {!editMode && optionsForKinds?.length ? (

                     <Field name="storeKind" validate={validateRequired()}>

                        {({ input, meta }) => (

                           <FormGroup>

                              <Label for="storeKind">Kind</Label>

                              <Select
                                 {...input}
                                 maxMenuHeight={140}
                                 menuPlacement="auto"
                                 options={optionsForKinds}
                                 placeholder="Select Kind"
                                 onChange={(event) => { onKindChange(event); input.onChange(event); }}
                                 styles={{ control: (provided) => (meta.touched && meta.invalid ? { ...provided, border: "solid 1px red", "&:hover": { border: "solid 1px red" } } : { ...provided }) }}
                              />

                              <div className="invalid-feedback" style={meta.touched && meta.invalid ? { display: "block" } : {}}>Required Field</div>

                           </FormGroup>
                        )}
                     </Field>

                  ) : null}

                  {editMode && credential?.kind ? (

                     <Field name="storeKind" format={(value) => value ? value.label : ""}>

                        {({ input, meta }) => (

                           <FormGroup>

                              <Label for="storeKind">Kind</Label>

                              <Input
                                 {...input}
                                 valid={!meta.error && meta.touched}
                                 invalid={!!meta.error && meta.touched}
                                 type="text"
                                 placeholder="Credential Kind"
                                 disabled={editMode}
                              />

                           </FormGroup>

                        )}

                     </Field>

                  ) : null}

                     <>
                         <br />
                         <TabLayout tabs={[
                             {
                                 title: "Connector Attributes",
                                 content: credentialProvider && values.storeKind && credentialProviderAttributeDescriptors && credentialProviderAttributeDescriptors.length > 0 ? (
                                     <AttributeEditor
                                         id="credential"
                                         attributeDescriptors={credentialProviderAttributeDescriptors}
                                         attributes={credential?.attributes}
                                         groupAttributesCallbackAttributes={groupAttributesCallbackAttributes}
                                         setGroupAttributesCallbackAttributes={setGroupAttributesCallbackAttributes}
                                     />
                                 ): <></>
                             },
                             {
                                 title: "Custom Attributes",
                                 content: <AttributeEditor
                                     id="customCredential"
                                     attributeDescriptors={resourceCustomAttributes}
                                     attributes={credential?.customAttributes}
                                 />
                             }
                         ]} />


                     </>

                  {

                     <div className="d-flex justify-content-end">

                        <ButtonGroup>

                           <ProgressButton
                              title={submitTitle}
                              inProgressTitle={inProgressTitle}
                              inProgress={submitting}
                              disabled={(editMode ? pristine : false) || !valid}
                           />

                           <Button
                              color="default"
                              onClick={onCancel}
                              disabled={submitting}
                           >
                              Cancel
                           </Button>

                        </ButtonGroup>

                     </div>
                  }

               </BootstrapForm>
            )}
         </Form>

      </Widget>

   );

}
