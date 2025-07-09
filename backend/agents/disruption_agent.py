import json
from pathlib import Path
import random
from datetime import datetime

class DisruptionAgent:
    def __init__(self, data_path: str):
        self.data_path = Path(data_path)
        self.disruption_types = ["weather", "traffic", "accident"]

    def get_disruptions(self):
        with open(self.data_path, 'r') as f:
            return json.load(f)

    def check_disruptions(self):
        # Placeholder: just return all disruptions for now
        return self.get_disruptions()

    def add_disruption(self, possible_routes):
        disruptions = self.get_disruptions()
        disrupted_routes = {d['location'] for d in disruptions}
        available_routes = list(set(possible_routes) - disrupted_routes)
        if not available_routes:
            return None  # No available route to disrupt
        route = random.choice(available_routes)
        disruption_type = random.choice(self.disruption_types)
        disruption = {
            "type": disruption_type,
            "location": route,
            "severity": random.choice(["low", "medium", "high"]),
            "timestamp": datetime.now().isoformat() + 'Z'
        }
        disruptions.append(disruption)
        with open(self.data_path, 'w') as f:
            json.dump(disruptions, f, indent=2)
        return disruption

    def resolve_oldest_disruption(self):
        disruptions = self.get_disruptions()
        if disruptions:
            resolved = disruptions.pop(0)
            with open(self.data_path, 'w') as f:
                json.dump(disruptions, f, indent=2)
            return resolved
        return None 