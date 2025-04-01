sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment"
], function (Controller, Fragment) {
    "use strict";

    return Controller.extend("com.bootcamp.sapui5.providers.controller.Detail", {
        onInit() {
            let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("detail").attachPatternMatched(this._onObjectMatched, this);
        },

        _onObjectMatched: function (oEvent) {
            let sSupplierID = oEvent.getParameter("arguments").SupplierID;
            this.getView().bindElement({
                path: "/Suppliers(" + sSupplierID + ")",
                parameters: {
                    expand: "Products"
                }
            });
        },

        onMaterialSelect: function (oEvent) {
            let oSelectedItem = oEvent.getParameter("listItem");
            let oBindingContext = oSelectedItem.getBindingContext();

            if (!oBindingContext) return;

            let oData = oBindingContext.getObject();

            if (!this._oDialog) {
                Fragment.load({
                    name: "com.bootcamp.sapui5.providers.view.fragments.DialogMaterial",
                    controller: this
                }).then((oDialog) => {
                    this._oDialog = oDialog;
                    this.getView().addDependent(this._oDialog);
                    this._setDialogData(oData);
                    this._oDialog.open();
                });
            } else {
                this._setDialogData(oData);
                this._oDialog.open();
            }
        },

        _setDialogData: function (oData) {
            sap.ui.getCore().byId("txtProductID").setText(oData.ProductID);
            sap.ui.getCore().byId("txtProductName").setText(oData.ProductName);
            sap.ui.getCore().byId("txtUnitPrice").setText(oData.UnitPrice);
            sap.ui.getCore().byId("txtUnitsInStock").setText(oData.UnitsInStock);
        },

        onDialogClose: function () {
            if (this._oDialog) {
                this._oDialog.close();
            }
        }

        
    });
});
