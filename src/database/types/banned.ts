import type {
	ColumnType,
	Generated,
	Insertable,
	Selectable,
	Updateable,
} from "kysely";

export interface BannedTable {
	id: Generated<number>;
	user_id: string;
	guild_id: string;
	reason: string;
	created_at: ColumnType<string, undefined, never>;
	ban_ends_at: ColumnType<string, undefined, never>;
	ban_duration_minutes: number;
}

export type Banned = Selectable<BannedTable>;
export type NewBan = Insertable<BannedTable>;
export type BanUpdate = Updateable<BannedTable>;
