import * as DOMPurify from "dompurify";
import hljs from "highlight.js";
import "highlight.js/styles/github.css";
import parse from "html-react-parser";
import React, { useState } from "react";
import { Button } from "reactstrap";
import { CodeBlockAttributeContentModel } from "../../../types/attributes";
import { ProgrammingLanguageEnum } from "../../../types/openapi";
import Dialog from "../../Dialog";

type Props = {
    content: CodeBlockAttributeContentModel;
}

export const getHighLightedCode = (code: string, language: ProgrammingLanguageEnum) => {
    try {
        return hljs.highlight(language, code).value;
    } catch (e) {
        console.error(e);
        return code;
    }
};

export default function CodeBlock({content}: Props) {
    const [showDialog, setShowDialog] = useState<boolean>(false);

    return (
        <>
            {content.data.language}&nbsp;
            <Button
                className="btn btn-link p-0"
                color="white"
                title={content.data.language}
                onClick={() => setShowDialog(true)}
            >
                <i className="fa fa-info" style={{color: "auto"}}/>
            </Button>

            <Dialog
                isOpen={showDialog}
                caption={`${content.data.language} code block`}
                size="lg"
                body={
                    <pre><code className={`language-${content.data.language}`}
                               style={{
                                   fontFamily: "\"Fira code\", \"Fira Mono\", monospace",
                                   fontSize: 14,
                               }}
                    >
                        {parse(DOMPurify.sanitize(getHighLightedCode(atob(content.data.code), content.data.language)))}
                    </code></pre>
                }
                toggle={() => setShowDialog(false)}
                buttons={[{color: "secondary", onClick: () => setShowDialog(false), body: "Cancel"}]}
            />
        </>
    );
}