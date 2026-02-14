import { Schema, model, models } from "mongoose";

export interface ILocation {
  name: string;
  slug: string;
  state: string;
  areas: string[];
  active: boolean;
}

const LocationSchema = new Schema<ILocation>({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  state: { type: String, required: true },
  areas: { type: [String], default: [] },
  active: { type: Boolean, default: true }
});

export default models.Location<ILocation> ||
  model<ILocation>("Location", LocationSchema);
