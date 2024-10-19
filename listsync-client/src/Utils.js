export const lightenColor = (color, amount = 0.5) => {
    // Remove the '#' if it exists
    color = color.replace(/^#/, '');
  
    // Parse the color
    let r = parseInt(color.substring(0, 2), 16);
    let g = parseInt(color.substring(2, 4), 16);
    let b = parseInt(color.substring(4, 6), 16);
  
    // Lighten the color
    r = Math.round(r + (255 - r) * amount);
    g = Math.round(g + (255 - g) * amount);
    b = Math.round(b + (255 - b) * amount);
  
    // Ensure the values are within the valid range (0-255)
    r = Math.min(255, Math.max(0, r));
    g = Math.min(255, Math.max(0, g));
    b = Math.min(255, Math.max(0, b));
  
    // Convert back to hex
    const rHex = r.toString(16).padStart(2, '0');
    const gHex = g.toString(16).padStart(2, '0');
    const bHex = b.toString(16).padStart(2, '0');
  
    return `#${rHex}${gHex}${bHex}`;
  };