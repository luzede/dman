import type {
	ColumnType,
	Generated,
	Insertable,
	Selectable,
	Updateable,
} from "kysely";

export interface MutedTable {
	id: Generated<number>;
	user_id: string;
	guild_id: string;
	reason: string;
	created_at: ColumnType<string, undefined, never>; // never in the UpdateType means it cannot be updated
	mute_ends_at: ColumnType<string, undefined, never>;
	mute_duration_minutes: number;
}

export type Muted = Selectable<MutedTable>;
export type NewMute = Insertable<MutedTable>;
export type MuteUpdate = Updateable<MutedTable>;
