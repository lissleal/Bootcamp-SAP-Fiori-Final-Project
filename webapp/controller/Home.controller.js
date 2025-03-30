sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "com/bootcamp/sapui5/providers/utils/HomeHelper"
], (Controller, HomeHelper) => {
    "use strict";

    return Controller.extend("com.bootcamp.sapui5.providers.controller.Home", {
        onInit() {
            this.oRouter = this.getOwnerComponent().getRouter();
        },

        onPress: async function(){
            let oDatos = await HomeHelper.getDataProviders();
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