import React, { useState } from "react";
import { Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";

type Props = {
    tabs: {
        title: string | JSX.Element;
        hidden?: boolean;
        content: JSX.Element;
        disabled?: boolean;
        onClick?: () => void;
    }[];
    onlyActiveTabContent?: boolean;
}

export default function TabLayout({tabs, onlyActiveTabContent = false}: Props) {
    const [activeTab, setActiveTab] = useState(0);

    return (<>
        <Nav tabs>
            {tabs.filter(e=>!e.hidden).map((t, i) => (
                <NavItem key={`nav-${i}`}><NavLink className={activeTab === i ? "active" : ""} onClick={() => {
                    if (t.disabled) {
                        return;
                    }
                    setActiveTab(i);
                    if (t.onClick) {
                        t.onClick();
                    }
                }}>{t.title}</NavLink></NavItem>))}
        </Nav>
        <TabContent activeTab={activeTab}>
            {tabs.filter(e=>!e.hidden).map((t, i) => (onlyActiveTabContent === false) || (activeTab === i) ?
                <TabPane key={`pane-${i}`} tabId={i}>
                    {t.content}
                </TabPane> : null)
            }
        </TabContent>
    </>);
}