async function request(path, options = null) {
  const url = `http://127.0.0.1:5000${path}`;
  const response = await fetch(url, {
    ...options,
    credentials: "include", // セッションCookieの送信に必要
    headers: {
      ...options?.headers,
      "Content-Type": "application/json",
    },
  });
  return response.json();
}

export function login(credentials) {
  return request("/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}

// 学生（ユーザー）関連
export function getStudents() {
  return request("/students");
}

export function postStudent(student) {
  return request("/students", {
    method: "POST",
    body: JSON.stringify(student),
  });
}

// 書籍関連
export function getBooks() {
  return request("/books");
}

export function postBook(book) {
  return request("/books", {
    method: "POST",
    body: JSON.stringify(book),
  });
}

// 読みたい本リスト関連
export function getWishlist() {
  return request("/wishlist");
}

export function postWishlist(wishlist) {
  return request("/wishlist", {
    method: "POST",
    body: JSON.stringify(wishlist),
  });
}

export function deleteWishlistBook(studentId, bookId) {
  return request(`/wishlist/${studentId}/${bookId}`, {
    method: "DELETE",
  });
}

// Google Books API関連
export async function searchGoogleBooks(query) {
  const response = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`
  );
  return response.json();
}

export async function getGoogleBookById(bookId) {
  const response = await fetch(
    `https://www.googleapis.com/books/v1/volumes/${bookId}`
  );
  return response.json();
}
