sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "com/bootcamp/sapui5/providers/utils/HomeHelper"
], (Controller, HomeHelper) => {
    "use strict";

    return Controller.extend("com.bootcamp.sapui5.providers.controller.Home", {
        onInit() {
        },

        onPress: async function(){
            let oDatos = await HomeHelper.getDataProducts();
            console.log(oDatos)
        }
    });
});