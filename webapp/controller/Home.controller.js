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

            this._mViewSettingsDialogs = {}; 

            Fragment.load({
                id: this.getView().getId(),
                name: "com.bootcamp.sapui5.providers.view.fragments.SortDialog",
                controller: this
            }).then(function (oDialog) {
                this._mViewSettingsDialogs["SortDialog"] = oDialog;
                this.getView().addDependent(oDialog);
            }.bind(this));

            this.loadInitialData();  
        },

        loadInitialData: async function () {
            let oDatos = await HomeHelper.getDataProviders([]);
            await HomeHelper.setProviderModel(this, oDatos[0].results);
        },

        onSuggestionItemSelected: function (oEvent) {
            let oSelectedItem = oEvent.getParameter("selectedItem");

            if (oSelectedItem) {
                let sSupplierName = oSelectedItem.getText();
                let sSupplierID = oSelectedItem.getAdditionalText();

                let oModel = this.getOwnerComponent().getModel("LocalDataModel");
                oModel.setProperty("/valueInput", sSupplierID);
                oModel.setProperty("/valueName", sSupplierName);
            }
        },

        onSelectionChange(oEvent) {
            let oSelectedItem = oEvent.getParameter("selectedItem");

            if (oSelectedItem) {
                let sSupplierCity = oSelectedItem.getText();

                let oModel = this.getOwnerComponent().getModel("LocalDataModel");
                oModel.setProperty("/selectedKey", sSupplierCity);
            }
        },


        onPress: async function () {
            let oFilter = [];
            let values = this.getOwnerComponent().getModel("LocalDataModel").getData()

            if (values.valueInput) {
                oFilter.push(new Filter("SupplierID", FilterOperator.EQ, values.valueInput));
            }
            if (values.valueName) {
                oFilter.push(new Filter("CompanyName", FilterOperator.Contains, values.valueName));
            }
            if (values.selectedKey) {
                oFilter.push(new Filter("City", FilterOperator.EQ, values.selectedKey));
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
        },

        onClearFilters: function () {
            let oModel = this.getOwnerComponent().getModel("LocalDataModel");

            oModel.setProperty("/valueInput", "");
            oModel.setProperty("/valueName", "");
            oModel.setProperty("/selectedKey", "");

            this.byId("inputID").setValue("");
            this.byId("comboboxID").setSelectedKey("");

            HomeHelper.getDataProviders([]).then((oDatos) => {
                HomeHelper.setProviderModel(this, oDatos[0].results);
            });
        }


    });
});