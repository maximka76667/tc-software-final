import asyncio
import json
import random
import websockets
from http.server import BaseHTTPRequestHandler, HTTPServer
import threading
from time import sleep

# Simulation state variables
state = "initial"  # initial, precharging, precharged, levitating, levitated, motor_starting, cruising, motor_stopping, levitation_stopping, discharging
voltage = 0.0      # in Volts
elevation = 0.0    # in millimeters
current = 0.0      # in Amperes

# Tick interval (seconds)
TICK = 0.1

# Commands
commands = ["precharge", "discharge", "start levitation", "stop levitation"]

# HTTP Server
class PingHandler(BaseHTTPRequestHandler):
    def _set_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")  # You can replace * with 'http://localhost:5173' if you want
        self.send_header("Access-Control-Allow-Methods", "GET, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")

    def do_OPTIONS(self):  # Handle preflight
        self.send_response(200)
        self._set_headers()
        self.end_headers()

    def do_GET(self):
        if self.path == '/ping':
            self.send_response(200)
            self.send_header("Content-type", "application/json")
            self._set_headers()
            self.end_headers()
            self.wfile.write(json.dumps({ "pong": True }).encode())
        else:
            self.send_response(404)
            self._set_headers()
            self.end_headers()

def run_http_server():
    server = HTTPServer(('localhost', 3000), PingHandler)
    print("HTTP server running on http://localhost:3000")
    server.serve_forever()

# WebSocket Server
async def websocket_handler(websocket, path):
    global state, voltage, elevation, current, velocity
    print("Client connected. Simulation starting in 'initial' state.")

    # Reset simulation variables on new connection.
    state = "initial"
    voltage = 0.0
    elevation = 0.0
    current = 0.0

    async def send_message(severity, message):
        await websocket.send(json.dumps({"id": "message", "data": {
            "severity": severity,
            "message": message
        }}))  

    async def process_commands():
        """Attempt to receive a command with a timeout."""
        try:
            msg = await asyncio.wait_for(websocket.recv(), timeout=TICK)
            try:
                command = json.loads(msg)
                cmd = command.get("id", "").lower()
                # Process commands only if valid in the current state.
                if cmd == "precharge" and state == "initial":
                    print("Command 'precharge' received.")
                    return "precharge"
                elif cmd == "start levitation" and state == "precharged":
                    print("Command 'start levitation' received.")
                    return "start levitation"
                elif cmd == "stop levitation" and state == "levitated":
                    print("Command 'stop levitation' received.")
                    return "stop levitation"
                elif cmd == "discharge" and state == "precharged":
                    print("Command 'discharge' received.")
                    return "discharge"
                elif cmd == "fault":
                    print("Fault!")
                    return "fault"
                elif commands.__contains__(cmd):
                    return "inappropriate state"
                else:
                    print(f"Ignored command '{cmd}' in state '{state}'")
                    return None
            except Exception as e:
                print("Error processing command:", e)
                return None
        except asyncio.TimeoutError:
            return None

    while True:
        # Process any incoming command.
        cmd = await process_commands()
        if cmd:
            if cmd == "inappropriate state":
                await send_message(5, f"Cannot execute command — system is in {state} state")
            if cmd == "precharge":
                state = "precharging"
                await send_message(2, "Precharging...")
            elif cmd == "start levitation":
                state = "levitating"
                await send_message(2, "Starting levitation...")
            elif cmd == "stop levitation":
                state = "levitation_stopping"
                await send_message(2, "Stopping levitation...")
            elif cmd == "discharge":
                state = "discharging"
                await send_message(2, "Discharging...")
            elif cmd == "fault":
                state = "fault confirm"
                await websocket.send(json.dumps({"id": "fault confirmed"}))
                websocket.close()
                break

        # Update simulation based on state:
        if state == "precharging":
            voltage += 10  # Increase voltage by 10 V per tick
            if voltage >= 400:
                voltage = 400
                state = "precharged"
                await send_message(4, "Precharge complete.")
                print("Precharge complete.")
        elif state == "levitating":
            elevation += 1  # Increase elevation 1 mm per tick
            current += 1    # Increase current 1 A per tick
            if elevation >= 19 and current >= 11:
                elevation = 19
                current = 11
                state = "levitated"
                await send_message(4, "Levitation complete.")
                print("Levitation complete.")
        elif state == "levitation_stopping":
            elevation -= 1  # Decrease elevation by 1 mm per tick
            if current > 0:
                current -= 1  # Decrease current gradually to 0
            if elevation <= 0:
                elevation = 0
                current = 0
                state = "precharged"
                await send_message(4, "Levitation stopped.")                
                print("Levitation stopped.")
        elif state == "discharging":
            voltage -= 50  # Fast discharge: drop 50 V per tick
            if voltage <= 0:
                voltage = 0
                state = "initial"
                await send_message(4, "Discharge complete.")
                print("Discharge complete.")

        angles = [0, 0, 0]

        if elevation > 0:
            angles = [random.randrange(-15, 15), random.randrange(-15, 15), random.randrange(-15, 15)]

        # Build and send a data packet.
        packet = {
            "id": "data",
            "current_state": state,
            "angles": angles,
            "data": {
                "elevation": elevation,
                "voltage": voltage,
                "current": current
            }
        }
        try:
            print(packet)
            await websocket.send(json.dumps(packet))
        except Exception as e:
            print("Error sending data:", e)
            break

        await asyncio.sleep(TICK)

async def run_websocket_server():
    print("WebSocket server running on ws://localhost:6789")
    async with websockets.serve(websocket_handler, "localhost", 6789):
        await asyncio.Future()  # run forever

# Run both servers
if __name__ == '__main__':
    threading.Thread(target=run_http_server, daemon=True).start()
    asyncio.run(run_websocket_server())
