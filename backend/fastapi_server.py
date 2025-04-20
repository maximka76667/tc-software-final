import asyncio
import json
import random
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# --- Simulation state variables ---
state = "initial"  # initial, precharging, precharged, levitating, levitated, motor_starting, cruising, motor_stopping, levitation_stopping, discharging
voltage = 0.0      # in Volts
elevation = 0.0    # in millimeters
current = 0.0      # in Amperes
TICK = 0.1

commands = ["precharge", "discharge", "start levitation", "stop levitation"]

# --- FastAPI setup ---
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/ping")
def ping():
    return {"pong": True}

# --- WebSocket handler ---
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    global state, voltage, elevation, current

    state = "initial"
    voltage = 0.0
    elevation = 0.0
    current = 0.0

    async def send_message(severity, message):
        await websocket.send_json({"id": "message", "data": {
            "severity": severity,
            "message": message
        }})

    async def process_commands():
        try:
            msg = await asyncio.wait_for(websocket.receive_text(), timeout=TICK)
            try:
                command = json.loads(msg)
                cmd = command.get("id", "").lower()
                if cmd == "precharge" and state == "initial":
                    return "precharge"
                elif cmd == "start levitation" and state == "precharged":
                    return "start levitation"
                elif cmd == "stop levitation" and state == "levitated":
                    return "stop levitation"
                elif cmd == "discharge" and state == "precharged":
                    return "discharge"
                elif cmd == "fault":
                    return "fault"
                elif cmd in commands:
                    return "inappropriate state"
            except Exception as e:
                print("Error processing command:", e)
                return None
        except asyncio.TimeoutError:
            return None

    try:
        while True:
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
                    await websocket.send_json({"id": "fault confirmed"})
                    await websocket.close()
                    break

            # Update simulation
            if state == "precharging":
                voltage += 10
                if voltage >= 400:
                    voltage = 400
                    state = "precharged"
                    await send_message(4, "Precharge complete.")

            elif state == "levitating":
                elevation += 1
                current += 1
                if elevation >= 19 and current >= 11:
                    elevation = 19
                    current = 11
                    state = "levitated"
                    await send_message(4, "Levitation complete.")

            elif state == "levitation_stopping":
                elevation -= 1
                if current > 0:
                    current -= 1
                if elevation <= 0:
                    elevation = 0
                    current = 0
                    state = "precharged"
                    await send_message(4, "Levitation stopped.")

            elif state == "discharging":
                voltage -= 50
                if voltage <= 0:
                    voltage = 0
                    state = "initial"
                    await send_message(4, "Discharge complete.")

            angles = [0, 0, 0]
            if elevation > 0:
                angles = [random.randint(-15, 15) for _ in range(3)]

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
                await websocket.send_json(packet)
            except Exception as e:
                print("Error sending data:", e)
                break

            await asyncio.sleep(TICK)

    except WebSocketDisconnect:
        print("Client disconnected")

if __name__ == "__main__":
    uvicorn.run("fastapi_server:app", host="127.0.0.1", port=3000, reload=True)
