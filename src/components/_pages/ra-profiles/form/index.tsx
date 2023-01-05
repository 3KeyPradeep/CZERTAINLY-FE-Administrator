import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { FormApi } from "final-form";
import { Form, Field } from "react-final-form";

import { Button, ButtonGroup, Form as BootstrapForm, FormFeedback, FormGroup, Input, Label } from "reactstrap";
import Select from "react-select";

import { mutators } from "utils/attributes/attributeEditorMutators";
import { collectFormAttributes } from "utils/attributes/attributes";

import { actions as raProfilesActions, selectors as raProfilesSelectors } from "ducks/ra-profiles";
import { actions as authoritiesActions, selectors as authoritiesSelectors } from "ducks/authorities";
import { actions as connectorActions } from "ducks/connectors";

import { composeValidators, validateAlphaNumeric, validateRequired } from "utils/validators";

import Widget from "components/Widget";
import AttributeEditor from "components/Attributes/AttributeEditor";
import ProgressButton from "components/ProgressButton";
import { RaProfileResponseModel } from "types/ra-profiles";
import { AttributeDescriptorModel } from "types/attributes";


interface FormValues {
   name: string;
   description: string;
   authority: { value: any; label: string } | undefined;
}


export default function RaProfileForm() {

   const dispatch = useDispatch();
   const navigate = useNavigate();

   const { id, authorityId } = useParams();

   const editMode = useMemo( () => !!id, [id] );

   const raProfileSelector = useSelector(raProfilesSelectors.raProfile);

   const authorities = useSelector(authoritiesSelectors.authorities);
   const raProfileAttributeDescriptors = useSelector(authoritiesSelectors.raProfileAttributeDescriptors);

   const isFetchingAuthorityRAProfileAttributes = useSelector(authoritiesSelectors.isFetchingRAProfilesAttributesDescriptors);

   const isFetchingDetail = useSelector(raProfilesSelectors.isFetchingDetail);
   const isCreating = useSelector(raProfilesSelectors.isCreating);
   const isUpdating = useSelector(raProfilesSelectors.isUpdating);

    const [groupAttributesCallbackAttributes, setGroupAttributesCallbackAttributes] = useState<AttributeDescriptorModel[]>([]);

    const [raProfile, setRaProfile] = useState<RaProfileResponseModel>();


   const isBusy = useMemo(
      () => isFetchingDetail || isCreating || isUpdating || isFetchingAuthorityRAProfileAttributes,
      [isCreating, isFetchingDetail, isUpdating, isFetchingAuthorityRAProfileAttributes]
   );


   useEffect(

      () => {

         dispatch(authoritiesActions.listAuthorities());
         dispatch(authoritiesActions.clearRAProfilesAttributesDescriptors());
         dispatch(connectorActions.clearCallbackData());

         if (editMode) dispatch(raProfilesActions.getRaProfileDetail({ authorityUuid: authorityId!, uuid: id! }));
      },
      [dispatch, editMode, id, authorityId]

   )


   useEffect(

      () => {

         if (editMode && raProfileSelector && raProfileSelector.uuid !== raProfile?.uuid) {

            setRaProfile(raProfileSelector);
            dispatch(authoritiesActions.getRAProfilesAttributesDescriptors({ authorityUuid: raProfileSelector.authorityInstanceUuid }));

         }
      },
      [authorities, dispatch, editMode, raProfile?.uuid, raProfileSelector]

   )


   const onAuthorityChange = useCallback(

      (authorityUuid: string, form: FormApi<FormValues>) => {

          dispatch(connectorActions.clearCallbackData());
          setGroupAttributesCallbackAttributes([]);
         form.mutators.clearAttributes();
         if (raProfile) setRaProfile({ ...raProfile, attributes: [] });
         dispatch(authoritiesActions.clearRAProfilesAttributesDescriptors());
         dispatch(authoritiesActions.getRAProfilesAttributesDescriptors({ authorityUuid }));

      },
      [dispatch, raProfile]

   );


   const onCancelClick = useCallback(

      () => {
         navigate(-1);
      },
      [navigate,]

   );


   const onSubmit = useCallback(

      (values: FormValues) => {

         if (editMode) {

            dispatch(
               raProfilesActions.updateRaProfile({
                  profileUuid: id!,
                  authorityInstanceUuid: values.authority!.value,
                  redirect: `../../../detail/${values.authority!.value}/${id}`,
                   raProfileEditRequest: {
                       enabled: raProfile!.enabled,
                       description: values.description,
                       attributes: collectFormAttributes("ra-profile", [...(raProfileAttributeDescriptors ?? []), ...groupAttributesCallbackAttributes], values),
                   }
               })
            );

         } else {

            dispatch(
               raProfilesActions.createRaProfile({
                  authorityInstanceUuid: values.authority!.value,
                   raProfileAddRequest: {
                       name: values.name,
                       description: values.description,
                       attributes: collectFormAttributes("ra-profile", [...(raProfileAttributeDescriptors ?? []), ...groupAttributesCallbackAttributes], values)
                   }
               })
            );

         }

      },
      [dispatch, editMode, id, raProfile, raProfileAttributeDescriptors, groupAttributesCallbackAttributes]

   );


   const optionsForAuthorities = useMemo(

      () => authorities.map(

         (authority) => ({
            value: authority.uuid,
            label: authority.name
         })
      ),
      [authorities]

   );


   const defaultValues: FormValues = useMemo(
      () => ({
         name: editMode ? raProfile?.name || "" : "",
         description: editMode ? raProfile?.description || "" : "",
         authority: editMode ? raProfile ? optionsForAuthorities.find(option => option.value === raProfile.authorityInstanceUuid) : undefined : undefined
      }),
      [editMode, optionsForAuthorities, raProfile]
   );


   const title = useMemo(
      () => editMode ? "Edit RA Profile" : "Create RA Profile",
      [editMode]
   );


   return (

      <Widget title={title} busy={isBusy}>

         <Form initialValues={defaultValues} onSubmit={onSubmit} mutators={{ ...mutators<FormValues>() }} >

            {({ handleSubmit, pristine, submitting, valid, form }) => (

               <BootstrapForm onSubmit={handleSubmit}>


                  <Field name="name" validate={composeValidators(validateRequired(), validateAlphaNumeric())}>

                     {({ input, meta }) => (

                        <FormGroup>

                           <Label for="name">RA Profile Name</Label>

                           <Input
                              {...input}
                              id="name"
                              type="text"
                              placeholder="Enter RA Profile Name"
                              valid={!meta.touched || !meta.error}
                              invalid={meta.touched && meta.error}
                              disabled={editMode}
                           />

                           <FormFeedback>{meta.error}</FormFeedback>

                        </FormGroup>

                     )}

                  </Field>

                  <Field name="description" validate={composeValidators(validateAlphaNumeric())}>

                     {({ input, meta }) => (

                        <FormGroup>

                           <Label for="description">Description</Label>

                           <Input
                              {...input}
                              id="description"
                              type="textarea"
                              className="form-control"
                              placeholder="Enter Description / Comment"
                              valid={!meta.touched || !meta.error}
                              invalid={meta.touched && meta.error}
                           />

                           <FormFeedback>{meta.error}</FormFeedback>

                        </FormGroup>

                     )}

                  </Field>

                  <Field name="authority" validate={validateRequired()}>

                     {({ input, meta }) => (

                        <FormGroup>

                           <Label for="authority">Select Authority</Label>

                           <Select
                              {...input}
                              id="authority"
                              maxMenuHeight={140}
                              menuPlacement="auto"
                              options={optionsForAuthorities}
                              placeholder="Select to change RA Profile if needed"
                              onChange={(event: any) => { onAuthorityChange(event.value, form); input.onChange(event) }}
                              styles={{ control: (provided) => (meta.touched && meta.invalid ? { ...provided, border: "solid 1px red", "&:hover": { border: "solid 1px red" } } : { ...provided }) }}
                           />

                           <div className="invalid-feedback" style={meta.touched && meta.invalid ? { display: "block" } : {}}>{meta.error}</div>

                        </FormGroup>

                     )}

                  </Field>


                  {!raProfileAttributeDescriptors ? <></> : (
                     <AttributeEditor
                        id="ra-profile"
                        authorityUuid={raProfile?.authorityInstanceUuid || form.getFieldState("authority")?.value?.value}
                        attributeDescriptors={raProfileAttributeDescriptors}
                        attributes={raProfile?.attributes}
                        groupAttributesCallbackAttributes={groupAttributesCallbackAttributes}
                        setGroupAttributesCallbackAttributes={setGroupAttributesCallbackAttributes}
                     />
                  )}

                  <div className="d-flex justify-content-end">

                     <ButtonGroup>

                        <ProgressButton
                           title={editMode ? "Update" : "Create"}
                           inProgressTitle={editMode ? "Updating..." : "Creating..."}
                           inProgress={submitting}
                           disabled={pristine || submitting || !valid}
                        />

                        <Button color="default" onClick={onCancelClick} disabled={submitting}>
                           Cancel
                        </Button>

                     </ButtonGroup>

                  </div>

               </BootstrapForm>

            )}

         </Form>

      </Widget >

   );

}
