#!/bin/bash

# Function to get user input for project details
get_project_details() {
    local folder="$1"

    while true; do
        read -p "Title? " title
        read -p "Description? " description
        read -p "Tags? (comma delimited) " tags
        read -p "Was AI used? (yes/no) " ai_used

        if [[ $ai_used == 'yes' ]]; then
            read -p "AI Name? " ai_name
            read -p "AI Link? " ai_link
        fi

#        created=$(git log --pretty=format:'%ai' -- $folder | tail -1 | cut -d ' ' -f 1)
#        updated=$(git log --pretty=format:'%ai' -- $folder | head -1 | cut -d ' ' -f 1)

        echo "Title: $title"
        echo "Description: $description"
        echo "Folder: $folder"
        echo "Tags: $tags"
        echo "AI: ${ai_name:-None} ${ai_link:-None}"
        echo "Created: $created"
        echo "Updated: $updated"

        read -p "Is this correct? (yes/no) " correct
        if [[ $correct == 'yes' ]]; then
            break
        fi
    done

    echo "{\"title\":\"$title\",\"description\":\"$description\",\"folder\":\"$folder\",\"created\":\"$created\",\"updated\":\"$updated\",\"tags\":[$(echo $tags | sed 's/,/\",\"/g' | sed 's/^/\"/' | sed 's/$/\"/')],\"ai\":{\"name\":\"${ai_name:-None}\",\"link\":\"${ai_link:-None}\"}}"
}

# Main recursive function
process_folder() {
    local folder="$1"

    for entry in "$folder"/*; do
        if [[ -d $entry ]]; then
            # Check if folder is in .skip file
            if grep -Fxq "$entry" .skip; then
                echo "Skipping previously skipped folder: $entry"
            else
              # Check if folder already exists in projects.json
              if ! jq -e --arg folder "$entry" '.[] | select(.folder == $folder)' projects.json > /dev/null; then
                  echo "Folder: $entry"
                  echo "Options:"
                  echo "1) See contents"
                  echo "2) Add to projects"
                  echo "3) Skip"
                  read -p "Choose an option (1/2/3): " choice
                  case "$choice" in
                      1)
                          echo "Contents:"
                          ls "$entry"
                          ;;
                      2)
                          project=$(get_project_details "$entry")
                          echo "$project"
                          jq --argjson project "$project" '. += [$project]' projects.json > tmp.json && mv tmp.json projects.json
                          ;;
                      3)
                          echo "$entry" >> .skip
                          ;;
                      *)
                          echo "Invalid choice."
                          ;;
                  esac
              fi
            fi
            process_folder "$entry"
        fi
    done
}

# Create projects.json if it does not exist
touch projects.json
if [[ ! -s projects.json ]]; then
    echo "[]" > projects.json
fi

# Start the process with the current folder
process_folder "."

echo "Processing complete."
