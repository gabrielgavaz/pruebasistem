sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/Fragment",
    "sap/m/MessageToast",
    "../util/formatter"
    
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Filter, FilterOperator, Fragment, MessageToast, formatter) {
        "use strict";
        

        return Controller.extend("pruebasistem.controller.pruebaconsistem", {
          formatter: formatter,

          onInit: function () {
            this._oDialog = sap.ui.xmlfragment(this.getView().getId(), "pruebasistem.view.fragment.Dialog", this);
            this.getView().addDependent(this._oDialog);
          },
        
          //abrir pop up para agregar pais
          agregarPais: function(oEvent) {
            var oContext = oEvent.getSource().getBindingContext();
            this._oDialog.setBindingContext(oContext).open();
          },
        
          closeDialog: function() {
            this._oDialog.close();
          },
        
          //abrir pop up de confirmacion para deletear
          onOpenConfirmation: function(oEvent) {
            if (!this._oConfirmationDialog) {
              var oListItem = oEvent.getSource().getParent().getParent();
              var oContext = oListItem.getBindingContext();
              var sIdPais = oContext.getProperty("IdPais");
              var sNombrePais = oContext.getProperty("NombrePais");
              
              // Almacena el valor de IdPais en el controlador
              this._idPais = sIdPais;

              // Muestra el ID del país en la consola
              console.log(this._idPais + "1");
              console.log(sNombrePais);

        
              this._oConfirmationDialog = sap.ui.xmlfragment(this.getView().getId(), "pruebasistem.view.fragment.Confirm", this);
              this.getView().addDependent(this._oConfirmationDialog);


            }
            this._oConfirmationDialog.open();
          },
        
          //Metodo confirmar para eliminar el pais
          onConfirm: function() {
            console.log("Confirmación realizada");
            var sIdPais = this._idPais;
            console.log(sIdPais + "2")
            var oModel = this.getView().getModel();
            
            oModel.remove("/paisSet('" + sIdPais + "')", {
              success: function() {
                // La eliminación fue exitosa
                sap.m.MessageToast.show("El país se eliminó correctamente.");
                this._oConfirmationDialog.close();
                this._oConfirmationDialog.destroy(); // Destruye el diálogo
                this._oConfirmationDialog = null; // Reinicia la referencia al diálog

    
              }.bind(this),
              error: function(oError) {
                // Ocurrió un error durante la eliminación
                sap.m.MessageBox.error("Error al eliminar el país: " + oError.message);
              },
            });
        
            this._oConfirmationDialog.close();
          },
        
          onCancel: function() {
            console.log("Acción cancelada");
            this._oConfirmationDialog.close();
            this._oConfirmationDialog.destroy(); // Destruye el diálogo
            this._oConfirmationDialog = null; // Reinicia la referencia al diálogo
          },

            onSearch : function (oEvt) {
                var aFilters = [];
                var sQuery = oEvt.getSource().getValue();
                if (sQuery && sQuery.length > 0) {
                  var filter = new sap.ui.model.Filter("NombrePais", sap.ui.model.FilterOperator.Contains, sQuery);
                  aFilters.push(filter);
                }
                var list = this.getView().byId("table");
                console.log(list);
                var binding = list.getBinding("items");
                console.log(binding);
                if (binding) {
                  binding.filter(aFilters, "Application");
                } else {
                  list.attachEventOnce("updateFinished", function() {
                    binding = list.getBinding("items");
                    binding.filter(aFilters, "Application");
                  });
                }
              },



              onCreate: function() {
                var oView = this.getView();
              
                // Obtener los valores ingresados en los campos de entrada
                var oModel = oView.getModel();
                var oNewCountry = {
                  // IdPais: oView.byId("idPaisInput").getValue(),
                  NombrePais: oView.byId("nombrePaisInput").getValue(),
                  CapitalPais: oView.byId("capitalPaisInput").getValue(),
                  PoblacionPais: oView.byId("poblacionPaisInput").getValue(),
                  SuperficiePais: oView.byId("superficiePaisInput").getValue(),
                  MonedaPais: oView.byId("monedaPaisInput").getValue(),
                  IdiomaPais: oView.byId("idiomaPaisInput").getValue()
                };

                console.log(oNewCountry)
              
                // Llamar al método create_entity con los datos del nuevo país
                oModel.create("/paisSet", oNewCountry, {
                  success: function() {
                    MessageToast.show("País creado exitosamente");
                  },
                  error: function(oError) {
                    MessageToast.error("Error al crear el país");
                  }
                });
              },

              //navegacion a detalle

              NavToDetail: function (oEvent) {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                var selectedIdPais = oEvent.getSource().getBindingContext().getProperty("IdPais");
                oRouter.navTo("RouteDetail", {
                    IdPais: selectedIdPais
                });
              },
              


              //expander el panel
              expandir: function (oEvent) {
                var oToolbar = oEvent.getSource();
                var oHeaderToolbar = oToolbar.getParent();
                var oPanel = oHeaderToolbar.getParent();
                oPanel.setExpanded(!oPanel.getExpanded());
              }
              
              

              



        });
    });
