import WidgetButtons from "components/WidgetButtons";
import React, { useEffect } from "react";

import { Field, useForm, useFormState } from "react-final-form";
import { Button, FormFeedback, FormGroup, Input, InputGroup, Label } from "reactstrap";
import { AttributeContentType } from "types/openapi";
import { composeValidators } from "utils/validators";
import { ContentFieldConfiguration } from "../index";

type Props = {
    isList: boolean;
    contentType: AttributeContentType;
}

export default function ContentDescriptorField({isList, contentType}: Props) {
    const form = useForm();
    const formState = useFormState();
    const contentValues = formState.values["content"];

    useEffect(() => {
        if (!isList && contentValues?.length > 1) {
            form.change("content", contentValues.slice(0, 1));
        }
    }, [isList, contentValues, form]);

    return (
        <>
            {
                contentValues?.map((_contentValue: any, index: number) => {
                    const name = `content[${index}].data`;

                    return ContentFieldConfiguration[contentType].type &&
                        (<Field key={name}
                                name={name}
                                validate={ContentFieldConfiguration[contentType].validators ? composeValidators(...(ContentFieldConfiguration[contentType].validators ?? [])) : undefined}
                                type={ContentFieldConfiguration[contentType].type}>
                            {({input, meta}) => {
                                const inputComponent = <Input
                                    {...input}
                                    valid={!meta.error && meta.touched}
                                    invalid={!!meta.error && meta.touched}
                                    type={ContentFieldConfiguration[contentType].type}
                                    id={name}
                                    placeholder="Default Content"
                                />;
                                const labelComponent = <Label for={name}>Default Content</Label>;
                                const buttonComponent = <WidgetButtons buttons={[{
                                    icon: "trash", disabled: false, tooltip: "Remove", onClick: () => {
                                        form.change("content", contentValues.filter((_contentValue: any, filterIndex: number) => index !== filterIndex));
                                    },
                                }]}/>;
                                const feedbackComponent = <FormFeedback>{meta.error}</FormFeedback>;

                                return <FormGroup>{contentType !== AttributeContentType.Boolean
                                    ? (<>{labelComponent}<InputGroup>{inputComponent}{buttonComponent}{feedbackComponent}</InputGroup></>)
                                    : (<>{inputComponent} {labelComponent}{buttonComponent}{feedbackComponent}</>)
                                }</FormGroup>;
                            }}
                        </Field>);
                })
            }
            {
                (isList || !contentValues || contentValues.length === 0) && (
                    <Button color={"default"}
                            onClick={() => form.change("content", [...(isList ? (contentValues ?? []) : []), {data: ContentFieldConfiguration[contentType].initial}])}>
                        <i className={"fa fa-plus"}/>&nbsp;Add Content
                    </Button>)
            }
        </>
    );
}