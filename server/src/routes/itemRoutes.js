import express from 'express';
import {
  createItem,
  getItems,
  getItemById,
  updateItem,
  matchItems,
  getPotentialMatches,
  updateMatchScores
} from '../controllers/itemController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   POST /api/items
// @desc    Create a new lost or found item
// @access  Private
router.post('/', protect, createItem);

// @route   GET /api/items
// @desc    Get all items (with optional filters)
// @access  Public
router.get('/', getItems);

// @route   GET /api/items/:id
// @desc    Get item by ID
// @access  Public
router.get('/:id', getItemById);

// @route   PUT /api/items/:id
// @desc    Update item
// @access  Private
router.put('/:id', protect, updateItem);

// @route   POST /api/items/:id/match
// @desc    Match lost and found items
// @access  Private
router.post('/:id/match', protect, matchItems);

// @route   GET /api/items/:id/matches
// @desc    Get potential matches for an item
// @access  Public
router.get('/:id/matches', getPotentialMatches);

// @route   POST /api/items/update-scores
// @desc    Update match scores for all items
// @access  Private/Admin
router.post('/update-scores', protect, admin, updateMatchScores);

export default router; 