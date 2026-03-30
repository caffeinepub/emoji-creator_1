import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface EmojiConfig {
    accessory: string;
    expression: string;
    name: string;
    color: string;
    baseShape: string;
    eyeStyle: string;
    mouthStyle: string;
}
export interface backendInterface {
    deleteEmoji(id: bigint): Promise<void>;
    getAllEmojiConfigs(): Promise<Array<EmojiConfig>>;
    getEmoji(id: bigint): Promise<EmojiConfig>;
    saveEmoji(config: EmojiConfig): Promise<bigint>;
    seedSampleEmojis(): Promise<void>;
}
