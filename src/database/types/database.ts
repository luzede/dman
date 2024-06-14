import type { BannedTable } from "./banned";
import type { MutedTable } from "./muted";

export interface Database {
	banned: BannedTable;
	muted: MutedTable;
}
