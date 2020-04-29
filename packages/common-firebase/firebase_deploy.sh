#!/usr/bin/env bash

firebase use common-daostack;

firebase deploy --only functions;
