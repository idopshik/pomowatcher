#!/usr/bin/env sh
kitty vim -c "execute 'VimwikiMakeDiaryNote' | $ | put =strftime('%H:%M') | norm $ a  "
