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

            $("#test2").on("click", function(event){
              alert("alert");
              /*
              event.preventDefault();
              var $trial = findTrialElement($(this));
              if ( $trial !== null ) {
                processTrialEyeClick( $trial );
              }
              */
            });

            $(".icon-eye").on("click", function(){
              alert('a');
            })


            $(".icon-star").on("click", function(){
              alert('a');
            })

            $(".HeaderImage").click(function(){
              alert('a');
            })


            $( "."+classIconStar ).click( function( event ){
              event.preventDefault();
              var $trial = findTrialElement( $(this) );
              if ( $trial !== null ) {
               processTrialStarClick( $trial );
              }
            });



            init();
 
          });  
