#!/usr/bin/env bash
set -euo pipefail

# Load test env (sets PORT/PRO_PORT and CYPRESS_APP_* envs)
. "$(dirname "$0")/../test.env"

# Free ports 3000/3001 if already in use (best-effort)
for p in "$PORT" "$PRO_PORT"; do
  if command -v lsof >/dev/null 2>&1; then
    PIDS=$(lsof -ti :"$p" -sTCP:LISTEN || true)
    if [ -n "$PIDS" ]; then
      echo "Freeing port $p (pids: $PIDS)"
      kill $PIDS || true
      sleep 1
    fi
  fi
done

# Stop any Docker containers publishing these ports (best-effort)
if command -v docker >/dev/null 2>&1; then
  MAP=$(docker ps --format '{{.ID}} {{.Ports}} {{.Names}}' || true)
  if echo "$MAP" | grep -E "(0\.0\.0\.0|:::).*:(${PORT}|${PRO_PORT})->" >/dev/null 2>&1; then
    IDS=$(echo "$MAP" | awk -v p1=":${PORT}->" -v p2=":${PRO_PORT}->" '{ if ($2 ~ p1 || $2 ~ p2) print $1 }')
    if [ -n "$IDS" ]; then
      echo "Stopping Docker containers using ${PORT}/${PRO_PORT}: $IDS"
      docker stop $IDS || true
      sleep 1
    fi
  fi
fi

# Build assets just once
npm run build

# Start server without nodemon
node -r @babel/register src/main.js &
SERVER_PID=$!

echo "Started test server pid=$SERVER_PID on $HOST:$PORT and $HOST:$PRO_PORT"

# Ensure server is stopped on exit
cleanup() {
  if kill -0 "$SERVER_PID" 2>/dev/null; then
    kill "$SERVER_PID" || true
    # Give it a moment to exit
    sleep 1
  fi
}
trap cleanup EXIT

# Wait for both ports
npm run wait

# Run Cypress and propagate exit code
STATUS=0
npm run cy:run || STATUS=$?

exit "$STATUS"
