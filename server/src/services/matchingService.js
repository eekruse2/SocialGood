import Item from '../models/Item.js';

// Weight configuration for different matching criteria
const MATCHING_WEIGHTS = {
  category: 0.3,      // Required field, higher weight
  subcategory: 0.2,   // Optional but important
  color: 0.15,        // Optional
  brand: 0.15,        // Optional
  model: 0.15,        // Optional
  size: 0.05,         // Optional
  material: 0.05,     // Optional
  condition: 0.05,    // Optional
  location: 0.15      // Optional, will be enhanced with map-based matching
};

// Helper function to calculate location similarity
const calculateLocationSimilarity = (loc1, loc2) => {
  if (!loc1 || !loc2) return 0;

  // Point-to-point matching
  if (loc1.locationType === 'point' && loc2.locationType === 'point') {
    const [lon1, lat1] = loc1.coordinates;
    const [lon2, lat2] = loc2.coordinates;
    // Calculate distance in kilometers
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    // Return higher score for closer points
    return distance < 1 ? 1 : 1 / (1 + distance);
  }

  // TODO: Implement route and area matching when MapBox integration is added
  return 0;
};

// Calculate similarity score between two items
const calculateSimilarityScore = (item1, item2) => {
  let totalScore = 0;
  let totalWeight = 0;

  // Category matching (required)
  if (item1.category && item2.category) {
    totalScore += MATCHING_WEIGHTS.category * (item1.category === item2.category ? 1 : 0);
    totalWeight += MATCHING_WEIGHTS.category;
  }

  // Optional fields matching
  if (item1.subcategory && item2.subcategory) {
    totalScore += MATCHING_WEIGHTS.subcategory * (item1.subcategory === item2.subcategory ? 1 : 0);
    totalWeight += MATCHING_WEIGHTS.subcategory;
  }

  if (item1.color && item2.color) {
    totalScore += MATCHING_WEIGHTS.color * (item1.color === item2.color ? 1 : 0);
    totalWeight += MATCHING_WEIGHTS.color;
  }

  if (item1.brand && item2.brand) {
    totalScore += MATCHING_WEIGHTS.brand * (item1.brand === item2.brand ? 1 : 0);
    totalWeight += MATCHING_WEIGHTS.brand;
  }

  if (item1.model && item2.model) {
    totalScore += MATCHING_WEIGHTS.model * (item1.model === item2.model ? 1 : 0);
    totalWeight += MATCHING_WEIGHTS.model;
  }

  if (item1.size && item2.size) {
    totalScore += MATCHING_WEIGHTS.size * (item1.size === item2.size ? 1 : 0);
    totalWeight += MATCHING_WEIGHTS.size;
  }

  if (item1.material && item2.material) {
    totalScore += MATCHING_WEIGHTS.material * (item1.material === item2.material ? 1 : 0);
    totalWeight += MATCHING_WEIGHTS.material;
  }

  if (item1.condition && item2.condition) {
    totalScore += MATCHING_WEIGHTS.condition * (item1.condition === item2.condition ? 1 : 0);
    totalWeight += MATCHING_WEIGHTS.condition;
  }

  // Location matching
  if (item1.location && item2.location) {
    const locationScore = calculateLocationSimilarity(item1.location, item2.location);
    totalScore += MATCHING_WEIGHTS.location * locationScore;
    totalWeight += MATCHING_WEIGHTS.location;
  }

  // Calculate final score
  const finalScore = totalWeight > 0 ? totalScore / totalWeight : 0;

  // Determine confidence level
  let confidence = 'low';
  if (finalScore >= 0.8) confidence = 'high';
  else if (finalScore >= 0.5) confidence = 'medium';

  return {
    score: finalScore,
    confidence
  };
};

// Find potential matches for an item
export const findPotentialMatches = async (itemId) => {
  try {
    const item = await Item.findByPk(itemId);
    if (!item) throw new Error('Item not found');

    // Get all items of opposite type
    const oppositeType = item.type === 'lost' ? 'found' : 'lost';
    const potentialMatches = await Item.findAll({
      where: {
        type: oppositeType,
        status: 'active',
        category: item.category // Only match within the same category
      }
    });

    // Calculate match scores for each potential match
    const matches = potentialMatches.map(match => {
      const { score, confidence } = calculateSimilarityScore(item, match);
      return {
        item: match,
        score,
        confidence
      };
    });

    // Sort by score and filter out low confidence matches
    return matches
      .filter(match => match.score > 0.3)
      .sort((a, b) => b.score - a.score);
  } catch (error) {
    console.error('Error finding matches:', error);
    throw error;
  }
};

// Update match scores for all active items
export const updateAllMatchScores = async () => {
  try {
    const activeItems = await Item.findAll({
      where: { status: 'active' }
    });

    for (const item of activeItems) {
      const matches = await findPotentialMatches(item.id);
      if (matches.length > 0) {
        const bestMatch = matches[0];
        await item.update({
          matchScore: bestMatch.score,
          matchConfidence: bestMatch.confidence
        });
      }
    }
  } catch (error) {
    console.error('Error updating match scores:', error);
    throw error;
  }
}; 