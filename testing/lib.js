  var gadgetPath = "https://s3.amazonaws.com/clinical-trials-gadget/xml/";
        var elemList = "sortable",
          elemTrial = "li.trial",
          classTrial = "trial",
          classTrialHidden = "trial-hidden",
          classIconEye = "icon-eye",
          classIconStar = "icon-star",
          urlPath = "https://s3.amazonaws.com/clinical-trials-gadget/xml/";

        function init(){
          loadTrialOrder();
          //loadTrials();
          /*
          getTrialOrder(function(orderObj){
            getTrialData(function(dataObj){
              displayData(orderObj, dataObj);
            });
          });
          */
          
        }

        gadgets.util.registerOnLoadHandler(function(){
          $(document).ready(function() {

            $("#trial-list").sortable({
              axis: "y",
              scroll: true,

              start: function( event, ui ) {
                ui.placeholder.height(ui.item.height());
              },

              update: function(event, ui) {
                saveTrialOrder($(this).sortable('toArray'));
              },

              items: "li:not(." + classTrialHidden + ")",
              cancel: "." + classTrialHidden
            });

            $(".view-home").on("click", ".icon-eye", function( event ){
              alert('a');
              event.preventDefault();
              var $trial = findTrialElement( $(this) );
              if ( $trial !== null ) {
                processTrialEyeClick( $trial );
              }
            });

            $(".view-home").on("click", ".icon-star", function( event ){
              alert('b');
              event.preventDefault();
              var $trial = findTrialElement( $(this) );
              if ( $trial !== null ) {
               processTrialStarClick( $trial );
              }
            });

            init();
          });  
        });
        