import { Schema, model, models } from "mongoose";

// Define the interface
export interface IService {
  name: string;
  slug: string;
  keywords: string[];
  seoTitle: string;
  seoDescription: string;
  active: boolean;
}

// Define schema
const ServiceSchema = new Schema<IService>({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  keywords: { type: [String], default: [] },
  seoTitle: { type: String, required: true },
  seoDescription: { type: String, required: true },
  active: { type: Boolean, default: true }
});

// Export model (default) + interface (named)
export default models.Service<IService> || model<IService>("Service", ServiceSchema);
