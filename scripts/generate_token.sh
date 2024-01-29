#!/bin/bash

# Generate a 32-byte random number and encode it in base64 format
TOKEN=$(openssl rand -base64 32)

# Print the generated token
echo "Generated Access Token: $TOKEN"
