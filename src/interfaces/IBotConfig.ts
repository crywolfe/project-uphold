import { IOscillation } from "./IOscillation";

export interface IBotConfig {
    timeOfConfig?: Date;
    pairs?: string[];
    oscillations?: Map<string, IOscillation>;
    interval?: number;
}