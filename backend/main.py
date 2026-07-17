# backend/main.py
import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional
import math
import heapq

app = FastAPI(title="FIFA World Cup 2026 - Stadium Operations Backend")

# Allow requests from React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify the actual frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── STADIUM TOPOLOGY REPRESENTATION ───
# Coordinates from STADIUM_MANUAL for distance calculations
NODE_COORDS = {
    # Gates
    "Gate A": (400, 70),
    "Gate B": (620, 180),
    "Gate C": (620, 420),
    "Gate D": (400, 530),
    "Gate E": (180, 420),
    "Gate F": (180, 180),
    # Sections
    "Sec 101": (400, 140),
    "Sec 102": (490, 160),
    "Sec 103": (550, 210),
    "Sec 104": (570, 300),
    "Sec 105": (550, 390),
    "Sec 106": (490, 440),
    "Sec 107": (400, 460),
    "Sec 108": (310, 440),
    "Sec 109": (250, 390),
    "Sec 110": (230, 300),
    "Sec 111": (250, 210),
    "Sec 112": (310, 160)
}

# Base graph edges (connections) between adjacent sections and sections-to-gates
GRAPH_EDGES = [
    # Circular connections between adjacent sections
    ("Sec 101", "Sec 102"), ("Sec 102", "Sec 103"), ("Sec 103", "Sec 104"),
    ("Sec 104", "Sec 105"), ("Sec 105", "Sec 106"), ("Sec 106", "Sec 107"),
    ("Sec 107", "Sec 108"), ("Sec 108", "Sec 109"), ("Sec 109", "Sec 110"),
    ("Sec 110", "Sec 111"), ("Sec 111", "Sec 112"), ("Sec 112", "Sec 101"),
    
    # Gate-to-section connections (primary evacuation corridors)
    ("Sec 101", "Gate A"), ("Sec 112", "Gate A"),
    ("Sec 102", "Gate B"), ("Sec 103", "Gate B"),
    ("Sec 104", "Gate C"), ("Sec 105", "Gate C"),
    ("Sec 106", "Gate D"), ("Sec 107", "Gate D"),
    ("Sec 108", "Gate E"), ("Sec 109", "Gate E"),
    ("Sec 110", "Gate F"), ("Sec 111", "Gate F")
]

# Real-time News Database
NEWS_DATABASE = [
    { "id": 1, "date": "9 Jul 2026", "headline": "BREAKING: FIFA World Cup 2026 semi-final matchups locked. High-octane clash expected at SoFi Stadium.", "tag": "MATCH_DAY", "color": "#0077b6", "details": "The semi-final line-ups are set. Argentina faces Morocco, while France will play Switzerland in back-to-back stadium double-headers." },
    { "id": 2, "date": "9 Jul 2026", "headline": "Operations update: MetLife Stadium launches real-time AI-powered spectator flow sensors.", "tag": "TECH_OPS", "color": "#2b9348", "details": "New thermal crowd-density sensors integrated with our AI agents will dynamically calculate walking routes and concession wait times." },
    { "id": 3, "date": "8 Jul 2026", "headline": "Norway stun Brazil 2-1 in Dallas to advance to their first-ever World Cup Quarter-Final", "tag": "UPSET", "color": "#ea580c", "details": "A late penalty from Erling Haaland sends Brazil home and scripts historical glory for Norwegian football." },
    { "id": 4, "date": "7 Jul 2026", "headline": "Belgium dismantle USA 4-1 at SoFi Stadium — Kevin De Bruyne masterclass with 2 goals", "tag": "RESULT", "color": "#0077b6", "details": "The Red Devils advance to the quarterfinals behind an inspiring performance by skipper De Bruyne." },
    { "id": 5, "date": "6 Jul 2026", "headline": "Safety First: Stadium operations team releases new extreme weather and heat-safety guidelines.", "tag": "SAFETY", "color": "#dc2626", "details": "With summer temperatures rising, organizers have added 20 additional water-refill stations and emergency cooling zones." }
]

class EvacuationRequest(BaseModel):
    start_section: str
    emergency_type: str  # "fire", "medical", "evacuation", "security"
    congested_nodes: Optional[List[str]] = []
    congested_gates: Optional[List[str]] = []

def calculate_distance(node1: str, node2: str) -> float:
    c1 = NODE_COORDS.get(node1)
    c2 = NODE_COORDS.get(node2)
    if not c1 or not c2:
        return 9999.0
    return math.sqrt((c1[0] - c2[0])**2 + (c1[1] - c2[1])**2)

@app.post("/api/evacuate")
def get_evacuation_path(req: EvacuationRequest):
    start = req.start_section
    if start not in NODE_COORDS:
        raise HTTPException(status_code=400, detail="Invalid start section")
    
    # Build graph with dynamic congestion weights
    adj_list = {node: [] for node in NODE_COORDS}
    
    for u, v in GRAPH_EDGES:
        dist = calculate_distance(u, v)
        
        # Apply congestion multipliers
        weight_u_to_v = dist
        weight_v_to_u = dist
        
        # If node is congested (simulated or flagged in req)
        if u in req.congested_nodes:
            weight_v_to_u *= 6.0
        if v in req.congested_nodes:
            weight_u_to_v *= 6.0
            
        # If target is a congested or closed gate
        if u in req.congested_gates:
            weight_v_to_u *= 25.0
        if v in req.congested_gates:
            weight_u_to_v *= 25.0
            
        # If the emergency is localized fire, isolate the affected nodes completely
        if req.emergency_type == "fire":
            if u in req.congested_nodes or u in req.congested_gates:
                weight_v_to_u = 99999.0
            if v in req.congested_nodes or v in req.congested_gates:
                weight_u_to_v = 99999.0
                
        adj_list[u].append((weight_u_to_v, v))
        adj_list[v].append((weight_v_to_u, u))
        
    # Dijkstra's Algorithm to find shortest path to ANY open gate
    gates = ["Gate A", "Gate B", "Gate C", "Gate D", "Gate E", "Gate F"]
    open_gates = [g for g in gates if g not in req.congested_gates]
    
    if not open_gates:
        # Fallback if all gates are congested, allow routing anyway but flag alert
        open_gates = gates
        
    distances = {node: float('inf') for node in NODE_COORDS}
    previous = {node: None for node in NODE_COORDS}
    distances[start] = 0.0
    
    pq = [(0.0, start)]
    
    while pq:
        curr_dist, u = heapq.heappop(pq)
        
        if curr_dist > distances[u]:
            continue
            
        for weight, v in adj_list[u]:
            new_dist = curr_dist + weight
            if new_dist < distances[v]:
                distances[v] = new_dist
                previous[v] = u
                heapq.heappush(pq, (new_dist, v))
                
    # Find the closest open gate
    best_gate = None
    min_dist = float('inf')
    for gate in open_gates:
        if distances[gate] < min_dist:
            min_dist = distances[gate]
            best_gate = gate
            
    if not best_gate or min_dist == float('inf'):
        raise HTTPException(status_code=500, detail="No evacuation route could be calculated")
        
    # Reconstruct path
    path = []
    curr = best_gate
    while curr is not None:
        path.append(curr)
        curr = previous[curr]
    path.reverse()
    
    # Generate step-by-step directions based on node sequence
    directions = []
    directions.append(f"Exit Section {start} and proceed immediately to the main Level 1 concourse corridor.")
    
    for i in range(1, len(path) - 1):
        curr_node = path[i]
        prev_node = path[i-1]
        next_node = path[i+1]
        
        # Simple spatial instructions
        directions.append(f"Pass through the corridor near {curr_node}. Watch for green evacuation floor arrows.")
        
    directions.append(f"Arrive at {best_gate}. Follow security stewards located at the exits.")
    
    # Estimated time in seconds based on distance (assumes walking speed 1.4 m/s, coords scaled)
    est_time_seconds = int((min_dist * 0.4) + 60) # Base scale factor
    
    return {
        "success": True,
        "emergency_type": req.emergency_type,
        "start_section": start,
        "target_gate": best_gate,
        "path": path,
        "directions": directions,
        "estimated_time_seconds": est_time_seconds,
        "alert_level": "CRITICAL" if req.emergency_type in ["fire", "evacuation"] else "WARNING"
    }

@app.get("/api/news")
def get_news(query: Optional[str] = None, tag: Optional[str] = None):
    results = NEWS_DATABASE
    if tag:
        results = [item for item in results if item["tag"].upper() == tag.upper()]
    if query:
        q = query.lower()
        results = [item for item in results if q in item["headline"].lower() or q in item["details"].lower()]
    return results

@app.get("/api/health")
def health():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
