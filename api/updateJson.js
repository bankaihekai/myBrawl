const API_URL = "https://mbdata.onrender.com/users";

/**
 * GET all users
 */
function getAllUsers() {
  return fetch(API_URL)
    .then(response => response.json())
    .catch(error => {
      console.error("Error fetching users:", error);
      throw error; // Ensure errors propagate
    });
}

/**
 * GET user by ID
 * @param {number} userId
 */
function getUserById(userId) {
  return fetch(`${API_URL}/${userId}`)
    .then(response => response.json())
    .catch(error => {
      console.error("Error fetching user:", error);
      throw error;
    });
}

/**
 * POST (Create) a new user
 * @param {object} data
 */
function createUser(data) {
  return fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .catch(error => {
      console.error("Error creating user:", error);
      throw error;
    });
}

/**
 * PATCH (Update part of a user)
 * @param {number} userId
 * @param {object} updates
 */
function updateUser(userId, updates) {
  return fetch(`${API_URL}/${userId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates)
  })
    .then(response => response.json())
    .catch(error => {
      console.error("Error updating user:", error);
      throw error;
    });
}

/**
 * DELETE a user by ID
 * @param {number} userId
 */
function deleteUser(userId) {
  return fetch(`${API_URL}/${userId}`, {
    method: "DELETE"
  })
    .then(response => {
      if (response.ok) return { success: true };
      throw new Error("Failed to delete user");
    })
    .catch(error => {
      console.error("Error deleting user:", error);
      throw error;
    });
}

// Example Usage:
// getAllUsers().then(data => console.log("All Users:", data));
// getUserById(1).then(data => console.log("User 1:", data));
// createUser("Alice Smith", "alice@example.com").then(data => console.log("User Created:", data));
// updateUser(1, { email: "newemail@example.com" }).then(data => console.log("User Updated:", data));
// deleteUser(2).then(data => console.log("User Deleted:", data));
