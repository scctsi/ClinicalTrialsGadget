#Overview

The clinical trials gadget is designed to run on Profiles Research Networking Software(PRNS) with Open Research Networking Gadgets(ORNG) extension installed.  The data is made available through a REST API.  http://scctsi-ctds-production.herokuapp.com/.


###Basic workflow:
1. Make request to Profiles for user first and last name.
2. Make ajax call to API to get clinial trials data for the user by full name.
3. Sort the clinial trials by the recruiting status and the trials enddate.
4. Save the order back to the Profiles database.
5. Display data on the gadget.

###Sandbox URL
http://profilesstage.sc-ctsi.org/ORNG/

###Profiles Installation Download and Guide:
Profiles RNS Version 2.5.1  
http://profiles.catalyst.harvard.edu/?pg=software

###Profiles/ORNG Resource
http://opensocial-resources.googlecode.com/svn/spec/0.9/OpenSocial-Specification.xml  
http://www.orng.info/  
https://groups.google.com/forum/#!forum/profilesrns
