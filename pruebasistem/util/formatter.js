sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/core/format/NumberFormat"
], function(Controller, NumberFormat) {
  "use strict";

  return {
    removeLeadingZerosAndFormatNumber: function(value) {
      // Remover los ceros iniciales
      if (value) {
        value = value.replace(/^0+/, "");
      }
      
      if (value) {
        var number = parseFloat(value);
        return number.toLocaleString(undefined, { useGrouping: true });
      }

      return value;
    }
  };
});
