import geojson
import json

def extract_neighborhood_names(geojson_file, output_file):
    # Read the GeoJSON file
    with open(geojson_file, 'r') as f:
        data = geojson.load(f)

    # Extract the neighborhood names
    neighborhood_names = [feature['properties']['pri_neigh'] for feature in data['features']]

    # Write the neighborhood names to a new JSON file
    with open(output_file, 'w') as f:
        json.dump(neighborhood_names, f, indent=4)

if __name__ == "__main__":
    geojson_file = './public/data/chicago-boundaries.geojson'
    output_file = 'neighborhood_names.json'
    extract_neighborhood_names(geojson_file, output_file)