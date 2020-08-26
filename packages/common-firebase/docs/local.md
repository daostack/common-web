# Running firebase locally

To run the firebase suite locally you need to have few utils installed on your machine. They are:

1. GCloud CLI
	- To install it run the following snipped:

			curl https://sdk.cloud.google.com | bash
			exec -l $SHELL
			gcloud init
2. MD5SHA1Sum
	- To install it run the following snipped:

		`brew install md5sha1sum`
		
		
To start the emulation suit first you need to pull the latest Firestore backups with `yarn data:update` and then to run the you can use `yarn start` witch starts the whole emulation suite including cloudFunctions, Firestore and others.