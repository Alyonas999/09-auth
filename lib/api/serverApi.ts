import { cookies } from "next/headers";
import { nextServer } from "./api";
import { Note } from "@/types/note";
import { User } from "@/types/user";

export const checkServerSession = async () => {
  const cookieStore = await cookies();
  const res = await nextServer.get("/auth/session", {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  return res;
};

export const getServerMe = async (): Promise<User> => {
  const cookieStore = await cookies();
  const { data } = await nextServer.get("/users/me", {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return data;
};

interface NotesHttpResponse {
  notes: Note[];
  totalPages: number;
}

export interface Category {
  id: string;
  name: string;
  count: number;
}

export const getCategories = async (): Promise<Category[]> => {
  const cookieStore = await cookies();

  try {
    const response = await nextServer.get<Category[]>("/notes/categories", {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    throw error;
  }
};

export const fetchNotes = async (
  search: string,
  page: number,
  tag: string | undefined
): Promise<NotesHttpResponse> => {
  const cookieStore = await cookies();
  const params = {
    ...(search && { search }),
    tag,
    page,
    perPage: 12,
  };
  const headers = {
    Cookie: cookieStore.toString(),
  };
  const response = await nextServer.get<NotesHttpResponse>("/notes", {
    params,
    headers,
  });
  return response.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const cookieStore = await cookies();
  const headers = {
    Cookie: cookieStore.toString(),
  };
  const response = await nextServer.get<Note>(`/notes/${id}`, { headers });
  return response.data;
};
