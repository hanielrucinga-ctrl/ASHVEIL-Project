#!/bin/sh
# Restart contract: probe preview port, start only if down, return fast.
set -eu
if curl -sf -o /dev/null --max-time 1 http://127.0.0.1:3000/; then
  exit 0
fi
cd /workspace
npm run dev >/tmp/ashveil-dev.log 2>&1 &
for i in $(seq 1 40); do
  if curl -sf -o /dev/null --max-time 1 http://127.0.0.1:3000/; then
    exit 0
  fi
  sleep 0.25
done
exit 0
