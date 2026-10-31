# ZsirafVision v4.7 – hordozható stream proxy (Koyeb, Fly.io, Railway, Northflank, Zeabur, HF Spaces, Cloud Run, Render)
FROM python:3.12-slim
WORKDIR /app
COPY server.py ./
COPY public ./public
ENV PROXY_ONLY=1 PORT=8080 PYTHONUNBUFFERED=1
EXPOSE 8080
CMD ["python", "server.py"]
