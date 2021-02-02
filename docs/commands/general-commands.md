## General Commands

##### Clean

This is lerna command that runs in all packages contains clean script.
As the name suggests it cleans all the packages according to the local clean script

##### Exec

This is lerna helper command. It uses the local lerna package to learn `lerna exec`. After that
you should provide the command that you want to execute and optionally the scope for it.

##### Typecheck

This is lerna command that runs in all packages containing the `typesc`