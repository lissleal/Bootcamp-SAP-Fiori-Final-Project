sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "com/bootcamp/sapui5/providers/utils/HomeHelper"
], (Controller, HomeHelper) => {
    "use strict";
    return Controller.extend("com.bootcamp.sapui5.providers.controller.Detail",
        {
            onInit() {
                let oRouter = sap.ui.core.UIComponent.getRouterFor(this);

                oRouter.getRoute("detail").attachPatternMatched(this._onObjectMatched, this);
            },
            _onObjectMatched: function (oEvent) {
                // Obtener el ProductID de la URL y enlazar el contexto
                let sSupplierID = oEvent.getParameter("arguments").SupplierID;
                this.getView().bindElement({
                    path: "/Suppliers(" + sSupplierID + ")",
                    parameters: {
                        expand: "Products"
                    }
                });
            },

            
        });
});
