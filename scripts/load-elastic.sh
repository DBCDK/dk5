#!/usr/bin/env bash
set -euo pipefail

# Usage: scripts/load-elastic.sh <iso2709_input> [dk5_prefix_filter]
# Requires: docker compose services up (elasticsearch), iso2709 file present in ./data (mounted to /data)
# Example: scripts/load-elastic.sh data/dk5_total.iso2709 13

ISO_FILE=${1:-}
FILTER=${2:-}
DATA_HOST_PATH=${ISO_FILE}
BULK_JSON=data/elastic_bulk_load.json
ES_SERVICE=elasticsearch
ES_HOST=localhost:9200

if [[ -z "${ISO_FILE}" ]]; then
  echo "ERROR: Missing iso2709 input file path" >&2
  exit 1
fi
if [[ ! -f "${ISO_FILE}" ]]; then
  echo "ERROR: Input file not found: ${ISO_FILE}" >&2
  exit 1
fi

echo "[1/5] Converting ISO2709 -> bulk JSON (${BULK_JSON})";
if [[ -n "${FILTER}" ]]; then
  docker compose run --rm dk5-app node src/iso2709ToElasticLoad -f "${FILTER}" -i "/data/$(basename ${ISO_FILE})" -o "/data/$(basename ${BULK_JSON})"
else
  docker compose run --rm dk5-app node src/iso2709ToElasticLoad -i "/data/$(basename ${ISO_FILE})" -o "/data/$(basename ${BULK_JSON})"
fi


echo "[2/6] Dropping existing indices";
curl -s -XDELETE "${ES_HOST}/*" -H 'Content-Type: application/json' || true

echo "[3/6] Creating systematic index";
curl -s -XPUT "${ES_HOST}/systematic" -H 'Content-Type: application/json' -d '{"mappings":{"dk5":{"properties":{"parent":{"enabled":"false"}}}},"settings":{"number_of_shards":1, "max_result_window":50000}}'

echo "[4/6] Creating register index";
curl -s -XPUT "${ES_HOST}/register" -H 'Content-Type: application/json' -d '{"settings":{"analysis":{"char_filter":{"dk5":{"type":"mapping","mappings":[":=>kolon"]}},"analyzer":{"default":{"type":"custom","char_filter":["dk5"],"tokenizer":"standard","filter":["lowercase"]}}},"number_of_shards":1, "max_result_window":50000}}'

echo "[5/6] Bulk loading data";
BULK_RESULT=$(curl -s -XPOST "${ES_HOST}/_bulk?refresh=wait_for" -H 'Content-Type: application/json' --data-binary @${BULK_JSON})
if echo "$BULK_RESULT" | grep -q '"errors":true'; then
  echo "ERROR: Bulk load reported errors!"
  echo "$BULK_RESULT" | jq '.items[] | select(.index.error != null)'
  exit 23
fi

echo "[6/6] Verifying document counts";
SYS_COUNT=$(curl -s "${ES_HOST}/systematic/_count" | jq .count)
REG_COUNT=$(curl -s "${ES_HOST}/register/_count" | jq .count)
echo "systematic count: $SYS_COUNT"
echo "register count: $REG_COUNT"

echo "Done. You can verify with: curl -s ${ES_HOST}/systematic/_count; curl -s ${ES_HOST}/register/_count"
