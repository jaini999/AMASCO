import json
from pathlib import Path

class RouteAgent:
    def __init__(self, data_path: str):
        self.data_path = Path(data_path)

    def get_routes(self):
        with open(self.data_path, 'r') as f:
            return json.load(f)

    def reroute_if_needed(self, disruptions):
        routes = self.get_routes()
        disrupted_routes = {d['location'] for d in disruptions}
        all_possible_routes = {f'Route {i}' for i in range(1, 10)}  # Example: Route 1 to Route 9
        used_routes = {r['route'] for r in routes}
        reroute_actions = []
        updated = False
        for route in routes:
            if route['route'] in disrupted_routes:
                # Find an alternate route not disrupted and not in use
                available_routes = list(all_possible_routes - disrupted_routes - used_routes)
                if available_routes:
                    new_route = available_routes[0]
                    old_route = route['route']
                    route['route'] = new_route
                    reroute_actions.append({
                        'truck': route['truck'],
                        'from_route': old_route,
                        'to_route': new_route,
                        'reason': f'Disruption on {old_route}'
                    })
                    used_routes.add(new_route)
                    updated = True
        if updated:
            with open(self.data_path, 'w') as f:
                json.dump(routes, f, indent=2)
        return reroute_actions 