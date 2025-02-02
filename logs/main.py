import json
import psycopg2
import sys

AUTO_MATS = "ep_auto_mats"
BATTERIES = "ep_batteries"
CAR_COVERS = "ep_car_covers"
CAR_TRUNKS = "ep_car_trunks"
LUBRICATING_OILS = "ep_lubricating_oils"
ROOF_BARS = "ep_roof_bars"
SNOW_CHAINS = "ep_snow_chains"
TRUNK_LINKER = "ep_trunk_liner"


def get_args():
    args = sys.argv[1:]
    url = None
    start_id = None

    for i in range(len(args)):
        if args[i] == "--url" and i + 1 < len(args):
            url = args[i + 1]
        elif args[i] == "--start-id" and i + 1 < len(args):
            start_id = int(args[i + 1])

    if url is None:
        print("URL is required")
        sys.exit(1)

    return url, start_id


def get_logs(url, start_id=1):
    conn = psycopg2.connect(url)
    cur = conn.cursor()
    cur.execute(
        "SELECT id, filter, configurator, created_at FROM ep_log WHERE id >= %s limit 10;",
        (start_id,),
    )
    rows = cur.fetchall()
    conn.close()
    return rows


def parse_where(where_filter, keys=[]):
    output = []

    for key in keys:
        if key not in where_filter:
            continue
        output.append(f"{key} filtered as {where_filter[key]}")

    print(", ".join(output))


def parse_logs(row):
    _, filter, configurator, _ = row
    parsed_filter = json.loads(filter)

    if configurator == AUTO_MATS:
        print("Querying auto mats")
        parse_where(parsed_filter["where"], ["brand", "model", "year", "type"])
    if configurator == BATTERIES:
        print("Querying batteries")
        parse_where(
            parsed_filter["where"],
            ["ah", "length", "width", "height", "positive_polarity"],
        )
    if configurator == CAR_COVERS:
        print("Querying car covers")
        parse_where(parsed_filter["where"], ["brand", "model"])
    if configurator == CAR_TRUNKS:
        print("Querying car trunks")
        parse_where(
            parsed_filter["where"],
            ["capacity", "color", "double_opening", "fixing_type"],
        )
    if configurator == LUBRICATING_OILS:
        print("Querying lubricating oils")
        parse_where(
            parsed_filter["where"],
            [
                "type",
                "gradation",
                "format",
                "specs",
                "brand",
                "oem_brand",
                "oem_certify",
            ],
        )
    if configurator == ROOF_BARS:
        print("Querying roof bars")
        parse_where(
            parsed_filter["where"], ["manufacter", "brand", "model", "year", "type"]
        )
    if configurator == SNOW_CHAINS:
        print("Querying snow chains")
        parse_where(
            parsed_filter["where"],
            ["width", "ratio", "diameter", "typology"],
        )
    if configurator == TRUNK_LINKER:
        print("Querying trunk linker")
        parse_where(parsed_filter["where"], ["car_model", "car_year"])


def main(url, start_id):
    logs = get_logs(url, start_id or 1)
    for log in logs:
        parse_logs(log)


if __name__ == "__main__":
    url, start_id = get_args()
    main(url, start_id)
