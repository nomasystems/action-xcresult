#!/usr/bin/env bash

npm exec -- json2ts \
    --input xcresult-to-json/Schema/output.json \
    --output src/__generated__/output.d.ts
