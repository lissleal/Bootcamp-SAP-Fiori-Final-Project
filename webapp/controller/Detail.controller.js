sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/m/MessageToast",
    "com/bootcamp/sapui5/providers/utils/HomeHelper",

], function (Controller, Fragment, MessageToast, HomeHelper) {
    "use strict";

    return Controller.extend("com.bootcamp.sapui5.providers.controller.Detail", {
        onInit() {
            let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("detail").attachPatternMatched(this._onObjectMatched, this);
        },
        //Logica de smarttable
        _onObjectMatched: function (oEvent) {
            let sSupplierID = oEvent.getParameter("arguments").SupplierID;
            this.getView().bindElement({
                path: "/Suppliers(" + sSupplierID + ")",
                parameters: {
                    expand: "Products"
                }
            });
        },
        //Logica de detalle de producto
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
        },

        //Logica de nuevo producto
        onHandleNewProduct: function () {
            if (!this._oNewProductDialog) {
                Fragment.load({
                    name: "com.bootcamp.sapui5.providers.view.fragments.NewProductDialog",
                    controller: this
                }).then((oDialog) => {
                    this._oNewProductDialog = oDialog;
                    this.getView().addDependent(this._oNewProductDialog);
                    this._clearDialogFields();
                    this._oNewProductDialog.open();
                });
            } else {
                this._clearDialogFields();
                this._oNewProductDialog.open();
            }
        },
        _clearDialogFields: function () {
            sap.ui.getCore().byId("inputProductID").setValue("");
            sap.ui.getCore().byId("inputProductName").setValue("");
            sap.ui.getCore().byId("inputUnitPrice").setValue("");
            sap.ui.getCore().byId("inputUnitsInStock").setValue("");
        },

        onSaveNewProduct: function () {
            let values = this.getOwnerComponent().getModel("LocalDataModel").getData()
            let sProductID = values.inputProductID;
            let sProductName = values.inputProductName;
            let fUnitPrice = values.inputUnitPrice;
            let iUnitsInStock = values.inputUnitsInStock;

            if (!sProductID || !sProductName || isNaN(fUnitPrice) || isNaN(iUnitsInStock) ) {
                MessageToast.show("Por favor, complete todos los campos correctamente.");
                return;
            }

            let oNewProduct = {
                ProductID: sProductID,
                ProductName: sProductName,
                UnitPrice: fUnitPrice,
                UnitsInStock: iUnitsInStock
            };


            let oModel = this.getView().getModel();
            oModel.create("/Products", oNewProduct, {
                success: function () {
                    MessageToast.show("Producto agregado con éxito");
                },
                error: function () {
                    MessageToast.show("Error al agregar el producto");
                }
            });

            this._oNewProductDialog.close();
        },

        onDialogClose: function () {
            if (this._oNewProductDialog) {
                this._oNewProductDialog.close();
            }
        },

    });
});
