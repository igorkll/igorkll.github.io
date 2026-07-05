#!/bin/bash

download_image() {
    local REPO="$1"
    local IMAGE_NAME="$2"
    local API_URL="https://api.github.com/repos/$REPO/releases/latest"

    if command -v jq &> /dev/null; then
        DOWNLOAD_URL=$(curl -s "$API_URL" | jq -r ".assets[] | select(.name==\"$IMAGE_NAME\") | .browser_download_url")
    else
        DOWNLOAD_URL=$(curl -s "$API_URL" | grep -o '"browser_download_url": "[^"]*' | grep -o '[^"]*$' | grep "$IMAGE_NAME")
    fi

    if [ -z "$DOWNLOAD_URL" ]; then
        echo "Error: $IMAGE_NAME not found in latest release of $REPO."
        exit 1
    fi

    echo "Download URL: $DOWNLOAD_URL"
    echo "Downloading $IMAGE_NAME..."
    curl -L -o "$IMAGE_NAME" "$DOWNLOAD_URL"

    if [ $? -ne 0 ] || [ ! -f "$IMAGE_NAME" ]; then
        echo "Download failed."
        exit 1
    fi
}

unpack_image() {
    local IMAGE_NAME="$1"

    echo "Download complete. Splitting into 80MB parts..."
    split -b 80M "$IMAGE_NAME.img" "${IMAGE_NAME}.img.part_"

    echo "Done. Parts:"
    ls -lh "${IMAGE_NAME}.img.part_"*
}

update_image() {
    local IMAGE_NAME="$1"

    cd "$IMAGE_NAME"
    rm -f "$IMAGE_NAME.img"
    rm -rf "$IMAGE_NAME.img."*
    download_image "igorkll/$IMAGE_NAME" "$IMAGE_NAME.img"
    unpack_image "$IMAGE_NAME"
    cd ..
}

update_image ALinux

