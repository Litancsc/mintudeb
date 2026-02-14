import mongoose, { Schema } from 'mongoose';

export interface IMenu {
  label: string;
  href: string;
  order: number;
  isActive: boolean;
  location: 'header' | 'footer' | 'both';
  openInNewTab: boolean;
  parentId?: mongoose.Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

const MenuSchema = new Schema<IMenu>(
  {
    label: { type: String, required: true, trim: true },
    href: { type: String, required: true, trim: true },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    location: {
      type: String,
      enum: ['header', 'footer', 'both'],
      default: 'both',
    },
    openInNewTab: { type: Boolean, default: false },
    parentId: {
      type: Schema.Types.ObjectId,
      ref: 'Menu',
      default: null,
    },
  },
  { timestamps: true }
);

MenuSchema.index({ location: 1, isActive: 1, order: 1 });
MenuSchema.index({ parentId: 1 });

const Menu =
  mongoose.models.Menu || mongoose.model<IMenu>('Menu', MenuSchema);

export default Menu;
