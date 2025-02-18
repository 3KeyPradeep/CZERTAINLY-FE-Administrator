import AttributeEditor from "components/Attributes/AttributeEditor";
import ProgressButton from "components/ProgressButton";

import Widget from "components/Widget";
import { actions as connectorActions } from "ducks/connectors";

import { actions as tokenProfilesActions, selectors as tokenProfilesSelectors } from "ducks/token-profiles";
import { actions as tokensActions, selectors as tokensSelectors } from "ducks/tokens";
import { FormApi } from "final-form";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Field, Form } from "react-final-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";

import { Button, ButtonGroup, Form as BootstrapForm, FormFeedback, FormGroup, Input, Label } from "reactstrap";
import { AttributeDescriptorModel } from "types/attributes";
import { TokenProfileDetailResponseModel } from "types/token-profiles";

import { mutators } from "utils/attributes/attributeEditorMutators";
import { collectFormAttributes } from "utils/attributes/attributes";

import { composeValidators, validateAlphaNumeric, validateRequired } from "utils/validators";
import { actions as customAttributesActions, selectors as customAttributesSelectors } from "../../../../ducks/customAttributes";
import { KeyUsage, Resource } from "../../../../types/openapi";
import TabLayout from "../../../Layout/TabLayout";

interface FormValues {
   name: string;
   description: string;
   token: { value: any; label: string } | undefined;
   usages: { value: KeyUsage; label: KeyUsage; }[];
}


export default function TokenProfileForm() {

   const dispatch = useDispatch();
   const navigate = useNavigate();

   const { id, tokenId } = useParams();

   const editMode = useMemo( () => !!id, [id] );

   const tokenProfileSelector = useSelector(tokenProfilesSelectors.tokenProfile);

   const tokens = useSelector(tokensSelectors.tokens);
   const tokenProfileAttributeDescriptors = useSelector(tokensSelectors.tokenProfileAttributeDescriptors);
    const resourceCustomAttributes = useSelector(customAttributesSelectors.resourceCustomAttributes);
    const isFetchingResourceCustomAttributes = useSelector(customAttributesSelectors.isFetchingResourceCustomAttributes);

   const isFetchingTokenProfileAttributes = useSelector(tokensSelectors.isFetchingTokenProfileAttributesDescriptors);

   const isFetchingDetail = useSelector(tokenProfilesSelectors.isFetchingDetail);
   const isCreating = useSelector(tokenProfilesSelectors.isCreating);
   const isUpdating = useSelector(tokenProfilesSelectors.isUpdating);

    const [groupAttributesCallbackAttributes, setGroupAttributesCallbackAttributes] = useState<AttributeDescriptorModel[]>([]);

    const [tokenProfile, setTokenProfile] = useState<TokenProfileDetailResponseModel>();


   const isBusy = useMemo(
      () => isFetchingDetail || isCreating || isUpdating || isFetchingTokenProfileAttributes || isFetchingResourceCustomAttributes,
      [isCreating, isFetchingDetail, isUpdating, isFetchingTokenProfileAttributes, isFetchingResourceCustomAttributes]
   );


   useEffect(

      () => {

         dispatch(tokensActions.listTokens());
         dispatch(tokensActions.clearTokenProfileAttributesDescriptors());
         dispatch(connectorActions.clearCallbackData());

         if (editMode) dispatch(tokenProfilesActions.getTokenProfileDetail({ tokenInstanceUuid: tokenId!, uuid: id! }));
      },
      [dispatch, editMode, id, tokenId]

   )

   useEffect(() => {
      dispatch(customAttributesActions.listResourceCustomAttributes(Resource.TokenProfiles));
  }, [dispatch]);


   useEffect(

      () => {

         if (editMode && tokenProfileSelector && tokenProfileSelector.uuid !== tokenProfile?.uuid) {

            setTokenProfile(tokenProfileSelector);
            dispatch(tokensActions.getTokenProfileAttributesDescriptors({ tokenUuid: tokenProfileSelector.tokenInstanceUuid }));

         }
      },
      [tokens, dispatch, editMode, tokenProfile?.uuid, tokenProfileSelector]

   )


   const onTokenChange = useCallback(

      (tokenUuid: string, form: FormApi<FormValues>) => {

          dispatch(connectorActions.clearCallbackData());
          setGroupAttributesCallbackAttributes([]);
         form.mutators.clearAttributes("ra-profile");
         if (tokenProfile) setTokenProfile({ ...tokenProfile });
         dispatch(tokensActions.clearTokenProfileAttributesDescriptors());
         dispatch(tokensActions.getTokenProfileAttributesDescriptors({ tokenUuid }));

      },
      [dispatch, tokenProfile]

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
               tokenProfilesActions.updateTokenProfile({
                  profileUuid: id!,
                  tokenInstanceUuid: values.token!.value,
                  redirect: `../../../detail/${values.token!.value}/${id}`,
                   tokenProfileEditRequest: {
                       enabled: tokenProfile!.enabled,
                       description: values.description,
                       attributes: collectFormAttributes("token-profile", [...(tokenProfileAttributeDescriptors ?? []), ...groupAttributesCallbackAttributes], values),
                       customAttributes: collectFormAttributes("customTokenProfile", resourceCustomAttributes, values),
                       usage: values.usages.map((item) => item.value)

                   }
               })
            );

         } else {

            dispatch(
               tokenProfilesActions.createTokenProfile({
                  tokenInstanceUuid: values.token!.value,
                   tokenProfileAddRequest: {
                       name: values.name,
                       description: values.description,
                       attributes: collectFormAttributes("token-profile", [...(tokenProfileAttributeDescriptors ?? []), ...groupAttributesCallbackAttributes], values),
                       customAttributes: collectFormAttributes("customTokenProfile", resourceCustomAttributes, values),
                       usage: values.usages.map((item) => item.value)
                   }
               })
            );

         }

      },
      [dispatch, editMode, id, tokenProfile, tokenProfileAttributeDescriptors, groupAttributesCallbackAttributes, resourceCustomAttributes]

   );


   const optionsForAuthorities = useMemo(

      () => tokens.map(

         (token) => ({
            value: token.uuid,
            label: token.name
         })
      ),
      [tokens]

   );


   const defaultValues: FormValues = useMemo(
      () => ({
         name: editMode ? tokenProfile?.name || "" : "",
         description: editMode ? tokenProfile?.description || "" : "",
         token: editMode ? tokenProfile ? optionsForAuthorities.find(option => option.value === tokenProfile.tokenInstanceUuid) : undefined : undefined,
         usages: editMode ? tokenProfile?.usages?.map((usage) => ({ value: usage, label: usage })) || [] : []
      }),
      [editMode, optionsForAuthorities, tokenProfile]
   );


   const title = useMemo(
      () => editMode ? "Edit Token Profile" : "Create Token Profile",
      [editMode]
   );

   const keyUsageOptions = () => {
      let options: { value: KeyUsage; label: string }[] = [];
      for (let key in KeyUsage) {
         options.push({ value: KeyUsage[key as keyof typeof KeyUsage], label: key });
      }
      return options;
   }


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
                              placeholder="Enter Token Profile Name"
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

                  <Field name="token" validate={validateRequired()}>

                     {({ input, meta }) => (

                        <FormGroup>

                           <Label for="token">Select Token</Label>

                           <Select
                              {...input}
                              id="token"
                              maxMenuHeight={140}
                              menuPlacement="auto"
                              options={optionsForAuthorities}
                              placeholder="Select to change Token if needed"
                              onChange={(event: any) => { onTokenChange(event.value, form); input.onChange(event) }}
                              styles={{ control: (provided) => (meta.touched && meta.invalid ? { ...provided, border: "solid 1px red", "&:hover": { border: "solid 1px red" } } : { ...provided }) }}
                           />

                           <div className="invalid-feedback" style={meta.touched && meta.invalid ? { display: "block" } : {}}>{meta.error}</div>

                        </FormGroup>

                     )}

                  </Field>

                  <Field name="usages">

                     {({ input, meta }) => (

                        <FormGroup>

                           <Label for="usages">Key Usages</Label>

                           <Select
                              {...input}
                              id="usages"
                              isMulti = {true}
                              maxMenuHeight={140}
                              menuPlacement="auto"
                              options={keyUsageOptions()}
                              placeholder="Select Key Usages"
                              onChange={(event: any) => { input.onChange(event) }}
                              styles={{ control: (provided) => (meta.touched && meta.invalid ? { ...provided, border: "solid 1px red", "&:hover": { border: "solid 1px red" } } : { ...provided }) }}
                           />

                           <div className="invalid-feedback" style={meta.touched && meta.invalid ? { display: "block" } : {}}>{meta.error}</div>

                        </FormGroup>

                     )}

                  </Field>


                   <br />
                   <TabLayout tabs={[
                       {
                           title: "Connector Attributes",
                           content: !tokenProfileAttributeDescriptors ? <></> : (
                               <AttributeEditor
                                   id="token-profile"
                                   callbackParentUuid={tokenProfile?.tokenInstanceUuid || form.getFieldState("token")?.value?.value}
                                   callbackResource={Resource.TokenProfiles}
                                   attributeDescriptors={tokenProfileAttributeDescriptors}
                                   attributes={tokenProfile?.attributes}
                                   groupAttributesCallbackAttributes={groupAttributesCallbackAttributes}
                                   setGroupAttributesCallbackAttributes={setGroupAttributesCallbackAttributes}
                               />)
                       },
                       {
                           title: "Custom Attributes",
                           content: <AttributeEditor
                               id="customTokenProfile"
                               attributeDescriptors={resourceCustomAttributes}
                               attributes={tokenProfile?.customAttributes}
                           />
                       }
                   ]} />

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
