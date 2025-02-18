import ProgressButton from "components/ProgressButton";

import Widget from "components/Widget";

import { actions as rolesActions, selectors as rolesSelectors } from "ducks/roles";
import React, { useCallback, useEffect, useMemo } from "react";
import { Field, Form } from "react-final-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import { Button, ButtonGroup, Form as BootstrapForm, FormFeedback, FormGroup, Input, Label } from "reactstrap";
import { composeValidators, validateAlphaNumeric, validateRequired } from "utils/validators";
import { actions as customAttributesActions, selectors as customAttributesSelectors } from "../../../../ducks/customAttributes";
import { Resource } from "../../../../types/openapi";
import { mutators } from "../../../../utils/attributes/attributeEditorMutators";
import { collectFormAttributes } from "../../../../utils/attributes/attributes";
import AttributeEditor from "../../../Attributes/AttributeEditor";
import TabLayout from "../../../Layout/TabLayout";

interface FormValues {
   name: string;
   description: string;
}


function RoleForm() {

   const dispatch = useDispatch();
   const navigate = useNavigate();

   const { id } = useParams();

   const editMode = useMemo( () => !!id, [id] );

   const roleSelector = useSelector(rolesSelectors.role);
   const isFetchingRoleDetail = useSelector(rolesSelectors.isFetchingDetail);
    const resourceCustomAttributes = useSelector(customAttributesSelectors.resourceCustomAttributes);
    const isFetchingResourceCustomAttributes = useSelector(customAttributesSelectors.isFetchingResourceCustomAttributes);


   useEffect(

      () => {
         dispatch(customAttributesActions.listResourceCustomAttributes(Resource.Roles));

         if (editMode) dispatch(rolesActions.getDetail({ uuid: id! }));

      },
      [dispatch, editMode, id]

   );

   const onSubmit = useCallback(

      (values: FormValues) => {

         if (editMode) {

            dispatch(

               rolesActions.update({
                  uuid: id!,
                   roleRequest: {
                       name: values.name,
                       description: values.description,
                       customAttributes: collectFormAttributes("customRole", resourceCustomAttributes, values)
                   }
               })

            );


         } else {

            dispatch(

               rolesActions.create({
                  name: values.name,
                  description: values.description,
                  customAttributes: collectFormAttributes("customRole", resourceCustomAttributes, values)
               })

            )

         }

      },

      [dispatch, editMode, id, resourceCustomAttributes]

   )


   const onCancel = useCallback(
      () => {

         navigate(-1);

      },
      [navigate]
   );


   const submitTitle = useMemo(
      () => editMode ? "Save" : "Create",
      [editMode]
   );


   const inProgressTitle = useMemo(
      () => editMode ? "Saving..." : "Creating...",
      [editMode]
   )


   const defaultValues: FormValues = useMemo(
      () => ({
         name: editMode ? roleSelector?.name || "" : "",
         description: editMode ? roleSelector?.description || "" : "",
      }),
      [editMode, roleSelector?.description, roleSelector?.name]
   );


   const title = useMemo(() => editMode ? "Edit Role" : "Add Role", [editMode]);


   return (

      <>

         <Widget title={title} busy={isFetchingRoleDetail || isFetchingResourceCustomAttributes}>

            <Form onSubmit={onSubmit} initialValues={defaultValues} mutators={{ ...mutators<FormValues>() }}>

               {({ handleSubmit, pristine, submitting, values, valid }) => (

                  <BootstrapForm onSubmit={handleSubmit}>

                     <Field name="name" validate={composeValidators(validateRequired(), validateAlphaNumeric())}>

                        {({ input, meta }) => (

                           <FormGroup>

                              <Label for="name">Role Name</Label>

                              <Input
                                 {...input}
                                 valid={!meta.error && meta.touched}
                                 invalid={!!meta.error && meta.touched}
                                 disabled={editMode || roleSelector?.systemRole}
                                 type="text"
                                 placeholder="Enter name of the role"
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
                                 valid={!meta.error && meta.touched}
                                 invalid={!!meta.error && meta.touched}
                                 type="text"
                                 placeholder="Enter description of the role"
                                 disabled={roleSelector?.systemRole}
                              />

                              <FormFeedback>{meta.error}</FormFeedback>

                           </FormGroup>

                        )}

                     </Field>

                      <br />

                      <TabLayout tabs={[
                          {
                              title: "Custom Attributes",
                              content: (<AttributeEditor
                                  id="customRole"
                                  attributeDescriptors={resourceCustomAttributes}
                                  attributes={roleSelector?.customAttributes}
                                />)
                          }
                      ]} />

                     <div className="d-flex justify-content-end">

                        <ButtonGroup>

                           <ProgressButton
                              title={submitTitle}
                              inProgressTitle={inProgressTitle}
                              inProgress={submitting}
                              disabled={pristine || submitting || roleSelector?.systemRole}
                           />

                           <Button color="default" onClick={onCancel} disabled={submitting}>
                              Cancel
                           </Button>

                        </ButtonGroup>

                     </div>

                  </BootstrapForm>
               )}

            </Form>

         </Widget>

      </>

   )

}

export default RoleForm;
