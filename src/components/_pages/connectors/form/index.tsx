import CustomTable, { TableDataRow, TableHeader } from "components/CustomTable";

import ProgressButton from "components/ProgressButton";
import Widget from "components/Widget";

import { actions as connectorActions, selectors as connectorSelectors } from "ducks/connectors";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Field, Form } from "react-final-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import Select from "react-select";
import { Badge, Button, ButtonGroup, Container, Form as BootstrapForm, FormFeedback, FormGroup, Input, Label, Table } from "reactstrap";
import { ConnectorResponseModel, EndpointModel } from "types/connectors";
import { AuthType, ConnectorStatus, Resource } from "types/openapi";

import { attributeFieldNameTransform, collectFormAttributes } from "utils/attributes/attributes";

import { composeValidators, validateAlphaNumeric, validateRequired, validateUrl } from "utils/validators";
import { actions as customAttributesActions, selectors as customAttributesSelectors } from "../../../../ducks/customAttributes";
import { mutators } from "../../../../utils/attributes/attributeEditorMutators";
import AttributeEditor from "../../../Attributes/AttributeEditor";
import TabLayout from "../../../Layout/TabLayout";
import InventoryStatusBadge from "../ConnectorStatus";

interface FormValues {
   uuid: string;
   name: string;
   url: string;
   authenticationType: { value: AuthType };
}

export default function ConnectorForm() {

   const dispatch = useDispatch();
   const navigate = useNavigate();

   const { id } = useParams();

   const editMode = useMemo( () => !!id, [id] );

   const optionsForAuth: { label: string, value: AuthType }[] = useMemo(

      () => [
         {
            label: "No Auth",
            value: AuthType.None,
         },
         {
            label: "Basic Auth",
            value: AuthType.Basic,
         },
         {
            label: "Client Cert",
            value: AuthType.Certificate,
         },
      ],
      []

   );

    const resourceCustomAttributes = useSelector(customAttributesSelectors.resourceCustomAttributes);
    // const isFetchingResourceCustomAttributes = useSelector(customAttributesSelectors.isFetchingResourceCustomAttributes);

   const isFetching = useSelector(connectorSelectors.isFetchingDetail);
   // const isCreating = useSelector(connectorSelectors.isCreating);
   // const isUpdating = useSelector(connectorSelectors.isUpdating);
   const isConnecting = useSelector(connectorSelectors.isConnecting);
   const isReconnecting = useSelector(connectorSelectors.isReconnecting);

   const connectorSelector = useSelector(connectorSelectors.connector);
   const connectionDetails = useSelector(connectorSelectors.connectorConnectionDetails);

   const [connector, setConnector] = useState<ConnectorResponseModel>();

   const [selectedAuthType, setSelectedAuthType] = useState<{ label: string, value: AuthType }>(
      editMode ? optionsForAuth.find(opt => opt.value === connector?.authType) || optionsForAuth[0] : optionsForAuth[0]
   );

   const submitTitle = editMode ? "Save" : "Create";
   const connectTitle = editMode ? "Reconnect" : "Connect";
   const inProgressTitle = editMode ? "Saving..." : "Creating...";
   const connectProgressTitle = editMode ? "Reconnecting..." : "Connecting...";


   useEffect(

      () => {
          dispatch(customAttributesActions.listResourceCustomAttributes(Resource.Connectors));

         if (id && (!connectorSelector || connectorSelector.uuid !== id) && !isFetching) {
            dispatch(connectorActions.getConnectorDetail({ uuid: id }));
         }

         if (id && (connectorSelector && connectorSelector.uuid === id && !isFetching)) {
            dispatch(connectorActions.reconnectConnector({ uuid: id }));
         }

         if (id && connectorSelector?.uuid === id) {

            setConnector(connectorSelector);

         } else {

            dispatch(connectorActions.clearConnectionDetails());
            dispatch(connectorActions.clearCallbackData());

            setConnector({
               uuid: "",
               name: "",
               url: "",
               authType: AuthType.None,
               status: ConnectorStatus.Offline,
               functionGroups: [],
            });

         }

      },
      [editMode, id, connectorSelector, isFetching, dispatch]

   )


   const onSubmit = useCallback(

      (values: FormValues) => {

         if (editMode) {

            if (!connector) return;

            dispatch(connectorActions.updateConnector({
               uuid: connector?.uuid,
             connectorUpdateRequest: {
               url: values.url,
               authType: selectedAuthType.value,
               customAttributes: collectFormAttributes("customConnector", resourceCustomAttributes, values)
               // authAttributes: []
             }
            }))

         } else {

            dispatch(connectorActions.createConnector({
               name: values.name,
               url: values.url,
               authType: selectedAuthType.value,
               customAttributes: collectFormAttributes("customConnector", resourceCustomAttributes, values)
               // authAttributes: []
            }))

         }

      },
      [editMode, connector, selectedAuthType.value, dispatch, resourceCustomAttributes]

   );


   const onCancel = useCallback(

      () => {
         navigate(-1);
      },
      [navigate]

   )


   const onConnectClick = useCallback(

      (values: FormValues) => {

         if (editMode) {
            dispatch(connectorActions.connectConnector({ uuid: connector!.uuid, url: values.url, authType: values.authenticationType.value }));
         } else {
            dispatch(connectorActions.connectConnector({ url: values.url, authType: values.authenticationType.value }));
         }

      },
      [connector, dispatch, editMode]

   );


   const getEndPointInfo = useCallback(

      (endpoints: EndpointModel[]): TableDataRow[] => {
         return endpoints.map(
            (endpoint: EndpointModel) => ({
               id: endpoint.name,
               columns: [
                  endpoint.name,
                  endpoint.context,
                  endpoint.method
               ]
            })

         )
      },
      []

   );


   const endPointsHeaders: TableHeader[] = useMemo(

      () => [
         {
            id: "name",
            sortable: true,
            sort: "asc",
            content: "Name"
         },
         {
            id: "context",
            sortable: true,
            content: "Context"
         },
         {
            id: "method",
            sortable: true,
            content: "Method"
         }
      ],
      []

   )


   const defaultValues = useMemo(

      () => ({
         name: editMode ? connector?.name : "",
         url: editMode ? connector?.url || "" : "",
         authenticationType: editMode ? optionsForAuth.find(opt => opt.value === connector?.authType) || optionsForAuth[0] : optionsForAuth[0],
      }),
      [editMode, optionsForAuth, connector]

   );

   return (

      <Container className="themed-container" fluid>
         <div>

            <Form onSubmit={onSubmit} initialValues={defaultValues} mutators={{ ...mutators<FormValues>() }}>

               {({ handleSubmit, pristine, submitting, values }) => (

                  <BootstrapForm onSubmit={handleSubmit}>

                     <Widget title={<h5>{editMode ? "Edit" : "Add new"} <span className="fw-semi-bold">Connector</span></h5>}>

                        <Field
                           name="url"
                           validate={composeValidators(validateRequired(), validateUrl())}
                        >

                           {({ input, meta }) => (

                              <FormGroup>

                                 <Label for="url">URL</Label>
                                 <Input
                                    {...input}
                                    valid={!meta.error && meta.touched}
                                    invalid={!!meta.error && meta.touched}
                                    type="text"
                                    placeholder="URL of the connector service"
                                 />
                                 <FormFeedback>{meta.error}</FormFeedback>

                              </FormGroup>

                           )}

                        </Field>

                        <Field name="authenticationType">

                           {({ input, meta, }) => (

                              <FormGroup>

                                 <Label for="authenticationType">Authentication Type</Label>

                                 <Select
                                    {...input}
                                    maxMenuHeight={140}
                                    menuPlacement="auto"
                                    options={optionsForAuth}
                                    placeholder="Select Auth Type"
                                    onChange={(e) => { input.onChange(e); setSelectedAuthType(e); }}
                                 />

                                 <div className="invalid-feedback" style={meta.touched && meta.invalid ? { display: "block" } : {}}>{meta.error}</div>

                              </FormGroup>

                           )}

                        </Field>

                        {
                           values.authenticationType.value === "basic" ? (

                              <div>

                                 <Field name="username">

                                    {({ input, meta }) => (

                                       <FormGroup>

                                          <Label for="username">Username</Label>

                                          <Input
                                             {...input}
                                             valid={!meta.error && meta.touched}
                                             invalid={!!meta.error && meta.touched}
                                             type="text"
                                             placeholder="Username"
                                          //disabled={editMode}
                                          />
                                          <FormFeedback>{meta.error}</FormFeedback>

                                       </FormGroup>
                                    )}

                                 </Field>

                                 <Field name="password">

                                    {({ input, meta }) => (

                                       <FormGroup>

                                          <Label for="password">Password</Label>

                                          <Input
                                             {...input}
                                             valid={!meta.error && meta.touched}
                                             invalid={!!meta.error && meta.touched}
                                             type="password"
                                             placeholder="Password"
                                          // disabled={editMode}
                                          />

                                          <FormFeedback>{meta.error}</FormFeedback>

                                       </FormGroup>

                                    )}

                                 </Field>

                              </div>

                           ) : null
                        }

                        {
                           values.authenticationType.value === "certificate" ? (

                              <Field name="clientCert">

                                 {({ input, meta }) => (

                                    <FormGroup>

                                       <Label for="clientCert">Client Certificate</Label>

                                       <Input
                                          {...input}
                                          valid={!meta.error && meta.touched}
                                          invalid={!!meta.error && meta.touched}
                                          type="file"
                                          placeholder="clientCert"
                                       // disabled={editMode}
                                       />

                                       <FormFeedback>{meta.error}</FormFeedback>

                                    </FormGroup>

                                 )}

                              </Field>

                           ) : null
                        }

                         <>
                             <br />

                             <TabLayout tabs={[
                                 {
                                     title: "Custom Attributes",
                                     content: (<AttributeEditor
                                         id="customConnector"
                                         attributeDescriptors={resourceCustomAttributes}
                                         attributes={connector?.customAttributes}
                                     />)
                                 }
                             ]} />
                         </>

                         <div className="d-flex justify-content-end">

                           <ButtonGroup>

                              <Button

                                 color="success"
                                 onClick={() => onConnectClick(values)}
                                 disabled={submitting || isConnecting || isReconnecting}
                              >
                                 {isConnecting || isReconnecting ? connectProgressTitle : connectTitle}
                              </Button>

                           </ButtonGroup>

                        </div>

                     </Widget>

                     {
                        connectionDetails ? (

                           <Widget title="Connection Details" busy={isConnecting}>

                              <Table className="table-hover" size="sm">

                                 <tbody>

                                    <tr>
                                       <td>URL</td>
                                       <td>{values.url}</td>
                                    </tr>

                                    <tr>

                                       <td>Connector Status</td>
                                       <td>
                                          <InventoryStatusBadge status={connectionDetails.length > 0 ? ConnectorStatus.Connected : ConnectorStatus.Failed} />
                                       </td>

                                    </tr>

                                    <tr>

                                       <td>Function Group(s)</td>
                                       <td>
                                          {connectionDetails.map(
                                             functionGroup => (
                                                <div>
                                                   <Badge color="primary">
                                                      {attributeFieldNameTransform[functionGroup?.name || ""] || functionGroup?.name}
                                                   </Badge>
                                                   &nbsp;
                                                </div>
                                             )
                                          )}
                                       </td>

                                    </tr>

                                 </tbody>

                              </Table>


                              {

                                 connectionDetails && connectionDetails.length > 0 ? (

                                    <div>

                                       <b>Connector Functionality Description</b>

                                       <hr />{" "}

                                       {connectionDetails.map(

                                          functionGroup => (

                                             <Widget key={functionGroup.name} title={

                                                <>

                                                   {attributeFieldNameTransform[functionGroup?.name || ""] || functionGroup?.name}

                                                   <div className="fa-pull-right mt-n-xs">
                                                      {
                                                         functionGroup.kinds.map(kinds =>
                                                            <>
                                                               &nbsp;
                                                               <Badge color="secondary">
                                                                  {kinds}
                                                               </Badge>
                                                            </>
                                                         )
                                                      }
                                                   </div>

                                                </>

                                             }>

                                                <CustomTable
                                                   headers={endPointsHeaders}
                                                   data={getEndPointInfo(functionGroup?.endPoints)}
                                                />

                                             </Widget>

                                          )

                                       )}

                                    </div>

                                 ) : null}

                              {

                                 connectionDetails && connectionDetails.length > 0 ? (

                                    <div>

                                       <Field name="name" validate={composeValidators(validateRequired(), validateAlphaNumeric())} >

                                          {({ input, meta }) => (

                                             <FormGroup>

                                                <Label for="name">Connector Name</Label>

                                                <Input
                                                   {...input}
                                                   valid={!meta.error && meta.touched}
                                                   invalid={!!meta.error && meta.touched}
                                                   type="text"
                                                   placeholder="Connector Name"
                                                   disabled={editMode}
                                                />

                                                <FormFeedback>{meta.error}</FormFeedback>

                                             </FormGroup>

                                          )}

                                       </Field>

                                       <div className="d-flex justify-content-end">

                                          <ButtonGroup>

                                             <Button
                                                color="default"
                                                onClick={onCancel}
                                                disabled={submitting}
                                             >
                                                Cancel
                                             </Button>

                                             <ProgressButton
                                                title={submitTitle}
                                                inProgressTitle={inProgressTitle}
                                                inProgress={submitting}
                                                disabled={pristine}
                                             />

                                          </ButtonGroup>

                                       </div>

                                    </div>

                                 ) : null

                              }

                           </Widget>

                        ) : null

                     }

                  </BootstrapForm>

               )}
            </Form>

         </div>
      </Container>

   );
}

