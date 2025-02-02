## Usage

### Locally

Install the required packages with the following command:

```bash
pip install -r requirements.txt
```

Then run the script with the following command:

```bash
python main.py --url PROD_DB_URL [--stard-id n]
```

- `--url`: URL of the production database.
- `--start-id`: ID of the first record to be processed. Defaults to 1 (all logs) if not specified.

### With Docker

Build the image with the following command:

```bash
docker build -t log-processor .
```

Run the image with the following command:

```bash
docker run --rm log-processor --url PROD_DB_URL [--start-id n]
```

