#!/usr/bin/env sh
kitty vim -u /home/st/Documents/MyJsScripts/github/littletimer/vimrc_special -c "execute 'VimwikiMakeDiaryNote' | $ | put =strftime('%H:%M') | norm $ a  "
