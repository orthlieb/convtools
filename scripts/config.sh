no_prompt=false

if [ "$1" = "--no-prompt" ]; then
    no_prompt=true
fi

prompt() {
    if [ $no_prompt = true ]; then
        return
    fi
    echo -n "$1: " >&2
    read value
    echo -n $value
}

export SFTP_HOST=$(prompt SFTP_HOST)
export SFTP_USERNAME=$(prompt SFTP_USERNAME)
export SFTP_PASSWORD=$(prompt SFTP_PASSWORD)
export SFTP_REMOTEPATH=$(prompt SFTP_REMOTEPATH)
export CONVTOOLS='{"clearDestination": true, "host": "'$SFTP_HOST'", "username": "'$SFTP_USERNAME'", "password": "'$SFTP_PASSWORD'", "remotePath": "'$SFTP_REMOTEPATH'"}'
echo $CONVTOOLS

unset no_prompt
