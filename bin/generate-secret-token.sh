#!/usr/bin/env bash

BLUE="\033[0;34m"
RED="\033[0;31m"
COFF="\033[0m"

function generate_token() {
  token=$(LC_ALL=c tr -dc A-Za-z0-9 </dev/urandom | head -c 25)
  sed -i.bak -e "s/SECRET_TOKEN=.*/SECRET_TOKEN=$token/" .env
  rm .env.bak
}

function generate_secret_token() {
	export $(grep -v '^#' .env | xargs -0)

	if [ ! "$SECRET_TOKEN" = "" ]; then
    printf "${RED}SECRET_TOKEN already set${COFF}\n"
    printf "${BLUE}Override? [Y/n]${COFF}"
    read -n1 answer
    printf "\n"

    if [ "$answer" = "y" ] || [ "$answer" = "Y" ]; then
      generate_token
    fi
  else
    generate_token
  fi
}

generate_secret_token
