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

            let oModel = this.getView().getModel();
            let oLocalModel = this.getView().getModel("LocalDataModel");

            oModel.read(`/Suppliers(${sSupplierID})/Products`, {
                success: (oData) => {
                    oLocalModel.setProperty("/mockProducts", oData.results);
                },
                error: function () {
                    MessageToast.show("Error al obtener productos.");
                }
            });

            oModel.read("/Categories", {
                success: (oData) => {
                    oLocalModel.setProperty("/categories", oData.results);
                },
                error: function () {
                    MessageToast.show("Error al obtener categorías.");
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
            let oLocalModel = this.getView().getModel("LocalDataModel");

            sap.ui.getCore().byId("txtProductID").setText(oData.ProductID);
            sap.ui.getCore().byId("txtProductName").setText(oData.ProductName);
            sap.ui.getCore().byId("txtUnitPrice").setText(oData.UnitPrice);
            sap.ui.getCore().byId("txtUnitsInStock").setText(oData.UnitsInStock);
            sap.ui.getCore().byId("txtUnitsOnOrder").setText(oData.UnitsOnOrder);
            sap.ui.getCore().byId("txtQperUnit").setText(oData.txtQperUnit);

            
            let aCategories = oLocalModel.getProperty("/categories")
            let oCategory = aCategories.find(cat => cat.CategoryID === oData.CategoryID);
            let sCategoryName = oCategory.CategoryName;
            sap.ui.getCore().byId("txtCategory").setText(sCategoryName);
        },

        onDialogMaterialClose: function () {
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
            sap.ui.getCore().byId("inputProductName").setValue("");
            sap.ui.getCore().byId("inputUnitPrice").setValue("");
            sap.ui.getCore().byId("inputUnitsInStock").setValue("");
            sap.ui.getCore().byId("txtCategory").setValue("");
            sap.ui.getCore().byId("txtQperUnit").setValue("");
            sap.ui.getCore().byId("txtUnitsOnOrder").setValue("");
        },

        onSaveNewProduct: function () {
            let oLocalModel = this.getView().getModel("LocalDataModel");
            let values = this.getOwnerComponent().getModel("LocalDataModel").getData();
            let aProducts = values.mockProducts;
            let sProductID = parseInt(aProducts.length + 1);
            let sProductName = values.inputProductName;
            let fUnitPrice = parseFloat(values.inputUnitPrice);
            let iUnitsInStock = parseInt(values.inputUnitsInStock);

            if (!sProductName || !fUnitPrice || !iUnitsInStock) {
                MessageToast.show("Por favor, complete todos los campos correctamente.");
                return;
            }

            let oNewProduct = {
                ProductID: sProductID,
                ProductName: sProductName,
                UnitPrice: fUnitPrice,
                UnitsInStock: iUnitsInStock
            };

            aProducts.push(oNewProduct);
            oLocalModel.setProperty("/mockProducts", aProducts);

            let oSmartTable = this.getView().byId("ST_ORDER_D");

            if (oSmartTable) {
                oSmartTable.setModel(oLocalModel);
                oSmartTable.setTableBindingPath("/mockProducts");
                oSmartTable.rebindTable();
            } 
            
            let oTable = this.getView().byId("tableProducts");
            if (oTable) {
                oTable.getBinding("items").refresh();
            }
                        
            MessageToast.show("Producto agregado con éxito");
            this._oNewProductDialog.close();

        },

        onDialogClose: function () {
            if (this._oNewProductDialog) {
                this._oNewProductDialog.close();
            }
        },

    });
});
