        function getImgUrlByStat(status, isVisible){
          switch(status.toLowerCase()){
            case 'recruiting':
            case 'enrolling by invitation':
              return ENV_LOCAL_URL + "/images/" + (isVisible ? "icon_check.png" : "grey_icon_check.png");
            case 'active, not recruiting':
            case 'not yet recruiting':
              return ENV_LOCAL_URL + '/images/' + (isVisible ? 'icon_triangle.png' : 'grey_icon_triangle.png');
            case 'completed':
            case 'suspended':
            case 'terminated':
            case 'withdrawn':
              return ENV_LOCAL_URL + '/images/' + (isVisible ? 'icon_x.png' : 'grey_icon_x.png');
            default:
              return ENV_LOCAL_URL + '/images/filler.png';
          }          
        }

        function getOrderNumByStat(status){
          switch(status.toLowerCase()){
            case 'recruiting':
              return 1;
            case 'enrolling by invitation':
              return 2;
            case 'active, not recruiting':
              return 3;
            case 'not yet recruiting':
              return 4;
            case 'completed':
              return 5;
            case 'suspended':
              return 6;
            case 'terminated':
              return 7;
            case 'withdrawn':
              return 8;
            default:
              return 9;
          }        
        }

        function getAPIUrl(callback){
          var fullname, baseUrl = "http://scctsi-ctds-production.herokuapp.com/1/clinical_trials/";
          osapi.jsonld.getOwner().execute(function(result){
            fullname = result.jsonld['foaf:firstName'] + '%20' + result.jsonld['foaf:lastName'];

            // for testing only
            if(fullname === "chi%20kwan") fullname = "Agustin%20Garcia";
            if(callback)
              callback(fullname.length ? baseUrl + "?pi_full_name=" + fullname : null);
          }); 
        }

        function getAPIData(callback){
          getAPIUrl(function(url){
            if(url !== null){
              var params = {};
              params[gadgets.io.RequestParameters.METHOD] = gadgets.io.MethodType.GET;
              params[gadgets.io.RequestParameters.CONTENT_TYPE] = gadgets.io.ContentType.JSON;
              gadgets.io.makeRequest(url, callback, params);
            }
          });
        }

        function getAppData(callback){
          osapi.appdata.get({'userId':'@owner',
            'groupId':'@self',
            'appId':'@app',
            'fields':'ct_data'
          }).execute(function(result){
            if(callback)
              callback(result);
          });
        }

        function loadTrialList(callback){
          getAPIData(function(api_data){
            getAppData(function(db_data){

              if(!api_data.error && !db_data.error){
                var viewer = os.osapi.getViewerFromResult(db_data);
                var trials = [], trial = {}, apiTrialList, dbTrialList, newTrials, index;

                if(api_data.data.count){
                  apiTrialList = api_data.data.response;
                  
                  if($.isEmptyObject(viewer)){
                    sortTrials(apiTrialList);
                    for(var i=0; i<apiTrialList.length; i++){
                      trial = {};
                      trial.i = apiTrialList[i].id + '';
                      trial.f = 0;
                      trial.v = 1;
                      trials.push(trial);
                    }
                  } else {
                    dbTrialList = JSON.parse(viewer.ct_data);
                    newTrials = findNewTrials(dbTrialList, apiTrialList);
                    if(newTrials.length){
                      trials = dbTrialList.slice();
                      index = findIndexOfFirstHiddenTrial(trials);
                      sortTrials(newTrials);
                      for(var j=0; j<newTrials.length; j++){
                        trial = {};
                        trial.i = newTrials[j].id + '';
                        trial.f = 0;
                        trial.v = 1;
                        if(index === -1){
                          trials.push(trial);
                        } else {
                          trials.splice(index, 0, trial);
                        }
                      }
                    }
                  }

                  if(trials.length){
                    osapi.appdata.update({'userId':'@owner',
                      'groupId':'@self',
                      'appId':'@app',
                      'data':{'ct_data':JSON.stringify(trials)}
                    }).execute(function(response){
                      // display updated list
                      if(callback)
                        callback(trials, apiTrialList);
                    });  
                  } else {
                    if(callback && dbTrialList.length)
                      callback(dbTrialList, apiTrialList);
                  }
                }
              }
            });
          });
        }

        function sortTrials(trials){
          if(trials.length > 1){
            trials.sort(function(a,b){
              if(a.recruitingStatus === b.recruitingStatus)
                return new Date(b.studyCompletionDate) - new Date(a.studyCompletionDate);
              return getOrderNumByStat(a.recruitingStatus) - getOrderNumByStat(b.recruitingStatus);
            });
          }
        }

        function findNewTrials(dbTrialList, apiTrialList){
          var hash = {}, diff = [];
          for(var i=0; i<dbTrialList.length; i++){
            hash[dbTrialList[i].i] = true;
          }

          for(var j=0; j<apiTrialList.length; j++){
            if(hash[apiTrialList[j].id] !== true){
              diff.push(apiTrialList[j]);
            }
          }
          return diff;
        }

        function findTrialById(id, apiTrialList){
          for(var i=0; i<apiTrialList.length; i++){
            if(apiTrialList[i].id == id){
              return apiTrialList[i];
            }
          }
          return null;
        }

        function findIndexOfFirstHiddenTrial(trialList){
          var len = trialList.length;
          if(len === 0){
            return -1; 
          }
          for(var i=0; i<len; i++){
            if(trialList[i].v === 0){
              return i;
            }
          }
          return -1;
        }

        function displayData(dbTrialList, apiTrialList, showHiddenTrials){
          var displayCount = 2;
          $(".clinicalTrialGadget").show();

          $(".img_star").attr("src", ENV_LOCAL_URL + "/images/star_empty.png");
          $(".img_eye").attr("src", ENV_LOCAL_URL + "/images/eye_icon.png");

          for(var i=0; i<dbTrialList.length; i++){
            var trial = findTrialById(dbTrialList[i].i, apiTrialList);
            if(trial !== null && (showHiddenTrials || dbTrialList[i].v === 1)){
              renderTrial(dbTrialList[i], trial);
            }
          }
          
          if(gadgets.views.getCurrentView().name_ === "profile"){
            if($("#trial-list-full li:not(.trial-hidden)").length > displayCount){
              $("#trial-list-full li:gt(1)").hide();
              var textToInsert = '<div class="plusbutton"><span><strong>...</strong> Show more</span><img src="' + ENV_LOCAL_URL + '/images/expandRound.gif" alt="+" style="vertical-align:top"></div>';

              textToInsert += '<div class="minusbutton" style="display: none;"><span>Show less</span><img src="' + ENV_LOCAL_URL + '/images/collapseRound.gif" alt="-" style="vertical-align:top"></div>';
              
              $(".clinicalTrialGadget").append(textToInsert);
            }
            adjustProfileViewHeight();
          } else {
            adjustHomeViewHeight();
          }
        }

        function renderTrial(dbTrialData, trial){
          var isFeature = dbTrialData.f,
              isVisible = dbTrialData.v;

          var textToInsert, 
            classTrialHidden = isVisible === 0 ? " trial-hidden" : "", 
            classTrialFeature = isFeature === 1 ? " trial-feature" : "";

          textToInsert = '<li id=t' + trial.id + ' class="trial' + classTrialHidden + classTrialFeature + '"><div class="icon-wrap">';

          if(isFeature === 1){
            textToInsert += '<img class="icon-star" src="' + ENV_LOCAL_URL + '/images/star_filled.png">';
          } else { 
            textToInsert += '<img class="icon-star" src="' + ENV_LOCAL_URL + '/images/star_empty.png">';
          }

          if(isVisible === 1){
            textToInsert += '<img class="icon-eye" src="' + ENV_LOCAL_URL + '/images/eye_icon.png"></div>';
          } else {
            textToInsert += '<img class="icon-eye" src="' + ENV_LOCAL_URL + '/images/grey_eye_icon.png"></div>';
          }

          if(isFeature === 1){
            textToInsert += '<img class="icon-feat" src="' + ENV_LOCAL_URL + '/images/r_star.png">';
            textToInsert += '<span class="text-feat">FEATURED:</span>';
          }

          textToInsert += '<div class="title"><a href="' + $(trial.url).attr("href") + '" target="_blank">' + trial.officialTitle + '</a></div>';
          textToInsert += '<div class="detail"><img class="statImg" src="' + getImgUrlByStat(trial.recruitingStatus, isVisible) + '">';
          textToInsert += '<span class="status">' + trial.recruitingStatus + '</span>';
          textToInsert += '<span class="disease"> | ' + trial.diseaseArea + ' | </span>';
          textToInsert += '<span class="site">' + trial.siteStatus + '</span></div>';

          if(isFeature === 1){
            $("#trial-list-feat").append(textToInsert);
          } else {
            $("#trial-list").append(textToInsert);
          }        
        }

        function adjustProfileViewHeight(){
          gadgets.window.adjustHeight($(".clinicalTrialGadget").height() + 40);
        }

        function adjustHomeViewHeight(){
          gadgets.window.adjustHeight($(".clinicalTrialGadget").height() + 90);
        }




        gadgets.util.registerOnLoadHandler(function(){
          $(document).ready(function() {
            $(".view-profile").on("click", ".plusbutton", function(){
              $('#trial-list-full li:gt(1)').toggle();
              $('.plusbutton').hide();
              $('.minusbutton').show();
              adjustProfileViewHeight();
            });
   
            $(".view-profile").on("click", ".minusbutton", function(){
              $('#trial-list-full li:gt(1)').toggle();
              $('.plusbutton').show();
              $('.minusbutton').hide();
              adjustProfileViewHeight();
            });

            loadTrialList(function(dbData, apiData){
              displayData(dbData, apiData, false);
            });
          });
        });




        gadgets.util.registerOnLoadHandler(function(){
          $(document).ready(function(){

            $("#trial-list-feat").sortable({
              axis: "y",
              scroll: true,
              start: function(event, ui){
                ui.placeholder.height(ui.item.height());
              },
              update: function(event, ui){
                saveTrialStatus();
              }              
            });
            
            $("#trial-list").sortable({
              axis: "y",
              scroll: true,
              start: function( event, ui ) {
                ui.placeholder.height(ui.item.height());
              },
              update: function(event, ui) {
                saveTrialStatus();
              },
              items: "li:not(.trial-hidden)",
              cancel: ".trial-hidden"
            });

            $(".view-home").on("click", ".icon-eye", function(event){
              event.preventDefault();
              var $trial = findTrialElement($(this));
              if ( $trial !== null ) {
                processTrialEyeClick($trial);
                saveTrialStatus();
              }
            });

            $(".view-home").on("click", ".icon-star", function(event){
              event.preventDefault();
              var $trial = findTrialElement($(this));
              if ( $trial !== null ) {
                processTrialStarClick($trial);
                saveTrialStatus();
              }
            });

            $("#clear").on("click", function(event){
              osapi.appdata.delete({
                'userId':'@owner',
                'groupId':'@self',
                'appId':'@app',
                'fields':'ct_data'
              }).execute(function(){
                alert('clear');
              });
            });

            $("#show").on("click", function(event){
              osapi.appdata.get({
                'userId':'@owner',
                'groupId':'@self',
                'appId':'@app',
                'fields':'ct_data'
              }).execute(function(result){
                var viewer = os.osapi.getViewerFromResult(result);
                console.log(viewer.ct_data);
                alert(viewer.ct_data);
              });
            });

            loadTrialList(function(dbData, apiData){
              displayData(dbData, apiData, true);
            });
          });  
        });

        function saveTrialStatus(){
          var featItems = $("ul#trial-list-feat li.trial"),
              listItems = $("ul#trial-list li.trial"),
              trials = [], trial = {};

          featItems.each(function() {
            trial = {};
            trial.i = $(this).attr("id").slice(1);
            trial.f = 1;
            trial.v = 1;
            trials.push(trial);
          });

          listItems.each(function() {
            trial = {};
            trial.i = $(this).attr("id").slice(1);
            trial.f = 0;
            trial.v = $(this).attr("class").indexOf("trial-hidden") > 0 ? 0 : 1;
            trials.push(trial);
          });

          if(listItems.length || featItems.length){
            osapi.appdata.update({
              'userId':'@owner',
              'groupId':'@self',
              'appId':'@app',
              'data':{'ct_data':JSON.stringify(trials)}
            }).execute(function(response){
            });
          }
        }

        function findTrialElement($elem){
          return $elem.parents("li.trial");
        }

        function processTrialEyeClick($trial){
          var $trialLastVisible = findLastVisibleTrial();
          toggleTrialVisibility($trial);
          moveTrialToEndOfVisibleList($trial, $trialLastVisible);
        }

        function findLastVisibleTrial() {
          var $trialList = $("#trial-list").children();
          var $trialLastVisible = null; // $( "#"+elemList+" li:last" );
          $trialList.each( function( index ) {
            if ( !( $( this ).hasClass("trial-hidden") ) ) {
              $trialLastVisible = $( this );
            } else {
            // exits the loop
              return false;
            }   
          });
          return $trialLastVisible;
        }

        function toggleTrialVisibility($trial){
          var status = $trial.find(".status").text();
          if($trial.hasClass("trial-hidden")){
            $trial.find(".statImg").attr("src", getImgUrlByStat(status, 1));
            $trial.find(".icon-eye").attr("src", ENV_LOCAL_URL + "/images/eye_icon.png");
            $trial.removeClass("trial-hidden");
          } else {
            $trial.find(".statImg").attr("src", getImgUrlByStat(status, 0));
            $trial.find(".icon-eye").attr("src", ENV_LOCAL_URL + "/images/grey_eye_icon.png");
            $trial.addClass("trial-hidden");
            if ( $trial.hasClass("trial-feature")){
              $trial.find(".icon-star").attr("src", ENV_LOCAL_URL + "/images/star_empty.png");
              $trial.removeClass("trial-feature");
            } 
          }
        }

        function moveTrialToEndOfVisibleList($trial, $trialLastVisible) {
          var $clone = $trial.clone(true, true);
          if ( $trial.is( $trialLastVisible ) ) {
            $clone.appendTo( $( "#trial-list" ) );
          } else if ( $trialLastVisible === null ) {
            $clone.insertBefore( $( "#trial-list" ).children()[0]);
          } else {
            $clone.insertAfter( $trialLastVisible );
          }
          $trial.remove();
        }

        function processTrialStarClick($trial){
          var $trialLastFeature = findLastFeatureTrial();
          moveTrialToEndOfFeatureList($trial, $trialLastFeature);
          toggleTrialFeature($trial);
        }

        function toggleTrialFeature($trial) {  
          if ($trial.hasClass("trial-feature")){
            $trial.find(".icon-star").attr("src", ENV_LOCAL_URL + "/images/star_empty.png");
            $trial.removeClass( "trial-feature" );
          } else {
            $trial.find(".icon-star").attr("src", ENV_LOCAL_URL + "/images/star_filled.png");
            $trial.addClass("trial-feature");
          }
        }

        function moveTrialToEndOfFeatureList($trial, $trialLastVisible){
          if($trial.hasClass("trial-feature"))
            $("#trial-list").prepend($trial);
          else
            $("#trial-list-feat").prepend($trial);
        }

        function findLastFeatureTrial(){
          var $trialLastFeature = null;
          if($("#trial-list-feature").children(".trial-feature:last").length > 0)
            $trialLastFeature = $("#trial-list").children(".trial-feature:last");
          return $trialLastFeature;
        }
