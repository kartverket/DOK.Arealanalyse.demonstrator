@echo off

set TENANT=a5f80a38-f3e4-4756-9298-c016d9e89da4
set NAME_OF_REGISTRY=crdokanalyse
set APP_NAME=dokarealanalyse-client
set APP_VERSION=%date:~10,4%%date:~4,2%%date:~7,2%

call az login --tenant %TENANT%
call az acr login -n %NAME_OF_REGISTRY%
call docker build -t %APP_NAME%:%APP_VERSION% .
call docker tag %APP_NAME%:%APP_VERSION% %NAME_OF_REGISTRY%.azurecr.io/%APP_NAME%:%APP_VERSION%
call docker push %NAME_OF_REGISTRY%.azurecr.io/%APP_NAME%:%APP_VERSION%
