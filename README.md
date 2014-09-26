##Overview

The clinical trials gadget is designed to run on Profiles Research Networking Software(PRNS) with Open Research Networking Gadgets(ORNG) extension installed.  The data is made available through a REST API.  http://scctsi-ctds-production.herokuapp.com/.

####Installation
1. checkout clinicalTrials.xml to your location \<GadgetURL\>
2. checkout image files to \<GadgetURL\>/images/.
3. checkout environment.js to \<GadgetURL\>/js/
4. checkout csl.gadget.css to \<GadgetURL\>/css/
5. update environment.js, change variable ENV_GADGET_URL to your gadget url.

####Basic workflow:
1. Make request to Profiles for user first and last name.
2. Make ajax call to API to get clinial trials data by user by full name.
3. Sort the clinial trials by the recruiting status and the trials enddate.
4. Save the sorted order to the Profiles database.
5. Display data on the gadget.

####Sandbox URL:
http://profilesstage.sc-ctsi.org/ORNG/

####Profiles Installation Download and Guide:
Profiles RNS Version 2.5.1  
http://profiles.catalyst.harvard.edu/?pg=download&version=2.5.1

####Profiles/ORNG Resources:
http://opensocial-resources.googlecode.com/svn/spec/0.9/OpenSocial-Specification.xml  
http://www.orng.info/  
https://groups.google.com/forum/#!forum/profilesrns
