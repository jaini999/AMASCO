from agents.inventory_agent import InventoryAgent
from agents.route_agent import RouteAgent
from agents.disruption_agent import DisruptionAgent
import time
import threading
import json
from datetime import datetime

INVENTORY_PATH = 'data/inventory.json'
ROUTES_PATH = 'data/routes.json'
DISRUPTIONS_PATH = 'data/disruptions.json'
LOGS_PATH = 'data/logs.json'

ALL_POSSIBLE_ROUTES = [f'Route {i}' for i in range(1, 10)]

class Simulator:
    def __init__(self):
        self.inventory_agent = InventoryAgent(INVENTORY_PATH)
        self.route_agent = RouteAgent(ROUTES_PATH)
        self.disruption_agent = DisruptionAgent(DISRUPTIONS_PATH)
        self.paused = False
        self.running = True
        self.loop_thread = threading.Thread(target=self.run_loop)
        self.tick = 0

    def start(self):
        print('Starting simulation loop. Press Ctrl+C to stop.')
        self.loop_thread.start()

    def run_loop(self):
        while self.running:
            if not self.paused:
                self.simulation_step()
            time.sleep(2)

    def simulation_step(self):
        self.tick += 1
        # InventoryAgent logic: restock if needed
        restock_actions = self.inventory_agent.restock_if_needed()
        for action in restock_actions:
            self.log_action(
                'InventoryAgent',
                'restock',
                action['store'],
                f"Restocked {action['restock_amount']} units at {action['store']} (new stock: {action['new_stock']}, threshold: {action['threshold']})"
            )
        # DisruptionAgent logic
        disruptions = self.disruption_agent.check_disruptions()
        for disruption in disruptions:
            self.log_action('DisruptionAgent', 'disruption_check', disruption.get('location', 'unknown'), f'Checked disruption of type {disruption["type"]} at {disruption.get("location", "unknown")}')
        # RouteAgent logic: reroute if needed
        reroute_actions = self.route_agent.reroute_if_needed(disruptions)
        for action in reroute_actions:
            self.log_action(
                'RouteAgent',
                'reroute',
                action['truck'],
                f"Rerouted {action['truck']} from {action['from_route']} to {action['to_route']} due to {action['reason']}"
            )
        # Resolve the oldest disruption every 2 ticks
        if self.tick % 2 == 0:
            resolved = self.disruption_agent.resolve_oldest_disruption()
            if resolved:
                explanation = (
                    f"Resolved disruption: {resolved['type'].capitalize()} at {resolved['location']} (severity: {resolved['severity']}). "
                    f"This disruption was active for approximately 4 seconds (2 simulation ticks)."
                )
                self.log_action('DisruptionAgent', 'resolve_disruption', resolved['location'], explanation)

    def log_action(self, agent, action, target, explanation):
        log_entry = {
            'timestamp': datetime.utcnow().isoformat() + 'Z',
            'agent': agent,
            'action': action,
            'target': target,
            'details': explanation,
            'explanation': explanation
        }
        try:
            with open(LOGS_PATH, 'r+') as f:
                logs = json.load(f)
                logs.append(log_entry)
                f.seek(0)
                json.dump(logs, f, indent=2)
                f.truncate()
        except Exception as e:
            print(f'Error logging action: {e}')

    def pause(self):
        self.paused = True
        print('Simulation paused.')

    def resume(self):
        self.paused = False
        print('Simulation resumed.')

    def stop(self):
        self.running = False
        self.loop_thread.join()
        print('Simulation stopped.')

if __name__ == '__main__':
    sim = Simulator()
    try:
        sim.start()
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        sim.stop() 