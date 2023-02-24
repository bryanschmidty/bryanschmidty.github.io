#!/bin/bash

# Check if jq is installed
if ! command -v jq &>/dev/null; then
  echo "Error: jq is not installed. Please install it by running 'sudo apt-get install jq' on Ubuntu or 'brew install jq' on macOS."
  exit 1
fi

cat /dev/null > menu.json

# Initialize the json data as an empty array
json_data="[]"

# Recursively iterate over the directory and add each file and sub-directory to the json data
function process_directory {
  new_json="[]"
  for item in "$1"/*; do
    if [ -f "$item" ]; then
      # Add the file name and size to the json data
      file_name=$(basename "$item")
      new_json=$(echo "$new_json" | jq ". + [{\"file\":\"$file_name\"}]")
    else
      sub_dir_data=$(process_directory "$item")
      dir_name=${item#./}
      new_json=$(echo "$new_json" | jq ". + [{\"directory\":\"$dir_name\",\"files\":$sub_dir_data}]")
    fi
  done
  echo "$new_json"
}

cd chats

json_data=$(process_directory ".")

# Write the json data to the output file
cd ..
echo "$json_data" > menu.json
