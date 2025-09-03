import axios from "axios";
import type { Note, NoteId } from "@/types/note";

axios.defaults.baseURL = "https://notehub-public.goit.study/api";
axios.defaults.headers.common["Authorization"] = `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`;

const Tags = ["All", "Todo", "Work", "Personal", "Meeting", "Shopping"] as const

export type Tags = typeof Tags

type SortBy = "created" | "updated"

interface FetchNotes {
	notes: Note[]
	totalPages: number
}

export const fetchNotes = async (
	search?: string,
	page: number = 1,
	perPage: number = 12,
	tag?: Exclude<Tags[number], "All">,
	sortBy?: SortBy
) => {
	const { data } = await axios.get<FetchNotes>("notes", {
		params: {
			search,
			page,
			perPage,
			tag,
			sortBy,
		},
	})
	return data
}

export const createNote = async (
	title: string,
	content: string,
	tag: string
) => {
	const { data } = await axios.post<Note>("/notes", {
		title,
		content,
		tag,
	})
	return data
}

export const fetchNoteById = async (noteId: NoteId) => {
	const { data } = await axios.get<Note>(`/notes/${noteId}`)
	return data
}

export const deleteNote = async (noteId: NoteId) => {
	const { data } = await axios.delete<Note>(`/notes/${noteId}`)
	return data
}

export const getCategories = Tags