import Item from '../models/Item.js';
import User from '../models/User.js';
import { findPotentialMatches, updateAllMatchScores } from '../services/matchingService.js';

// @desc    Create a new lost or found item
// @route   POST /api/items
// @access  Private
export const createItem = async (req, res) => {
  try {
    const { 
      type, 
      title, 
      description, 
      imageUrl, 
      location, 
      date,
      category,
      subcategory,
      color,
      brand,
      model,
      size,
      material,
      condition,
      locationPrecision,
      datePrecision
    } = req.body;
    
    const item = await Item.create({
      userId: req.user.id,
      type,
      title,
      description,
      imageUrl,
      location,
      date,
      category,
      subcategory,
      color,
      brand,
      model,
      size,
      material,
      condition,
      locationPrecision,
      datePrecision
    });

    // Find potential matches for the new item
    const matches = await findPotentialMatches(item.id);
    if (matches.length > 0) {
      const bestMatch = matches[0];
      await item.update({
        matchScore: bestMatch.score,
        matchConfidence: bestMatch.confidence
      });
    }

    res.status(201).json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get all items (with optional filters)
// @route   GET /api/items
// @access  Public
export const getItems = async (req, res) => {
  try {
    const { type, status, category, confidence } = req.query;
    const where = {};
    
    if (type) where.type = type;
    if (status) where.status = status;
    if (category) where.category = category;
    if (confidence) where.matchConfidence = confidence;

    const items = await Item.findAll({
      where,
      include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName', 'email']
        }
      ],
      order: [['matchScore', 'DESC'], ['createdAt', 'DESC']]
    });

    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get item by ID
// @route   GET /api/items/:id
// @access  Public
export const getItemById = async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: Item,
          as: 'matchedItem',
          include: [{
            model: User,
            attributes: ['id', 'firstName', 'lastName', 'email']
          }]
        }
      ]
    });

    if (item) {
      // Get potential matches
      const matches = await findPotentialMatches(item.id);
      res.json({ item, potentialMatches: matches });
    } else {
      res.status(404).json({ message: 'Item not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Update item
// @route   PUT /api/items/:id
// @access  Private
export const updateItem = async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Check if user owns the item
    if (item.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this item' });
    }

    const { 
      title, 
      description, 
      imageUrl, 
      location, 
      date,
      category,
      subcategory,
      color,
      brand,
      model,
      size,
      material,
      condition,
      locationPrecision,
      datePrecision,
      status 
    } = req.body;

    await item.update({
      title: title || item.title,
      description: description || item.description,
      imageUrl: imageUrl || item.imageUrl,
      location: location || item.location,
      date: date || item.date,
      category: category || item.category,
      subcategory: subcategory || item.subcategory,
      color: color || item.color,
      brand: brand || item.brand,
      model: model || item.model,
      size: size || item.size,
      material: material || item.material,
      condition: condition || item.condition,
      locationPrecision: locationPrecision || item.locationPrecision,
      datePrecision: datePrecision || item.datePrecision,
      status: status || item.status
    });

    // Update match scores
    const matches = await findPotentialMatches(item.id);
    if (matches.length > 0) {
      const bestMatch = matches[0];
      await item.update({
        matchScore: bestMatch.score,
        matchConfidence: bestMatch.confidence
      });
    }

    res.json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Match lost and found items
// @route   POST /api/items/:id/match
// @access  Private
export const matchItems = async (req, res) => {
  try {
    const { matchedItemId } = req.body;
    const item = await Item.findByPk(req.params.id);
    const matchedItem = await Item.findByPk(matchedItemId);

    if (!item || !matchedItem) {
      return res.status(404).json({ message: 'One or both items not found' });
    }

    // Check if items are of opposite types
    if (item.type === matchedItem.type) {
      return res.status(400).json({ message: 'Cannot match items of the same type' });
    }

    // Update both items
    item.matchedItemId = matchedItem.id;
    item.status = 'matched';
    matchedItem.matchedItemId = item.id;
    matchedItem.status = 'matched';

    await item.save();
    await matchedItem.save();

    res.json({ message: 'Items matched successfully', item, matchedItem });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get potential matches for an item
// @route   GET /api/items/:id/matches
// @access  Public
export const getPotentialMatches = async (req, res) => {
  try {
    const matches = await findPotentialMatches(req.params.id);
    res.json(matches);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Update match scores for all items
// @route   POST /api/items/update-scores
// @access  Private/Admin
export const updateMatchScores = async (req, res) => {
  try {
    await updateAllMatchScores();
    res.json({ message: 'Match scores updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
}; 