export const fetchAuthors = async (): Promise<Authors> => {
  return await useApi<void, Authors>(`authors`)
}

export const searchAuthors = async (query: AuthorQuery): Promise<Authors> => {
  return await useApi<AuthorQuery, Authors>(`authors/search`, {
    params: query
  })
}

export const postAuthor = async (author: Author): Promise<Author> => {
  return await useApi<Author, Author>(`authors`, {
    method: 'POST',
    body: {
      ...author
    }
  })
}

export const putAuthor = async (author: Author): Promise<Author> => {
  return await useApi<Author, Author>(`authors`, {
    method: 'PUT',
    body: {
      ...author
    }
  })
}

export const fetchAuthorScenarios = async (
  authorId: number
): Promise<ScenariosResponse> => {
  return await useApi<void, ScenariosResponse>(`authors/${authorId}/scenarios`)
}
