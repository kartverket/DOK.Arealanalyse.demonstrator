FROM python:3.12 AS build

WORKDIR /app
ENV VIRTUAL_ENV=/opt/venv
RUN python3 -m venv $VIRTUAL_ENV
ENV PATH="$VIRTUAL_ENV/bin:$PATH"
COPY main.py requirements.txt ./

RUN apt update \
    && apt install -y binutils \
    && pip3 install -r requirements.txt \
    && pyinstaller --name main --onefile --hidden-import=main ./main.py

FROM debian:bookworm-slim

WORKDIR /app
COPY --from=build /app/dist /app

EXPOSE 5002

CMD ["./main"]