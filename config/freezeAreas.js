// Flights in the freeze will discard any new advisory

// KML to this format :
// Find : (\d+\.\d+),(\d+\.\d+),\d+\.\d+
// Replace with : [\1, \2],\n

const EGLL = [
  // Define coordinates here
  // Decimal values, long/lat
  // Polygon must be closed, i.e last point should equal first point
  [2.0306608, 49.1888617],
  [2.75, 49.45],
  [3.61, 50.4952778],
  [2.5455556, 51.0891667],
  [1.4666667, 50.99999999999999],
  [1.4666667, 50.66666669999999],
  [0.560952, 50.315695],
  [2.0306608, 49.1888617],
];

const LSZH = undefined;

export default {
  EGLL,
  LSZH,
};
