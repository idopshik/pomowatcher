#!/usr/bin/env sh
gvim -c "execute 'VimwikiMakeDiaryNote' | $ | put =strftime('%H:%M') | norm $ a  "
