#!/usr/bin/env sh
kitty vim -c "execute 'VimwikiMakeDiaryNote'" -c "$" -c "put =strftime('%H:%M')" -c "norm $ a  "
