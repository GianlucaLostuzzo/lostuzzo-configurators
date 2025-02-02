FROM python:3.12.8-alpine

WORKDIR /app

COPY . /app

RUN pip install -r requirements.txt

ENTRYPOINT ["python", "main.py"]

CMD ["--url", "$URL"]
