#!/usr/bin/env python3
import atexit
import signal
import subprocess
import sys
import time
import shutil
import platform
from pathlib import Path

ROOT = Path(__file__).resolve().parent
BACKEND_DIR = ROOT / "backend"
FRONTEND_DIR = ROOT / "frontend"
PROCESSES = []

def resolve_npm():
    candidates = ["npm"]
    if platform.system().lower().startswith("win"):
        candidates = ["npm.cmd", "npm"]
    for name in candidates:
        found = shutil.which(name)
        if found:
            return found
    raise FileNotFoundError("npm not found on PATH. Install Node.js or add npm to PATH.")

def check_paths():
    missing = []
    for path in (BACKEND_DIR, FRONTEND_DIR):
        if not path.exists():
            missing.append(str(path))
    if missing:
        raise FileNotFoundError(f"Missing required folders: {', '.join(missing)}")
    
def ensure_db():
    from backend.scripts.init_db import init_db
    init_db()

def spawn(command, cwd):
    print(f"Launching {' '.join(command)} (cwd={cwd})")
    proc = subprocess.Popen(command, cwd=cwd)
    PROCESSES.append(proc)
    return proc

def shutdown(*_):
    for proc in PROCESSES:
        if proc.poll() is None:
            proc.terminate()
    for proc in PROCESSES:
        if proc.poll() is None:
            try:
                proc.wait(timeout=10)
            except subprocess.TimeoutExpired:
                proc.kill()

def main():
    check_paths()
    ensure_db()
    
    backend_cmd = [
        sys.executable,
        "-m",
        "uvicorn",
        "app.main:app",
        "--reload",
        "--host",
        "0.0.0.0",
        "--port",
        "8000",
    ]
    npm = resolve_npm()
    frontend_cmd = [npm, "run", "dev", "--", "--host", "--port", "5173"]

    signal.signal(signal.SIGINT, shutdown)
    signal.signal(signal.SIGTERM, shutdown)
    atexit.register(shutdown)

    spawn(backend_cmd, BACKEND_DIR)
    # Small stagger so the API starts before the UI probes it.
    time.sleep(1)
    spawn(frontend_cmd, FRONTEND_DIR)

    print("Backend: http://localhost:8000")
    print("Frontend: http://localhost:5173")

    # Keep the parent alive while children run.
    try:
        while any(proc.poll() is None for proc in PROCESSES):
            time.sleep(0.5)
    except KeyboardInterrupt:
        pass
    finally:
        shutdown()


if __name__ == "__main__":
    main()
