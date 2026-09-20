#!/usr/bin/env python3
"""Small dependency-free Acolyte runtime for local and sandbox use."""

from __future__ import annotations

import argparse
import json
import os
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit


ROOT = Path(__file__).resolve().parent
WEBAPP_ROOT = ROOT / "webapp"
ALLOWED_ENVIRONMENTS = {"local", "test", "sandbox", "staging", "production"}


class AcolyteHandler(SimpleHTTPRequestHandler):
    """Serve the immutable webapp and expose a small runtime health contract."""

    server_version = "AcolyteSandbox/1.0"

    def do_GET(self) -> None:  # noqa: N802 - stdlib handler API
        path = urlsplit(self.path).path
        if path in {"/health", "/health/"}:
            self._health()
            return
        super().do_GET()

    def _health(self) -> None:
        environment = os.environ.get("APP_ENV", "local").strip().lower()
        if environment not in ALLOWED_ENVIRONMENTS:
            self.send_error(503, "Invalid APP_ENV")
            return
        payload = {
            "status": "ok",
            "service": "acolyte",
            "environment": environment,
        }
        body = json.dumps(payload, separators=(",", ":")).encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.send_header("X-Robots-Tag", "noindex, nofollow, noarchive")
        self.end_headers()
        self.wfile.write(body)

    def end_headers(self) -> None:
        self.send_header("X-Robots-Tag", "noindex, nofollow, noarchive")
        super().end_headers()


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Serve the Acolyte webapp")
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=4173)
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    if not WEBAPP_ROOT.is_dir() or not (WEBAPP_ROOT / "index.html").is_file():
        raise SystemExit(f"Missing deployable webapp under {WEBAPP_ROOT}")
    handler = lambda *handler_args: AcolyteHandler(  # noqa: E731
        *handler_args, directory=str(WEBAPP_ROOT)
    )
    with ThreadingHTTPServer((args.host, args.port), handler) as server:
        print(
            f"Acolyte listening on http://{args.host}:{args.port} "
            f"(APP_ENV={os.environ.get('APP_ENV', 'local')})",
            flush=True,
        )
        try:
            server.serve_forever()
        except KeyboardInterrupt:
            pass


if __name__ == "__main__":
    main()
