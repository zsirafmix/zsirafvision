#!/usr/bin/env bash
# ZsirafVision indító szkript

cd "$(dirname "$0")"

echo "=========================================================="
echo "📺 ZsirafVision - Videoton Retro IPTV Lejátszó Indítása..."
echo "=========================================================="

# Ellenőrizzük, hogy fut-e már a szerver
if lsof -Pi :8080 -sTCP:LISTEN -t >/dev/null ; then
    echo "A szerver már fut a 8080-as porton."
else
    echo "Python stream proxy & web szerver indítása (port: 8080)..."
    python3 server.py &
    SERVER_PID=$!
    sleep 1
fi

echo "Megnyitás az alapértelmezett böngészőben..."
if command -v xdg-open > /dev/null; then
    xdg-open "http://localhost:8080"
elif command -v sensible-browser > /dev/null; then
    sensible-browser "http://localhost:8080"
fi

echo ""
echo "🔗 Cím: http://localhost:8080"
echo "Jó szórakozást kíván a ZsirafVision!"
echo "=========================================================="
