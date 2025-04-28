import { DataTypes } from 'sequelize';
import db from '../config/database.js';
import User from './User.js';

const Item = db.define('Item', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  type: {
    type: DataTypes.ENUM('lost', 'found'),
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  location: {
    type: DataTypes.JSONB,
    allowNull: true,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('active', 'matched', 'claimed'),
    defaultValue: 'active'
  },
  matchedItemId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'Items',
      key: 'id'
    }
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  subcategory: {
    type: DataTypes.STRING,
    allowNull: true
  },
  color: {
    type: DataTypes.STRING,
    allowNull: true
  },
  brand: {
    type: DataTypes.STRING,
    allowNull: true
  },
  model: {
    type: DataTypes.STRING,
    allowNull: true
  },
  size: {
    type: DataTypes.STRING,
    allowNull: true
  },
  material: {
    type: DataTypes.STRING,
    allowNull: true
  },
  condition: {
    type: DataTypes.ENUM('new', 'like_new', 'good', 'fair', 'poor'),
    allowNull: true
  },
  locationType: {
    type: DataTypes.ENUM('point', 'route', 'area'),
    allowNull: true
  },
  matchScore: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  matchConfidence: {
    type: DataTypes.ENUM('high', 'medium', 'low'),
    allowNull: true
  }
}, {
  timestamps: true
});

// Define associations
Item.belongsTo(User, { foreignKey: 'userId' });
Item.belongsTo(Item, { as: 'matchedItem', foreignKey: 'matchedItemId' });

export default Item; 