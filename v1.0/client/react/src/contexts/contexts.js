import React from "react";

export const ContextModal = React.createContext({
    dataModal: {},
    setDataModal : ()=>{}
});

export const ContextUserID = React.createContext(null);