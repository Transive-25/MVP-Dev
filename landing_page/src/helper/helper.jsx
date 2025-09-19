  // Generate a smooth curved path (Uber style)
  export const getCurvedPath = (start, end, segments = 100) => {
    if (!start || !end) return [start, end];

    const lat1 = start.lat;
    const lng1 = start.lng;
    const lat2 = end.lat;
    const lng2 = end.lng;

    // Calculate distance between points
    const distance = Math.sqrt(Math.pow(lat2 - lat1, 2) + Math.pow(lng2 - lng1, 2));

    // Dynamic arc height based on distance (more curve for longer distances)
    // Minimum arc height of 0.001 for very close points, up to 0.03 for far points
    const arcHeight = Math.max(0.001, Math.min(0.03, distance * 0.2));

    // Midpoint
    let cLat = (lat1 + lat2) / 2;
    let cLng = (lng1 + lng2) / 2;

    // Add arc height (skew midpoint to curve the line)
    // Determine direction of curve based on line orientation
    const angle = Math.atan2(lng2 - lng1, lat2 - lat1);

    // Curve perpendicular to the line direction
    cLat += arcHeight * Math.cos(angle + Math.PI / 2);
    cLng += arcHeight * Math.sin(angle + Math.PI / 2);

    // Create curve points using quadratic Bézier interpolation
    const curvePoints = [];
    for (let t = 0; t <= 1; t += 1 / segments) {
      const oneMinusT = 1 - t;
      const lat =
        oneMinusT * oneMinusT * lat1 +
        2 * oneMinusT * t * cLat +
        t * t * lat2;

      const lng =
        oneMinusT * oneMinusT * lng1 +
        2 * oneMinusT * t * cLng +
        t * t * lng2;

      curvePoints.push({ lat, lng });
    }

    return curvePoints;
  };
