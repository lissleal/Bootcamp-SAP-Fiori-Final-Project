sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "com/bootcamp/sapui5/providers/utils/HomeHelper",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], (Controller, HomeHelper, Filter, FilterOperator) => {
    "use strict";

    return Controller.extend("com.bootcamp.sapui5.providers.controller.Home", {
        onInit() {
            this.oRouter = this.getOwnerComponent().getRouter();
        },

        onPress: async function(){
            let oFilter = [];
            let values = this.getOwnerComponent().getModel("LocalDataModel").getData()
            console.log(values)
            
            if(values.valueInput){
                oFilter.push(new Filter("SupplierID", FilterOperator.EQ, values.valueInput));
            }
            if(values.selectedKey){
                oFilter.push(new Filter("CompanyName", FilterOperator.EQ, values.selectedKey));
            }
            let oDatos = await HomeHelper.getDataProviders(oFilter);
            await HomeHelper.setProviderModel(this, oDatos[0].results);
        },


        onItemPress: function(oEvent){
            let oSource = oEvent.getSource();
            let oDatos = oSource.getBindingContext("ProviderCollection").getObject();
            this.oRouter.navTo("detail", {
            SupplierID: oDatos.SupplierID
            });
            }
            
    });
});