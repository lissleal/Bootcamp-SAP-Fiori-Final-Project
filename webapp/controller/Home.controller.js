sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "com/bootcamp/sapui5/providers/utils/HomeHelper",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter",
    "sap/ui/core/Fragment",
], (Controller, HomeHelper, Filter, FilterOperator, Sorter, Fragment) => {
    "use strict";

    return Controller.extend("com.bootcamp.sapui5.providers.controller.Home", {
        onInit() {
            this.oRouter = this.getOwnerComponent().getRouter();

            this._mViewSettingsDialogs = {}; // Objeto para almacenar los diálogos

            Fragment.load({
                id: this.getView().getId(),
                name: "com.bootcamp.sapui5.providers.view.fragments.SortDialog", 
                controller: this
            }).then(function (oDialog) {
                this._mViewSettingsDialogs["SortDialog"] = oDialog;
                this.getView().addDependent(oDialog);
            }.bind(this));
        },

        onPress: async function () {
            let oFilter = [];
            let values = this.getOwnerComponent().getModel("LocalDataModel").getData()
            console.log(values)

            if (values.valueInput) {
                oFilter.push(new Filter("SupplierID", FilterOperator.EQ, values.valueInput));
            }
            if (values.selectedKey) {
                oFilter.push(new Filter("CompanyName", FilterOperator.EQ, values.selectedKey));
            }
            let oDatos = await HomeHelper.getDataProviders(oFilter);
            await HomeHelper.setProviderModel(this, oDatos[0].results);
        },


        onItemPress: function (oEvent) {
            let oSource = oEvent.getSource();
            let oDatos = oSource.getBindingContext("ProviderCollection").getObject();
            this.oRouter.navTo("detail", {
                SupplierID: oDatos.SupplierID
            });
        },
        handleSortButtonPressed: function () {
            let oDialog = this._mViewSettingsDialogs["SortDialog"];
            if (oDialog) {
                oDialog.open();
            }
        },

        handleSortDialogConfirm: function (oEvent) {
            let oTable = this.byId("SuppliersTable"), 
                mParams = oEvent.getParameters(),
                oBinding = oTable.getBinding("items"),
                aSorters = [];
        
            let sPath = mParams.sortItem.getKey();
            let bDescending = mParams.sortDescending;
            aSorters.push(new sap.ui.model.Sorter(sPath, bDescending));
        
            oBinding.sort(aSorters);
        }
        
    });
});